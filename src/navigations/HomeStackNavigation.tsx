import React from "react"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MainStack = createStackNavigator()
const Tab = createBottomTabNavigator();

const HomeStackNavigation = () => {
  const { localization } = useLocalizationContext()
  const { i18n } = useI18nContext()
  const theme = useTheme()

  const tabBarListeners = ({ navigation, route }) => ({
    focus: () => navigation.setParams({ screen: undefined }),
    tabPress: () => {
      console.log("response tabpress" + route.name)
      navigation?.canGoBack() && navigation.popToTop();
      navigation.navigate(route.name)
    },
  });

  const tabNavigation = () => {
  const insets = useSafeAreaInsets();


    return (
      <Tab.Navigator
        initialRouteName={Routes.TopParis}
        // tabBar={(props) => <TabBar {...props} />}
        screenOptions={{
          unmountOnBlur: true,
        }}
        lazy={true}
        tabBarOptions={{
          keyboardHidesTabBar: true,
          inactiveBackgroundColor: theme.color.backgroundSecond,
          activeBackgroundColor: theme.color.colorPrimary,
          activeTintColor: 'white',
          inactiveTintColor: theme.color.colorGrey2,
          style: {
            minHeight: normalize(42) + insets.bottom,
            height: normalize(42) + insets.bottom,
            paddingHorizontal: normalize(8),
            paddingVertical: 0,
            paddingTop: 0,
            width: '100%',
            borderTopColor: theme.color.borderColor3,
            backgroundColor: theme.color.backgroundSecond,
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'space-between',
          },
          labelStyle: {
            fontSize: normalize(8),
            ...fontBase[600](),
            marginTop: 0,
            marginLeft: 0
          },
          labelPosition: 'below-icon',
          tabStyle: {
            borderTopColor: theme.color.borderColor3,
            borderRadius: normalize(8),
            marginVertical: 0,
            marginHorizontal: normalize(8),
            flexDirection: 'column',
            paddingTop: normalize(2),
            paddingBottom: normalize(5),
            alignSelf: 'center',
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center',
            flex: 1,
            minWidth: normalize(47),
            width: normalize(48),
            height: normalize(41),
          },
        }}>
        <Tab.Screen
          name={ROUTES.Home}
          component={MainStackNavigation}
          listeners={tabBarListeners}
          options={{
            unmountOnBlur: true,
            tabBarLabel: ,
            tabBarIcon: ({ color, size, focused }) => (
              <Icon
                image={"search"}
                size={24}
              />
            ),
          }}
        />
     
      
      </Tab.Navigator>
    );
  };

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

export default HomeStackNavigation
