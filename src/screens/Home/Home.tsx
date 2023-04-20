import React from "react"
import { View, Text, TouchableOpacity, TextInput, BackHandler, Alert } from "react-native"
import { useTheme, Divider } from "react-native-paper"
import { StackNavigationProp } from "@react-navigation/stack"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { CommonActions, useFocusEffect } from "@react-navigation/native"
import { RouteProp } from "@react-navigation/native"

import { useI18nContext } from "../../modules/I18nProvider"
import { usePushNotification } from "../../modules/PushNotification"
import CommonAppHeader from "../../components/CommonAppHeader"
import { NavigationParamList } from "../../navigations"
import useStyles from "./styles"

import { useAuthContext } from "../../modules/AuthProvider"
import { useEventLoggingApi } from "../../modules/api/logging"

interface IProps {
  route: RouteProp<NavigationParamList, "Home">
  navigation: StackNavigationProp<NavigationParamList>
}

// Main home screen
const Home = ({ navigation, route }: IProps) => {
  // Init notification
  usePushNotification()

  const { i18n } = useI18nContext()
  const theme = useTheme()
  const styles = useStyles()
  const { currentUser } = useAuthContext()
  const logEvent = useEventLoggingApi()

  // Handle logout
  const handleLogout = () => {
    if (route.name === "Home") {
      Alert.alert(
        i18n.t("home.logoutalerttitle"),
        i18n.t("home.logoutalertmessage"),
        [
          {
            text: i18n.t("home.logoutyes"),
            onPress: () => {
              navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [{ name: "Login" }],
                }),
              )
            },
          },
          { text: i18n.t("home.logoutno"), onPress: () => console.log("NO Pressed") },
        ],
        { cancelable: false },
      )
    }
    return true
  }

  const handleScanCode = () => {
    //Logging action
    logEvent(currentUser, "OPEN-SCAN-QRCODE-SCREEN", "NULL", "NULL")
    navigation.navigate("QrScanner", {})
  }

  const handleSearch = (searhQuery: string) => {
    //Logging action
    logEvent(currentUser, "OPEN-SEARCH-SCREEN", "NULL", "NULL")
    navigation.navigate("SearchForm")
  }

  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        header: () => {
          return <CommonAppHeader title={i18n.t("home.screentitle")} navigation={navigation} />
        },
      })

      // Remove the Login and SelectFokotany routes from the stack
      navigation.dispatch((state) => {
        const routes = state.routes.filter((r) => !["Login", "SelectFokotany"].includes(r.name))
        return CommonActions.reset({
          ...state,
          routes,
          index: routes.length - 1,
        })
      })

      BackHandler.addEventListener("hardwareBackPress", handleLogout)

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleLogout)
      }
    }, []),
  )

  return (
    <View style={styles.root}>
      <Text style={styles.hintLabel}>{i18n.t("home.searchhint")}</Text>
      <TouchableOpacity style={styles.qrMenuButton} onPress={handleSearch}>
        <Icon name="home-search-outline" size={64} color={theme.colors.onPrimary} />
      </TouchableOpacity>
      <Divider style={styles.divider} />
      <Text style={styles.hintLabel}>{i18n.t("home.scanhint")}</Text>
      <TouchableOpacity style={styles.qrMenuButton} onPress={handleScanCode}>
        <Icon name="qrcode-scan" size={64} color={theme.colors.onPrimary} />
      </TouchableOpacity>
    </View>
  )
}

export default Home
