import { StyleSheet } from "react-native"
import { useTheme, Colors } from "react-native-paper"
import color from "color"

const useStyles = () => {
  const theme = useTheme()

  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primary,
    },
    notificationContainer: {
      flex: 1,
      width: "100%",
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
    },
    notificationItm: {
      display: "flex",
      flexDirection: "column",
      paddingLeft: 13,
      paddingRight: 13,
    },
    notifContent: {
      display: "flex",
      flexDirection: "row",
    },
    badge: {
      backgroundColor: theme.colors.secondary,
      color: theme.colors.onPrimary,
    },
    textWrapper: {
      flex: 1,
    },
    iconWrapper: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    citizenName: {
      fontFamily: theme.fonts.medium.fontFamily,
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0.15,
      paddingLeft: 11,
      paddingRight: 8,
    },
    citizenAddress: {
      fontFamily: theme.fonts.regular.fontFamily,
      fontSize: 14,
      lineHeight: 24,
      letterSpacing: 0.15,
      paddingLeft: 11,
      paddingRight: 8,
    },
    dividerContainer: {
      paddingTop: 8,
      paddingBottom: 8,
    },
    divider: {
      width: "100%",
      backgroundColor: color(Colors.black).alpha(0.12).rgb().string(),
    },
  })
}

export default useStyles
