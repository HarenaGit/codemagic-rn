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
      backgroundColor: theme.colors.primary,
    },
    formContainer: {
      flex: 1,
      width: "100%",
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
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
    profilePicRow: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 32,
      marginBottom: 32,
    },
    profilePicBox: {
      height: 138,
      width: 138,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    profilePic: {
      position: "absolute",
      top: 0,
      height: 138,
      width: 138,
    },
    profilePicEdit: {
      backgroundColor: color(theme.colors.secondary).alpha(0.5).rgb().string(),
      padding: 17,
      borderRadius: 52,
    },
    editPicMenuItm: {
      flex: 1,
      padding: 0,
      margin: 0,
      width: "100%",
      maxWidth: "100%",
    },
    editPicMenu: {
      flex: 1,
      position: "absolute",
      left: 32,
      width: Dimensions.get("window").width - 64,
      padding: 0,
    },
  })
}

export default useStyles
