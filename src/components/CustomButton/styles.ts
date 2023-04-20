import { StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

const useStyles = () => {
  const theme = useTheme()
  return StyleSheet.create({
    button: {
      display: "flex",
      flexDirection: "row",
      flex: 1,
      borderRadius: 5,
      alignItems: "center",
      justifyContent: "center",
      fontSize: 20,
      height: 55,
      textAlign: "center",
      fontWeight: "bold",
    },
    text: {
      fontSize: 16,
      fontWeight: "bold",
      fontFamily: theme.fonts.medium.fontFamily,
      lineHeight: 24,
      letterSpacing: 3.15,
      textTransform: "uppercase",
      paddingLeft: 8,
      paddingRight: 8,
    },
    primaryButton: {
      backgroundColor: theme.colors.secondary,
    },
    secondaryButton: {
      borderColor: theme.colors.secondary,
      borderWidth: 1,
    },
    primaryText: {
      color: theme.navigation.colors.text,
    },
    secondaryText: {
      color: theme.colors.secondary,
    },
    disabledButton: {
      opacity: 0.7,
    },
  })
}

export default useStyles
