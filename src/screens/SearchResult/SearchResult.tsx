import React, { useState } from "react"
import { View, Text, TouchableOpacity, FlatList, BackHandler } from "react-native"
import { useTheme, Appbar, Divider, Chip } from "react-native-paper"
import { RouteProp, useFocusEffect } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import Icon from "react-native-vector-icons/MaterialIcons"
import moment from "moment"

import LoadingIndicator from "../../components/LoadingIndicator"
import NoNetworkIndicator from "../../components/NoNetworkIndicator"
import { useI18nContext } from "../../modules/I18nProvider"
import { useAuthContext } from "../../modules/AuthProvider"
import { useNetworkInfoContext } from "../../modules/NetworkInfoProvider"
import { NavigationParamList } from "../../navigations"
import { useSearchCitizenApi } from "../../modules/api"
import useStyles from "./styles"
import { useSearchCriteriaContext } from "../../modules/SearchCriteriaProvider"
import { useLocalizationContext } from "../../modules/LocalizationProvider"
import { useBlockHardGobackPress } from "../../modules/hooks"
import { REQUEST_MAX_RETRY } from "../../consts"
import ErrorIndicator from "../../components/ErrorIndicator"
import { useEventLoggingApi } from "../../modules/api/logging"

interface IProps {
  route: RouteProp<NavigationParamList, "SearchResult">
  navigation: StackNavigationProp<NavigationParamList>
}

const PAGE_SIZE = 30

// Search citizen
const SearchResult = ({ navigation, route }: IProps) => {
  const { i18n } = useI18nContext()
  const theme = useTheme()
  const styles = useStyles()

  const {
    birthDate,
    cni,
    firstName,
    lastName,
    setNoResult,
    globSearch,
    searchTriggered,
    setSearchTriggered,
    retryCount,
    setRetryCount,
  } = useSearchCriteriaContext()

  const { localization } = useLocalizationContext()
  const {
    isLoading,
    handleSearchCitizen,
    citizens,
    hasError,
    setCitizens,
    hasNetworkError,
  } = useSearchCitizenApi()
  const [currentPage, setCurrentPage] = useState(1)
  const { isConnected } = useNetworkInfoContext()

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

  // Search the specified name
  const handleSearchCitizens = (pageNum: number) => {
    setCurrentPage(pageNum)
    setSearchTriggered(true)
    handleSearchCitizen({
      fokontanyId: globSearch ? undefined : localization.fokontanyId,
      firstName,
      lastName,
      cni,
      birthDate,
      page: pageNum,
      size: PAGE_SIZE,
    })
  }

  // Load more
  const handleLoadMoreCitizens = () => {
    if (citizens.length >= PAGE_SIZE) {
      handleSearchCitizens(currentPage + 1)
    }
  }

  // Go back to Home
  const handleClose = () => {
    setCitizens([])
    setCurrentPage(1)
    navigation.goBack()
  }

  // Load on screen open
  useFocusEffect(
    React.useCallback(() => {
      if (citizens.length === 0 && !searchTriggered) handleSearchCitizens(currentPage)
    }, [citizens]),
  )

  // Reaload connection state change
  useFocusEffect(
    React.useCallback(() => {
      if (isConnected && !isLoading && hasNetworkError && retryCount <= REQUEST_MAX_RETRY) {
        handleSearchCitizens(currentPage)
      }
    }, [isConnected, hasNetworkError, isLoading]),
  )

  // Go back if no search result
  useFocusEffect(
    React.useCallback(() => {
      if (
        currentPage === 1 &&
        !isLoading &&
        citizens.length === 0 &&
        !hasError &&
        !globSearch &&
        searchTriggered
      ) {
        setNoResult(true)
        handleClose()
      } else setNoResult(false)
    }, [isLoading, citizens, globSearch, hasError, searchTriggered, currentPage]),
  )

  const formatCriteria = () => {
    return [lastName, firstName, cni, birthDate ? moment(birthDate).format("DD/MM/YYYY") : null]
      .filter((itm) => Boolean(itm))
      .map((elem) => (
        <Chip key={elem} style={styles.criteriaItm}>
          {elem}
        </Chip>
      ))
  }
  // Render divider
  const renderDivider = () => (
    <View style={styles.dividerContainer}>
      <Divider style={styles.divider} />
    </View>
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
              {formatCriteria()}
              <Appbar.Content title={""} color={theme.navigation.colors.text} />
              {!isLoading && hasError && (
                <Appbar.Action
                  icon="refresh"
                  color={theme.navigation.colors.text}
                  onPress={() => handleSearchCitizens(currentPage)}
                />
              )}
            </Appbar.Header>
          )
        },
      })
    }, [isLoading, hasError, hasNetworkError, currentPage]),
  )

  // Render citizen item
  const renderItem = ({ item }: { item: ICitizen }) => (
    <TouchableOpacity onPress={() => handleCitizenItemPress(item)}>
      <View style={styles.rowItem}>
        <View style={styles.iconWrapper}>
          {item.isChief ? (
            <Icon
              name="admin-panel-settings"
              color={item.isConfirmed ? theme.colors.success : theme.colors.primary}
              size={24}
            />
          ) : (
            <View style={{ width: 24 }}></View>
          )}
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.citizenNames}>
            {item.lastName} {item.firstName}
          </Text>
          <Text style={styles.citizenAddress}>
            {item.address?.addressId
              ? `${item.address?.municipality?.name} ${item.address?.fokontany?.name}, ${
                  item.address?.sector ?? ""
                } ${item.address?.name}`
              : i18n.t("household.noadresse")}
          </Text>
        </View>
        <View style={styles.rightIconWrapper}>
          <Icon name={"keyboard-arrow-right"} size={24} color={theme.colors.disabled} />
        </View>
      </View>
      {renderDivider()}
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>{i18n.t("search.resulttitle")}</Text>
        {renderDivider()}
        {!searchTriggered || isLoading ? (
          <LoadingIndicator />
        ) : !isConnected && hasNetworkError && !isLoading ? (
          <NoNetworkIndicator />
        ) : hasError ? (
          <ErrorIndicator />
        ) : (
          <FlatList
            data={citizens}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            removeClippedSubviews={true}
            legacyImplementation={true}
            bounces={false}
            refreshing={isLoading}
            onEndReached={handleLoadMoreCitizens}
            onEndReachedThreshold={0.01}
            onRefresh={() => handleSearchCitizens(currentPage === 1 ? 1 : currentPage - 1)}
          />
        )}
      </View>
    </View>
  )
}

export default SearchResult
