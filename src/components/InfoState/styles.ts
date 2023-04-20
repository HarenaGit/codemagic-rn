import { StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"
import color from "color"

const useStyles = (typeDisaster: "help" |"disaster"|"nodisater") => {
  const theme = useTheme()
 
  return StyleSheet.create({
    root: {
      display: "flex",
      flexDirection: "column",
      marginRight: 24,
      marginLeft: 24,
      marginTop: 16,
      padding: 24,
      borderRadius: 8,
      backgroundColor: 
      typeDisaster === "disaster"
          ?theme.colors.success
          : ( typeDisaster === "nodisater"? theme.colors.error: theme.colors.primary),
    },

    cardTitle: {
      fontFamily: theme.fonts.medium.fontFamily,
      fontWeight: "bold",
      fontSize: 14,
      lineHeight: 16,
      color: theme.colors.onPrimary,
      paddingLeft: 8,
    },
  })
}

export default useStyles
