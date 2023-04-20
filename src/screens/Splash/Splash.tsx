import React from "react"
import { Image, View } from "react-native"
import { useTheme, Text } from "react-native-paper"
import {version, displayName} from '../../../app.json'
import useStyles from "./styles"

interface IProps {
  children: React.ReactNode
}

// Splash screen on launching
const Splash = (props: IProps) => {
  const [loading, setLoading] = React.useState<boolean>(true)
  const theme = useTheme()
  const styles = useStyles()
  
  React.useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 3000)
    }
  }, [loading])

  return (
    <>
      {!loading && props.children}
      {loading && (
        <View style={styles.container}>
          <Image source={require("../../assets/republic-mg.png")} />
          <Image source={require("../../assets/logo_loharano.png")} />
          <Text style={styles.versionText} >{displayName} {version}</Text>
        </View>
      )}
    </>
  )
}

export default Splash
