import React from "react"
import { Text, SafeAreaView } from "react-native"
import { useTheme } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialIcons"

import { useI18nContext } from "../../modules/I18nProvider"
import styles from "./styles"

// Show an error indicator
const ErrorIndicator = () => {
  const theme = useTheme()
  const { i18n } = useI18nContext()

  return (
    <SafeAreaView style={styles.container}>
      <Icon name="report" size={44} color={theme.colors.error} />
      <Text style={styles.networkErrorLabel}>{i18n.t("errors.dataloaderror")}</Text>
    </SafeAreaView>
  )
}

export default ErrorIndicator
