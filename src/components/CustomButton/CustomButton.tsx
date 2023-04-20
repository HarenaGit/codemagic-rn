import React from "react"
import { TouchableOpacity, Text, ActivityIndicator, StyleProp, ViewStyle, View } from "react-native"
import { useTheme } from "react-native-paper"

import useStyles from "./styles"

interface IProps {
  variant?: "primary" | "secondary"
  label: string
  onPress?: () => void
  isLoading?: boolean
  style?: StyleProp<ViewStyle>
  disabled?: boolean
}

const CustomButton = ({
  label = "Enter",
  variant = "primary",
  onPress = () => {},
  isLoading = false,
  disabled = false,
  style,
}: IProps) => {
  const styles = useStyles()
  const theme = useTheme()

  const renderConent = () => {
    return (
      <>
        <Text
          style={[styles.text, variant === "primary" ? styles.primaryText : styles.secondaryText]}
        >
          {label}
        </Text>
      </>
    )
  }

  return disabled || isLoading ? (
    <View
      style={[
        styles.button,
        variant === "primary" ? styles.primaryButton : styles.secondaryButton,
        disabled && styles.disabledButton,
        style,
      ]}
    >
      {isLoading && (
        <ActivityIndicator
          animating
          size="large"
          color={variant === "primary" ? theme.colors.onPrimary : theme.colors.secondary}
        />
      )}
      {renderConent()}
    </View>
  ) : (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        variant === "primary" ? styles.primaryButton : styles.secondaryButton,
        style,
      ]}
    >
      {renderConent()}
    </TouchableOpacity>
  )
}

export default CustomButton
