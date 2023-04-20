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

import useStyles from "./styles"

interface IProps {
  labelMode?: "bold" | "light"
  layout?: "inline" | "stacked"
  dense?: boolean
  name: string
  label: string
  placeholder?: string
  defaultValue?: string
  value?: string | number
  hasError?: boolean
  handleChange?: ((text: string, name?: string) => void) | ((text: string) => void)
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void
  disabled?: boolean
  inputMode?: KeyboardTypeOptions
  errorMessage?: string | null
  onFocus?: () => void
  labelFlex?: number
  inputFlex?: number,
  maxLength?: number, 
  required?: boolean | false
}

const TextInput = ({
  name,
  label,
  placeholder,
  defaultValue,
  value,
  hasError = true,
  handleChange,
  disabled = false,
  errorMessage,
  inputMode = "default",
  layout = "inline",
  labelMode = "bold",
  dense = true,
  onFocus = () => {},
  onBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {},
  labelFlex,
  inputFlex,
  maxLength,
  required
}: IProps) => {
  const styles = useStyles()
  const theme = useTheme()
  const fieldRef = useRef<typeof RNTextInput>(null)
  

  const onChangeText = (text: string) => {
    if (handleChange) {
      handleChange(text, name)
    }
  }
  const handleFocus = () => {
    onFocus()
  }

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    onBlur(e)
  }

  return (
    <View
      style={[
        layout === "inline" && styles.inlineFormInputField,
        layout === "stacked" && styles.stackedFormInputField,
      ]}
    >
      {label && (
        <Text
          style={[
            styles.inputLabel,
            !dense && layout === "stacked" && styles.inputLabelMargin,
            labelMode === "light" && styles.inputLabelLight,
            layout === "inline" && styles.inputLabelInline,
            (Boolean(value) || disabled) && styles.inputLabelEmpty,
            labelFlex ? { flex: labelFlex } : {},
          ]}
        >
          {label} {required ?" * ": ""}
          {layout === "inline" && ":"}
        </Text>
      )}
      <View
        style={[
          styles.textInputWrapper,
          Boolean(label) && layout === "inline" && styles.textInputWrapperMargin,
          inputFlex ? { flex: inputFlex } : {},
        ]}
      >
        <RNTextInput
          maxLength= {maxLength }
          placeholder={placeholder ? placeholder : label}
          editable={!disabled}
          defaultValue={defaultValue}
          value={value ? String(value) : ""}
          style={[styles.textInput, disabled && styles.textInputDisable]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={onChangeText}
          keyboardType={inputMode}
       
        />
        {hasError && errorMessage && (
          <HelperText type="error" visible={hasError} padding="none">
            {errorMessage}
          </HelperText>
        )}
      </View>
    </View>
  )
}

export default TextInput
