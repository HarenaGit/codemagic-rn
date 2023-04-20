import { StyleSheet } from "react-native"
import { useTheme, Colors } from "react-native-paper"
import color from "color"

const useStyles = () => {
  const theme = useTheme()

  return StyleSheet.create({
    root: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.background,
      padding: 24,
    },
    hintLabel: {
      fontWeight: "bold",
      fontSize: 16,
      lineHeight: 18,
      textAlign: "center",
      letterSpacing: 0.15,
      maxWidth: 256,
      marginBottom: 32,
    },
    searchInputWrapper: {
      backgroundColor: theme.colors.searchfield,
      width: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 4,
      paddingLeft: 16,
      paddingRight: 16,
    },
    searchInput: {
      flex: 1,
      marginLeft: 8,
    },
    searchButtonLabel: {
      fontWeight: "500",
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0.15,
      color: theme.colors.onCard,
    },
    qrMenuButton: {
      borderRadius: 58,
      backgroundColor: theme.colors.primary,
      padding: 24,
    },
    divider: {
      width: 166,
      marginTop: 32,
      marginBottom: 32,
      backgroundColor: color(Colors.black).alpha(0.12).rgb().string(),
    },
  })
}

export default useStyles
