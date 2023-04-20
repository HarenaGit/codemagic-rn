import React from "react"
import { useFocusEffect } from "@react-navigation/core"
import { BackHandler } from "react-native"

export const useBlockHardGobackPress = (blockCond: boolean) => {
  useFocusEffect(
    React.useCallback(() => {
      // Handle go back
      const preventGoBack = () => {
        return blockCond
      }
      BackHandler.addEventListener("hardwareBackPress", preventGoBack)

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", preventGoBack)
      }
    }, [blockCond]),
  )
}
