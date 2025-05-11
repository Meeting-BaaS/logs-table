import LogsTable from "@/components/logs-table"
import { ScreenshotViewer } from "@/components/screenshot-viewer"

export default async function Home() {
  return (
    <div className="m-4 md:m-8">
      <LogsTable />
      <ScreenshotViewer />
    </div>
  )
}
