import React, { useState } from "react"
import { diff } from "deep-object-diff"
import { View, ScrollView, TouchableOpacity, ActivityIndicator, Text } from "react-native"
import { useTheme, Appbar, Menu, Divider } from "react-native-paper"
import FastImage from "react-native-fast-image"
import { RouteProp } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import Icon from "react-native-vector-icons/MaterialIcons"
import ImagePicker from "react-native-image-crop-picker"
import { useFocusEffect } from "@react-navigation/native"

import ItemListPicker from "../../components/ItemListPicker"
import Snackbar from "../../components/Snackbar"
import TextInput from "../../components/TextInput"
import DateTimePicker from "../../components/DateTimePicker"
import { useI18nContext } from "../../modules/I18nProvider"
import { NavigationParamList } from "../../navigations"
import { JOBS, NATIONALITIES, OTHER_JOB_ID } from "../../consts"
import { useAuthContext } from "../../modules/AuthProvider"
import { useLifeStatus } from "../../modules/hooks/useLifeStatus"
import { useYesNoItems } from "../../modules/hooks/useYesNoItems"
import { useGenderItems } from "../../modules/hooks/useGenderItems"
import { name } from "../../../app.json"
import {
  useCreateCitizenAndHouseholdApi,
  useSearchCitizenApi,
  useUpdateCitizenApi,
} from "../../modules/api"

import useStyles from "./styles"
import { useFormik } from "./formik"
import { useNetworkInfoContext } from "../../modules/NetworkInfoProvider"
import { useBlockHardGobackPress } from "../../modules/hooks"
import { useEventLoggingApi } from "../../modules/api/logging"

interface IProps {
  route: RouteProp<NavigationParamList, "CitizenEditor">
  navigation: StackNavigationProp<NavigationParamList>
}

// Update/Create citizen info
const CitizenEditor = ({ navigation, route }: IProps) => {
  const { i18n } = useI18nContext()
  const theme = useTheme()
  const styles = useStyles()
  const [isSnackbarVisible, setSnackbarVisible] = React.useState<boolean>(false)
  const [haveCNI, setHaveCNI] = React.useState<boolean>(false)

  const formik = useFormik({
    onSubmit: async (values) => {},
    initialValues: route.params.citizen,
    intent: route.params.intent,
  })

  const { LIFE_STATUS } = useLifeStatus()
  const { GENDER_ITEMS } = useGenderItems()
  const { YESNO_ITEMS } = useYesNoItems()

  const [isPicMenuVisible, setPicMenuVisible] = React.useState<boolean>(false)
  const [isPicDeleted, setPicDeleted] = React.useState<boolean>(false)

  const { currentUser } = useAuthContext()
  const { isConnected } = useNetworkInfoContext()
  const {
    hasError: isUpdateHasError,
    isLoading: isUpdateLoading,
    message: updateMessage,
    newCitizenUpdate,
    citizenIdUpdate,
    handleUpdateCitizen,
  } = useUpdateCitizenApi()
  const {
    hasError: isCreationHasError,
    isLoading: isCreationLoading,
    message: creationMessage,
    newCitizenAdd,
    citizenIdAdd,
    isDuplicate,
    handleCreateCitizenAndHousehold,
  } = useCreateCitizenAndHouseholdApi()

  const logEvent = useEventLoggingApi()

  const hasError = isUpdateHasError || isCreationHasError
  const isLoading = isUpdateLoading || isCreationLoading
  const newCitizenId = citizenIdUpdate ? citizenIdUpdate : citizenIdAdd
  const newCitizen = newCitizenAdd ? newCitizenAdd : newCitizenUpdate

  // Block hardware back press on loading
  useBlockHardGobackPress(isLoading)

  const hasUpdate = Object.keys(diff(route.params.citizen, formik.values)).length > 0

  // Handle identity pic menu visibility
  const togglePicMenu = () => {
    setPicMenuVisible((currentState) => !currentState)
  }

  // Open camera for profile picture shoot
  const openCamera = () => {
    setPicMenuVisible(false)
    ImagePicker.openCamera({
      width: 512,
      height: 512,
      cropping: true,
      includeBase64: true,
      mediaType: "photo",
    })
      .then((image) => {
        setPicDeleted(false)
        formik.setFieldValue("photo", `data:${image.mime};base64,${image.data}`)
        //Logging action
        logEvent(currentUser, "CHANGE-PROFILE-PICTURE", "NULL", "NULL")
      })
      .catch((reason) => console.log("openCamera => ", reason))
  }

  const handleCreateOrUpdateCitizen = () => {
    // Update citizen
    if (route.params.intent === "updatecitizen" && route.params.citizen.id) {
      handleUpdateCitizen(route.params.citizen.id, formik.values, route.params.validation, {
        onSuccess: () => {
          setSnackbarVisible(true)
          setPicDeleted(false)
        },
        onError: () => {
          setSnackbarVisible(true)
          setPicDeleted(false)
        },
      })
    }
    // Create new citizen with household
    else if (
      route.params.intent === "createhousehold" ||
      route.params.intent === "addhouseholdmember"
    ) {
      handleCreateCitizenAndHousehold(formik.values, route.params.intent, {
        onSuccess: () => {
          setSnackbarVisible(true)
          setPicDeleted(false)
        },
        onError: () => {
          setSnackbarVisible(true)
          setPicDeleted(false)
        },
      })
    }
  }

  React.useEffect(() => {
    if (route.params.intent === "createhousehold") {
      formik.setFieldValue("isChief", true)
    }
  }, [])

  const  numberWithSpaces =(x)=> {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    const reuslt=parts.join(".");
    formik.setFieldValue("CNI", reuslt)
 
    ///alert("result ====> "+formik.values.CNI)
}

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
              {route.params.intent === "createhousehold" && (
                <Appbar.Content
                  title={i18n.t("updatecitizen.screentitle2")}
                  color={theme.navigation.colors.text}
                />
              )}
              {route.params.intent === "addhouseholdmember" && (
                <Appbar.Content
                  title={i18n.t("updatecitizen.screentitle3")}
                  color={theme.navigation.colors.text}
                />
              )}
              {route.params.intent === "updatecitizen" && (
                <Appbar.Content
                  title={`${route.params.citizen.lastName ===null ? '' : route.params.citizen.lastName} ${route.params.citizen.firstName === null? '' :route.params.citizen.firstName}`}
                  color={theme.navigation.colors.text}
                />
              )}
              {!isLoading && (
                <Appbar.Action
                  icon="check"
                  disabled={!hasUpdate || !formik.isValid}
                  color={theme.navigation.colors.text}
                  onPress={handleCreateOrUpdateCitizen}
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
    }, [route.params.citizen, isLoading, isPicDeleted, formik, hasUpdate]),
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
        <View style={styles.profilePicRow}>
          <View style={styles.profilePicBox}>
            <FastImage
              style={styles.profilePic}
              source={
                formik.values?.photo && formik.values?.photo?.length > 0 && !isPicDeleted
                  ? { uri: formik.values.photo, priority: FastImage.priority.normal }
                  : require("../../assets/default-pic.png")
              }
              resizeMode={FastImage.resizeMode.contain}
            />
            <Menu
              visible={isPicMenuVisible}
              onDismiss={togglePicMenu}
              anchor={
                <TouchableOpacity
                  style={styles.profilePicEdit}
                  onPress={togglePicMenu}
                  disabled={isLoading}
                >
                  <Icon name={"edit"} size={18} color={theme.colors.onPrimary} />
                </TouchableOpacity>
              }
              style={styles.editPicMenu}
            >
              <Menu.Item title={i18n.t("updatecitizen.menuprofilepic")} />
              <Divider />
              <Menu.Item
                style={styles.editPicMenuItm}
                icon="camera"
                onPress={openCamera}
                title={i18n.t("updatecitizen.menunewpic")}
              />
              <Menu.Item
                disabled={
                  !(formik.values?.photo && formik.values?.photo?.length > 0) || isPicDeleted
                }
                style={styles.editPicMenuItm}
                icon="trash-can-outline"
                onPress={() => {
                  setPicMenuVisible(false)
                  formik.setFieldValue("photo", undefined)
                  setPicDeleted(true)
                }}
                title={i18n.t("updatecitizen.menuremovepic")}
              />
            </Menu>
          </View>
        </View>
        {route.params.validation && (
          <>
            {renderDivider()}
            <ItemListPicker
              name="isChief"
              mode="dropdown"
              label={i18n.t("household.chef")}
              selectedValue={String(formik.values.isChief)}
              items={YESNO_ITEMS}
              handleChange={(val) => {
                formik.handleChange("isChief")(String(val))
              }}
              disabled={isLoading}
              hasError={Boolean(formik?.errors?.isChief)}
              errorMessage={formik?.errors?.isChief}
            />
          </>
        )}

        {route.params.intent !== "addhouseholdmember" && (
          <>
            {renderDivider()}
            <TextInput
              name={"address.name"}
              label={i18n.t("household.adresse")}
              value={formik?.values?.address?.name}
              handleChange={formik.handleChange("address.name")}
              disabled={isLoading || route.params.intent === "createhousehold"}
              hasError={Boolean(formik?.errors?.address?.name)}
              errorMessage={formik?.errors?.address?.name}
            />
            {renderDivider()}
            <TextInput
              name={"address.sector"}
              label={i18n.t("household.secteur")}
              value={formik?.values?.address?.sector}
              handleChange={formik.handleChange("address.sector")}
              disabled={isLoading}
              hasError={Boolean(formik?.errors?.address?.sector)}
              errorMessage={formik?.errors?.address?.sector}
            />
            {renderDivider()}
            <TextInput
              inputMode="phone-pad"
              name={"household.registerNumber"}
              label={i18n.t("household.registration")}
              value={formik?.values?.household?.registerNumber}
              handleChange={formik.handleChange("household.registerNumber")}
              disabled={isLoading}
              hasError={Boolean(formik?.errors?.household?.registerNumber)}
              errorMessage={formik?.errors?.household?.registerNumber}
            />
          </>
        )}

        {renderDivider()}
        <TextInput
          name={"lastName"}
          label={i18n.t("updatecitizen.name")}
          value={formik.values.lastName}
          handleChange={formik.handleChange("lastName")}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.lastName)}
          errorMessage={formik?.errors?.lastName}
          maxLength={50}
          required={true}
        />
        {renderDivider()}
        <TextInput
          name={"firstname"}
          label={i18n.t("updatecitizen.firstname")}
          value={formik.values.firstName}
          handleChange={formik.handleChange("firstName")}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.firstName)}
          errorMessage={formik?.errors?.lastName}
          maxLength={50}
        />
        {renderDivider()}
        <ItemListPicker
          name="gender"
          mode="dropdown"
          label={i18n.t("updatecitizen.sex")}
          selectedValue={Number(formik.values.gender)}
          items={GENDER_ITEMS}
          handleChange={(val) => formik.handleChange("gender")(String(val))}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.gender)}
          errorMessage={formik?.errors?.gender}
        />
        {renderDivider()}
        <ItemListPicker
          name="isHandicapped"
          mode="dropdown"
          label={i18n.t("household.handicapped")}
          selectedValue={String(formik.values.isHandicapped)}
          items={YESNO_ITEMS}
          handleChange={(val) => formik.handleChange("isHandicapped")(String(val))}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.isHandicapped)}
          errorMessage={formik?.errors?.isHandicapped}
        />
        {renderDivider()}
        <DateTimePicker
          name={"birthDate"}
          label={i18n.t("updatecitizen.birthdate")}
          mode="date"
          value={formik.values.birthDate}
          handleChange={formik.handleChange("birthDate")}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.birthDate)}
          errorMessage={formik?.errors?.birthDate}
          required={true}
        />
        {renderDivider()}
        <TextInput
          name={"birthPlace"}
          label={i18n.t("updatecitizen.birthplace")}
          value={formik.values.birthPlace}
          handleChange={formik.handleChange("birthPlace")}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.birthPlace)}
          errorMessage={formik?.errors?.birthPlace}
        />
        {renderDivider()}
        <TextInput
          name={"father"}
          label={i18n.t("household.father")}
          value={formik.values.father}
          handleChange={formik.handleChange("father")}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.father)}
          errorMessage={formik?.errors?.father}
        />
        {renderDivider()}
        <ItemListPicker
          name="fatherStatus"
          mode="dropdown"
          label={i18n.t("household.fatherstatus")}
          selectedValue={Number(formik.values.fatherStatus)}
          items={LIFE_STATUS}
          handleChange={(val) => formik.handleChange("fatherStatus")(String(val))}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.fatherStatus)}
          errorMessage={formik?.errors?.fatherStatus}
        />
        {renderDivider()}
        <TextInput
          name={"mother"}
          label={i18n.t("household.mother")}
          value={formik.values.mother}
          handleChange={formik.handleChange("mother")}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.mother)}
          errorMessage={formik?.errors?.mother}
        />
        {renderDivider()}
        <ItemListPicker
          name="motherStatus"
          mode="dropdown"
          label={i18n.t("household.motherstatus")}
          selectedValue={Number(formik.values.motherStatus)}
          items={LIFE_STATUS}
          handleChange={(val) => formik.handleChange("motherStatus")(String(val))}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.motherStatus)}
          errorMessage={formik?.errors?.motherStatus}
        />
        {renderDivider()}
        <TextInput
          inputMode="phone-pad"
          name={"phoneNumber"}
          label={i18n.t("updatecitizen.phonenumbers")}
          value={formik.values.phoneNumber}
          
          handleChange={formik.handleChange("phoneNumber")}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.phoneNumber)}
          errorMessage={formik?.errors?.phoneNumber}
        />
        {renderDivider()}
        <ItemListPicker
          name="nationalityId"
          label={i18n.t("updatecitizen.nationality")}
          selectedValue={Number(formik.values.nationalityId)}
          items={NATIONALITIES}
          handleChange={(val) => formik.handleChange("nationalityId")(String(val))}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.nationalityId)}
          errorMessage={formik?.errors?.nationalityId}
        />
        {renderDivider()}
               <TextInput
          inputMode="phone-pad"
          name={"CNI"}
          label={i18n.t("updatecitizen.cin")}
          value={formik.values.CNI}
          handleChange={formik.handleChange("CNI")}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.CNI)}
          errorMessage={formik?.errors?.CNI}
          onFocus={()=>{
            console.log('test ======>')
            const value = formik.values.CNI?.trim()
            if (value !== "" ) {
              console.log('true')
              setHaveCNI(true)
           
            }else{
              console.log('false')
              setHaveCNI(false)
            }
            formik.handleChange("CNI")
          
          }}
          onBlur={(val)=>{

if(formik.values.CNI?.length===12)numberWithSpaces(formik.values.CNI)
          }}
          maxLength={15}
        />
        {renderDivider()}
        <DateTimePicker
          name={"CNIDeliveryDate"}
          label={i18n.t("household.datecin")}
          mode="date"
          value={formik.values.CNIDeliveryDate}
          handleChange={formik.handleChange("CNIDeliveryDate")}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.CNIDeliveryDate)}
          errorMessage={formik?.errors?.CNIDeliveryDate}
          required={haveCNI ? true : false}
        />
        {renderDivider()}
        <TextInput
          name={"CNIDeliveryPlace"}
          label={i18n.t("household.loccin")}
          value={formik.values.CNIDeliveryPlace}
          handleChange={formik.handleChange("CNIDeliveryPlace")}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.CNIDeliveryPlace)}
          errorMessage={formik?.errors?.CNIDeliveryPlace}
          required={haveCNI ? true : false}
        />
        {renderDivider()}
        <ItemListPicker
          name="dead"
          mode="dropdown"
          label={i18n.t("household.dead")}
          selectedValue={String(formik.values.isDied)}
          items={YESNO_ITEMS}
          handleChange={(val) => formik.handleChange("isDied")(String(val))}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.isDied)}
          errorMessage={formik?.errors?.isDied}
        />
        {String(formik.values.isDied) === "true" && (
          <>
            {renderDivider()}
            <DateTimePicker
              name={"deathDate"}
              label={i18n.t("household.deathdate")}
              mode="date"
              value={formik.values.deathDate}
              handleChange={formik.handleChange("deathDate")}
              disabled={isLoading}
              hasError={Boolean(formik?.errors?.deathDate)}
              errorMessage={formik?.errors?.deathDate}
            />
          </>
        )}
        {renderDivider()}
        <ItemListPicker
          name="jobId"
          label={i18n.t("updatecitizen.job")}
          selectedValue={Number(formik.values.jobId)}
          items={JOBS}
          handleChange={(val) => formik.handleChange("jobId")(String(val))}
          disabled={isLoading}
          hasError={Boolean(formik?.errors?.jobId)}
          errorMessage={formik?.errors?.jobId}
        />
        {Number(formik.values.jobId) === OTHER_JOB_ID && (
          <>
            {renderDivider()}
            <TextInput
              name={"jobOther"}
              label={i18n.t("updatecitizen.otherjob")}
              value={formik.values.jobOther}
              handleChange={formik.handleChange("jobOther")}
              disabled={isLoading}
              hasError={Boolean(formik?.errors?.jobOther)}
              errorMessage={formik?.errors?.jobOther}
            />
          </>
        )}
        <View style={{ height: 64 }}></View>
      </ScrollView>
      {isSnackbarVisible && (
        <Snackbar
          variant={hasError || isDuplicate ? "error" : "success"}
          visible={isSnackbarVisible}
          duration={1000}
          onDismiss={() => {
            setSnackbarVisible(false)
            if (!hasError) {
              if (newCitizenId && newCitizen)
                navigation.navigate("CitizenView", {
                  citizenId: newCitizenId,
                  lastName: newCitizen?.lastName ? newCitizen.lastName : "",
                  firstName: newCitizen?.firstName ? newCitizen.firstName : "",
                })
              else {
                navigation.goBack()
              }
            }
          }}
        >
          {hasError
            ? !isConnected
              ? i18n.t("errors.networkerror")
              : route.params.intent === "updatecitizen"
              ? updateMessage
              : creationMessage
            : route.params.intent === "updatecitizen"
            ? updateMessage
            : creationMessage}
        </Snackbar>
      )}
    </View>
  )
}

export default CitizenEditor
