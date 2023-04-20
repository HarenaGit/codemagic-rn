import React, { useState } from "react"
import { View, Image, TextInput } from "react-native"
import { useTheme, HelperText } from "react-native-paper"
import { StackNavigationProp } from "@react-navigation/stack"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { Picker } from "@react-native-picker/picker"

import { ApiEnv } from "../../config"
import { useI18nContext } from "../../modules/I18nProvider"
import CustomButton from "../../components/CustomButton"
import { NavigationParamList } from "../../navigations"
import { useAuthContext } from "../../modules/AuthProvider"
import { useLoginApi } from "../../modules/api"
import { useNetworkInfoContext } from "../../modules/NetworkInfoProvider"
import { useLocalizationContext } from "../../modules/LocalizationProvider"
import useStyles from "./styles"
import { useFormik } from "./formik"
import { useEventLoggingApi } from "../../modules/api/logging"
import ItemListPicker from "../../components/ItemListPicker"
import { useApiEnvContext } from "../../modules/ApiEnvProvider"

interface IProps {
  navigation: StackNavigationProp<NavigationParamList>
}

// Main home screen
const Login = ({ navigation }: IProps) => {
  const { i18n } = useI18nContext()
  const theme = useTheme()
  const styles = useStyles()

  const { envName, setEnvName, envNames } = useApiEnvContext()
  const { currentUser } = useAuthContext()
  const { localization } = useLocalizationContext()
  const { isConnected } = useNetworkInfoContext()
  const { isLoading, hasError, handleLogin } = useLoginApi()
  const logEvent = useEventLoggingApi()

  const formik = useFormik({
    onSubmit: async (values) => {
      handleLogin(values, () => {
        // Go to home screen
        if (
          Boolean(
            localization.provinceId &&
              localization.regionId &&
              localization.districtId &&
              localization.municipalityId &&
              localization.boroughId &&
              localization.fokontanyId,
          )
        ) {
          //Logging
          logEvent(currentUser, "OPEN-HOME-SCREEN", "NULL", "NULL")
          navigation.navigate("Home", {})
        }
        // Go to SelectFokotany screen
        else {
          //Logging
          logEvent(currentUser, "OPEN-INIT-FOKONTANY-SCREEN", "NULL", "NULL")
          navigation.navigate("SelectFokotany", { intent: "init" })
        }
      })
    },
  })

  return (
    <View style={styles.root}>
      <View style={styles.logoContainer}>
        <Image source={require("../../assets/logo_loharano.png")} />
      </View>
      <View style={styles.fieldContainer}>
        <View style={styles.inputRow}>
          <View style={styles.fieldWrapper}>
            <Icon name="account" size={18} color={theme.colors.onCard} />
            <TextInput
              value={formik.values?.username}
              placeholder={i18n.t("login.username")}
              style={styles.textInput}
              onChangeText={formik.handleChange("username")}
              onBlur={formik.handleBlur("username")}
            />
          </View>
          {formik.touched.username && Boolean(formik.errors.username) && (
            <HelperText type="error" visible={true} padding="none">
              {formik.errors.username}
            </HelperText>
          )}
        </View>
        <View style={styles.inputRow}>
          <View style={styles.fieldWrapper}>
            <Icon name="lock" size={18} color={theme.colors.onCard} />
            <TextInput
              value={formik.values?.password}
              placeholder={i18n.t("login.password")}
              style={styles.textInput}
              secureTextEntry={true}
              onChangeText={formik.handleChange("password")}
              onBlur={formik.handleBlur("password")}
            />
          </View>
          {formik.touched.password && Boolean(formik.errors.password) && (
            <HelperText type="error" visible={true} padding="none">
              {formik.errors.password}
            </HelperText>
          )}
        </View>
        <View style={styles.inputRow}>
          <View style={styles.fieldWrapper}>
            <Icon name="database-settings" size={18} color={theme.colors.onCard} />
            <Picker
              mode={"dropdown"}
              selectedValue={envName}
              style={styles.pickerComponent}
              prompt={i18n.t("apienv.envlabel")}
              onValueChange={(itemValue, itemIndex) => {
                if (itemValue) setEnvName(itemValue as ApiEnv)
              }}
            >
              {envNames
                .map((envItm) => ({
                  value: envItm,
                  label: envItm,
                }))
                .map((item) => (
                  <Picker.Item key={item.value} value={item.value} label={item.label} />
                ))}
            </Picker>
          </View>
        </View>
        {hasError && (
          <View style={styles.inputRow}>
            <HelperText type="error" visible={true} padding="none">
              {isConnected ? i18n.t("login.invalidcredential") : i18n.t("networkerror")}
            </HelperText>
          </View>
        )}
        <View style={styles.loginButtonWrapper}>
          <CustomButton
            isLoading={isLoading}
            variant="primary"
            label={i18n.t("login.login")}
            onPress={formik.handleSubmit}
          />
        </View>
      </View>
    </View>
  )
}

export default Login
