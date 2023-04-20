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
    resultContainer: {
      flex: 1,
      width: "100%",
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
    },
    resultTitle: {
      fontFamily: theme.fonts.medium.fontFamily,
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: 0.15,
      paddingTop: 20,
      paddingRight: 20,
      paddingLeft: 20,
      paddingBottom: 8,
    },
    criteriaItm: {
      opacity: 0.7,
      marginRight: 4,
    },
    rowItem: {
      display: "flex",
      flexDirection: "row",
    },
    iconWrapper: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
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
    citizenNames: {
      fontFamily: theme.fonts.medium.fontFamily,
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0.15,
      paddingLeft: 8,
      paddingRight: 8,
    },
    citizenAddress: {
      fontFamily: theme.fonts.regular.fontFamily,
      fontSize: 14,
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
  })
}

export default useStyles
