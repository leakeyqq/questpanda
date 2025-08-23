"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface PlatformData {
  name: string
  views: number
  likes: number
  comments: number
  shares: number
  bookmarks: number
  color: string
}
interface PlatformDistributionChartProps {
  data: PlatformData[]
  title: string
  subtitle: string
}

const chartConfig = {
  views: {
    label: "Views",
  },
  tiktok: {
    label: "TikTok",
    color: "#8A4FFF",
  },
  instagram: {
    label: "Instagram",
    color: "#FF4F8A",
  },
  youtube: {
    label: "YouTube",
    color: "#06D6A0",
  },
} satisfies ChartConfig

export function PlatformDistributionChart({ data, title, subtitle }: PlatformDistributionChartProps) {
const chartData = data.map((platform) => ({
  platform: platform.name.toLowerCase(),
  views: platform.views,
  likes: platform.likes,
  comments: platform.comments,
  shares: platform.shares,
  bookmarks: platform.bookmarks,
  fill: platform.name === "TikTok" ? "#8A4FFF" : platform.name === "Instagram" ? "#FF4F8A" : "#06D6A0",
}))

  const totalViews = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.views, 0)
  }, [chartData])

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white border border-gray-200 shadow p-3 rounded text-sm text-gray-800">
        <div className="font-bold capitalize">{data.platform}</div>
        <div>Views: {formatNumber(data.views)}</div>
        <div>Likes: {formatNumber(data.likes)}</div>
        <div>Comments: {formatNumber(data.comments)}</div>
        <div>Shares: {formatNumber(data.shares)}</div>
        <div>Bookmarks: {formatNumber(data.bookmarks)}</div>
      </div>
    )
  }

  return null
}
  return (
    <Card className="flex flex-col bg-white border-gray-200 shadow-sm">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-brand-dark">{title}</CardTitle>
        <CardDescription className="text-gray-600">{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            {/* <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} /> */}
            <ChartTooltip cursor={false} content={<CustomTooltip hideLabel />} />

            <Pie data={chartData} dataKey="views" nameKey="platform" innerRadius={60} strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-brand-dark text-3xl font-bold">
                          {formatNumber(totalViews)}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-gray-600">
                          Total Views
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
         {/* Legend */}
        <div className="flex justify-center gap-6 mt-4">
          {chartData.map((item) => (
            <div key={item.platform} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
              <span className="text-sm text-gray-600 capitalize">{item.platform}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
