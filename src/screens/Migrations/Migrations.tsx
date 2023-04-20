import React, { useState } from "react"
import { View, Text, TouchableOpacity, FlatList } from "react-native"
import { Divider, Badge, useTheme } from "react-native-paper"
import { useFocusEffect } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import axios from "axios"
import Icon from "react-native-vector-icons/MaterialIcons"

import { API_CONFIGS } from "../../config"
import LoadingIndicator from "../../components/LoadingIndicator"
import NoNetworkIndicator from "../../components/NoNetworkIndicator"
import { useI18nContext } from "../../modules/I18nProvider"
import { useAuthContext } from "../../modules/AuthProvider"
import { useNetworkInfoContext } from "../../modules/NetworkInfoProvider"
import { NavigationParamList } from "../../navigations"
import useStyles from "./styles"

interface IProps {
  navigation: StackNavigationProp<NavigationParamList>
}

const PAGE_SIZE = 30

// Migration list
const Migrations = ({ navigation }: IProps) => {
  const theme = useTheme()
  const { i18n } = useI18nContext()
  const styles = useStyles()
  const [migrations, setMigrations] = useState<MigrationItemType[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setLoading] = useState(false)
  const { isConnected } = useNetworkInfoContext()

  const { currentUser } = useAuthContext()

  // Load the house of a citizen
  const handleLoadHouse = (
    fokontany_source_id: number,
    fokontany_target_id: number,
    household_id: number,
    request_date: string,
  ) => {
    navigation.navigate("MigrationDetail", {
      fokontany_source_id,
      fokontany_target_id,
      household_id,
      request_date,
    })
  }

  // Fetch migration requests
  const handleLoadMigrationRequest = (pageNum: number) => {
    setLoading(true)
    setCurrentPage(pageNum)

    axios
      .get<MigrationItemType[]>(API_CONFIGS["BETA"].API_MIGRATION_REQUEST_URL, {
        params: {
          size: PAGE_SIZE,
          page: pageNum,
          fokontany_id: currentUser?.fokontany_id,
          user_id: currentUser?.user_id,
        },
      })
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          if (!res.data[0].error) {
            setMigrations(res.data)
          } else {
            setMigrations([])
          }
        }
        setLoading(false)
      })
      .catch((error) => {
        console.log("error => ", error)
        setMigrations([])
        setLoading(false)
      })
  }

  // Load more
  const handleLoadMoreMigrationRequest = () => {
    if (migrations.length >= PAGE_SIZE) {
      handleLoadMigrationRequest(currentPage + 1)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      handleLoadMigrationRequest(1)
    }, []),
  )

  useFocusEffect(
    React.useCallback(() => {
      if (isConnected && !isLoading) {
        handleLoadMigrationRequest(currentPage)
      }
    }, [isConnected]),
  )

  // Render divider
  const renderDivider = () => (
    <View style={styles.dividerContainer}>
      <Divider style={styles.divider} />
    </View>
  )

  // Render citizen item
  const renderItem = ({ item, index }: { item: MigrationItemType; index: number }) => (
    <TouchableOpacity
      style={[styles.notificationItm, index === 0 && { marginTop: 16 }]}
      onPress={() =>
        item?.book_number &&
        handleLoadHouse(
          item?.fokontany_source_id,
          item?.fokontany_target_id,
          item?.household_id,
          item?.request_date,
        )
      }
    >
      <View style={styles.notifContent}>
        <View style={styles.textWrapper}>
          <Text style={styles.citizenName} numberOfLines={1}>
            {item.book_number}
          </Text>
          <Text style={styles.citizenAddress} numberOfLines={1}>
            {item.fokontany}
          </Text>
        </View>
        <View style={styles.iconWrapper}>
          <Icon name={"keyboard-arrow-right"} size={24} color={theme.colors.text} />
          {/* <Badge style={styles.badge}>{item.total_queries}</Badge> */}
        </View>
      </View>
      {renderDivider()}
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.notificationContainer}>
        {isLoading ? (
          <LoadingIndicator />
        ) : !isConnected && !isLoading ? (
          <NoNetworkIndicator />
        ) : (
          <FlatList
            data={migrations}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.book_number}-${index}`}
            removeClippedSubviews={true}
            legacyImplementation={true}
            bounces={false}
            refreshing={isLoading}
            onEndReached={handleLoadMoreMigrationRequest}
            onEndReachedThreshold={0.01}
            onRefresh={() => handleLoadMigrationRequest(currentPage === 1 ? 1 : currentPage - 1)}
          />
        )}
      </View>
    </View>
  )
}

export default Migrations
