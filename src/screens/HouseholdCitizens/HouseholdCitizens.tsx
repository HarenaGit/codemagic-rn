import React, { useEffect, useState } from "react"
import { View, ScrollView, TouchableOpacity } from "react-native"
import { StackNavigationProp } from "@react-navigation/stack"
import { CommonActions, RouteProp } from "@react-navigation/native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { FAB, useTheme } from "react-native-paper"
import { useFocusEffect } from "@react-navigation/native"

import { useI18nContext } from "../../modules/I18nProvider"
import NoNetworkIndicator from "../../components/NoNetworkIndicator"
import { useNetworkInfoContext } from "../../modules/NetworkInfoProvider"
import Snackbar from "../../components/Snackbar"
import { NATIONALITIES, JOBS, OTHER_JOB_ID } from "../../consts"
import { NavigationParamList } from "../../navigations"
import InfoCard from "../../components/InfoCard"
import LoadingIndicator from "../../components/LoadingIndicator"
import { useAuthContext } from "../../modules/AuthProvider"
import { useLoadHouseholdApi } from "../../modules/api"
import { formatDateValue } from "../../components/DateTimePicker"
import { useJobLabel } from "../../modules/hooks/useJobLabel"
import { useGenderItems, useNationalityLabel } from "../../modules/hooks"
import { useEventLoggingApi } from "../../modules/api/logging"
import useStyles from "./styles"
import InfoState from "../../components/InfoState"
import { useHouseholdHelpProgramsApi } from "../../modules/api/household-help"

interface IProps {
  route: RouteProp<NavigationParamList, "HouseholdCitizens">
  navigation: StackNavigationProp<NavigationParamList, "HouseholdCitizens">
}

// Citizens list of a household
const HouseholdCitizens = ({ navigation, route }: IProps) => {
  const theme = useTheme()
  const { i18n } = useI18nContext()
  const styles = useStyles()

  const { household, isLoading, handleLoadHousehold, hasError } = useLoadHouseholdApi()
  const { isConnected } = useNetworkInfoContext()
  const [isSnackbarVisible, setSnackbarVisible] = React.useState<boolean>(false)

  const { GENDER_ITEMS, getGenderLabel } = useGenderItems()
  const getNationalityLabel = useNationalityLabel()
  const getJobLabel = useJobLabel()

  const { currentUser } = useAuthContext()
  const logEvent = useEventLoggingApi()

  const { householdHelpPrograms, loadHouseholdHelpPrograms } = useHouseholdHelpProgramsApi()

  useFocusEffect(
    React.useCallback(() => {
      loadHouseholdHelpPrograms(route.params.bookNumber)
    }, [route.params.bookNumber]),
  )

  const loadHouseHold = () => {
    handleLoadHousehold(route.params.bookNumber)
  }

  // Open update citizen screen
  const updateCitizen = (currentHousehold: IHousehold, citizen: ICitizen) => {
    //Logging action
    logEvent(currentUser, "OPEN-CITIZEN-UPDATE-SCREEN", JSON.stringify(citizen), "NULL")
    navigation.navigate("CitizenEditor", {
      citizen: {
        ...citizen,
        household: currentHousehold,
        address: currentHousehold.address,
      },
      intent: "updatecitizen",
      validation: false,
    })
  }

  // Open citizen add screen
  const addHouseholdMember = (currentHousehold?: IHousehold) => {
    if (currentHousehold) {
      //Logging action
      logEvent(currentUser, "OPEN-CITIZEN-ADD-SCREEN", JSON.stringify(currentHousehold), "NULL")
      navigation.navigate("CitizenEditor", {
        citizen: {
          household: currentHousehold,
          address: currentHousehold.address,
        },
        intent: "addhouseholdmember",
        validation: false,
      })
    }
  }

  // Open household helps
  const showHouseholdHelps = () => {
    //Logging action
    logEvent(
      currentUser,
      "OPEN-HOUSEHOLD-HELPS-SCREEN",
      { bookNumber: route.params.bookNumber },
      "NULL",
    )
    navigation.navigate("HouseHoldHelps", {
      bookNumber: route.params.bookNumber,
    })
  }

  // Open household disasters enrollment form
  const identifyHouseholdDisasters = () => {
    if (household?.householdId) {
      //Logging action
      logEvent(
        currentUser,
        "OPEN-HOUSEHOLD-DISASTER-SCREEN",
        { householdId: household.householdId },
        "NULL",
      )
      navigation.navigate("EnrollDisaster", {
        householdId: household.householdId,
      })
    }
  }

  // Load household data on screen open
  useFocusEffect(
    React.useCallback(() => {
      loadHouseHold()
      // Remove the CitizenEditor route from the stack
      navigation.dispatch((state) => {
        const routes = state.routes.filter((r) => r.name !== "CitizenEditor")
        return CommonActions.reset({
          ...state,
          routes,
          index: routes.length - 1,
        })
      })
    }, []),
  )

  // Load household data on screen open
  useFocusEffect(
    React.useCallback(() => {
      loadHouseHold()
    }, []),
  )

  // Reload on connection error
  useFocusEffect(
    React.useCallback(() => {
      if (isConnected && !isLoading && hasError) {
        loadHouseHold()
      }
    }, [isConnected, hasError]),
  )

  return isLoading ? (
    <LoadingIndicator />
  ) : !isConnected && hasError ? (
    <NoNetworkIndicator />
  ) : (
    <View style={styles.container}>
      <ScrollView>
        <InfoState
          typeDisaster={household?.isDisaster ? "disaster" : "nodisater"}
          title={
            household?.isDisaster
              ? i18n.t("statecitizen.disaster")
              : i18n.t("statecitizen.nodisaster")
          }
        />
        {householdHelpPrograms && householdHelpPrograms.length > 0 && (
          <InfoState typeDisaster={"help"} title={i18n.t("statecitizen.receivedassistance")} />
        )}
        <InfoCard
          type="location"
          icon={<Icon name="location-on" color={theme.colors.onCard} size={20} />}
          title={i18n.t("household.localisation")}
          infos={[
            {
              label: i18n.t("household.booknumber"),
              value: route.params.bookNumber ?? i18n.t("household.inconnue"),
            },
            {
              label: i18n.t("household.registration"),
              value: household?.registerNumber ?? i18n.t("household.inconnue"),
            },
            {
              label: i18n.t("household.quartier"),
              value: household?.address?.fokontany?.name ?? i18n.t("household.inconnue"),
            },
            {
              label: i18n.t("household.adresse"),
              value: household?.address?.name ?? i18n.t("household.inconnue"),
            },
            {
              label: i18n.t("household.secteur"),
              value: household?.address?.sector ?? i18n.t("household.inconnue"),
            },
          ]}
        />
        {household?.citizens
          ?.sort((a, b) => {
            return a.isChief === b.isChief ? 0 : a.isChief ? -1 : 1
          })
          ?.map((citizen, index: number) => (
            <InfoCard
              onPress={citizen?.id ? () => updateCitizen(household, citizen) : undefined}
              type={citizen.isChief ? "chief" : "member"}
              photo={citizen?.photo && citizen?.photo?.length > 0 ? citizen?.photo : undefined}
              icon={
                citizen.isChief ? (
                  <Icon name="admin-panel-settings" color={theme.colors.primary} size={20} />
                ) : (
                  <Icon name="person" color={theme.colors.onCard} size={20} />
                )
              }
              key={`${route.params.bookNumber}-${index}`}
              title={`${i18n.t("household.member")} ${index + 1}`}
              otherTitle={i18n.t("household.chef")}
              infos={[
                { 
                  label: i18n.t("household.nom"),
                  value: citizen?.lastName?.trim() 
                },
                { 
                  label: i18n.t("household.prenom"), 
                  value: citizen?.firstName?.trim() 
                },
                {
                  label: i18n.t("household.sexe"),
                  value: getGenderLabel(citizen?.gender),
                },
                {
                  label: i18n.t("household.naissance"),
                  value: citizen?.birthDate ? formatDateValue(citizen.birthDate, "date") : "",
                },
                {
                  label: i18n.t("household.lieunaissance"),
                  value: citizen?.birthPlace,
                },
                { 
                  label: i18n.t("household.telephone"), 
                  value: citizen?.phoneNumber?.trim() 
                },
                {
                  label: i18n.t("household.nationalite"),
                  value: getNationalityLabel(citizen?.nationalityId),
                },
                { 
                  label: i18n.t("household.cin"),
                  value: citizen?.CNI?.trim() 
                },
                {
                  label: i18n.t("household.profession"),
                  value:
                    Number(citizen.jobId) === OTHER_JOB_ID
                      ? citizen?.jobOther
                      : getJobLabel(citizen.jobId),
                },
              ]}
            />
          ))}
        <View style={{ height: 16 }}></View>
      </ScrollView>

      <FAB
        icon="sack"
        style={styles.helpFabButton}
        onPress={showHouseholdHelps}
        color={theme.colors.onPrimary}
      />

      <FAB
        icon="home-flood"
        style={styles.victimFabButton}
        onPress={identifyHouseholdDisasters}
        color={theme.colors.card}
      />

      <FAB
        icon="plus-thick"
        style={styles.addMemberFabButton}
        onPress={() => addHouseholdMember(household)}
        color={theme.colors.onPrimary}
      />
      {["qrcode", "search"].includes(route.params.origin) && (
        <FAB
          icon={route.params.origin === "qrcode" ? "qrcode-scan" : "account-outline"}
          style={styles.backFabButton}
          onPress={() => navigation.goBack()}
          color={theme.colors.onPrimary}
        />
      )}
      {isSnackbarVisible && (
        <Snackbar
          visible={isSnackbarVisible}
          duration={5000}
          onDismiss={() => {
            setSnackbarVisible(false)
          }}
        >
          {i18n.t("household.unknownornopermission")}
        </Snackbar>
      )}
    </View>
  )
}

export default HouseholdCitizens
