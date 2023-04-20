import { StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

const useStyles = () => {
  const theme = useTheme()

  return StyleSheet.create({
    fieldWrapper: {
      flex: 1,
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      paddingRight: 8,
      paddingLeft: 8,
      marginBottom: 24,
      marginTop: 24,
      marginRight: 8,
      borderRadius: 24,
      backgroundColor: theme.colors.input,
    },
    textInputWrapper: {
      flex: 1,
      display: "flex",
      flexDirection: "row",
    },
    textInput: {
      ...theme.fonts.medium,
      color: theme.colors.onCard,
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0.15,
      height: 40,
      maxHeight: 40,
      paddingTop: 0,
      paddingBottom: 0,
      paddingRight: 8,
      paddingLeft: 8,
      flex: 1,
    },

    iconWrapper: {
      height: 40,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
  })
}

export default useStyles
