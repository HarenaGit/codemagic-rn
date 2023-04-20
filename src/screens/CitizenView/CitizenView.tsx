import React, { useState } from "react"
import { View, ScrollView, Text } from "react-native"
import { useTheme, Appbar, Divider, Chip, FAB, ActivityIndicator } from "react-native-paper"
import FastImage from "react-native-fast-image"
import { RouteProp } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import Icon from "react-native-vector-icons/MaterialIcons"
import { useFocusEffect } from "@react-navigation/native"

import { useI18nContext } from "../../modules/I18nProvider"
import { NavigationParamList } from "../../navigations"
import { JOBS, NATIONALITIES, OTHER_JOB_ID } from "../../consts"
import { useAuthContext } from "../../modules/AuthProvider"
import Snackbar from "../../components/Snackbar"
import { useLifeStatus } from "../../modules/hooks/useLifeStatus"
import { useYesNoItems } from "../../modules/hooks/useYesNoItems"
import { useGenderItems } from "../../modules/hooks/useGenderItems"
import { useBlockHardGobackPress, useNationalityLabel } from "../../modules/hooks"
import { useJobLabel } from "../../modules/hooks/useJobLabel"
import { formatDateValue } from "../../components/DateTimePicker"
import { useLoadCitizenApi, useMarkValidHouseholdChiefApi } from "../../modules/api"
import { useNetworkInfoContext } from "../../modules/NetworkInfoProvider"
import LoadingIndicator from "../../components/LoadingIndicator"
import NoNetworkIndicator from "../../components/NoNetworkIndicator"
import ErrorIndicator from "../../components/ErrorIndicator"
import { useEventLoggingApi } from "../../modules/api/logging"

import useStyles from "./styles"

interface IProps {
  route: RouteProp<NavigationParamList, "CitizenView">
  navigation: StackNavigationProp<NavigationParamList>
}

// Show citizen's info
const CitizenView = ({ navigation, route }: IProps) => {
  const { i18n } = useI18nContext()
  const theme = useTheme()
  const styles = useStyles()
  // Handle snackbar state
  const [isSnackbarVisible, setSnackbarVisible] = React.useState<boolean>(false)
  // Handle fab state
  const [isLoadTriggered, setLoadTriggered] = React.useState(false)
  const [isValidated, setValidated] = React.useState(false)
  const [openFab, setOpenFab] = React.useState(false)

  const { LIFE_STATUS, getLifeStatusLabel } = useLifeStatus()
  const { GENDER_ITEMS, getGenderLabel } = useGenderItems()
  const { YESNO_ITEMS, getYesNoLabel } = useYesNoItems()
  const getNationalityLabel = useNationalityLabel()
  const getJobLabel = useJobLabel()

  const {
    citizen,
    handleLoadCitizen,
    hasNetworkError,
    hasError: isCitizenInfoHasError,
    isLoading: isLoadingCitizenInfo,
  } = useLoadCitizenApi()
  const {
    handleMarkValidHouseholdChief,
    hasError: isValidationHasError,
    isLoading: isLoadingValidation,
  } = useMarkValidHouseholdChiefApi()

  const { isConnected } = useNetworkInfoContext()
  const { currentUser } = useAuthContext()
  const logEvent = useEventLoggingApi()

  // Load citizen info
  const loadCitizenData = () => {
    setLoadTriggered(true)
    handleLoadCitizen(route.params.citizenId, {
      onError: () => setSnackbarVisible(true),
    })
  }

  // Open citizen household
  const openHouseholdCitizens = () => {
    if (citizen && citizen.household) {
      // Logging
      logEvent(currentUser, "OPEN-HOUSEHOLD-VIEW-SCREEN", JSON.stringify(citizen), "NULL")
      navigation.navigate("HouseholdCitizens", {
        bookNumber: citizen.household.bookNumber,
        origin: "search",
      })
    }
  }

  // Open edit citizen screen
  const openUpdateCitizen = () => {
    if (citizen) {
      //Logging action
      logEvent(currentUser, "OPEN-UPDATE-CITIZEN-SCREEN", JSON.stringify(citizen), "NULL")
      //navigation.navigate("CitizenUpdate", { citizen, intent: "updatecitizen", validation: true })
      navigation.navigate("CitizenEditor", { citizen, intent: "updatecitizen", validation: true })
    }
  }

  // Run citizen info validation
  const runChiefValidation = () => {
    if (citizen) {
      handleMarkValidHouseholdChief(
        citizen?.id,
        {
          addressId: citizen?.address?.addressId ?? -1,
          householdId: citizen?.household?.householdId ?? -1,
          status: 1,
        },
        {
          onError: () => {
            setValidated(false)
            setSnackbarVisible(true)
          },
          onSuccess: () => {
            setValidated(true)
            setSnackbarVisible(true)
          },
        },
      )
    }
  }

  const hasError = isCitizenInfoHasError || isValidationHasError
  const isLoading = isLoadingCitizenInfo || isLoadingValidation

  const canBeValidated = Boolean(
    citizen?.isChief && citizen?.household?.registerNumber && citizen?.address?.name,
  )

  // Block hardware back press on loading
  useBlockHardGobackPress(isLoading)

  // Load household data on screen open
  useFocusEffect(
    React.useCallback(() => {
      loadCitizenData()
    }, []),
  )

  // Update screen header
  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        header: () => {
          return (
            <Appbar.Header style={{ backgroundColor: theme.navigation.colors.primary }}>
              <Appbar.Action
                icon="arrow-left"
                disabled={isLoading}
                color={theme.navigation.colors.text}
                onPress={() => {
                  navigation.navigate("SearchForm")
                }}
              />
              {citizen && (
                <Chip mode="flat" ellipsizeMode="tail" style={styles.titleChip}>
                  {citizen?.lastName} {citizen?.firstName}
                </Chip>
              )}
              {!citizen && (
                <Chip mode="flat" ellipsizeMode="tail" style={styles.titleChip}>
                  {route.params?.lastName} {route.params?.firstName}
                </Chip>
              )}
              {isLoadingValidation && (
                <View style={{ marginRight: 8 }}>
                  <ActivityIndicator animating size="small" color={theme.navigation.colors.text} />
                </View>
              )}
              {!isLoading && isCitizenInfoHasError && (
                <Appbar.Action
                  icon="refresh"
                  color={theme.navigation.colors.text}
                  onPress={loadCitizenData}
                />
              )}
            </Appbar.Header>
          )
        },
      })
    }, [
      route.params.citizenId,
      citizen,
      isLoading,
      hasError,
      isCitizenInfoHasError,
      isLoadingValidation,
    ]),
  )

  // Render divider
  const renderDivider = () => (
    <View style={styles.dividerContainer}>
      <Divider style={styles.divider} />
    </View>
  )

  return !isLoadTriggered || isLoadingCitizenInfo ? (
    <LoadingIndicator />
  ) : !isConnected && hasNetworkError ? (
    <NoNetworkIndicator />
  ) : citizen ? (
    <View style={styles.container}>
      <ScrollView style={styles.formContainer}>
        <View style={styles.profilePicRow}>
          <View style={styles.profilePicBox}>
            <FastImage
              style={styles.profilePic}
              source={
                citizen?.photo && citizen?.photo?.length > 0
                  ? { uri: citizen?.photo, priority: FastImage.priority.normal }
                  : require("../../assets/default-pic.png")
              }
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
        </View>
      
        {[
          {
            label: i18n.t("household.adresse"),
            value: citizen?.address?.addressId
              ? `${citizen?.address?.municipality?.name ?? ""} ${
                  citizen?.address?.fokontany?.name ?? ""
                } ${citizen?.address?.sector ?? ""} ${citizen?.address?.name ?? ""}`
              : undefined,
          },
          {
            label: i18n.t("household.registration"),
            value: citizen?.household?.registerNumber ?? undefined,
          },
          { label: i18n.t("household.chef"), value: getYesNoLabel(citizen?.isChief) },
          { label: i18n.t("household.nom"), value: citizen?.lastName },
          { label: i18n.t("household.prenom"), value: citizen?.firstName },
          {
            label: i18n.t("household.sexe"),
            value: getGenderLabel(citizen?.gender),
          },
          {
            label: i18n.t("household.handicapped"),
            value: getYesNoLabel(citizen?.isHandicapped),
          },
          {
            label: i18n.t("household.naissance"),
            value: citizen?.birthDate ? formatDateValue(citizen?.birthDate, "date") : undefined,
          },
          {
            label: i18n.t("household.lieunaissance"),
            value: citizen?.birthPlace,
          },
          { label: i18n.t("household.telephone"), value: citizen?.phoneNumber?.trim() },
          {
            label: i18n.t("household.nationalite"),
            value: getNationalityLabel(citizen?.nationalityId),
          },
          {
            label: i18n.t("household.father"),
            value: citizen?.father,
          },
          {
            label: i18n.t("household.fatherstatus"),
            value: getLifeStatusLabel(citizen?.fatherStatus),
          },

          {
            label: i18n.t("household.mother"),
            value: citizen?.mother,
          },
          {
            label: i18n.t("household.motherstatus"),
            value: getLifeStatusLabel(citizen?.motherStatus),
          },
          { label: i18n.t("household.cin"), value: citizen?.CNI?.trim() },
          {
            label: i18n.t("household.datecin"),
            value: citizen?.CNIDeliveryDate
              ? formatDateValue(citizen?.CNIDeliveryDate, "date")
              : undefined,
          },
          { label: i18n.t("household.loccin"), value: citizen?.CNIDeliveryPlace?.trim() },

          { label: i18n.t("household.dead"), value: getYesNoLabel(citizen?.isDied) },

          {
            label: i18n.t("household.deathdate"),
            value: citizen?.deathDate ? formatDateValue(citizen?.deathDate, "date") : undefined,
          },
          {
            label: i18n.t("household.profession"),
            value:
              Number(citizen?.jobId) === OTHER_JOB_ID
                ? citizen?.jobOther
                : getJobLabel(citizen?.jobId),
          },
        ].map((infoItm, index) =>
          infoItm.value ? (
            <View key={`rowitm-${index}`}>
              {renderDivider()}
              <View style={styles.rowItem}>
                <Text style={styles.itemTitle}>{infoItm.label}:</Text>
                <Text style={styles.itemValue}>{infoItm.value}</Text>
              </View>
            </View>
          ) : null,
        )}
        <View style={{ height: 64 }}></View>
      </ScrollView>
      {!isLoading && citizen && (
        <FAB.Group
          open={openFab}
          icon={openFab ? "close" : "menu"}
          actions={[
            {
              icon: "home-account",
              label: i18n.t("search.houshold"),
              onPress: openHouseholdCitizens,
              color: theme.colors.onPrimary,
              style: { backgroundColor: theme.colors.secondary },
              testID: "HOUSEHOLD",
            },
            {
              icon: "pencil",
              label: i18n.t("viewcitizen.updateinfo"),
              onPress: openUpdateCitizen,
              color: theme.colors.onPrimary,
              style: { backgroundColor: theme.colors.primary },
              testID: "UPDATE",
            },
            {
              icon: "check-bold",
              label: i18n.t("viewcitizen.validateinfo"),
              onPress: runChiefValidation,
              color: theme.colors.onPrimary,
              style: { backgroundColor: theme.colors.primary },
              testID: "VALIDATE",
            },
          ].filter((menuItm) => {
            if (menuItm.testID === "VALIDATE") {
              return !citizen.isConfirmed && canBeValidated && !isValidated
            } else if (menuItm.testID === "UPDATE") {
              return !citizen.isConfirmed && !isValidated
            }
            return true
          })}
          fabStyle={{ backgroundColor: theme.colors.secondary }}
          onStateChange={({ open }) => setOpenFab(open)}
          color={theme.colors.onPrimary}
        />
      )}
      {isSnackbarVisible && (
        <Snackbar
          variant={hasError ? "error" : "success"}
          visible={isSnackbarVisible}
          duration={2000}
          onDismiss={() => {
            setSnackbarVisible(false)
          }}
        >
          {hasError
            ? !isConnected
              ? i18n.t("errors.networkerror")
              : i18n.t("updatecitizen.saveerror")
            : i18n.t("updatecitizen.savesuccess")}
        </Snackbar>
      )}
    </View>
  ) : (
    <ErrorIndicator />
  )
}

export default CitizenView
