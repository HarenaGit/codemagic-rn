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
import {
  useAllocateHouseholdHelpApi,
  useHelpProgramsApi,
  useHouseholdHelpProgramsApi,
} from "../../../modules/api/household-help"
import { useBlockHardGobackPress } from "../../../modules/hooks"
import ItemListPicker from "../../../components/ItemListPicker"
import { useHelpTransactionChannel } from "../../../modules/hooks/useHelpTransactionChannel"
import { useBankItems } from "../../../modules/hooks/useBankItems"
import { HELP_TYPE_CASH } from "../../../consts"
import Snackbar from "../../../components/Snackbar"

import useStyles from "./styles"
import { useFormik } from "./formik"
import { differenceBetwenTwoDateValue } from "../../../components/DateTimePicker"

interface IProps {
  route: RouteProp<NavigationParamList, "AllocateHelp">
  navigation: StackNavigationProp<NavigationParamList>
}

// Allocate help to household
const AllocateHelp = ({ navigation, route }: IProps) => {
  const { i18n } = useI18nContext()
  const theme = useTheme()
  const styles = useStyles()
  const [isSnackbarVisible, setSnackbarVisible] = React.useState<boolean>(false)
  const [currentHelpType, setCurrentHelpType] = React.useState<IHelpProgram>()
  const [dateNumber, setDateNumber] = React.useState<number>(0)
  const [helpAlreadyReceived, setHelpAlreadyReceived] = React.useState<boolean>(false)
  const [isSnackbarVisibleHelp, setSnackbarVisibleHelp] = React.useState<boolean>(false)
  const { householdHelpPrograms, loadHouseholdHelpPrograms } = useHouseholdHelpProgramsApi()

  const { BANK_CHANNEL, PAOMA_CHANNEL, TRANSACTION_CHANNELS, OTHER_CHANNEL } =
    useHelpTransactionChannel()
  const { BANK_ITEMS } = useBankItems()

  const {
    hasError: helpProgramsHasError,
    isLoading: helpProgramsIsLoading,
    helpPrograms,
    loadHelpPrograms,
  } = useHelpProgramsApi()

  useFocusEffect(
    React.useCallback(() => {
      loadHouseholdHelpPrograms(route.params.bookNumber)
    }, [route.params.bookNumber]),
  )

  const formik = useFormik(
    {
      onSubmit: async (values) => {},
      initialValues: {
        bookNumber: route.params.bookNumber,
        bankId: BANK_ITEMS[0].value,
        transactionChannel: TRANSACTION_CHANNELS[0].value,
      },
    },
    currentHelpType,
  )

  const { isConnected } = useNetworkInfoContext()

  const {
    hasError: allocateHelpHasError,
    isLoading: allocateHelpIsLoading,
    message: allocateHelpMessage,
    handleAllocateHouseholdHelp,
  } = useAllocateHouseholdHelpApi({
    onSuccess: () => {
      setSnackbarVisible(true)
    },
    onError: () => {
      setSnackbarVisible(true)
    },
  })

  const isLoading = allocateHelpIsLoading || helpProgramsIsLoading
  const hasError = helpProgramsHasError || allocateHelpHasError

  // Block hardware back press on loading
  useBlockHardGobackPress(isLoading)

  const handleAllocateHelp = () => {
    if (!helpAlreadyReceived) {
      formik.validateForm(formik.values).then((value) => {
        if (Object.keys(value).length === 0) {
          handleAllocateHouseholdHelp(formik.values as IHouseholdHelpPayload)
        }
      })
    } else {
      setSnackbarVisibleHelp(true)
    }
  }

  // Set current help program
  useFocusEffect(
    React.useCallback(() => {
      if (formik.values.helpId) {
        const helpType = helpPrograms.find(
          (pgmItm) => pgmItm.helpId === Number(formik.values.helpId),
        )
        let householdHelpProgramsbytype = householdHelpPrograms.filter(
          (x) => x.helpId === Number(formik.values.helpId),
        )
        if (householdHelpProgramsbytype && householdHelpProgramsbytype.length > 0) {
          let most_recent = householdHelpProgramsbytype.reduce((mostRecent, item) =>
            item.date > mostRecent.date ? item : mostRecent,
          )
          setDateNumber(differenceBetwenTwoDateValue(most_recent.date))
          if (dateNumber < 14) {
            setHelpAlreadyReceived(true)
            setSnackbarVisibleHelp(true)
          } else {
            setHelpAlreadyReceived(false)
          }
        } else {
          setHelpAlreadyReceived(false)
        }
        setCurrentHelpType(helpType)
      }
    }, [formik.values.helpId]),
  )

  // Load all help programs
  useFocusEffect(
    React.useCallback(() => {
      loadHelpPrograms()
    }, [route.params.bookNumber]),
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
                title={i18n.t("allocatehelp.screentitle")}
                color={theme.navigation.colors.text}
              />
              {!isLoading && (
                <Appbar.Action
                  icon="check"
                  disabled={!formik.isValid || helpAlreadyReceived}
                  color={theme.navigation.colors.text}
                  onPress={handleAllocateHelp}
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
    }, [route.params.bookNumber, isLoading, formik]),
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
          name="helpId"
          mode="dropdown"
          label={i18n.t("allocatehelp.helptype")}
          selectedValue={Number(formik.values.helpId)}
          items={helpPrograms.map((pgmItm) => ({ label: pgmItm.name, value: pgmItm.helpId }))}
          handleChange={(val) => val && formik.handleChange("helpId")(String(val))}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.helpId)}
          errorMessage={formik?.errors?.helpId}
        />
        {currentHelpType && currentHelpType?.type === HELP_TYPE_CASH && (
          <>
            {renderDivider()}
            <ItemListPicker
              name="transactionChannel"
              mode="dropdown"
              label={i18n.t("allocatehelp.transactionchannel")}
              selectedValue={Number(formik.values.transactionChannel)}
              items={TRANSACTION_CHANNELS}
              handleChange={(val) => formik.handleChange("transactionChannel")(String(val))}
              disabled={isLoading}
              hasError={Boolean(formik?.errors?.transactionChannel)}
              errorMessage={formik?.errors?.transactionChannel}
            />
            {formik.values.transactionChannel &&
              ![BANK_CHANNEL, PAOMA_CHANNEL, OTHER_CHANNEL].includes(
                Number(formik.values.transactionChannel),
              ) && (
                <>
                  {renderDivider()}
                  <TextInput
                    name={"phoneNumber"}
                    inputMode="phone-pad"
                    label={i18n.t("allocatehelp.telephone")}
                    value={formik.values.phoneNumber}
                    handleChange={formik.handleChange("phoneNumber")}
                    disabled={isLoading}
                    hasError={Boolean(formik?.errors?.phoneNumber)}
                    errorMessage={formik?.errors?.phoneNumber}
                  />
                </>
              )}
            {formik.values.transactionChannel &&
              BANK_CHANNEL === Number(formik.values.transactionChannel) && (
                <>
                  {renderDivider()}
                  <ItemListPicker
                    name="bankId"
                    mode="dropdown"
                    label={i18n.t("allocatehelp.bank")}
                    selectedValue={Number(formik.values.bankId)}
                    items={BANK_ITEMS}
                    handleChange={(val) => formik.handleChange("bankId")(String(val))}
                    disabled={isLoading}
                    hasError={Boolean(formik?.errors?.bankId)}
                    errorMessage={formik?.errors?.bankId}
                  />
                  {renderDivider()}
                  <TextInput
                    name={"rib"}
                    inputMode="phone-pad"
                    label={i18n.t("allocatehelp.rib")}
                    value={formik.values.rib}
                    handleChange={formik.handleChange("rib")}
                    disabled={isLoading}
                    hasError={Boolean(formik?.errors?.rib)}
                    errorMessage={formik?.errors?.rib}
                  />
                </>
              )}
            {formik.values.transactionChannel &&
              PAOMA_CHANNEL === Number(formik.values.transactionChannel) && (
                <>
                  {renderDivider()}
                  <TextInput
                    name={"paositraMoney"}
                    label={i18n.t("allocatehelp.paoma")}
                    value={formik.values.paositraMoney}
                    handleChange={formik.handleChange("paositraMoney")}
                    disabled={isLoading}
                    hasError={Boolean(formik?.errors?.paositraMoney)}
                    errorMessage={formik?.errors?.paositraMoney}
                  />
                </>
              )}
            {formik.values.transactionChannel &&
              OTHER_CHANNEL === Number(formik.values.transactionChannel) && (
                <>
                  {renderDivider()}
                  <TextInput
                    name={"otherChannel"}
                    label={i18n.t("allocatehelp.othertransactionchannel")}
                    value={formik.values.otherChannel}
                    handleChange={formik.handleChange("otherChannel")}
                    disabled={isLoading}
                    hasError={Boolean(formik?.errors?.otherChannel)}
                    errorMessage={formik?.errors?.otherChannel}
                  />
                </>
              )}
          </>
        )}
        {renderDivider()}
        <TextInput
          name={"observation"}
          label={i18n.t("allocatehelp.comments")}
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
          variant={hasError ? "error" : "success"}
          visible={isSnackbarVisible}
          duration={1000}
          onDismiss={() => {
            setSnackbarVisible(false)
            if (!hasError) navigation.goBack()
          }}
        >
          {hasError
            ? !isConnected
              ? i18n.t("errors.networkerror")
              : allocateHelpMessage
            : allocateHelpMessage}
        </Snackbar>
      )}
      {isSnackbarVisibleHelp && (
        <Snackbar
          variant={"error"}
          visible={isSnackbarVisibleHelp}
          duration={1000}
          onDismiss={() => {
            setSnackbarVisibleHelp(false)
            if (!helpAlreadyReceived) navigation.goBack()
          }}
        >
          {helpAlreadyReceived
            ? !isConnected
              ? i18n.t("errors.networkerror")
              : i18n.t("statecitizen.helpAlreadyReceived", { helpType: currentHelpType?.name })
            : i18n.t("statecitizen.helpAlreadyReceived", { helpType: currentHelpType?.name })}
        </Snackbar>
      )}
    </View>
  )
}

export default AllocateHelp
