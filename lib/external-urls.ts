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
export const APP_URL = createUrl("auth")
export const MEETING_BAAS_HOMEPAGE_URL = `https://${environment}${BASE_DOMAIN}`
export const TERMS_AND_CONDITIONS_URL = `https://${environment}${BASE_DOMAIN}/terms-and-conditions`
export const PRIVACY_POLICY_URL = `https://${environment}${BASE_DOMAIN}/privacy`

// Settings and subdomain URLs
export const SETTINGS_URL = `https://${environment}${BASE_DOMAIN}`
export const LOGS_URL = createUrl("logs")
export const BOT_ANALYTICS_URL = createUrl("analytics")
export const USAGE_URL = `${BOT_ANALYTICS_URL}/usage`
export const CONSUMPTION_URL = USAGE_URL
export const BILLING_URL = createUrl("pricing") + "/billing"
export const CREDENTIALS_URL = createUrl("settings") + "/credentials"

// Docs URL
export const DOCS_URL = createUrl("docs")

// Github
export const GITHUB_REPO_URL = "https://github.com/Meeting-Baas/logs-table"

// Recording Viewer. Append uuid to the end of the URL to view a specific recording.
export const RECORDING_VIEWER_URL = `${createUrl("viewer")}/:uuid`

// AI Chat
export const AI_CHAT_URL = createUrl("chat")
