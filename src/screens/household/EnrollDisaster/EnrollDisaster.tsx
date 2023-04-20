import React, { useState } from "react"
import { View, ScrollView, ActivityIndicator } from "react-native"
import { useTheme, Appbar, Divider } from "react-native-paper"
import { RouteProp } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { useFocusEffect } from "@react-navigation/native"

import { useNetworkInfoContext } from "../../../modules/NetworkInfoProvider"
import { useI18nContext } from "../../../modules/I18nProvider"
import { NavigationParamList } from "../../../navigations"
import TextInput from "../../../components/TextInput"
import { useBlockHardGobackPress, useYesNoItems } from "../../../modules/hooks"
import ItemListPicker from "../../../components/ItemListPicker"
import Snackbar from "../../../components/Snackbar"

import useStyles from "./styles"
import { useFormik } from "./formik"
import {
  useEnrollHouseholdDisasterApi,
  useEvacuationSitesApi,
} from "../../../modules/api/household-disaster"
import { useLocalizationContext } from "../../../modules/LocalizationProvider"
import DateTimePicker from "../../../components/DateTimePicker"

interface IProps {
  route: RouteProp<NavigationParamList, "EnrollDisaster">
  navigation: StackNavigationProp<NavigationParamList>
}

// Allocate help to househole
const EnrollDisaster = ({ navigation, route }: IProps) => {
  const { i18n } = useI18nContext()
  const theme = useTheme()
  const styles = useStyles()
  const [isSnackbarVisible, setSnackbarVisible] = React.useState<boolean>(false)

  const { YESNO_ITEMS } = useYesNoItems()

  const { localization, setLocalization } = useLocalizationContext()

  const {
    hasError: evacuationSitesHasError,
    isLoading: evacuationSitesIsLoading,
    evacuationSites,
    loadEvacuationSites,
  } = useEvacuationSitesApi()

  const formik = useFormik({
    onSubmit: async (values) => {},
    initialValues: {
      siteId: localization.siteId ?? undefined,
      householdId: route.params.householdId,
      quantity: 0,
      quantityMale: 0,
      quantityFemale: 0,
      quantityStudent: 0,
      childrenUnder5Year: 0,
      quantityPregnant: 0,
      quantityFemaleFeeding: 0,
      quantityHandicapped: 0,
      quantityOver60Year: 0,
      quantityDiarrhea: 0,
      quantityProblemRespiratory: 0,
      quantityGetFlu: 0,
      quantityGetPaludism: 0,
      destroyedSchoolKit: false,
      destroyedKitchenEquipment: false,
      destroyedWaterSource: false,
      destroyedWaterStore: false,
      destroyedHouse: false,
      burningHouse: false,
      floodedHouse: false,
      rooflessHouse: false,
      hasElectricity: false,
      hasDrinkingWater: false,
      scanQr: false,
      simpleBook: false,
      noBook: false,
    },
  })

  const { isConnected } = useNetworkInfoContext()
  const {
    hasError: allocateHelpHasError,
    isLoading: allocateHelpIsLoading,
    isDisater,
    message: allocateHelpMessage,
    handleEnrollHouseholdDisaster,
  } = useEnrollHouseholdDisasterApi({
    onSuccess: () => {
      setSnackbarVisible(true)
    },
    onError: () => {
      setSnackbarVisible(true)
    },
  })

  const isLoading = allocateHelpIsLoading || evacuationSitesIsLoading
  const hasError = allocateHelpHasError || evacuationSitesHasError

  // Block hardware back press on loading
  useBlockHardGobackPress(isLoading)

  const handleEnrollDisaster = () => {
    formik.validateForm(formik.values).then((value) => {
      if (Object.keys(value).length === 0) {
        handleEnrollHouseholdDisaster(formik.values as IHouseholdDisasterPayload)
      }
    })
  }

  // Load all evacuations sites
  useFocusEffect(
    React.useCallback(() => {
      loadEvacuationSites()
    }, [route.params.householdId]),
  )

  // Update screen header
  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        header: () => {
          return (
            <Appbar.Header
              style={{ backgroundColor: theme.navigation.colors.primary, elevation: 0 }}
            >
              <Appbar.Action
                icon="close"
                color={theme.navigation.colors.text}
                onPress={() => {
                  navigation.goBack()
                }}
                disabled={isLoading}
              />
              <Appbar.Content
                title={i18n.t("enrolldisaster.screentitle")}
                color={theme.navigation.colors.text}
              />
              {!isLoading && (
                <Appbar.Action
                  icon="check"
                  disabled={!formik.isValid}
                  color={theme.navigation.colors.text}
                  onPress={handleEnrollDisaster}
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
    }, [route.params.householdId, isLoading, formik]),
  )

  // Render divider
  const renderDivider = () => (
    <View style={styles.dividerContainer}>
      <Divider style={styles.divider} />
    </View>
  )

  return (
    <View style={styles.container}>
      <ScrollView style={styles.formContainer}>
        <ItemListPicker
          name="siteId"
          mode="dropdown"
          label={i18n.t("enrolldisaster.evacuationsite")}
          selectedValue={Number(formik.values.siteId)}
          items={evacuationSites.map((pgmItm) => ({ label: pgmItm.name, value: pgmItm.siteId }))}
          handleChange={(val) => {
            if (val) {
              formik.handleChange("siteId")(String(val))
              setLocalization({ ...localization, siteId: Number(val) })
            }
          }}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.siteId)}
          errorMessage={formik?.errors?.siteId}
          labelFlex={2}
        />
        {renderDivider()}
        <ItemListPicker
          name="scanQr"
          mode="dropdown"
          label={i18n.t("enrolldisaster.scan_qr")}
          selectedValue={String(formik.values.scanQr)}
          items={YESNO_ITEMS}
          handleChange={(val) => formik.handleChange("scanQr")(String(val))}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.scanQr)}
          errorMessage={formik?.errors?.scanQr}
          labelFlex={2}
        />
        {renderDivider()}
        <ItemListPicker
          name="simpleBook"
          mode="dropdown"
          label={i18n.t("enrolldisaster.simple_book")}
          selectedValue={String(formik.values.simpleBook)}
          items={YESNO_ITEMS}
          handleChange={(val) => formik.handleChange("simpleBook")(String(val))}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.simpleBook)}
          errorMessage={formik?.errors?.simpleBook}
          labelFlex={2}
        />
        {renderDivider()}
        <ItemListPicker
          name="noBook"
          mode="dropdown"
          label={i18n.t("enrolldisaster.no_book")}
          selectedValue={String(formik.values.noBook)}
          items={YESNO_ITEMS}
          handleChange={(val) => formik.handleChange("noBook")(String(val))}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.noBook)}
          errorMessage={formik?.errors?.noBook}
          labelFlex={2}
        />
        {renderDivider()}
        <DateTimePicker
          dense={true}
          name={"entryDate"}
          label={i18n.t("enrolldisaster.entry_date")}
          mode="date"
          value={formik.values.entryDate}
          handleChange={formik.handleChange("entryDate")}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.entryDate)}
          errorMessage={formik?.errors?.entryDate}
          labelFlex={2}
        />

        {renderDivider()}
        <TextInput
          name={"quantity"}
          label={i18n.t("enrolldisaster.quantity")}
          value={formik.values.quantity}
          handleChange={formik.handleChange("quantity")}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.quantity)}
          errorMessage={formik?.errors?.quantity}
          inputMode="numeric"
          labelFlex={2}
        />
        {renderDivider()}
        <TextInput
          name={"quantityMale"}
          label={i18n.t("enrolldisaster.quantitymale")}
          value={formik.values.quantityMale}
          handleChange={formik.handleChange("quantityMale")}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.quantityMale)}
          errorMessage={formik?.errors?.quantityMale}
          inputMode="numeric"
          labelFlex={2}
        />
        {renderDivider()}
        <TextInput
          name={"quantityFemale"}
          label={i18n.t("enrolldisaster.quantityfemale")}
          value={formik.values.quantityFemale}
          handleChange={formik.handleChange("quantityFemale")}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.quantityFemale)}
          errorMessage={formik?.errors?.quantityFemale}
          inputMode="numeric"
          labelFlex={2}
        />
        {renderDivider()}
        <TextInput
          name={"quantityStudent"}
          label={i18n.t("enrolldisaster.quantitystudent")}
          value={formik.values.quantityStudent}
          handleChange={formik.handleChange("quantityStudent")}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.quantityStudent)}
          errorMessage={formik?.errors?.quantityStudent}
          inputMode="numeric"
          labelFlex={2}
        />
        {renderDivider()}
        <TextInput
          name={"childrenUnder5Year"}
          label={i18n.t("enrolldisaster.quantitykids")}
          value={formik.values.childrenUnder5Year}
          handleChange={formik.handleChange("childrenUnder5Year")}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.childrenUnder5Year)}
          errorMessage={formik?.errors?.childrenUnder5Year}
          inputMode="numeric"
          labelFlex={2}
        />
        {renderDivider()}
        <TextInput
          name={"quantityPregnant"}
          label={i18n.t("enrolldisaster.quantitypregnant")}
          value={formik.values.quantityPregnant}
          handleChange={formik.handleChange("quantityPregnant")}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.quantityPregnant)}
          errorMessage={formik?.errors?.quantityPregnant}
          inputMode="numeric"
          labelFlex={2}
        />
        {renderDivider()}
        <TextInput
          name={"quantityFemaleFeeding"}
          label={i18n.t("enrolldisaster.quantityfemalefeeding")}
          value={formik.values.quantityFemaleFeeding}
          handleChange={formik.handleChange("quantityFemaleFeeding")}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.quantityFemaleFeeding)}
          errorMessage={formik?.errors?.quantityFemaleFeeding}
          inputMode="numeric"
          labelFlex={2}
        />
        {renderDivider()}
        <TextInput
          name={"quantityHandicapped"}
          label={i18n.t("enrolldisaster.quantityhandicapped")}
          value={formik.values.quantityHandicapped}
          handleChange={formik.handleChange("quantityHandicapped")}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.quantityHandicapped)}
          errorMessage={formik?.errors?.quantityHandicapped}
          inputMode="numeric"
          labelFlex={2}
        />
        {renderDivider()}
        <TextInput
          name={"quantityOver60Year"}
          label={i18n.t("enrolldisaster.quantityover60year")}
          value={formik.values.quantityOver60Year}
          handleChange={formik.handleChange("quantityOver60Year")}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.quantityOver60Year)}
          errorMessage={formik?.errors?.quantityOver60Year}
          inputMode="numeric"
          labelFlex={2}
        />
        {renderDivider()}
        <TextInput
          name={"quantityDiarrhea"}
          label={i18n.t("enrolldisaster.quantitydiarrhea")}
          value={formik.values.quantityDiarrhea}
          handleChange={formik.handleChange("quantityDiarrhea")}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.quantityDiarrhea)}
          errorMessage={formik?.errors?.quantityDiarrhea}
          inputMode="numeric"
          labelFlex={2}
        />
        {renderDivider()}
        <TextInput
          name={"quantityProblemRespiratory"}
          label={i18n.t("enrolldisaster.quantityproblemrespiratory")}
          value={formik.values.quantityProblemRespiratory}
          handleChange={formik.handleChange("quantityProblemRespiratory")}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.quantityProblemRespiratory)}
          errorMessage={formik?.errors?.quantityProblemRespiratory}
          inputMode="numeric"
          labelFlex={2}
        />
        {renderDivider()}
        <TextInput
          name={"quantityGetFlu"}
          label={i18n.t("enrolldisaster.quantitygetflu")}
          value={formik.values.quantityGetFlu}
          handleChange={formik.handleChange("quantityGetFlu")}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.quantityGetFlu)}
          errorMessage={formik?.errors?.quantityGetFlu}
          inputMode="numeric"
          labelFlex={2}
        />
        {renderDivider()}
        <TextInput
          name={"quantityGetPaludism"}
          label={i18n.t("enrolldisaster.quantitygetpaludism")}
          value={formik.values.quantityGetPaludism}
          handleChange={formik.handleChange("quantityGetPaludism")}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.quantityGetPaludism)}
          errorMessage={formik?.errors?.quantityGetPaludism}
          inputMode="numeric"
          labelFlex={2}
        />
        {renderDivider()}
        <ItemListPicker
          name="destroyedSchoolKit"
          mode="dropdown"
          label={i18n.t("enrolldisaster.destroyedschoolkit")}
          selectedValue={String(formik.values.destroyedSchoolKit)}
          items={YESNO_ITEMS}
          handleChange={(val) => formik.handleChange("destroyedSchoolKit")(String(val))}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.destroyedSchoolKit)}
          errorMessage={formik?.errors?.destroyedSchoolKit}
          labelFlex={2}
        />
        {renderDivider()}
        <ItemListPicker
          name="destroyedKitchenEquipment"
          mode="dropdown"
          label={i18n.t("enrolldisaster.destroyedkitchenequipment")}
          selectedValue={String(formik.values.destroyedKitchenEquipment)}
          items={YESNO_ITEMS}
          handleChange={(val) => formik.handleChange("destroyedKitchenEquipment")(String(val))}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.destroyedKitchenEquipment)}
          errorMessage={formik?.errors?.destroyedKitchenEquipment}
          labelFlex={2}
        />
        {renderDivider()}
        <ItemListPicker
          name="destroyedWaterSource"
          mode="dropdown"
          label={i18n.t("enrolldisaster.destroyedwatersource")}
          selectedValue={String(formik.values.destroyedWaterSource)}
          items={YESNO_ITEMS}
          handleChange={(val) => formik.handleChange("destroyedWaterSource")(String(val))}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.destroyedWaterSource)}
          errorMessage={formik?.errors?.destroyedWaterSource}
          labelFlex={2}
        />
        {renderDivider()}
        <ItemListPicker
          name="destroyedWaterStore"
          mode="dropdown"
          label={i18n.t("enrolldisaster.destroyedwaterstore")}
          selectedValue={String(formik.values.destroyedWaterStore)}
          items={YESNO_ITEMS}
          handleChange={(val) => formik.handleChange("destroyedWaterStore")(String(val))}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.destroyedWaterStore)}
          errorMessage={formik?.errors?.destroyedWaterStore}
          labelFlex={2}
        />
        {renderDivider()}
        <ItemListPicker
          name="destroyedHouse"
          mode="dropdown"
          label={i18n.t("enrolldisaster.destroyedhouse")}
          selectedValue={String(formik.values.destroyedHouse)}
          items={YESNO_ITEMS}
          handleChange={(val) => formik.handleChange("destroyedHouse")(String(val))}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.destroyedHouse)}
          errorMessage={formik?.errors?.destroyedHouse}
          labelFlex={2}
        />
        {renderDivider()}
        <ItemListPicker
          name="burningHouse"
          mode="dropdown"
          label={i18n.t("enrolldisaster.burninghouse")}
          selectedValue={String(formik.values.burningHouse)}
          items={YESNO_ITEMS}
          handleChange={(val) => formik.handleChange("burningHouse")(String(val))}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.burningHouse)}
          errorMessage={formik?.errors?.burningHouse}
          labelFlex={2}
        />
        {renderDivider()}
        <ItemListPicker
          name="floodedHouse"
          mode="dropdown"
          label={i18n.t("enrolldisaster.floodedhouse")}
          selectedValue={String(formik.values.floodedHouse)}
          items={YESNO_ITEMS}
          handleChange={(val) => formik.handleChange("floodedHouse")(String(val))}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.floodedHouse)}
          errorMessage={formik?.errors?.floodedHouse}
          labelFlex={2}
        />
        {renderDivider()}
        <ItemListPicker
          name="rooflessHouse"
          mode="dropdown"
          label={i18n.t("enrolldisaster.rooflesshouse")}
          selectedValue={String(formik.values.rooflessHouse)}
          items={YESNO_ITEMS}
          handleChange={(val) => formik.handleChange("rooflessHouse")(String(val))}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.rooflessHouse)}
          errorMessage={formik?.errors?.rooflessHouse}
          labelFlex={2}
        />
        {renderDivider()}
        <ItemListPicker
          name="hasElectricity"
          mode="dropdown"
          label={i18n.t("enrolldisaster.haselectricity")}
          selectedValue={String(formik.values.hasElectricity)}
          items={YESNO_ITEMS}
          handleChange={(val) => formik.handleChange("hasElectricity")(String(val))}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.hasElectricity)}
          errorMessage={formik?.errors?.hasElectricity}
          labelFlex={2}
        />
        {renderDivider()}
        <ItemListPicker
          name="hasDrinkingWater"
          mode="dropdown"
          label={i18n.t("enrolldisaster.hasdrinkingwater")}
          selectedValue={String(formik.values.hasDrinkingWater)}
          items={YESNO_ITEMS}
          handleChange={(val) => formik.handleChange("hasDrinkingWater")(String(val))}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.hasDrinkingWater)}
          errorMessage={formik?.errors?.hasDrinkingWater}
          labelFlex={2}
        />
        {renderDivider()}
        <TextInput
          name={"observation"}
          label={i18n.t("enrolldisaster.observation")}
          value={formik.values.observation}
          handleChange={formik.handleChange("observation")}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.observation)}
          errorMessage={formik?.errors?.observation}
        />
        <View style={{ height: 64 }}></View>
      </ScrollView>
      {isSnackbarVisible && (
        <Snackbar
          variant={isDisater ? "isDisater": (hasError ? "error" : "success")}
          visible={isSnackbarVisible}
          duration={1000}
          onDismiss={() => {
            setSnackbarVisible(false)
            if (!hasError && !isDisater) navigation.goBack()
          }}
        >
          {( hasError
            ? !isConnected
              ? i18n.t("errors.networkerror")
              : allocateHelpMessage
            : allocateHelpMessage)}
        </Snackbar>
      )}
    </View>
  )
}

export default EnrollDisaster
