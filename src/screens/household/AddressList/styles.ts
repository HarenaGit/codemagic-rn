import { StyleSheet } from "react-native"
import { useTheme, Colors } from "react-native-paper"
import color from "color"

const useStyles = () => {
  const theme = useTheme()

  return StyleSheet.create({
    container: {
      display: "flex",
      flexDirection: "column",
      flex: 1,
      backgroundColor: theme.colors.primary,
    },
    resultContainer: {
      flex: 1,
      width: "100%",
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingTop: 16,
    },
    rowItem: {
      display: "flex",
      flexDirection: "row",
      paddingRight: 16,
      paddingLeft: 16,
    },
    rightIconWrapper: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      paddingRight: 8,
    },
    textWrapper: {
      flex: 1,
    },
    addressName: {
      fontFamily: theme.fonts.medium.fontFamily,
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0.15,
      paddingLeft: 8,
      paddingRight: 8,
    },
    dividerContainer: {
      paddingLeft: 13,
      paddingRight: 13,
      paddingTop: 8,
      paddingBottom: 8,
    },
    divider: {
      width: "100%",
      backgroundColor: color(Colors.black).alpha(0.12).rgb().string(),
    },
    addFabButton: {
      position: "absolute",
      margin: 16,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.secondary,
    },
  })
}

export default useStyles
