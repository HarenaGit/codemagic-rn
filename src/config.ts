import { releaseName } from "../app.json"

export enum ApiEnv {
  Production = "Production-AWS",
  //Production = "Production-AWS",
  Training = "Production-MEF",
  Beta = "Recette-MEF",
  Dev = "Env-etech",
}

export const API_CONFIGS: Record<
  ApiEnv,
  {
    API_AUDIT: string
    API_REGISTER_DEVICETOKEN_URL: string
    API_MIGRATION_REQUEST_URL: string
    API_MIGRATION_DETAIL_URL: string
    FOKONTANY_API_ENDPOINT: string
  }
> = {
  [ApiEnv.Beta]: {
    API_AUDIT: "http://41.188.38.190:7026/services/AuditLoharano/audit",
    API_REGISTER_DEVICETOKEN_URL: "http://41.188.38.190:7023/dskfjsdopkzepomdlsfdsfds",
    API_MIGRATION_REQUEST_URL: "http://41.188.38.190:7023/pkdojzeojdspds4az4",
    API_MIGRATION_DETAIL_URL: "http://41.188.38.190:7023/kidsjpozejisdpdfpd",
    FOKONTANY_API_ENDPOINT: "http://41.188.38.190:7023/api",
  },
  [ApiEnv.Training]: {
    API_AUDIT: "http://41.188.38.190:7027/services/AuditLoharano/audit",
    API_REGISTER_DEVICETOKEN_URL: "http://41.188.38.190:7028/dskfjsdopkzepomdlsfdsfds",
    API_MIGRATION_REQUEST_URL: "http://41.188.38.190:7028/pkdojzeojdspds4az4",
    API_MIGRATION_DETAIL_URL: "http://41.188.38.190:7028/kidsjpozejisdpdfpd",
    FOKONTANY_API_ENDPOINT: "http://41.188.38.190:7028/api",
  },
  [ApiEnv.Production]: {
    API_AUDIT: "https://www.e-fokontany.gov.mg/api/wso2/services/AuditLoharano/audit",
    API_REGISTER_DEVICETOKEN_URL: "http://41.188.38.190:7028/dskfjsdopkzepomdlsfdsfds",
    API_MIGRATION_REQUEST_URL: "http://41.188.38.190:7028/pkdojzeojdspds4az4",
    API_MIGRATION_DETAIL_URL: "http://41.188.38.190:7028/kidsjpozejisdpdfpd",

    // FOKONTANY_API_ENDPOINT: "http://192.168.1.127:4000",
    // FOKONTANY_API_ENDPOINT: "http://41.188.38.190:7028/api",
    FOKONTANY_API_ENDPOINT: "https://www.e-fokontany.gov.mg/api",
  },

  [ApiEnv.Dev]: {
    API_AUDIT: "http://146.59.155.44:4000",
    API_REGISTER_DEVICETOKEN_URL: "http://146.59.155.44:4000",
    API_MIGRATION_REQUEST_URL: "http://146.59.155.44:4000",
    API_MIGRATION_DETAIL_URL: "http://146.59.155.44:4000",
    FOKONTANY_API_ENDPOINT: "http://146.59.155.44:4000",
  },
}
