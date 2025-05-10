import LogsTable from "@/components/logs-table"
import { ScreenshotViewer } from "@/components/screenshot-viewer"

export default async function Home() {
  return (
    <div className="container mx-auto">
      <LogsTable />
      <ScreenshotViewer />
    </div>
  )
}
