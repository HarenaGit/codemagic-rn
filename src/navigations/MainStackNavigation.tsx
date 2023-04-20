import React from "react"
import {
  createStackNavigator,
  HeaderStyleInterpolators,
  CardStyleInterpolators,
  TransitionPresets,
} from "@react-navigation/stack"
import { useTheme } from "react-native-paper"

import { useI18nContext } from "../modules/I18nProvider"
import Login from "../screens/Login"
import Home from "../screens/Home"
import HouseholdCitizens from "../screens/HouseholdCitizens"
import QrScanner from "../screens/QrScanner"
import SearchResult from "../screens/SearchResult"
import CitizenEditor from "../screens/CitizenEditor"
import Migrations from "../screens/Migrations"
import About from "../screens/About"
import MigrationDetail from "../screens/MigrationDetail"
import SelectFokotany from "../screens/SelectFokotany"
import SearchForm from "../screens/SearchForm"

import ROUTES from "."
import CitizenView from "../screens/CitizenView"
import AddressList from "../screens/household/AddressList"
import { useLocalizationContext } from "../modules/LocalizationProvider"
import HouseHoldHelps from "../screens/household/HouseHoldHelps"
import AllocateHelp from "../screens/household/AllocateHelp"
import EnrollDisaster from "../screens/household/EnrollDisaster"

const MainStack = createStackNavigator()

const MainStackNavigation = () => {
  const { localization } = useLocalizationContext()
  const { i18n } = useI18nContext()
  const theme = useTheme()

  return (
    <MainStack.Navigator
      headerMode="screen"
      initialRouteName={ROUTES.Login}
      screenOptions={{
        headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        animationEnabled: true,
        headerStyle: {
          backgroundColor: theme.navigation.colors.primary,
        },
      }}
    >
      <MainStack.Screen
        name={ROUTES.Login}
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <MainStack.Screen
        name={ROUTES.SelectFokotany}
        component={SelectFokotany}
        options={{
          headerShown: true,
        }}
      />
      <MainStack.Screen
        name={ROUTES.Home}
        component={Home}
        options={{
          headerShown: true,
        }}
      />
      <MainStack.Screen
        name={ROUTES.SearchForm}
        component={SearchForm}
        options={{
          title: i18n.t("search.screentitle"),
          headerShown: true,
        }}
      />
      <MainStack.Screen
        name={ROUTES.SearchResult}
        component={SearchResult}
        options={{
          ...TransitionPresets.ModalSlideFromBottomIOS,
          headerShown: true,
        }}
      />
      <MainStack.Screen
        name={ROUTES.QrScanner}
        component={QrScanner}
        options={{
          title: i18n.t("qrscanner.screentitle"),
          headerShown: true,
        }}
      />
      <MainStack.Screen
        name={ROUTES.HouseholdCitizens}
        component={HouseholdCitizens}
        options={{
          title: i18n.t("household.screentitle"),
          headerShown: true,
        }}
      />
      <MainStack.Screen
        name={ROUTES.MigrationDetail}
        component={MigrationDetail}
        options={{
          title: i18n.t("household.screentitle"),
          headerShown: true,
        }}
      />
      <MainStack.Screen
        name={ROUTES.Migrations}
        component={Migrations}
        options={{
          ...TransitionPresets.FadeFromBottomAndroid,
          headerShown: true,
          title: i18n.t("migrations.screentitle"),
          headerStyle: {
            elevation: 0,
            backgroundColor: theme.navigation.colors.primary,
          },
        }}
      />
      <MainStack.Screen
        name={ROUTES.CitizenEditor}
        component={CitizenEditor}
        options={{
          ...TransitionPresets.ModalSlideFromBottomIOS,
          headerShown: true,
        }}
      />
      <MainStack.Screen
        name={ROUTES.CitizenView}
        component={CitizenView}
        options={{
          title: i18n.t("viewcitizen.screentitle"),
          headerShown: true,
        }}
      />
      <MainStack.Screen
        name={ROUTES.About}
        component={About}
        options={{
          title: i18n.t("about.screentitle"),
          headerShown: true,
        }}
      />
      <MainStack.Screen
        name={ROUTES.AddressList}
        component={AddressList}
        options={{
          title: `${i18n.t("household.adresse")} (${localization.fokontanyName})`,
          headerShown: true,
          headerStyle: {
            elevation: 0,
            backgroundColor: theme.navigation.colors.primary,
          },
        }}
      />
      <MainStack.Screen
        name={ROUTES.HouseHoldHelps}
        component={HouseHoldHelps}
        options={{
          title: i18n.t("householdhelp.screentitle"),
          headerShown: true,
          headerStyle: {
            elevation: 0,
            backgroundColor: theme.navigation.colors.primary,
          },
        }}
      />
      <MainStack.Screen
        name={ROUTES.AllocateHelp}
        component={AllocateHelp}
        options={{
          ...TransitionPresets.ModalSlideFromBottomIOS,
          title: i18n.t("allocatehelp.screentitle"),
          headerShown: true,
          headerStyle: {
            elevation: 0,
            backgroundColor: theme.navigation.colors.primary,
          },
        }}
      />
      <MainStack.Screen
        name={ROUTES.EnrollDisaster}
        component={EnrollDisaster}
        options={{
          ...TransitionPresets.ModalSlideFromBottomIOS,
          title: i18n.t("enrolldisaster.screentitle"),
          headerShown: true,
          headerStyle: {
            elevation: 0,
            backgroundColor: theme.navigation.colors.primary,
          },
        }}
      />
    </MainStack.Navigator>
  )
}

export default MainStackNavigation
