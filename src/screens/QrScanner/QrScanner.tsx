import React from "react"
import { View } from "react-native"
import { useTheme } from "react-native-paper"
import QRCodeScanner from "react-native-qrcode-scanner"
import { BarCodeReadEvent } from "react-native-camera"
import { StackNavigationProp } from "@react-navigation/stack"
import useSound from "react-native-use-sound"

import { useI18nContext } from "../../modules/I18nProvider"
import { NavigationParamList } from "../../navigations"
import styles from "./styles"
import { useAuthContext } from "../../modules/AuthProvider"
import { useEventLoggingApi } from "../../modules/api/logging"

interface IProps {
  navigation: StackNavigationProp<NavigationParamList>
}

// Qr scanner screen
const QrScanner = ({ navigation }: IProps) => {
  const { i18n } = useI18nContext()
  const theme = useTheme()
  const [play, pause, stop, data] = useSound("shutter2.mp3")
  const { currentUser } = useAuthContext()
  const logEvent = useEventLoggingApi()

  const handlePlaySound = () => {
    if (data.isPlaying) pause()
    else play()
  }

  const handleCode = (event: BarCodeReadEvent) => {
    handlePlaySound()
    // Logging
    logEvent(currentUser, "SCAN-QR-CODE", "NULL", event.data)

    if (event.data.includes("|")) {
      // Logging
      logEvent(currentUser, "OPEN-HOUSEHOLD-VIEW-SCREEN", "NULL", {
        bookNumber: event.data.split("|")[1].trim(),
        origin: "qrcode",
      })
      navigation.navigate("HouseholdCitizens", {
        bookNumber: event.data.split("|")[1].trim(),
        origin: "qrcode",
      })
    }
  }

  return (
    <View style={styles.root}>
      <QRCodeScanner
        onRead={handleCode}
        reactivate={true}
        reactivateTimeout={3000}
        showMarker={true}
        markerStyle={{
          backfaceVisibility: "visible",
          borderColor: theme.colors.primary,
          borderWidth: 1,
          borderRadius: 24,
        }}
        cameraStyle={{
          height: "100%",
        }}
        vibrate={true}
      />
    </View>
  )
}

export default QrScanner
