"use client"

import type { SystemMetricsMachine, SystemMetricsPoint } from "@/components/logs-table/types"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import type { ChartConfig } from "@/components/ui/chart"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
} from "@/components/ui/chart"
import { Download } from "lucide-react"
import { useMemo, useState } from "react"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Button } from "../ui/button"

interface MemoryViewerProps {
    metrics: SystemMetricsPoint[]
    logsUrl?: string
    machine?: SystemMetricsMachine
}

interface ChartDataPoint {
    timestamp: string
    time: string
    mem_mo: number
    cpu_all: number
    cpu_ffmpeg: number
}

type SubTabType = "memory" | "performance"

interface TooltipPayloadEntry {
    dataKey: string
    color: string
    value: number | string
    name?: string
}

interface CustomTooltipProps {
    active?: boolean
    payload?: TooltipPayloadEntry[]
    label?: string
    config?: ChartConfig
}

// Custom tooltip component with larger fonts and size
const CustomTooltip = ({ active, payload, label, config }: CustomTooltipProps) => {
    if (!active || !payload || payload.length === 0) return null

    return (
        <div className="bg-background border rounded-lg shadow-lg p-4 min-w-[200px]">
            <p className="font-semibold text-base mb-3 text-foreground">{label}</p>
            <div className="space-y-2">
                {payload.map((entry: TooltipPayloadEntry, index: number) => {
                    const configItem = config?.[entry.dataKey]
                    const color = configItem?.color || entry.color
                    const label = configItem?.label || entry.dataKey

                    return (
                        <div key={index} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{ backgroundColor: color }}
                            />
                            <span className="text-sm font-medium text-foreground">
                                {label}:
                            </span>
                            <span className="text-sm font-bold text-foreground ml-auto">
                                {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// Using explicit colors that work well together
// TODO: Make this dynamic based on the theme
const colors = {
    systemMemoryPercent: "#3b82f6", // Blue
    chromeMemory: "#10b981", // Green  
    ffmpegMemory: "#f59e0b", // Amber
    chromeCpu: "#ef4444", // Red
    chromeProcessCount: "#8b5cf6", // Purple
}

const metricsChartConfig = {
    mem_mo: {
        label: "Memory Used (MB)",
        color: colors.systemMemoryPercent,
    },
    cpu_all: {
        label: "Total CPU %",
        color: colors.chromeCpu,
    },
    cpu_ffmpeg: {
        label: "FFmpeg CPU %",
        color: colors.ffmpegMemory,
    },
} satisfies ChartConfig

const performanceChartConfig = {
    chromeCpu: {
        label: "Chrome CPU %",
        color: colors.chromeCpu,
    },
    chromeProcessCount: {
        label: "Chrome Processes",
        color: colors.chromeProcessCount,
    },
} satisfies ChartConfig

export function MemoryViewer({ metrics, logsUrl, machine }: MemoryViewerProps) {
    const [activeSubTab, setActiveSubTab] = useState<SubTabType>("memory")

    const chartData = useMemo(() => {
        return metrics.map((point): ChartDataPoint => {
            const date = new Date(point.timestamp_ms)
            return {
                timestamp: String(point.timestamp_ms),
                time: date.toLocaleTimeString(),
                mem_mo: point.mem_mo,
                cpu_all: point.cpu_all,
                cpu_ffmpeg: point.cpu_ffmpeg
            }
        })
    }, [metrics])

    const handleDownloadLogs = () => {
        if (logsUrl) {
            window.open(logsUrl, "_blank")
        }
    }

    if (metrics.length === 0) {
        return (
            <div className="flex h-96 items-center justify-center text-muted-foreground">
                No system metrics data available
            </div>
        )
    }

    // Compute summary statistics
    const stats = useMemo(() => {
        if (chartData.length === 0) {
            return {
                maxMem: 0,
                avgMem: 0,
                maxCpu: 0,
                avgCpu: 0,
                maxFfmpeg: 0,
                avgFfmpeg: 0
            }
        }
        const mems = chartData.map(d => d.mem_mo)
        const cpus = chartData.map(d => d.cpu_all)
        const ffmpegs = chartData.map(d => d.cpu_ffmpeg)
        return {
            maxMem: Math.max(...mems),
            avgMem: mems.reduce((sum, v) => sum + v, 0) / chartData.length,
            maxCpu: Math.max(...cpus),
            avgCpu: cpus.reduce((sum, v) => sum + v, 0) / chartData.length,
            maxFfmpeg: Math.max(...ffmpegs),
            avgFfmpeg: ffmpegs.reduce((sum, v) => sum + v, 0) / chartData.length
        }
    }, [chartData])

    return (
        <div className="w-full space-y-4">
            {/* Download button */}
            <div className="flex justify-end">
                <Button
                    onClick={handleDownloadLogs}
                    variant="outline"
                    size="sm"
                    disabled={!logsUrl}
                >
                    <Download className="mr-2 h-4 w-4" />
                    Download Raw Logs
                </Button>
            </div>

            {/* Metrics Chart */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>System Metrics Over Time</CardTitle>
                    <CardDescription>
                        Memory usage (MB), total CPU %, and FFmpeg CPU %
                    </CardDescription>
                </CardHeader>
                <CardContent className="w-full p-0">
                    <div className="w-full h-[600px] px-6 pb-6">
                        <ChartContainer config={metricsChartConfig} className="w-full h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={chartData}
                                    margin={{
                                        top: 20,
                                        right: 60,
                                        left: 60,
                                        bottom: 60,
                                    }}
                                >
                                    <defs>
                                        <linearGradient id="memMoGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={colors.systemMemoryPercent} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={colors.systemMemoryPercent} stopOpacity={0.1} />
                                        </linearGradient>
                                        <linearGradient id="cpuAllGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={colors.chromeCpu} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={colors.chromeCpu} stopOpacity={0.1} />
                                        </linearGradient>
                                        <linearGradient id="cpuFfmpegGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={colors.ffmpegMemory} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={colors.ffmpegMemory} stopOpacity={0.1} />
                                        </linearGradient>
                                    </defs>

                                    <XAxis
                                        dataKey="time"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        interval="preserveStartEnd"
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis
                                        yAxisId="mem"
                                        orientation="left"
                                        tick={{ fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                        label={{ value: 'Memory (MB)', angle: -90, position: 'insideLeft' }}
                                    />
                                    <YAxis
                                        yAxisId="cpu"
                                        orientation="right"
                                        tick={{ fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                        label={{ value: 'CPU %', angle: 90, position: 'insideRight' }}
                                    />
                                    <ChartTooltip
                                        content={<CustomTooltip config={metricsChartConfig} />}
                                    />
                                    <ChartLegend content={<ChartLegendContent />} />

                                    {/* Memory in MB on left axis */}
                                    <Area
                                        yAxisId="mem"
                                        type="monotone"
                                        dataKey="mem_mo"
                                        stroke={colors.systemMemoryPercent}
                                        fill="url(#memMoGradient)"
                                        strokeWidth={2}
                                        name="Memory Used (MB)"
                                    />

                                    {/* CPU percentages on right axis */}
                                    <Area
                                        yAxisId="cpu"
                                        type="monotone"
                                        dataKey="cpu_all"
                                        stroke={colors.chromeCpu}
                                        fill="url(#cpuAllGradient)"
                                        strokeWidth={2}
                                        name="Total CPU %"
                                    />
                                    <Area
                                        yAxisId="cpu"
                                        type="monotone"
                                        dataKey="cpu_ffmpeg"
                                        stroke={colors.ffmpegMemory}
                                        fill="url(#cpuFfmpegGradient)"
                                        strokeWidth={2}
                                        name="FFmpeg CPU %"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Summary Stats */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Memory Usage</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm">
                        <div>Max Used: {stats.maxMem.toFixed(2)} MB</div>
                        <div>Avg Used: {stats.avgMem.toFixed(2)} MB</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Total CPU Usage</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm">
                        <div>Max: {stats.maxCpu.toFixed(2)}%</div>
                        <div>Avg: {stats.avgCpu.toFixed(2)}%</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">FFmpeg CPU Usage</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm">
                        <div>Max: {stats.maxFfmpeg.toFixed(2)}%</div>
                        <div>Avg: {stats.avgFfmpeg.toFixed(2)}%</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 