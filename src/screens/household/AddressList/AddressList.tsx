import React, { useState } from "react"
import { View, Text, TouchableOpacity, FlatList } from "react-native"
import { useTheme, Appbar, Divider, FAB } from "react-native-paper"
import { RouteProp, useFocusEffect } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import Icon from "react-native-vector-icons/MaterialIcons"

import Snackbar from "../../../components/Snackbar"
import { useI18nContext } from "../../../modules/I18nProvider"
import { useLocalizationContext } from "../../../modules/LocalizationProvider"
import { NavigationParamList } from "../../../navigations"
import { useNetworkInfoContext } from "../../../modules/NetworkInfoProvider"
import { useBlockHardGobackPress } from "../../../modules/hooks"
import { useAuthContext } from "../../../modules/AuthProvider"
import { useEventLoggingApi } from "../../../modules/api/logging"
import { useAddressListApi, useCreateNewAddressApi } from "../../../modules/api"

import useStyles from "./styles"
import NoNetworkIndicator from "../../../components/NoNetworkIndicator"
import ErrorIndicator from "../../../components/ErrorIndicator"
import SearchInput from "../../../components/SearchInput"
import DialogInput from "../../../components/DialogInput"

interface IProps {
  route: RouteProp<NavigationParamList, "AddressList">
  navigation: StackNavigationProp<NavigationParamList>
}

// Search citizen
const AddressList = ({ navigation, route }: IProps) => {
  const { i18n } = useI18nContext()
  const theme = useTheme()
  const styles = useStyles()

  // Handle snackbar state
  const [snackBarData, setSnackBarData] = React.useState<ISnackBarData>({
    isVisible: false,
    variant: "success",
  })
  const [isNewAddressPromptVisible, setNewAddressPromptVisible] = React.useState<boolean>(false)
  const [searchQuery, setSearchQuery] = React.useState<string>()

  const { localization } = useLocalizationContext()
  const {
    currentPage,
    setCurrentPage,
    isLoading,
    addresses,
    loadAddresses,
    setAddresses,
    hasError,
    hasNetworkError,
    isFirstRequestTriggered,
    PAGE_SIZE,
  } = useAddressListApi()

  const {
    handleCreateNewAddress,
    hasError: isCreateNewAddressHasError,
    hasNetworkError: isCreateNewAddressHasNetError,
    isLoading: isCreateNewAddressLoading,
  } = useCreateNewAddressApi({
    onSuccess: (newAdr) => {
      setSnackBarData({
        isVisible: true,
        variant: "success",
        message: i18n.t("addresses.savesuccess"),
      })

      setNewAddressPromptVisible(false)
      if (newAdr) {
        setSearchQuery(newAdr.name)
        loadAddresses({
          page: 1,
          fokontanyId: localization.fokontanyId,
          name: newAdr.name,
        })
      }
    },
    onError: () => {
      setSnackBarData({
        isVisible: true,
        variant: "error",
        message: i18n.t("addresses.saveerror"),
      })
    },
  })

  const { isConnected } = useNetworkInfoContext()

  // Block hardware back press on loading
  useBlockHardGobackPress(false)

  const { currentUser } = useAuthContext()
  const logEvent = useEventLoggingApi()

  // Select address
  const handleAddressItemPress = (address: IAddress) => {
    //Logging action
    logEvent(currentUser, "OPEN-CREATE-CITIZEN-SCREEN", "NULL", address)
    navigation.navigate("CitizenEditor", {
      citizen: {
        address,
      },
      intent: "createhousehold",
      validation: true,
    })
  }

  // Go back to Home
  const handleClose = () => {
    setCurrentPage(1)
    setAddresses([])
    navigation.goBack()
  }

  // Load more
  const handleLoadMoreAddresses = () => {
    if (addresses.length >= PAGE_SIZE) {
      loadAddresses({
        page: currentPage + 1,
        fokontanyId: localization.fokontanyId,
        name: searchQuery,
      })
    }
  }

  // Refresh list
  const handleRefreshAddresses = () => {
    loadAddresses({
      page: currentPage === 1 ? 1 : currentPage - 1,
      fokontanyId: localization.fokontanyId,
      name: searchQuery,
    })
  }

  // Load on screen open
  useFocusEffect(
    React.useCallback(() => {
      if (addresses.length === 0 && !isFirstRequestTriggered) {
        loadAddresses({
          page: currentPage,
          fokontanyId: localization.fokontanyId,
          name: searchQuery,
        })
      }
    }, [addresses, localization.fokontanyId, isFirstRequestTriggered, currentPage, searchQuery]),
  )

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
                icon="arrow-left"
                color={theme.navigation.colors.text}
                onPress={handleClose}
                disabled={isLoading}
              />
              <SearchInput
                placeholder={`${i18n.t("household.adresse")} (${localization.fokontanyName})`}
                value={searchQuery}
                handleChange={(newText) => {
                  // On clear
                  if (newText === "") {
                    setCurrentPage(1)
                    setSearchQuery("")
                    loadAddresses({ page: 1, fokontanyId: localization.fokontanyId, name: "" })
                  } else {
                    setSearchQuery(newText)
                  }
                }}
                onSubmit={(newText) => {
                  setSearchQuery(newText)
                  loadAddresses({ page: 1, fokontanyId: localization.fokontanyId, name: newText })
                }}
              />
              {!isLoading && hasError && (
                <Appbar.Action
                  icon="refresh"
                  color={theme.navigation.colors.text}
                  onPress={() =>
                    loadAddresses({
                      page: currentPage,
                      fokontanyId: localization.fokontanyId,
                      name: searchQuery,
                    })
                  }
                />
              )}
            </Appbar.Header>
          )
        },
      })
    }, [isLoading, hasError, hasNetworkError, localization.fokontanyId, currentPage, searchQuery]),
  )

  // Render address item
  const renderItem = ({ item }: { item: IAddress }) => (
    <TouchableOpacity onPress={() => handleAddressItemPress(item)}>
      <View style={styles.rowItem}>
        <View style={styles.textWrapper}>
          <Text style={styles.addressName}>{item.name}</Text>
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
        {!isConnected && hasNetworkError && !isLoading ? (
          <NoNetworkIndicator />
        ) : hasError ? (
          <ErrorIndicator />
        ) : (
          <>
          <FlatList
            data={addresses}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            removeClippedSubviews={true}
            legacyImplementation={true}
            bounces={false}
            refreshing={isLoading}
            onEndReached={handleLoadMoreAddresses}
            onEndReachedThreshold={0.01}
            onRefresh={handleRefreshAddresses}
          />
          </>
        )}
      </View>
      {!isLoading && (
        <FAB
          icon="plus"
          style={styles.addFabButton}
          onPress={() => setNewAddressPromptVisible(true)}
          color={theme.colors.onPrimary}
        />
      )}

      {isNewAddressPromptVisible && (
        <DialogInput
          isLoading={isCreateNewAddressLoading}
          loadingMessage={i18n.t("addresses.creatingaddress")}
          hasError={isCreateNewAddressHasNetError || isCreateNewAddressHasError}
          errorMessage={
            !isConnected
              ? i18n.t("errors.networkerror")
              : isCreateNewAddressHasError
              ? i18n.t("addresses.saveerror")
              : undefined
          }
          isDialogVisible={isNewAddressPromptVisible}
          title={i18n.t("addresses.createnew")}
          message={i18n.t("addresses.formmessage")}
          placeholder={i18n.t("addresses.address")}
          onSubmit={(inputText) => {
            if (inputText)
              handleCreateNewAddress({
                fokontanyId: localization.fokontanyId,
                name: inputText,
              })
          }}
          closeDialog={() => {
            setNewAddressPromptVisible(false)
          }}
        />
      )}
      {snackBarData.isVisible && (
        <Snackbar
          variant={snackBarData.variant}
          visible={snackBarData.isVisible}
          duration={2000}
          onDismiss={() => {
            setSnackBarData({
              ...snackBarData,
              isVisible: false,
            })
          }}
        >
          {!isConnected
            ? i18n.t("errors.networkerror")
            : snackBarData.message
            ? snackBarData.message
            : ""}
        </Snackbar>
      )}
    </View>
  )
}

export default AddressList
