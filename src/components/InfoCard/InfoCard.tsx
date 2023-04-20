import React from "react"
import { View, Text, TouchableOpacity } from "react-native"
import FastImage from "react-native-fast-image"
import useStyles from "./styles"

interface IProps {
  type: "location" | "member" | "chief"
  photo?: string
  icon: React.ReactNode
  title: string
  otherTitle?: string
  infos: {
    label: string
    value: string | null | undefined
  }[]
  onPress?: () => void
}

const InfoCard = ({ title = "", infos = [], otherTitle, icon, photo, type, onPress }: IProps) => {
  const styles = useStyles(type)

  const renderContent = () => (
    <>
      <View style={styles.titleRow}>
        {icon}
        <Text style={styles.cardTitle}>{title}</Text>
        {type === "chief" && otherTitle && <Text style={styles.cardChiefTitle}>{otherTitle}</Text>}
      </View>
      {["chief", "member"].includes(type) && photo && (
        <FastImage
          style={styles.profilePic}
          source={{
            uri: photo,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      )}
      {["chief", "member"].includes(type) && !photo && (
        <FastImage
          style={styles.profilePic}
          source={require("../../assets/default-pic.png")}
          resizeMode={FastImage.resizeMode.contain}
        />
      )}
      {infos.map((infoItm, index) => {
        return infoItm.value ? (
          <View key={`rowitm-${index}`} style={styles.rowItem}>
            <Text style={styles.itemTitle}>{infoItm.label}:</Text>
            <Text style={styles.itemValue}>{infoItm.value}</Text>
          </View>
        ) : null
      })}
    </>
  )

  return onPress ? (
    <TouchableOpacity style={styles.root} onPress={onPress}>
      {renderContent()}
    </TouchableOpacity>
  ) : (
    <View style={styles.root}>{renderContent()}</View>
  )
}

export default InfoCard
