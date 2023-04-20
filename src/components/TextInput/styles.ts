import { StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"
import color from "color"

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
    textInputWrapper: {
      flex: 2,
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
    textInputWrapperMargin: {
      marginLeft: 16,
    },

    textInput: {
      ...theme.fonts.medium,
      color: theme.colors.onCard,
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0.15,
      borderRadius: 4,
      height: 40,
      maxHeight: 40,
      borderWidth: 1,
      borderColor: theme.colors.input,
      backgroundColor: theme.colors.input,
      paddingTop: 0,
      paddingBottom: 0,
      paddingRight: 8,
      paddingLeft: 8,
      flex: 1,
    },

    textInputDisable: {
      color: color(theme.colors.onCard).alpha(0.5).rgb().string(),
    },
  })
}

export default useStyles
