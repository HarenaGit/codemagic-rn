import React from "react"
import { ActivityIndicator, SafeAreaView } from "react-native"
import { useTheme } from "react-native-paper"

import styles from "./styles"

// Show an activity indicator
const LoadingIndicator = () => {
  const theme = useTheme()

  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator animating size="large" color={theme.colors.primary} />
    </SafeAreaView>
  )
}

export default LoadingIndicator
