"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface PlatformData {
  name: string
  views: number
  likes: number
  color: string
}

interface PlatformEngagementAreaChartProps {
  data: PlatformData[]
  title?: string
  subtitle?: string
}

const chartConfig = {
  views: {
    label: "Views",
    color: "hsl(var(--chart-1))",
  },
  engagement: {
    label: "Engagement",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function PlatformEngagementAreaChart({
  data,
  title = "Platform Views vs Engagement",
  subtitle = "Comparing reach and engagement across platforms",
}: PlatformEngagementAreaChartProps) {
  // Transform the data for the area chart
  const chartData = data.map((platform) => ({
    platform: platform.name,
    views: platform.views,
    engagement: platform.likes, // Using likes as engagement metric
  }))

  // Helper function to format numbers
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="platform" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={formatNumber} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            {/* Views area (outer/larger area) */}
            <Area
              dataKey="views"
              type="natural"
              fill="var(--color-views)"
              fillOpacity={0.3}
              stroke="var(--color-views)"
              strokeWidth={2}
              stackId="a"
            />
            {/* Engagement area (inner/smaller area) */}
            <Area
              dataKey="engagement"
              type="natural"
              fill="var(--color-engagement)"
              fillOpacity={0.6}
              stroke="var(--color-engagement)"
              strokeWidth={2}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              TikTok shows highest engagement rate <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Views form the outer area, engagement fills the inner curve
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
