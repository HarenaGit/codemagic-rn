import moment from "moment"
import axios from "axios"
import { useAuthContext } from "../AuthProvider"
import { useApiEnvContext } from "../ApiEnvProvider"

//get date for audit
function getDate() {
  var date = moment().utcOffset("+03:00").format("YYYY-MM-DD hh:mm:ss a")
  return date
}
//Get User's Network Public Ip Address for audit
function getclientexternalipaddress() {
  return "127.0.0.1"
}

// Event logging (Activity tracking)
export const useEventLoggingApi = () => {
  const { envName, API_ENDPOINTS } = useApiEnvContext()

  return (issuer: IUserInfo | undefined | null, action: string, oldData: any, newData: any) => {
    // Build indentity info if exists
    const issuerLabel = JSON.stringify({
      id: issuer?.id ?? "unknown",
      username: issuer?.userName ?? "unknown",
      lastName: issuer?.lastName ?? "unknown",
      firstName: issuer?.firstName ?? "unknown",
    })

    // Post event logs
    axios
      .post(API_ENDPOINTS[envName].API_AUDIT, {
        data: {
          utilisateur: issuerLabel,
          action: action,
          date_changement: moment().utcOffset("+03:00").format("YYYY-MM-DD"),
          old_data: typeof oldData === "object" ? JSON.stringify(oldData) : oldData,
          new_data: typeof newData === "object" ? JSON.stringify(newData) : newData,
          heure: moment().utcOffset("+03:00").format("hh:mm:ss"),
          description: "",
          ip: getclientexternalipaddress(),
          application: "ANDROID-APP-FOKONTANY",
        },
      })
      .then((response) => {})
      .catch((error) => {
        console.log("ERROR: Cannot save tracking log => ", action)
      })
  }
}
