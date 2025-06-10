import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import ***REMOVED*** cva ***REMOVED*** from "class-variance-authority"
import ***REMOVED*** ChevronDownIcon ***REMOVED*** from "lucide-react"

import ***REMOVED*** cn ***REMOVED*** from "@/lib/utils"

function NavigationMenu(***REMOVED***
  className,
  children,
  viewport = true,
  ...props
***REMOVED***: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & ***REMOVED***
  viewport?: boolean
***REMOVED***) ***REMOVED***
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport=***REMOVED***viewport***REMOVED***
      className=***REMOVED***cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    >
      ***REMOVED***children***REMOVED***
      ***REMOVED***viewport && <NavigationMenuViewport />***REMOVED***
    </NavigationMenuPrimitive.Root>
  )
***REMOVED***

function NavigationMenuList(***REMOVED***
  className,
  ...props
***REMOVED***: React.ComponentProps<typeof NavigationMenuPrimitive.List>) ***REMOVED***
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className=***REMOVED***cn(
        "group flex flex-1 list-none items-center justify-center gap-1",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function NavigationMenuItem(***REMOVED***
  className,
  ...props
***REMOVED***: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) ***REMOVED***
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className=***REMOVED***cn("relative", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[active=true]:bg-accent/50 data-[state=open]:bg-accent/50 data-[active=true]:text-accent-foreground ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1"
)

function NavigationMenuTrigger(***REMOVED***
  className,
  children,
  ...props
***REMOVED***: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) ***REMOVED***
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className=***REMOVED***cn(navigationMenuTriggerStyle(), "group", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    >
      ***REMOVED***children***REMOVED******REMOVED***" "***REMOVED***
      <ChevronDownIcon
        className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  )
***REMOVED***

function NavigationMenuContent(***REMOVED***
  className,
  ...props
***REMOVED***: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) ***REMOVED***
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className=***REMOVED***cn(
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 top-0 left-0 w-full p-2 pr-2.5 md:absolute md:w-auto",
        "group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function NavigationMenuViewport(***REMOVED***
  className,
  ...props
***REMOVED***: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) ***REMOVED***
  return (
    <div
      className=***REMOVED***cn(
        "absolute top-full left-0 isolate z-50 flex justify-center"
      )***REMOVED***
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className=***REMOVED***cn(
          "origin-top-center bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border shadow md:w-[var(--radix-navigation-menu-viewport-width)]",
          className
        )***REMOVED***
        ***REMOVED***...props***REMOVED***
      />
    </div>
  )
***REMOVED***

function NavigationMenuLink(***REMOVED***
  className,
  ...props
***REMOVED***: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) ***REMOVED***
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className=***REMOVED***cn(
        "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function NavigationMenuIndicator(***REMOVED***
  className,
  ...props
***REMOVED***: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) ***REMOVED***
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className=***REMOVED***cn(
        "data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    >
      <div className="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  )
***REMOVED***

export ***REMOVED***
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
***REMOVED***
