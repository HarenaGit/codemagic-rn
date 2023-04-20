import React, { useState, useEffect } from "react"
import DateTimePickerComponent, { Event } from "@react-native-community/datetimepicker"
import {
  View,
  TouchableOpacity,
  Text,
  TextInputFocusEventData,
  NativeSyntheticEvent,
} from "react-native"
import { HelperText, useTheme } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialIcons"
import moment from "moment"
import useStyles from "./styles"

export const DATE_FORMAT = "DD/MM/YYYY"
export const DATE_FORMAT2 = "DD-MM-YYYY"
export const DATETIME_FORMAT = "DD/MM/YYYY h:mm"

export const formatDateValue = (value: string, mode: "date" | "datetime" | "time"): string =>
  moment(value).format(mode && mode === "datetime" ? DATETIME_FORMAT : DATE_FORMAT)

interface IProps {
  labelMode?: "bold" | "light"
  layout?: "inline" | "stacked"
  dense?: boolean
  name: string
  label: string
  handleChange?: ((dateVal: string, fieldName?: string) => void) | ((dateVal: string) => void)
  placeholder?: string
  mode?: "date" | "time"
  disabled?: boolean
  value?: string
  hasError?: boolean
  errorMessage?: string | null
  labelFlex?: number
  inputFlex?: number
  required?:boolean | false
}

export const changeFormatDate = (date: string): string => moment(date).format(DATE_FORMAT2)

export const differenceBetwenTwoDateValue = (dateValue: string): number => {
  let datenumber = 0
  let dateString = changeFormatDate(dateValue)
  var dateofhelp = moment(dateString, "DD-MM-YYYY")
  var today = moment()
  datenumber = today.diff(dateofhelp, "days")
  return datenumber
}

export const DateTimePicker = ({
  name,
  label,
  placeholder,
  mode = "date",
  disabled = false,
  value = undefined,
  handleChange = (dateVal: string, fieldName?: string) => {},
  hasError = false,
  errorMessage = "",
  layout = "inline",
  labelMode = "bold",
  dense = true,
  labelFlex,
  inputFlex,
  required
}: IProps) => {
  const theme = useTheme()
  const styles = useStyles()

  // Today's date is the max allowed date
  const maxDate = new Date()

  const [inputValue, setInputValue] = useState(value ? moment(value) : moment())

  const [isPickerVisible, setPickerVisible] = useState<boolean>(false)

  // Show the date picker
  const showPicker = () => {
    if (!disabled) {
      setPickerVisible(true)
    }
  }

  // Hide the date pickerNumber(citizenItm?.gender ?? undefined)
  const hidePicker = () => {
    setPickerVisible(false)
  }

  // Apply change to parent state
  const onChangeDateTime = (event: Event, newValue?: Date) => {
    hidePicker()
    if (event.type === "set" && newValue) {
      handleChange(newValue.toISOString(), name)
    }
  }

  // Update the local input value on Parent state change
  useEffect(() => {
    setInputValue(value ? moment(value) : moment())
  }, [value])

  return (
    <View
      style={[
        layout === "inline" && styles.inlineFormInputField,
        layout === "stacked" && styles.stackedFormInputField,
      ]}
    >
      {Boolean(label) && (
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
          styles.pickerWrapper,
          Boolean(label) && layout === "inline" && styles.pickerWrapperMargin,
          inputFlex ? { flex: inputFlex } : {},
        ]}
      >
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => showPicker()}
          activeOpacity={0.7}
        >
          <Icon name={"calendar-today"} size={18} color={theme.colors.onCard} />
          {!Boolean(value) && (
            <Text style={styles.pickerPlaceholder}>{placeholder ? placeholder : label}</Text>
          )}
          {Boolean(value) && (
            <Text style={styles.pickerValue}>{value ? formatDateValue(value, mode) : ""}</Text>
          )}
          {Boolean(value) && (
            <TouchableOpacity onPress={() => handleChange("", name)}>
              <Icon name={"close"} size={24} color={theme.colors.onCard} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
        {hasError && (
          <HelperText type="error" visible={hasError} padding="none">
            {errorMessage}
          </HelperText>
        )}
      </View>
      {isPickerVisible && (
        <DateTimePickerComponent
          testID={`datetime-${name}`}
          display="spinner"
          value={new Date(inputValue.toISOString())}
          onChange={onChangeDateTime}
          mode={mode}
          maximumDate={maxDate}
        />
      )}
    </View>
  )
}

export default DateTimePicker
