import React from "react"
import { Picker } from "@react-native-picker/picker"
import { View, Text } from "react-native"
import { HelperText, useTheme } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialIcons"
import useStyles from "./styles"

interface IProps {
  labelMode?: "bold" | "light"
  layout?: "inline" | "stacked"
  name: string
  label: string
  selectedValue?: string | number
  handleChange?: (fieldVal: string | number, fieldName?: string) => void
  disabled?: boolean
  hasError?: boolean
  dense?: boolean
  errorMessage?: string | null
  items: {
    label: string
    value: number | string
  }[]
  mode?: "dialog" | "dropdown"
  labelFlex?: number
  inputFlex?: number
}

const ItemListPicker = ({
  name,
  label,
  selectedValue,
  items,
  disabled = false,
  handleChange = (fieldVal: string | number, fieldName?: string) => {},
  hasError = false,
  errorMessage = "",
  mode = "dialog",
  layout = "inline",
  labelMode = "bold",
  dense = true,
  labelFlex,
  inputFlex,
}: IProps) => {
  const theme = useTheme()
  const styles = useStyles()

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
            ((selectedValue !== undefined && selectedValue !== null) || disabled) &&
              styles.inputLabelEmpty,
            labelFlex ? { flex: labelFlex } : {},
          ]}
        >
          {label}
          {layout === "inline" && ":"}
        </Text>
      )}
      <View
        style={[
          styles.pickerWrapper,
          Boolean(label) && layout === "inline" && styles.pickerWrapperMargin,
          inputFlex ? { flex: inputFlex } : {},
        ]}
      >
        <View style={styles.pickerFieldWrapper}>
          <Picker
            mode={mode}
            selectedValue={selectedValue}
            style={styles.pickerComponent}
            prompt={label}
            enabled={!disabled}
            onValueChange={(itemValue, itemIndex) => {
              if (!disabled && items.length > 0) handleChange(itemValue, name)
            }}
          >
            {items.map((item) => (
              <Picker.Item key={item.value} value={item.value} label={item.label} />
            ))}
          </Picker>
        </View>
        {hasError && errorMessage && (
          <HelperText type="error" visible={hasError} padding="none">
            {errorMessage}
          </HelperText>
        )}
      </View>
    </View>
  )
}

export default ItemListPicker
