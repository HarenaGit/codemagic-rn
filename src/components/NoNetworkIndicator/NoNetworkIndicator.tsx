import React from "react"
import { Text, SafeAreaView } from "react-native"
import { useTheme } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialIcons"

import { useI18nContext } from "../../modules/I18nProvider"
import styles from "./styles"

// Show info about network
const NoNetworkIndicator = () => {
  const theme = useTheme()
  const { i18n } = useI18nContext()

  return (
    <SafeAreaView style={styles.container}>
      <Icon name="wifi-off" size={44} color={theme.colors.secondary} />
      <Text style={styles.networkErrorLabel}>{i18n.t("networkerror")}</Text>
    </SafeAreaView>
  )
}

export default NoNetworkIndicator
