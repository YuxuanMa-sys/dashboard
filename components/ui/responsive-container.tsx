"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useDeviceType } from "@/hooks/use-mobile"

interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  mobileClassName?: string
  tabletClassName?: string
  desktopClassName?: string
  as?: React.ElementType
}

export function ResponsiveContainer({
  children,
  className,
  mobileClassName,
  tabletClassName,
  desktopClassName,
  as: Component = "div",
  ...props
}: ResponsiveContainerProps) {
  const deviceType = useDeviceType()

  const responsiveClasses = React.useMemo(() => {
    switch (deviceType) {
      case "mobile":
        return mobileClassName
      case "tablet":
        return tabletClassName
      case "desktop":
        return desktopClassName
      default:
        return ""
    }
  }, [deviceType, mobileClassName, tabletClassName, desktopClassName])

  return (
    <Component
      className={cn(className, responsiveClasses)}
      data-device-type={deviceType}
      {...props}
    >
      {children}
    </Component>
  )
}

interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  mobileCols?: number
  tabletCols?: number
  desktopCols?: number
  gap?: string
}

export function ResponsiveGrid({
  children,
  mobileCols = 1,
  tabletCols = 2,
  desktopCols = 4,
  gap = "gap-4",
  className,
  ...props
}: ResponsiveGridProps) {
  const gridCols = `grid-cols-${mobileCols} sm:grid-cols-${tabletCols} lg:grid-cols-${desktopCols}`

  return (
    <div
      className={cn("grid", gridCols, gap, className)}
      {...props}
    >
      {children}
    </div>
  )
}

interface ResponsiveTextProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  mobileSize?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl"
  tabletSize?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl"
  desktopSize?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl"
  as?: React.ElementType
}

export function ResponsiveText({
  children,
  mobileSize = "base",
  tabletSize,
  desktopSize,
  className,
  as: Component = "span",
  ...props
}: ResponsiveTextProps) {
  const textSize = `text-${mobileSize} ${tabletSize ? `sm:text-${tabletSize}` : ""} ${desktopSize ? `lg:text-${desktopSize}` : ""}`

  return (
    <Component
      className={cn(textSize, className)}
      {...props}
    >
      {children}
    </Component>
  )
} 