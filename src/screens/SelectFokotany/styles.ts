import { StyleSheet, Dimensions } from "react-native"
import { useTheme, Colors } from "react-native-paper"
import color from "color"

const useStyles = () => {
  const theme = useTheme()

  return StyleSheet.create({
    container: {
      display: "flex",
      flexDirection: "column",
      flex: 1,
    },
    formContainer: {
      flex: 1,
      width: "100%",
      paddingTop: 24,
      backgroundColor: theme.colors.background,
    },
    formTitle: {
      fontFamily: theme.fonts.medium.fontFamily,
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: 0.15,
      paddingTop: 20,
      paddingRight: 20,
      paddingLeft: 20,
      paddingBottom: 8,
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

    buttonWrapper: {
      flex: 1,
      display: "flex",
      flexDirection: "row",
      paddingTop: 24,
      paddingRight: 32,
      paddingLeft: 32,
    },
  })
}

export default useStyles
