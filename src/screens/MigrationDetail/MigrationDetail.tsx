import React, { useEffect, useState } from "react"
import { View, ScrollView } from "react-native"
import axios from "axios"
import { StackNavigationProp } from "@react-navigation/stack"
import { RouteProp } from "@react-navigation/native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { useTheme, FAB } from "react-native-paper"
import { useFocusEffect } from "@react-navigation/native"

import { useI18nContext } from "../../modules/I18nProvider"
import { useAuthContext } from "../../modules/AuthProvider"
import NoNetworkIndicator from "../../components/NoNetworkIndicator"
import { useNetworkInfoContext } from "../../modules/NetworkInfoProvider"
import Snackbar from "../../components/Snackbar"
import { NATIONALITIES, JOBS, OTHER_JOB_ID } from "../../consts"
import { NavigationParamList } from "../../navigations"
import { API_CONFIGS } from "../../config"
import InfoCard from "../../components/InfoCard"
import LoadingIndicator from "../../components/LoadingIndicator"
import useStyles from "./styles"

interface IProps {
  route: RouteProp<NavigationParamList, "MigrationDetail">
  navigation: StackNavigationProp<NavigationParamList, "MigrationDetail">
}

// Citizens list of a household
const MigrationDetail = ({ navigation, route }: IProps) => {
  const theme = useTheme()
  const { i18n } = useI18nContext()
  const styles = useStyles()
  const [isLoading, setLoading] = useState(false)
  const [openFab, setOpenFab] = useState(false)
  const [household, setHousehold] = useState<MigrationHouseholdType>()
  const { isConnected } = useNetworkInfoContext()
  const [isSnackbarVisible, setSnackbarVisible] = React.useState<boolean>(false)

  const loadHouseHold = () => {
    setLoading(true)
    axios
      .get<MigrationHouseholdType>(API_CONFIGS["BETA"].API_MIGRATION_DETAIL_URL, {
        params: {
          fokontany_source_id: route.params.fokontany_source_id,
          fokontany_target_id: route.params.fokontany_target_id,
          household_id: route.params.household_id,
          request_date: route.params.request_date,
        },
      })
      .then((res) => {
        if (!res.data.error) {
          setHousehold(res.data)
        } else {
          setSnackbarVisible(true)
          setHousehold(undefined)
        }
        setLoading(false)
      })
      .catch((error) => {
        console.log("error => ", error)
        setHousehold(undefined)
        setLoading(false)
      })
  }

  useFocusEffect(
    React.useCallback(() => {
      console.log(route.params)
      // Load household data
      loadHouseHold()
    }, []),
  )

  // Find the nationality and Displayable label
  const getNationalityLabel = (nationalityId: number | null | undefined) => {
    return nationalityId === null || nationalityId === undefined
      ? i18n.t("household.inconnue")
      : NATIONALITIES.find((nationalityItm) => nationalityItm.value === nationalityId)?.label ??
          i18n.t("household.inconnue")
  }

  // Get displayable sex label
  const getSexLabel = (sexId: number | null | undefined) => {
    return sexId === null || sexId === undefined
      ? i18n.t("household.inconnue")
      : sexId === 1
      ? i18n.t("household.homme")
      : i18n.t("household.femme")
  }

  useFocusEffect(
    React.useCallback(() => {
      if (isConnected && !isLoading) {
        loadHouseHold()
      }
    }, [isConnected]),
  )

  return isLoading ? (
    <LoadingIndicator />
  ) : !isConnected ? (
    <NoNetworkIndicator />
  ) : (
    <View style={styles.container}>
      <ScrollView>
        <InfoCard
          type="location"
          icon={<Icon name="location-on" color={theme.colors.onCard} size={20} />}
          title={i18n.t("household.localisation")}
          infos={[
            {
              label: i18n.t("household.quartier"),
              value: household?.fokontany?.fokontany_name ?? i18n.t("household.inconnue"),
            },
            {
              label: i18n.t("household.adresse"),
              value: household?.current_address ?? i18n.t("household.inconnue"),
            },
            {
              label: i18n.t("household.secteur"),
              value: household?.fokontany.borough_name ?? i18n.t("household.inconnue"),
            },
          ]}
        />
        {household?.citizens?.map((citizenItm, index: number) => (
          <InfoCard
            type="member"
            photo={
              citizenItm?.photo && citizenItm?.photo?.length > 0 ? citizenItm?.photo : undefined
            }
            icon={<Icon name="person" color={theme.colors.onCard} size={20} />}
            key={`${citizenItm.citizen_id}-${index}`}
            title={`${i18n.t("household.member")} ${index + 1}`}
            infos={[
              { label: i18n.t("household.nom"), value: citizenItm?.name?.trim() },
              { label: i18n.t("household.prenom"), value: citizenItm?.f_name.trim() },
              { label: i18n.t("household.naissance"), value: citizenItm?.birth_date.trim() },
              { label: i18n.t("household.cin"), value: citizenItm?.cin_citizen?.trim() },
            ]}
          />
        ))}
        <View style={{ height: 16 }}></View>
      </ScrollView>
      <FAB.Group
        open={openFab}
        icon={openFab ? "close" : "menu"}
        actions={[
          {
            icon: "close-octagon",
            label: i18n.t("household.denymigration"),
            onPress: () => console.log("Pressed star"),
            color: theme.colors.onPrimary,
            style: { backgroundColor: theme.colors.primary },
          },
          {
            icon: "check-circle",
            label: i18n.t("household.validatemigraiton"),
            onPress: () => console.log("Pressed email"),
            color: theme.colors.onPrimary,
            style: { backgroundColor: theme.colors.primary },
          },
        ]}
        fabStyle={{ backgroundColor: theme.colors.secondary }}
        onStateChange={({ open }) => setOpenFab(open)}
        color={theme.colors.onPrimary}
        visible={!!household}
      />
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

export default MigrationDetail
