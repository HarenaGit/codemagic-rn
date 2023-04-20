import React, { useEffect } from "react"
import { View, Text, TouchableOpacity, FlatList, BackHandler } from "react-native"
import { useTheme, Appbar, Divider, Chip, FAB } from "react-native-paper"
import { RouteProp, useFocusEffect } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

import { useHouseholdHelpProgramsApi } from "../../../modules/api/household-help"
import { useAuthContext } from "../../../modules/AuthProvider"
import { useBlockHardGobackPress } from "../../../modules/hooks"
import { useNetworkInfoContext } from "../../../modules/NetworkInfoProvider"
import { useI18nContext } from "../../../modules/I18nProvider"
import { NavigationParamList } from "../../../navigations"
import { useEventLoggingApi } from "../../../modules/api/logging"
import ErrorIndicator from "../../../components/ErrorIndicator"
import NoNetworkIndicator from "../../../components/NoNetworkIndicator"
import { differenceBetwenTwoDateValue, formatDateValue } from "../../../components/DateTimePicker"
import useStyles from "./styles"
import { HELP_TYPE_CASH } from "../../../consts"

interface IProps {
  route: RouteProp<NavigationParamList, "HouseHoldHelps">
  navigation: StackNavigationProp<NavigationParamList>
}

// List of household's helps
const HouseHoldHelps = ({ navigation, route }: IProps) => {
  const { i18n } = useI18nContext()
  const theme = useTheme()
  const styles = useStyles()

  const { isConnected } = useNetworkInfoContext()
  const [dateNumber, setDateNumber] = React.useState<number>(0)

  const {
    hasError,
    isLoading,
    householdHelpPrograms,
    loadHouseholdHelpPrograms,
  } = useHouseholdHelpProgramsApi()

  // Block hardware back press on loading
  useBlockHardGobackPress(isLoading)

  const { currentUser } = useAuthContext()
  const logEvent = useEventLoggingApi()

  // Load citizen or the household
  const handleCitizenItemPress = (citizen: ICitizen) => {
    // Show citizen's info
    // Logging
    logEvent(currentUser, "OPEN-CITIZEN-VIEW-SCREEN", JSON.stringify(citizen), "NULL")
    navigation.navigate("CitizenView", {
      citizenId: citizen.id,
      lastName: citizen.lastName,
      firstName: citizen.firstName,
    })
  }

  // Allocate new help
  const allocateNewHouseholdHelp = () => {
    //Logging action
    logEvent(
      currentUser,
      "OPEN-ALLOCATE-HELP-SCREEN",
      { bookNumber: route.params.bookNumber },
      "NULL",
    )
    navigation.navigate("AllocateHelp", {
      bookNumber: route.params.bookNumber,
    })
  }
  // Render divider
  const renderDivider = () => (
    <View style={styles.dividerContainer}>
      <Divider style={styles.divider} />
    </View>
  )

  // Load allocated helps on screen showing
  useFocusEffect(
    React.useCallback(() => {
      loadHouseholdHelpPrograms(route.params.bookNumber)
    }, [route.params.bookNumber]),
  )

  // Update screen header
  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        header: () => {
          return (
            <Appbar.Header
              style={{ backgroundColor: theme.navigation.colors.primary, elevation: 0 }}
            >
              <Appbar.Action
                icon="close"
                color={theme.navigation.colors.text}
                onPress={() => {
                  navigation.goBack()
                }}
                disabled={isLoading}
              />
              <Appbar.Content
                title={i18n.t("householdhelp.screentitle")}
                color={theme.navigation.colors.text}
              />
              {!isLoading && hasError && (
                <Appbar.Action
                  icon="refresh"
                  color={theme.navigation.colors.text}
                  onPress={() => loadHouseholdHelpPrograms(route.params.bookNumber)}
                />
              )}
            </Appbar.Header>
          )
        },
      })
    }, [isLoading, hasError, route.params.bookNumber]),
  )

  // Render citizen item
  const renderItem = ({ item }: { item: IHouseholdHelpProgram }) => (
    <View>
      <View style={styles.rowItem}>
        <View style={styles.iconWrapper}>
          <Icon
            name={item.helpType.type === HELP_TYPE_CASH ? "sack" : "charity"}
            color={theme.colors.secondary}
            size={24}
          />
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.helpLabel}>{item.helpType.name}</Text>
          <Text style={styles.helpSubTitle}>
            {item?.date ? formatDateValue(item?.date, "date") : ""}
          </Text>
        </View>
      </View>
      {renderDivider()}
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.resultContainer}>
        {!isConnected && hasError && !isLoading ? (
          <NoNetworkIndicator />
        ) : hasError && !isLoading ? (
          <ErrorIndicator />
        ) : householdHelpPrograms && householdHelpPrograms.length > 0 ? (
          <FlatList
            data={householdHelpPrograms}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.bookNumber}-${item.helpId}-${index}`}
            removeClippedSubviews={true}
            legacyImplementation={true}
            bounces={false}
            refreshing={isLoading}
            onRefresh={() => loadHouseholdHelpPrograms(route.params.bookNumber)}
          />
        ) : (
          <Text style={styles.resultTitle}>{i18n.t("householdhelp.empty")}</Text>
        )}
      </View>
      {(!isLoading ) && (
        <FAB
          icon="plus"
          style={styles.addFabButton}
          onPress={allocateNewHouseholdHelp}
          color={theme.colors.onPrimary}
        />
      )}
    </View>
  )
}

export default HouseHoldHelps
