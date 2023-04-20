import React, { useState } from "react"
import { View, ScrollView, ActivityIndicator, Text } from "react-native"
import { useTheme, Appbar, HelperText } from "react-native-paper"
import { RouteProp } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import Icon from "react-native-vector-icons/MaterialIcons"
import { useFocusEffect } from "@react-navigation/native"
import { Value } from "react-native-reanimated"

import ItemListPicker from "../../components/ItemListPicker"
import { useI18nContext } from "../../modules/I18nProvider"
import { NavigationParamList } from "../../navigations"
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
import TextInput from "../../components/TextInput"
import DateTimePicker from "../../components/DateTimePicker"
import { useSearchCriteriaContext } from "../../modules/SearchCriteriaProvider"
import useStyles from "./styles"

interface IProps {
  route: RouteProp<NavigationParamList, "SearchForm">
  navigation: StackNavigationProp<NavigationParamList>
}

// Search form
const SearchForm = ({ navigation, route }: IProps) => {
  const { i18n } = useI18nContext()
  const theme = useTheme()
  const styles = useStyles()
  const {
    birthDate,
    cni,
    firstName,
    lastName,
    formik,
    noResult,
    setGlobSearch,
    isFormEmpty,
    setSearchTriggered,
  } = useSearchCriteriaContext()

  // Run search in the previously specified fokontany
  const handleRunSearch = () => {
    setGlobSearch(false)
    setSearchTriggered(false)
    navigation.navigate("SearchResult")
  }

  // Run global search
  const handleRunGlobalSearch = () => {
    setGlobSearch(true)
    setSearchTriggered(false)
    navigation.navigate("SearchResult")
  }

  // Create new household
  const handleCreateNewHousehold = () => {
    setGlobSearch(false)
    setSearchTriggered(false)
    navigation.navigate("AddressList")
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.formContainer}>
        <TextInput
          layout="stacked"
          name={"lastName"}
          label={i18n.t("search.name")}
          value={lastName}
          handleChange={formik?.handleChange("lastName")}
          onBlur={formik?.handleBlur("lastName")}
          hasError={formik?.touched?.lastName && Boolean(formik?.errors?.lastName)}
          errorMessage={formik?.errors?.lastName}
        />
        <TextInput
          layout="stacked"
          name={"firstName"}
          label={i18n.t("search.firstname")}
          value={firstName}
          handleChange={formik?.handleChange("firstName")}
          onBlur={formik?.handleBlur("firstName")}
          hasError={formik?.touched?.firstName && Boolean(formik?.errors?.firstName)}
          errorMessage={formik?.errors?.firstName}
        />
        <TextInput
          layout="stacked"
          inputMode="phone-pad"
          placeholder="000000000000"
          name={"cni"}
          label={i18n.t("search.cni")}
          value={cni}
          handleChange={formik?.handleChange("cni")}
          onBlur={formik?.handleBlur("cni")}
          hasError={formik?.touched?.cni && Boolean(formik?.errors?.cni)}
          errorMessage={formik?.errors?.cni}
        />
        <DateTimePicker
          layout="stacked"
          placeholder="JJ/MM/AAAA"
          name={"birthDate"}
          label={i18n.t("search.birthdate")}
          mode="date"
          value={birthDate}
          handleChange={formik?.handleChange("birthDate")}
          hasError={Boolean(formik?.errors?.birthDate)}
          errorMessage={formik?.errors?.birthDate}
        />

        {(noResult || isFormEmpty) && (
          <View style={styles.errorWrapper}>
            <HelperText type="error" visible={true} padding="none">
              {!noResult ? i18n.t("errors.emptysearchcriteria") : i18n.t("search.nosearchresult")}
            </HelperText>
          </View>
        )}
        <View style={styles.buttonWrapper}>
          <CustomButton
            disabled={!formik?.isValid || (!cni && !lastName && !firstName && !birthDate)}
            variant="primary"
            label={i18n.t("search.searchbutton")}
            onPress={handleRunSearch}
          />
          {noResult && (
            <CustomButton
              disabled={!formik?.isValid || (!cni && !lastName && !firstName && !birthDate)}
              variant="secondary"
              label={i18n.t("search.globalsearch")}
              style={{ marginTop: 16 }}
              onPress={handleRunGlobalSearch}
            />
          )}
          <CustomButton
            variant="secondary"
            label={i18n.t("common.createnewhousehold")}
            style={{ marginTop: 16 }}
            onPress={handleCreateNewHousehold}
          />
        </View>
        <View style={{ height: 64 }}></View>
      </ScrollView>
    </View>
  )
}

export default SearchForm
