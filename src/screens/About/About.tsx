import React from "react"
import { View, Text, Image } from "react-native"

import { version, displayName, releaseName } from "../../../app.json"
import { useI18nContext } from "../../modules/I18nProvider"
import useStyles from "./styles"


// About the app
const About = () => {
  const { i18n } = useI18nContext()
  const styles = useStyles()

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.appInfo}>
          {releaseName === "BETA" && (<Image style={styles.appIcon} source={require("../../assets/app-icon-beta.png")} />)}
          {releaseName === "TRAINING" && (<Image style={styles.appIcon} source={require("../../assets/app-icon-training.png")} />)}
          {releaseName === "PROD" && (<Image style={styles.appIcon} source={require("../../assets/app-icon-prod.png")} />)}
          <Text style={styles.versionLabel}>
            {displayName} {i18n.t("about.version")} {version}
          </Text>
          <Text style={styles.appContextDesc} >{i18n.t("about.devContextDesc")}</Text>
        </View>
        <View style={styles.companyInfo}>
          <Text style={styles.companyHint}>{i18n.t("about.companyLabelHint")}</Text>
          <Text style={styles.companyName}>{i18n.t("about.companyName")}</Text>
        </View>
      </View>
    </View>
  )
}

export default About
