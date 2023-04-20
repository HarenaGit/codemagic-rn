import React from "react"
import { View, Text, TouchableOpacity } from "react-native"
import useStyles from "./styles"

interface IProps {
  title: string
  typeDisaster: "help"| "disaster" | "nodisater"
}

const InfoState = ({ title = "", typeDisaster }: IProps) => {
  const styles = useStyles(typeDisaster)


  return(
    <View style={styles.root}> 
    <Text style={styles.cardTitle}>{title}</Text>
    </View>
  )
}

export default InfoState
