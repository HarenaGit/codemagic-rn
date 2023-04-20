import { StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

const useStyles = () => {
  const theme = useTheme()

  return StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 0,
      display: "flex",
      flexDirection: "column",
    },
    victimFabButton: {
      position: "absolute",
      margin: 16,
      right: 0,
      bottom: 128,
      backgroundColor: theme.colors.error,
    },
    helpFabButton: {
      position: "absolute",
      margin: 16,
      right: 0,
      bottom: 192,
      backgroundColor: theme.colors.primary,
    },
    addMemberFabButton: {
      position: "absolute",
      margin: 16,
      right: 0,
      bottom: 64,
      backgroundColor: theme.colors.success,
    },
    backFabButton: {
      position: "absolute",
      margin: 16,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.secondary,
    },
  })
}

export default useStyles
