## Connection Explanation

Below is a template for other NextJS users on how to fetch and treat data from the /bots/all endpoint (rewritten from /api/logs) using the API_SERVER_BASEURL.

---

### 1. Configure Next.js Rewrites

In your next.config.ts (or next.config.js), set up a rewrite so that requests to /api/logs are forwarded to your external API (for example, /bots/all):

```ts
// next.config.ts (or next.config.js)
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async rewrites() {
    const apiServerBaseUrl = process.env.API_SERVER_BASEURL
    return [
      {
        source: "/api/logs",
        destination: `${apiServerBaseUrl}/bots/all`
      },
      // (other rewrites if needed)
    ]
  }
}

export default nextConfig
```


---

### 2. Create an API Utility (lib/api.ts)

Create (or update) a utility function (for example, fetchLogs) that builds a query (using offset, limit, and date parameters) and then fetches from /api/logs (which Next rewrites to /bots/all). For example:

```ts
// lib/api.ts
export async function fetchLogs(params: { offset: number; limit: number; start_date?: string; end_date?: string }) {
  const queryParams = new URLSearchParams({
    offset: params.offset.toString(),
    limit: params.limit.toString()
  })
  if (params.start_date) queryParams.append("start_date", params.start_date)
  if (params.end_date) queryParams.append("end_date", params.end_date)

  const response = await fetch(`/api/logs?${queryParams.toString()}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch logs: ${response.status} ${response.statusText}`)
  }
  return response.json()
}
```


---

### 3. Create a Custom Hook (hooks/use-logs.ts)

Create a custom hook (for example, useLogs) that calls fetchLogs and then "selects" (or transforms) the returned data. (For instance, you might format the bot status and compute a "platform" from the meeting URL.) For example:

```ts
// hooks/use-logs.ts
import { useQuery } from "@tanstack/react-query"
import { fetchLogs } from "@/lib/api"
import dayjs from "dayjs"

interface UseLogsParams {
  offset: number
  pageSize: number
  startDate: Date | null
  endDate: Date | null
}

export function useLogs({ offset, pageSize, startDate, endDate }: UseLogsParams) {
  const { data, isLoading, isError, error, isRefetching } = useQuery({
    queryKey: ["logs", { offset, limit: pageSize, startDate, endDate }],
    queryFn: () =>
      fetchLogs({
        offset,
        limit: pageSize,
        start_date: startDate ? `${dayjs(startDate).format("YYYY-MM-DD")}T00:00:00` : "",
        end_date: endDate ? `${dayjs(endDate).format("YYYY-MM-DD")}T23:59:59" : ""
      }),
    select: (data) => {
      // (Optional) Transform the data, e.g. format status, compute platform, etc.
      const formattedBots = data.bots.map((bot) => ({
         ...bot,
         // formattedStatus: formatBotStatus(bot),
         // platform: getPlatformFromUrl(bot.bot.meeting_url)
      }))
      return { has_more: data.has_more, bots: formattedBots }
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    placeholderData: (previousData) => previousData
  })

  return { data, isLoading, isError, error, isRefetching }
}
```


---

### 4. Use the Hook in Your UI (for example, in a Logs Table Component)

In your component (for example, components/logs-table/index.tsx), use the useLogs hook to fetch (and re-fetch) the data. Then, pass the (transformed) data (for example, data?.bots) to your UI (for example, a DataTable) so that the list of bots is rendered (and paginated, filtered, etc.). For example:

```tsx
// components/logs-table/index.tsx (or your component)
"use client"

import { useState } from "react"
import { useLogs } from "@/hooks/use-logs"
import dayjs from "dayjs"

export default function LogsTable() {
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [dateRange, setDateRange] = useState({ startDate: dayjs().subtract(14, "day").toDate(), endDate: dayjs().toDate() })

  const { data, isLoading, isError, error, isRefetching } = useLogs({
    offset: pageIndex * pageSize,
    pageSize,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate
  })

  if (isLoading && !data) return <div>Loading…</div>
  if (isError) return <div>Error: {error instanceof Error ? error.message : "Generic error"}</div>

  return (
    <div>
      {/* (Your UI, e.g. a DataTable, that renders data?.bots) */}
      {data?.bots.map((bot) => (
         <div key={bot.bot.bot.uuid}>
           {bot.bot.bot.meeting_url} – {bot.status.text} – {bot.status.details}
         </div>
      ))}
    </div>
  )
}
```


---

### 5. Sample Data (for Reference)

Below is an example of the JSON data returned by the /bots/all endpoint (rewritten from /api/logs):

```json
{
  "bots": [
    {
      "bot": {
         "bot": {
            "id": 514,
            "account_id": 16,
            "meeting_url": "https://meet.google.com/vuq-abvw-scc",
            "created_at": "2025-05-14T07:17:40.565921",
            "session_id": "meeting_bot_session_16_c873aba1-b912-4e79-a39b-75cf6805a69b",
            "reserved": false,
            "errors": null,
            "ended_at": null,
            "mp4_s3_path": "d37cd7a3-83a9-46c6-b46f-ec1f6bc3f465.mp4",
            "uuid": "d37cd7a3-83a9-46c6-b46f-ec1f6bc3f465",
            "bot_param_id": 595,
            "event_id": null,
            "scheduled_bot_id": null,
            "diarization_v2": false,
            "transcription_fails": null,
            "diarization_fails": null,
            "user_reported_error": [
               { "created_at": "2025-05-14T14:24:33.922104", "note": "" },
               { "created_at": "2025-05-14T18:21:43.906174", "note": "" }
            ]
         },
         "params": {
            "bot_name": "meeting baas",
            "bot_image": null,
            "speech_to_text_provider": null,
            "enter_message": null,
            "recording_mode": null,
            "speech_to_text_api_key": null,
            "streaming_input": null,
            "streaming_output": null,
            "waiting_room_timeout": null,
            "noone_joined_timeout": null,
            "deduplication_key": null,
            "extra": { "type": "admin", "user": "MY" },
            "webhook_url": "https://webhook-test.com/22d9c42d6ab80e85acce382229308101",
            "streaming_audio_frequency": null,
            "zoom_sdk_id": null,
            "zoom_sdk_pwd": null
         },
         "duration": 0
      },
      "status": {
         "text": "Stalled",
         "type": "Error",
         "details": "Bot has been pending for 13.0 hours",
         "category": "stalled_error",
         "priority": "Critical"
      },
      "ui_status": {
         "value": "Stalled",
         "type": "error",
         "details": "Bot has been pending for 13.0 hours",
         "sort_priority": 0,
         "category": "stalled_error",
         "icon": "exclamation-circle",
         "color": "#D32F2F"
      }
    },
    {
      "bot": {
         "bot": {
            "id": 513,
            "account_id": 16,
            "meeting_url": "https://meet.google.com/vuq-abvw-scc",
            "created_at": "2025-05-12T11:41:43.763807",
            "session_id": "meeting_bot_session_16_40fbfbb9-8de3-4389-9260-932af90312f6",
            "reserved": false,
            "errors": null,
            "ended_at": null,
            "mp4_s3_path": "61e887de-3f26-4f15-bf5e-d6747a9b137e.mp4",
            "uuid": "61e887de-3f26-4f15-bf5e-d6747a9b137e",
            "bot_param_id": 594,
            "event_id": null,
            "scheduled_bot_id": null,
            "diarization_v2": false,
            "transcription_fails": null,
            "diarization_fails": null,
            "user_reported_error": [
               { "created_at": "2025-05-12T18:04:06.923415", "note": "User reported: Bot did not record the meeting as expected." },
               { "created_at": "2025-05-12T18:43:28.853061", "note": "User reported: Bot did not record the meeting as expected." },
               { "created_at": "2025-05-12T18:48:21.893533", "note": "" },
               { "created_at": "2025-05-12T19:06:16.313615", "note": "" },
               { "created_at": "2025-05-14T16:50:35.195984", "note": "User reported: Bot did not record the meeting as expected." },
               { "created_at": "2025-05-14T16:52:03.201527", "note": "User reported: Bot did not record the meeting as expected." }
            ]
         },
         "params": {
            "bot_name": "meeting baas",
            "bot_image": null,
            "speech_to_text_provider": null,
            "enter_message": null,
            "recording_mode": null,
            "speech_to_text_api_key": null,
            "streaming_input": null,
            "streaming_output": null,
            "waiting_room_timeout": null,
            "noone_joined_timeout": null,
            "deduplication_key": null,
            "extra": { "type": "admin", "user": "MY" },
            "webhook_url": "https://webhook-test.com/22d9c42d6ab80e85acce382229308101",
            "streaming_audio_frequency": null,
            "zoom_sdk_id": null,
            "zoom_sdk_pwd": null
         },
         "duration": 0
      },
      "status": {
         "text": "Stalled",
         "type": "Error",
         "details": "Bot has been pending for 56.6 hours",
         "category": "stalled_error",
         "priority": "Critical"
      },
      "ui_status": {
         "value": "Stalled",
         "type": "error",
         "details": "Bot has been pending for 56.6 hours",
         "sort_priority": 0,
         "category": "stalled_error",
         "icon": "exclamation-circle",
         "color": "#D32F2F"
      }
    }
  ],
  "has_more": false
}
```


---

### Summary

• In your NextJS project, configure a rewrite (in next.config.ts) so that /api/logs is forwarded (for example, to /bots/all) using your API_SERVER_BASEURL.
• Create (or update) a utility (for example, lib/api.ts) that builds a query (using offset, limit, and date parameters) and then fetches from /api/logs (which Next rewrites).
• Create a custom hook (for example, hooks/use-logs.ts) that calls that utility and then "selects" (or transforms) the returned data (for example, formatting status and computing a "platform").
• In your UI (for example, a logs-table component), use that hook to fetch (and re-fetch) the data and then pass the (transformed) data (for example, data?.bots) to your UI (for example, a DataTable) so that the list of bots is rendered (and paginated, filtered, etc.).