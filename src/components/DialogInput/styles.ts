import { StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"
import color from "color"

export const useStyles = () => {
  const theme = useTheme()

  return StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      height: "100%",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: color(theme.colors.onSurface).alpha(0.4).rgb().string(),
    },
    modalContainer: {
      marginLeft: 30,
      marginRight: 30,
      backgroundColor: theme.colors.surface,
      elevation: 24,
      minWidth: 280,
      borderRadius: 5,
    },
    modalBody: {
      padding: 24,
    },
    titleModal: {
      fontWeight: "bold",
      fontSize: 20,
      textAlign: "left",
      color: theme.colors.onSurface,
    },
    messageModal: {
      fontSize: 16,
      textAlign: "left",
      marginTop: 16,
      marginBottom: 16,
      color: color(theme.colors.onSurface).alpha(0.5).rgb().string(),
    },
    messageErrorModal: {
      color: theme.colors.error,
    },
    inputContainer: {
      textAlign: "left",
      fontSize: 16,
      color: theme.colors.onSurface,
      marginTop: 8,
      borderBottomWidth: 2,
      borderColor: theme.colors.primary,
    },
    btnContainer: {
      flex: 1,
      flexDirection: "row",
      alignSelf: "flex-end",
      maxHeight: 52,
      marginTop: 8,
      marginBottom: 8,
    },
    divider_btn: {
      width: 0,
    },
    touchBouttonModal: {
      paddingRight: 8,
      minWidth: 64,
      height: 36,
    },
    btnModalLeft: {
      textAlign: "right",
      color: theme.colors.secondary,
      padding: 16,
      fontWeight: "bold",
    },
    btnModalRight: {
      textAlign: "right",
      color: theme.colors.secondary,
      padding: 16,
      fontWeight: "bold",
    },
  })
}

export default useStyles
