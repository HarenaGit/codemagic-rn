import React from "react"
import PushNotification from "react-native-push-notification"
import axios from "axios"

import { useAuthContext } from "../../modules/AuthProvider"
import { REACT_APP_REGISTER_DEVICETOKEN_URL } from "../../config"

export const usePushNotification = () => {
  const { currentUser } = useAuthContext()

  React.useEffect(() => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: async (payload) => {
        console.log(REACT_APP_REGISTER_DEVICETOKEN_URL, {
          firebase_token: payload.token,
          user_id: currentUser?.user_id,
        })
        await axios
          .put(REACT_APP_REGISTER_DEVICETOKEN_URL, {
            firebase_token: payload.token,
            user_id: currentUser?.user_id,
          })
          .then((response) => console.log("usePushNotification => ", response.data))
          .catch((reason) => console.log("usePushNotification => ", reason))
        console.log("usePushNotification::TOKEN:", payload.token)
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: (notification) => {
        console.log("usePushNotification::NOTIFICATION: ", notification)
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: (notification) => {
        console.log("usePushNotification::ACTION: ", notification.action)
        console.log("usePushNotification::NOTIFICATION: ", notification)

        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: (err) => {
        console.error(err.message, err)
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    })

    PushNotification.createChannel(
      {
        channelId: "notification",
        channelName: "Notification channel",
        channelDescription: "Default notification channel",
        playSound: true,
        soundName: "default",
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    )
  }, [])
}
