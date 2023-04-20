import { StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

const useStyles = () => {
  const theme = useTheme()

  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 32,
      display: "flex",
      flexDirection: "column",
    },
    logoContainer: {
      flex: 2,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    fieldContainer: {
      paddingTop: 32,
      flex: 5,
    },
    inputRow: {
      display: "flex",
      flexDirection: "column",
      marginBottom: 16,
    },
    fieldWrapper: {
      backgroundColor: theme.colors.searchfield,
      width: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 4,
      paddingLeft: 16,
      paddingRight: 16,
    },
    textInput: {
      flex: 1,
      marginLeft: 8,
    },
    loginButtonWrapper: {
      flex: 1,
      display: "flex",
      flexDirection: "row",
    },
    qrMenuButton: {
      borderRadius: 58,
      backgroundColor: theme.colors.primary,
      padding: 24,
    },
    pickerComponent: {
      flex: 1,
      minHeight: 40,
      marginLeft: 8,
    },
  })
}

export default useStyles
