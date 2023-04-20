import React from "react"
import { View } from "react-native"
import { Appbar, useTheme, Menu, Divider, Badge } from "react-native-paper"
import { StackNavigationProp } from "@react-navigation/stack"
import { CommonActions } from "@react-navigation/native"
import Icon from "react-native-vector-icons/MaterialIcons"

import { NavigationParamList } from "../../navigations"
import { useThemeContext } from "../../modules/ThemeProvider"
import { useI18nContext } from "../../modules/I18nProvider"

import { useAuthContext } from "../../modules/AuthProvider"
import { useLocalizationContext } from "../../modules/LocalizationProvider"
import { useEventLoggingApi } from "../../modules/api/logging"

interface IProps {
  title: string
  onBackPress?: () => void
  navigation?: StackNavigationProp<NavigationParamList>
}

const CommonAppHeader = ({ onBackPress, title, navigation }: IProps) => {
  const theme = useTheme()
  const { i18n, locale, setLocale } = useI18nContext()
  const { setTheme } = useThemeContext()

  const { currentUser, setCurrentUser } = useAuthContext()
  const logEvent = useEventLoggingApi()
  const { localization } = useLocalizationContext()
  const [isMenuVisible, setMenuVisible] = React.useState<boolean>(false)

  const toggleMenu = () => {
    setMenuVisible((currentState) => !currentState)
  }

  const toggleTheme = () => {
    setTheme(!theme.dark)
    setMenuVisible(false)

    //Logging
    const old_data = (title = !theme.dark ? i18n.t("menu.themelight") : i18n.t("menu.themedark"))
    const new_data = (title = theme.dark ? i18n.t("menu.themelight") : i18n.t("menu.themedark"))
    logEvent(currentUser, "CHANGE-APP-THEME", old_data, new_data)
  }

  const toggleLocale = async () => {
    setLocale(locale === "mg" ? "fr" : "mg")
    setMenuVisible(false)

    //Logging
    logEvent(currentUser, "CHANGE-APP-LOCALE", locale, locale === "mg" ? "fr" : "mg")
  }

  const handleLogout = () => {
    setCurrentUser(null)
    navigation?.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: "Login" }],
      }),
    )

    //Logging
    logEvent(currentUser, "LOGGING-OUT", "NULL", "NULL")
  }

  const openAboutScreen = () => {
    navigation?.navigate("About", {})
    setMenuVisible(false)

    //Logging
    logEvent(currentUser, "OPEN-ABOUT-SCREEN", "NULL", "NULL")
  }

  const changeFokontany = () => {
    navigation?.navigate("SelectFokotany", { intent: "update" })
    setMenuVisible(false)

    //Logging
    logEvent(currentUser, "OPEN-CHANGE-FOKONTANY-SCREEN", "NULL", "NULL")
  }

  const openMigrationScreen = () => {
    navigation?.navigate("Migrations", {})
    setMenuVisible(false)
  }

  return (
    <Appbar.Header style={{ backgroundColor: theme.navigation.colors.primary }}>
      {onBackPress && (
        <Appbar.BackAction onPress={onBackPress} color={theme.navigation.colors.text} />
      )}
      <Appbar.Content
        title={`${title}${localization?.fokontanyName ? ` (${localization?.fokontanyName})` : ""}`}
        color={theme.navigation.colors.text}
      />

      {/* <View>
        <Appbar.Action
          animated={false}
          icon={(props) => <Icon name="notifications" size={24} color={props.color} />}
          color={theme.navigation.colors.text}
          onPress={openMigrationScreen}
        />
        <Badge
          style={{
            position: "absolute",
            top: 0,
            backgroundColor: theme.colors.secondary,
            color: theme.colors.onPrimary,
          }}
        >
          3
        </Badge>
      </View> */}
      <Menu
        visible={isMenuVisible}
        onDismiss={toggleMenu}
        anchor={
          <Appbar.Action
            icon="dots-vertical"
            color={theme.navigation.colors.text}
            onPress={toggleMenu}
          />
        }
      >
        <Menu.Item
          icon="map-marker-outline"
          onPress={changeFokontany}
          title={i18n.t("menu.changefokontany")}
        />
        <Divider />
        <Menu.Item
          icon="theme-light-dark"
          onPress={toggleTheme}
          title={theme.dark ? i18n.t("menu.themelight") : i18n.t("menu.themedark")}
        />
        <Divider />
        <Menu.Item
          icon="translate"
          onPress={toggleLocale}
          title={i18n.currentLocale() === "mg" ? i18n.t("menu.langfr") : i18n.t("menu.langmg")}
        />
        <Divider />
        <Menu.Item
          icon="information-outline"
          onPress={openAboutScreen}
          title={i18n.t("about.screentitle")}
        />
        {navigation && (
          <>
            <Divider />
            <Menu.Item icon="logout" onPress={handleLogout} title={i18n.t("login.logout")} />
          </>
        )}
      </Menu>
    </Appbar.Header>
  )
}

export default CommonAppHeader
