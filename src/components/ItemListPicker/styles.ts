import { StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

const useStyles = () => {
  const theme = useTheme()

  return StyleSheet.create({
    inlineFormInputField: {
      flex: 1,
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      paddingRight: 32,
      paddingLeft: 32,
      paddingBottom: 8,
    },
    stackedFormInputField: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      paddingRight: 32,
      paddingLeft: 32,
      paddingBottom: 8,
    },
    inputLabel: {
      ...theme.fonts.medium,
      fontWeight: "bold",
      fontSize: 14,
      lineHeight: 24,
      letterSpacing: 0.15,
      flex: 1,
      color: theme.colors.inputLabel,
    },
    inputLabelEmpty: {
      color: theme.colors.inputLabelEmpty,
    },
    inputLabelLight: {
      fontWeight: "500",
    },
    inputLabelMargin: {
      marginBottom: 4,
    },
    inputLabelInline: {
      paddingTop: 6,
    },
    pickerWrapper: {
      flex: 2,
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
    pickerWrapperMargin: {
      marginLeft: 16,
    },
    pickerFieldWrapper: {
      borderWidth: 1,
      borderRadius: 4,
      borderColor: theme.colors.input,
      backgroundColor: theme.colors.input,
    },
    pickerComponent: {
      flex: 1,
      height: 40,
      maxHeight: 40,
    },
  })
}

export default useStyles
