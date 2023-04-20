import { StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

const useStyles = () => {
  const theme = useTheme()

  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.background,
      padding: 32,
    },
    versionText: {
      fontFamily: theme.fonts.medium.fontFamily,
      color: theme.colors.onCard,
      fontWeight: "500",
      fontSize: 12,
      lineHeight: 24,
    },
  })
}

export default useStyles
