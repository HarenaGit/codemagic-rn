import axios from "axios"
import { ACCESS_TOKEN_KEY } from "../../consts"
import { useApiEnvContext } from "../ApiEnvProvider"
import AsyncStorage from "../AsyncStorage"

export const useFokontanyService = () => {
  const { envName, API_ENDPOINTS } = useApiEnvContext()

  const FokontanyService = axios.create({
    baseURL: API_ENDPOINTS[envName].FOKONTANY_API_ENDPOINT,
  })

  FokontanyService.interceptors.request.use(
    async (req) => {
      // Add configurations
      const access_token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY)

      // console.log({
      //   METHOD: req.method,
      //   baseURL: req.baseURL,
      //   url: req.url,
      //   access_token,
      //   params: req.params,
      //   data: req.data ? JSON.stringify(req.data) : "",
      // })

      req.headers.Authorization = access_token ? `Bearer ${access_token}` : ""
      return req
    },
    (err) => {
      return Promise.reject(err)
    },
  )

  return FokontanyService
}
