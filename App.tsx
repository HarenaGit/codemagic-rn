import React from "react"
import { LogBox, StatusBar } from "react-native"
import { enableScreens } from "react-native-screens"
import { NavigationContainer } from "@react-navigation/native"
import { Provider as PaperProvider } from "react-native-paper"
import { SafeAreaProvider } from "react-native-safe-area-context"
import ThemeProvider from "./src/modules/ThemeProvider"
import I18nProvider from "./src/modules/I18nProvider"
import AuthProvider from "./src/modules/AuthProvider"
import { ACCESS_TOKEN_KEY, NAVIGATION_PERSISTENCE_KEY } from "./src/consts"
import AsyncStorage from "./src/modules/AsyncStorage"
import Splash from "./src/screens/Splash"
import MainStackNavigation from "./src/navigations/MainStackNavigation"
import NetworkInfoProvider from "./src/modules/NetworkInfoProvider"
import LocalizationProvider from "./src/modules/LocalizationProvider"
import SearchCriteriaProvider from "./src/modules/SearchCriteriaProvider"
import ApiEnvProvider from "./src/modules/ApiEnvProvider"

enableScreens()
LogBox.ignoreAllLogs(true)

const App = () => {
  const [navState, setNavState] = React.useState()

  // Restore navigation state
  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const savedState = await AsyncStorage.getItem(NAVIGATION_PERSISTENCE_KEY)

        const _state = savedState ? JSON.parse(savedState) : undefined

        if (_state !== undefined) {
          setNavState(_state)
        }
      } catch (error) {
        console.log(error)
      }
    }

    restoreState()
  }, [])

  return (
    <ApiEnvProvider>
      <ThemeProvider>
        {(theme) => (
          <PaperProvider theme={theme}>
            <I18nProvider>
              <NetworkInfoProvider>
                <AuthProvider>
                  <LocalizationProvider>
                    <SearchCriteriaProvider>
                      <SafeAreaProvider>
                        <StatusBar
                          backgroundColor={theme.navigation.colors.dark}
                          barStyle="light-content"
                        />
                        <Splash>
                          <NavigationContainer
                            initialState={navState}
                            onStateChange={(state) =>
                              AsyncStorage.setItem(
                                NAVIGATION_PERSISTENCE_KEY,
                                JSON.stringify(state),
                              )
                            }
                            theme={theme.navigation}
                          >
                            <MainStackNavigation />
                          </NavigationContainer>
                        </Splash>
                      </SafeAreaProvider>
                    </SearchCriteriaProvider>
                  </LocalizationProvider>
                </AuthProvider>
              </NetworkInfoProvider>
            </I18nProvider>
          </PaperProvider>
        )}
      </ThemeProvider>
    </ApiEnvProvider>
  )
}

export default App
