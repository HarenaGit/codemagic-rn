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
    titleChip: {
      opacity: 0.7,
      flex: 1,
      padding: 0,
      margin: 0,
      maxWidth: "100%",
      marginRight: 16,
    },
    rowItem: {
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 8,
      paddingRight: 32,
      paddingLeft: 32,
    },
    itemTitle: {
      flex: 2,
      fontFamily: theme.fonts.medium.fontFamily,
      fontWeight: "bold",
      fontSize: 13,
      lineHeight: 24,
      color: color(theme.colors.onCard).alpha(0.6).rgb().string(),
    },
    itemValue: {
      flex: 3,
      fontFamily: theme.fonts.medium.fontFamily,
      fontWeight: "500",
      fontSize: 16,
      lineHeight: 24,
      color: theme.colors.onCard,
      flexWrap: "wrap",
      marginLeft: 8,
      marginRight: 8,
      width: "100%",
    },
  })
}

export default useStyles
