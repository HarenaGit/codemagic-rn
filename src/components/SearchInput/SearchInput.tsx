import React, { useRef } from "react"
import {
  View,
  TextInput as RNTextInput,
  Text,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  KeyboardTypeOptions,
} from "react-native"
import { HelperText, useTheme } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialIcons"

import useStyles from "./styles"

interface IProps {
  placeholder: string
  defaultValue?: string
  value?: string | number
  handleChange?: (text: string) => void
  onSubmit?: (text: string) => void
  disabled?: boolean
}

const TextInput = ({
  placeholder,
  defaultValue,
  value,
  handleChange,
  disabled = false,
  onSubmit,
}: IProps) => {
  const styles = useStyles()
  const theme = useTheme()

  const onChangeText = (text: string) => {
    if (handleChange) {
      handleChange(text)
    }
  }

  const onSubmitEditing = (text: string) => {
    if (onSubmit) {
      onSubmit(text)
    }
  }

  return (
    <View style={styles.fieldWrapper}>
      <View style={styles.textInputWrapper}>
        <RNTextInput
          placeholder={placeholder}
          editable={!disabled}
          defaultValue={defaultValue}
          value={value ? String(value) : ""}
          style={styles.textInput}
          onChangeText={onChangeText}
          onSubmitEditing={(e) => onSubmitEditing(e.nativeEvent.text)}
          returnKeyType="search"
        />
      </View>
      <View style={styles.iconWrapper}>
        <Icon name="search" color={theme.colors.disabled} size={24} />
      </View>
    </View>
  )
}

export default TextInput
