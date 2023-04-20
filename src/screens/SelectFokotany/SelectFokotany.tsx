import React, { useState } from "react"
import { View, ScrollView, ActivityIndicator, Text } from "react-native"
import { useTheme, Appbar } from "react-native-paper"
import { RouteProp } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { useFocusEffect } from "@react-navigation/native"

import ItemListPicker from "../../components/ItemListPicker"
import { useI18nContext } from "../../modules/I18nProvider"
import { NavigationParamList } from "../../navigations"
import useStyles from "./styles"

import { useAuthContext } from "../../modules/AuthProvider"
import CustomButton from "../../components/CustomButton"
import { useLocalizationContext } from "../../modules/LocalizationProvider"
import {
  useBoroughsListApi,
  useDistrictsListApi,
  useFokontaniesListApi,
  useMunicipalitiesListApi,
  useProvincesListApi,
  useRegionsListApi,
} from "../../modules/api"
import { useNetworkInfoContext } from "../../modules/NetworkInfoProvider"
import { useBlockHardGobackPress } from "../../modules/hooks"
import { useEventLoggingApi } from "../../modules/api/logging"

interface IProps {
  route: RouteProp<NavigationParamList, "SelectFokotany">
  navigation: StackNavigationProp<NavigationParamList>
}

// Select the default fokotany
const SelectFokotany = ({ navigation, route }: IProps) => {
  const { i18n } = useI18nContext()
  const theme = useTheme()
  const styles = useStyles()

  const { isConnected } = useNetworkInfoContext()
  const { currentUser } = useAuthContext()
  const logEvent = useEventLoggingApi()

  // Block hardware back press
  useBlockHardGobackPress(true)

  // Localisation context
  const {
    localization,
    tmpLocalization,
    setLocalization,
    setTmpLocalization,
    handleTmpLocalizationChange,
  } = useLocalizationContext()

  // Load fokontanies
  const {
    isLoading: isLoadingFokontany,
    hasError: isFokontanyHasError,
    fokontanies,
    loadFokontanies,
  } = useFokontaniesListApi({
    onSuccess: (fokontany) => {
      if (
        fokontany &&
        (!tmpLocalization.fokontanyId || tmpLocalization.boroughId !== fokontany.boroughId)
      ) {
        handleTmpLocalizationChange("fokontanyName", fokontany.name)
        handleTmpLocalizationChange("fokontanyId", fokontany.id)
      }
    },
  })

  // Load boroughs
  const {
    isLoading: isLoadingBorough,
    hasError: isBoroughHasError,
    boroughs,
    loadBoroughs,
  } = useBoroughsListApi({
    onSuccess: (borough) => {
      if (
        borough &&
        (!tmpLocalization.boroughId || tmpLocalization.municipalityId !== borough.municipalityId)
      ) {
        handleTmpLocalizationChange("boroughId", borough.id)
        loadFokontanies(borough.id)
      } else {
        loadFokontanies(tmpLocalization.boroughId)
      }
    },
  })

  // Load municipalities
  const {
    isLoading: isLoadingMunicipality,
    hasError: isMunicipalityHasError,
    municipalities,
    loadMunicipalities,
  } = useMunicipalitiesListApi({
    onSuccess: (municipality) => {
      if (
        municipality &&
        (!tmpLocalization.municipalityId || tmpLocalization.districtId !== municipality.districtId)
      ) {
        handleTmpLocalizationChange("municipalityId", municipality.id)
        loadBoroughs(municipality.id)
      } else {
        loadBoroughs(tmpLocalization.municipalityId)
      }
    },
  })

  // Load districts
  const {
    isLoading: isLoadingDistrict,
    hasError: isDistrictHasError,
    districts,
    loadDistricts,
  } = useDistrictsListApi({
    onSuccess: (district) => {
      if (
        district &&
        (!tmpLocalization.districtId || tmpLocalization.regionId !== district.regionId)
      ) {
        handleTmpLocalizationChange("districtId", district.id)
        loadMunicipalities(district.id)
      } else {
        loadMunicipalities(tmpLocalization.districtId)
      }
    },
  })

  // Load regions
  const {
    isLoading: isLoadingRegion,
    hasError: isRegionHasError,
    regions,
    loadRegions,
  } = useRegionsListApi({
    onSuccess: (region) => {
      if (
        region &&
        (!tmpLocalization.regionId || tmpLocalization.provinceId !== region.provinceId)
      ) {
        handleTmpLocalizationChange("regionId", region.id)
        loadDistricts(region.id)
      } else {
        loadDistricts(tmpLocalization.regionId)
      }
    },
  })

  // Load provinces
  const {
    isLoading: isLoadingProvince,
    hasError: isProvinceHasError,
    provinces,
    loadProvinces,
  } = useProvincesListApi({
    onSuccess: (province) => {
      if (province && !tmpLocalization.provinceId) {
        handleTmpLocalizationChange("provinceId", province.id)
        loadRegions(province.id)
      } else {
        loadRegions(tmpLocalization.provinceId)
      }
    },
  })

  // Handle localization change
  const handleLocalizationChange = (field: keyof ILocalization) => (
    value: number | string,
    name?: string,
  ) => {
    // Check accepable value
    if (!isNaN(Number(value)) && Number(value) > 0) {
      handleTmpLocalizationChange(field, Number(value))
      if (field === "fokontanyId") {
        const fokontany = fokontanies.find((itm) => itm.id === value)
        if (fokontany) handleTmpLocalizationChange("fokontanyName", fokontany.name)
      }

      // Load down stream related data
      if (field === "provinceId" && Number(value) !== tmpLocalization.provinceId)
        loadRegions(Number(value))
      else if (field === "regionId" && Number(value) !== tmpLocalization.regionId)
        loadDistricts(Number(value))
      else if (field === "districtId" && Number(value) !== tmpLocalization.districtId)
        loadMunicipalities(Number(value))
      else if (field === "municipalityId" && Number(value) !== tmpLocalization.municipalityId)
        loadBoroughs(Number(value))
      else if (field === "boroughId" && Number(value) !== tmpLocalization.boroughId)
        loadFokontanies(Number(value))
    }
  }

  // Reload localization data (If any errors occurred on loading)
  const handleReloadMissingData = () => {
    if (isProvinceHasError) loadProvinces()
    else if (isRegionHasError && tmpLocalization.provinceId) loadRegions(tmpLocalization.provinceId)
    else if (isDistrictHasError && tmpLocalization.regionId) loadDistricts(tmpLocalization.regionId)
    else if (isMunicipalityHasError && tmpLocalization.districtId)
      loadMunicipalities(tmpLocalization.districtId)
    else if (isBoroughHasError && tmpLocalization.municipalityId)
      loadBoroughs(tmpLocalization.municipalityId)
    else if (isFokontanyHasError && tmpLocalization.boroughId)
      loadBoroughs(tmpLocalization.boroughId)
  }

  // Update the default localization
  const handleSetLocalization = () => {
    setLocalization(tmpLocalization)
    // Logging
    logEvent(currentUser, "SELECT-FOKONTANY", localization, tmpLocalization)
    if (route.params.intent === "init") {
      navigation.navigate("Home", {})
    } else {
      navigation.goBack()
    }
  }

  // Is data currently on load
  const isLoading =
    isLoadingProvince ||
    isLoadingRegion ||
    isLoadingDistrict ||
    isLoadingMunicipality ||
    isLoadingBorough ||
    isLoadingFokontany

  // Is load has an error
  const hasError =
    isProvinceHasError ||
    isRegionHasError ||
    isDistrictHasError ||
    isMunicipalityHasError ||
    isBoroughHasError ||
    isFokontanyHasError

  //Load the last localization data
  useFocusEffect(
    React.useCallback(() => {
      // setTmpLocalization(localization)
      loadProvinces()
    }, []),
  )

  // Block hardware back press on loading
  useBlockHardGobackPress(isLoading || hasError)

  // Skip this screen if fokontany chief
  useFocusEffect(
    React.useCallback(() => {
      if (
        route.params.intent === "init" &&
        currentUser?.fokontany &&
        currentUser?.fokontany.length > 0
      ) {
        const defaultFokontany = currentUser.fokontany[0]
        setLocalization({
          boroughId: defaultFokontany.boroughId,
          fokontanyId: defaultFokontany.id,
          fokontanyName: defaultFokontany.name,
        })
        setTmpLocalization({
          boroughId: defaultFokontany.boroughId,
          fokontanyId: defaultFokontany.id,
          fokontanyName: defaultFokontany.name,
        })
        navigation.navigate("Home", {})
      }
    }, [currentUser]),
  )

  // Update screen header
  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        header: () => {
          return (
            <Appbar.Header style={{ backgroundColor: theme.navigation.colors.primary }}>
              {route.params.intent === "update" && (
                <Appbar.Action
                  icon="arrow-left"
                  color={theme.navigation.colors.text}
                  onPress={() => {
                    navigation.goBack()
                  }}
                  disabled={isLoading || hasError}
                />
              )}
              <Appbar.Content
                title={i18n.t("selectfokontany.title")}
                color={theme.navigation.colors.text}
              />
              {!isLoading && hasError && (
                <Appbar.Action
                  icon="refresh"
                  color={theme.navigation.colors.text}
                  onPress={handleReloadMissingData}
                />
              )}
              {isLoading && (
                <View style={{ marginRight: 8 }}>
                  <ActivityIndicator animating size="small" color={theme.navigation.colors.text} />
                </View>
              )}
            </Appbar.Header>
          )
        },
      })
    }, [isLoading, hasError]),
  )

  return (
    <View style={styles.container}>
      <ScrollView style={styles.formContainer}>
        <ItemListPicker
          dense={false}
          layout="stacked"
          labelMode="light"
          mode="dropdown"
          name="province"
          label={i18n.t("common.province")}
          selectedValue={tmpLocalization.provinceId}
          items={provinces.map((itm) => ({ label: itm.name, value: itm.id }))}
          handleChange={handleLocalizationChange("provinceId")}
          disabled={isLoading}
          hasError={isProvinceHasError}
          errorMessage={
            isConnected ? i18n.t("errors.dataloaderror") : i18n.t("errors.networkerror")
          }
        />
        <ItemListPicker
          dense={false}
          layout="stacked"
          labelMode="light"
          mode="dropdown"
          name="region"
          label={i18n.t("common.region")}
          selectedValue={tmpLocalization.regionId}
          items={regions.map((itm) => ({ label: itm.name, value: itm.id }))}
          handleChange={handleLocalizationChange("regionId")}
          disabled={isLoading || Boolean(!tmpLocalization.provinceId)}
          hasError={isRegionHasError}
          errorMessage={
            isConnected ? i18n.t("errors.dataloaderror") : i18n.t("errors.networkerror")
          }
        />
        <ItemListPicker
          dense={false}
          layout="stacked"
          labelMode="light"
          mode="dropdown"
          name="district"
          label={i18n.t("common.district")}
          selectedValue={tmpLocalization.districtId}
          items={districts.map((itm) => ({ label: itm.name, value: itm.id }))}
          handleChange={handleLocalizationChange("districtId")}
          disabled={isLoading || Boolean(!tmpLocalization.regionId)}
          hasError={isDistrictHasError}
          errorMessage={
            isConnected ? i18n.t("errors.dataloaderror") : i18n.t("errors.networkerror")
          }
        />
        <ItemListPicker
          dense={false}
          layout="stacked"
          labelMode="light"
          mode="dropdown"
          name="municipality"
          label={i18n.t("common.municipality")}
          selectedValue={tmpLocalization.municipalityId}
          items={municipalities.map((itm) => ({ label: itm.name, value: itm.id }))}
          handleChange={handleLocalizationChange("municipalityId")}
          disabled={isLoading || Boolean(!tmpLocalization.districtId)}
          hasError={isMunicipalityHasError}
          errorMessage={
            isConnected ? i18n.t("errors.dataloaderror") : i18n.t("errors.networkerror")
          }
        />
        <ItemListPicker
          dense={false}
          layout="stacked"
          labelMode="light"
          mode="dropdown"
          name="borough"
          label={i18n.t("common.borough")}
          selectedValue={tmpLocalization.boroughId}
          items={boroughs.map((itm) => ({ label: itm.name, value: itm.id }))}
          handleChange={handleLocalizationChange("boroughId")}
          disabled={isLoading || Boolean(!tmpLocalization.municipalityId)}
          hasError={isBoroughHasError}
          errorMessage={
            isConnected ? i18n.t("errors.dataloaderror") : i18n.t("errors.networkerror")
          }
        />
        <ItemListPicker
          dense={false}
          layout="stacked"
          labelMode="light"
          mode="dropdown"
          name="fokontany"
          label={i18n.t("common.fokontany")}
          selectedValue={tmpLocalization.fokontanyId}
          items={fokontanies.map((itm) => ({ label: itm.name, value: itm.id }))}
          handleChange={handleLocalizationChange("fokontanyId")}
          disabled={isLoading || Boolean(!tmpLocalization.boroughId)}
          hasError={isFokontanyHasError}
          errorMessage={
            isConnected ? i18n.t("errors.dataloaderror") : i18n.t("errors.networkerror")
          }
        />
        <View style={styles.buttonWrapper}>
          <CustomButton
            disabled={
              isLoading ||
              hasError ||
              !Boolean(
                tmpLocalization.provinceId &&
                  tmpLocalization.regionId &&
                  tmpLocalization.districtId &&
                  tmpLocalization.municipalityId &&
                  tmpLocalization.boroughId &&
                  tmpLocalization.fokontanyId,
              )
            }
            variant="primary"
            label={i18n.t("selectfokontany.validate")}
            onPress={handleSetLocalization}
          />
        </View>
        <View style={{ height: 64 }}></View>
      </ScrollView>
    </View>
  )
}

export default SelectFokotany
