import { StyleSheet } from "react-native"
import { useTheme, Colors } from "react-native-paper"
import color from "color"

const useStyles = () => {
  const theme = useTheme()

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      backgroundColor: "#E5E5E5",
    },
    contentWrapper: {
      flex: 1,
      flexDirection: "column",
      height: "100%",
      width: "100%",
    },
    appInfo: {
      flex: 2,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    appIcon: {
      height: 67,
      width: 67,
    },
    versionLabel: {
      ...theme.fonts.medium,
      fontSize: 14,
      lineHeight: 24,
      letterSpacing: 0.15,
      paddingTop: 20,
      paddingRight: 20,
      paddingLeft: 20,
      paddingBottom: 8,
      textAlign: "center",
    },
    appContextDesc: {
      ...theme.fonts.regular,
      fontSize: 11,
      lineHeight: 15,
      letterSpacing: 0.15,
      textAlign: "center",
      paddingTop: 48,
      maxWidth: 266,
    },
    companyInfo: {
      flex: 1,
      display: "flex",
      justifyContent: "flex-end",
    },
    companyHint: {
      ...theme.fonts.regular,
      fontSize: 11,
      lineHeight: 15,
      letterSpacing: 0.15,
      textAlign: "center",
    },
    companyName: {
      ...theme.fonts.medium,
      fontSize: 11,
      lineHeight: 15,
      letterSpacing: 0.15,
      paddingBottom: 8,
      textAlign: "center",
    }
  })
}

export default useStyles
