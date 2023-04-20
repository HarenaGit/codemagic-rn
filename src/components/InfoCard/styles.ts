import { StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"
import color from "color"

const useStyles = (type: "location" | "member" | "chief") => {
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
        type === "chief"
          ? color(theme.colors.primary).alpha(0.2).rgb().string()
          : theme.colors.card,
    },
    titleRow: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 18,
    },
    rowItem: {
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    editIcon: {
      width: 20,
      height: 20,
    },
    cardTitle: {
      fontFamily: theme.fonts.medium.fontFamily,
      fontWeight: "bold",
      fontSize: 14,
      lineHeight: 16,
      color: theme.colors.onCard,
      paddingLeft: 8,
    },
    cardChiefTitle:{
      flexGrow: 1,
      fontFamily: theme.fonts.medium.fontFamily,
      fontWeight: "bold",
      fontSize: 14,
      lineHeight: 16,
      color: theme.colors.onCard,
      paddingLeft: 8,
      textAlign: "right",
    },
    profilePic: {
      height: 266,
      width: "100%",
      marginBottom: 24,
      borderRadius: 4,
    },
    itemTitle: {
      fontFamily: theme.fonts.medium.fontFamily,
      fontWeight: "bold",
      fontSize: 13,
      lineHeight: 24,
      color: color(theme.colors.onCard).alpha(0.6).rgb().string() ,
    },
    itemValue: {
      flex: 1,
      fontFamily: theme.fonts.medium.fontFamily,
      fontWeight: "500",
      fontSize: 16,
      lineHeight: 24,
      color: theme.colors.onCard,
      flexWrap: "wrap",
      marginLeft: 8,
      marginRight: 8,
      width: "100%"
    },
  })
}

export default useStyles
