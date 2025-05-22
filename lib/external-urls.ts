// Meeting BaaS environment prefix for app URLs. For lower environments, it would be something like pre-prod-
// It would be empty for prod.
const environment = process.env.NEXT_PUBLIC_ENVIRONMENT || ""

// Define base domain
const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || "meetingbaas.com"

// Helper to construct environment-aware URLs
const createUrl = (subdomain: string) => {
  if (environment) {
    return `https://${subdomain}.${environment}${BASE_DOMAIN}`
  }
  return `https://${subdomain}.${BASE_DOMAIN}`
}

// Main app URLs
export const MEETING_BAAS_HOMEPAGE_URL = `https://${environment}${BASE_DOMAIN}`
export const TERMS_AND_CONDITIONS_URL = `https://${environment}${BASE_DOMAIN}/terms-and-conditions`
export const PRIVACY_POLICY_URL = `https://${environment}${BASE_DOMAIN}/privacy`

// Settings and subdomain URLs
export const SETTINGS_URL = createUrl("settings")
export const LOGS_URL = createUrl("logs")
export const BOT_ANALYTICS_URL = createUrl("analytics")
export const USAGE_URL = `${BOT_ANALYTICS_URL}/usage`
export const CONSUMPTION_URL = USAGE_URL
export const BILLING_URL = `${createUrl("pricing")}/billing`
export const CREDENTIALS_URL = `${SETTINGS_URL}/credentials`

// Docs URL
export const DOCS_URL = createUrl("docs")

// Github
export const GITHUB_REPO_URL = "https://github.com/Meeting-Baas/logs-table"

//  Recording Viewer: build URL with dynamic recording `uuid` in the path.
export const RECORDING_VIEWER_URL = `${createUrl("viewer")}/:uuid`

// AI Chat
export const AI_CHAT_URL = createUrl("chat")

// Grafana
export const getGrafanaLogsUrl = (bot_uuid?: string) =>
  `https://meetingbaas.grafana.net/explore?schemaVersion=1&panes=%7B%225lu%22:%7B%22datasource%22:%22grafanacloud-logs%22,%22queries%22:%5B%7B%22refId%22:%22A%22,%22expr%22:%22%7Bbot_uuid%3D%5C%22${bot_uuid}%5C%22%7D+%7C%3D+%60%60%22,%22queryType%22:%22range%22,%22datasource%22:%7B%22type%22:%22loki%22,%22uid%22:%22grafanacloud-logs%22%7D,%22editorMode%22:%22builder%22,%22direction%22:%22backward%22%7D%5D,%22range%22:%7B%22from%22:%22now-2d%22,%22to%22:%22now%22%7D%7D%7D&orgId=1`
