import { StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

const useStyles = () => {
  const theme = useTheme()

  return StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 0,
    },
    fabAction: {
      backgroundColor: theme.colors.secondary,
      padding: 12,
      position: "absolute",
      bottom: 16,
      right: 16,
      borderRadius: 32,
    },
  })
}

export default useStyles
