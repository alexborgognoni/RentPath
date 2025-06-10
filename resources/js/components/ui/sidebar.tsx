import * as React from "react"
import ***REMOVED*** Slot ***REMOVED*** from "@radix-ui/react-slot"
import ***REMOVED*** VariantProps, cva ***REMOVED*** from "class-variance-authority"
import ***REMOVED*** PanelLeftIcon ***REMOVED*** from "lucide-react"

import ***REMOVED*** useIsMobile ***REMOVED*** from "@/hooks/use-mobile"
import ***REMOVED*** cn ***REMOVED*** from "@/lib/utils"
import ***REMOVED*** Button ***REMOVED*** from "@/components/ui/button"
import ***REMOVED*** Input ***REMOVED*** from "@/components/ui/input"
import ***REMOVED*** Separator ***REMOVED*** from "@/components/ui/separator"
import ***REMOVED***
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
***REMOVED*** from "@/components/ui/sheet"
import ***REMOVED*** Skeleton ***REMOVED*** from "@/components/ui/skeleton"
import ***REMOVED***
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
***REMOVED*** from "@/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContext = ***REMOVED***
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
***REMOVED***

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() ***REMOVED***
  const context = React.useContext(SidebarContext)
  if (!context) ***REMOVED***
    throw new Error("useSidebar must be used within a SidebarProvider.")
  ***REMOVED***

  return context
***REMOVED***

function SidebarProvider(***REMOVED***
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
***REMOVED***: React.ComponentProps<"div"> & ***REMOVED***
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
***REMOVED***) ***REMOVED***
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => ***REMOVED***
      const openState = typeof value === "function" ? value(open) : value
      if (setOpenProp) ***REMOVED***
        setOpenProp(openState)
  ***REMOVED*** else ***REMOVED***
        _setOpen(openState)
  ***REMOVED***

      // This sets the cookie to keep the sidebar state.
      document.cookie = `$***REMOVED***SIDEBAR_COOKIE_NAME***REMOVED***=$***REMOVED***openState***REMOVED***; path=/; max-age=$***REMOVED***SIDEBAR_COOKIE_MAX_AGE***REMOVED***`
***REMOVED***,
    [setOpenProp, open]
  )

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => ***REMOVED***
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
  ***REMOVED***, [isMobile, setOpen, setOpenMobile])

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => ***REMOVED***
    const handleKeyDown = (event: KeyboardEvent) => ***REMOVED***
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) ***REMOVED***
        event.preventDefault()
        toggleSidebar()
  ***REMOVED***
***REMOVED***

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  ***REMOVED***, [toggleSidebar])

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed"

  const contextValue = React.useMemo<SidebarContext>(
    () => (***REMOVED***
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
***REMOVED***),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  )

  return (
    <SidebarContext.Provider value=***REMOVED***contextValue***REMOVED***>
      <TooltipProvider delayDuration=***REMOVED***0***REMOVED***>
        <div
          data-slot="sidebar-wrapper"
          style=***REMOVED***
            ***REMOVED***
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
        ***REMOVED*** as React.CSSProperties
      ***REMOVED***
          className=***REMOVED***cn(
            "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
            className
          )***REMOVED***
          ***REMOVED***...props***REMOVED***
        >
          ***REMOVED***children***REMOVED***
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
***REMOVED***

function Sidebar(***REMOVED***
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
***REMOVED***: React.ComponentProps<"div"> & ***REMOVED***
  side?: "left" | "right"
  variant?: "sidebar" | "floating" | "inset"
  collapsible?: "offcanvas" | "icon" | "none"
***REMOVED***) ***REMOVED***
  const ***REMOVED*** isMobile, state, openMobile, setOpenMobile ***REMOVED*** = useSidebar()

  if (collapsible === "none") ***REMOVED***
    return (
      <div
        data-slot="sidebar"
        className=***REMOVED***cn(
          "bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
          className
        )***REMOVED***
        ***REMOVED***...props***REMOVED***
      >
        ***REMOVED***children***REMOVED***
      </div>
    )
  ***REMOVED***

  if (isMobile) ***REMOVED***
    return (
      <Sheet open=***REMOVED***openMobile***REMOVED*** onOpenChange=***REMOVED***setOpenMobile***REMOVED*** ***REMOVED***...props***REMOVED***>
        <SheetHeader className="sr-only">
          <SheetTitle>Sidebar</SheetTitle>
          <SheetDescription>Displays the mobile sidebar.</SheetDescription>
        </SheetHeader>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          className="bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden"
          style=***REMOVED***
            ***REMOVED***
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
        ***REMOVED*** as React.CSSProperties
      ***REMOVED***
          side=***REMOVED***side***REMOVED***
        >
          <div className="flex h-full w-full flex-col">***REMOVED***children***REMOVED***</div>
        </SheetContent>
      </Sheet>
    )
  ***REMOVED***

  return (
    <div
      className="group peer text-sidebar-foreground hidden md:block"
      data-state=***REMOVED***state***REMOVED***
      data-collapsible=***REMOVED***state === "collapsed" ? collapsible : ""***REMOVED***
      data-variant=***REMOVED***variant***REMOVED***
      data-side=***REMOVED***side***REMOVED***
      data-slot="sidebar"
    >
      ***REMOVED***/* This is what handles the sidebar gap on desktop */***REMOVED***
      <div
        className=***REMOVED***cn(
          "relative h-svh w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
        )***REMOVED***
      />
      <div
        className=***REMOVED***cn(
          "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          // Adjust the padding for floating and inset variants.
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className
        )***REMOVED***
        ***REMOVED***...props***REMOVED***
      >
        <div
          data-sidebar="sidebar"
          className="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
        >
          ***REMOVED***children***REMOVED***
        </div>
      </div>
    </div>
  )
***REMOVED***

function SidebarTrigger(***REMOVED***
  className,
  onClick,
  ...props
***REMOVED***: React.ComponentProps<typeof Button>) ***REMOVED***
  const ***REMOVED*** toggleSidebar ***REMOVED*** = useSidebar()

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className=***REMOVED***cn("h-7 w-7", className)***REMOVED***
      onClick=***REMOVED***(event) => ***REMOVED***
        onClick?.(event)
        toggleSidebar()
  ***REMOVED******REMOVED***
      ***REMOVED***...props***REMOVED***
    >
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
***REMOVED***

function SidebarRail(***REMOVED*** className, ...props ***REMOVED***: React.ComponentProps<"button">) ***REMOVED***
  const ***REMOVED*** toggleSidebar ***REMOVED*** = useSidebar()

  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex=***REMOVED***-1***REMOVED***
      onClick=***REMOVED***toggleSidebar***REMOVED***
      title="Toggle Sidebar"
      className=***REMOVED***cn(
        "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function SidebarInset(***REMOVED*** className, ...props ***REMOVED***: React.ComponentProps<"main">) ***REMOVED***
  return (
    <main
      data-slot="sidebar-inset"
      className=***REMOVED***cn(
        "bg-background relative flex max-w-full min-h-svh flex-1 flex-col",
        "peer-data-[variant=inset]:min-h-[calc(100svh-(--spacing(4)))] md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-0",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function SidebarInput(***REMOVED***
  className,
  ...props
***REMOVED***: React.ComponentProps<typeof Input>) ***REMOVED***
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className=***REMOVED***cn("bg-background h-8 w-full shadow-none", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function SidebarHeader(***REMOVED*** className, ...props ***REMOVED***: React.ComponentProps<"div">) ***REMOVED***
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className=***REMOVED***cn("flex flex-col gap-2 p-2", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function SidebarFooter(***REMOVED*** className, ...props ***REMOVED***: React.ComponentProps<"div">) ***REMOVED***
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className=***REMOVED***cn("flex flex-col gap-2 p-2", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function SidebarSeparator(***REMOVED***
  className,
  ...props
***REMOVED***: React.ComponentProps<typeof Separator>) ***REMOVED***
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className=***REMOVED***cn("bg-sidebar-border mx-2 w-auto", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function SidebarContent(***REMOVED*** className, ...props ***REMOVED***: React.ComponentProps<"div">) ***REMOVED***
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className=***REMOVED***cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function SidebarGroup(***REMOVED*** className, ...props ***REMOVED***: React.ComponentProps<"div">) ***REMOVED***
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className=***REMOVED***cn("relative flex w-full min-w-0 flex-col p-2", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function SidebarGroupLabel(***REMOVED***
  className,
  asChild = false,
  ...props
***REMOVED***: React.ComponentProps<"div"> & ***REMOVED*** asChild?: boolean ***REMOVED***) ***REMOVED***
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      className=***REMOVED***cn(
        "text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function SidebarGroupAction(***REMOVED***
  className,
  asChild = false,
  ...props
***REMOVED***: React.ComponentProps<"button"> & ***REMOVED*** asChild?: boolean ***REMOVED***) ***REMOVED***
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      className=***REMOVED***cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "group-data-[collapsible=icon]:hidden",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function SidebarGroupContent(***REMOVED***
  className,
  ...props
***REMOVED***: React.ComponentProps<"div">) ***REMOVED***
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className=***REMOVED***cn("w-full text-sm", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function SidebarMenu(***REMOVED*** className, ...props ***REMOVED***: React.ComponentProps<"ul">) ***REMOVED***
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className=***REMOVED***cn("flex w-full min-w-0 flex-col gap-1", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function SidebarMenuItem(***REMOVED*** className, ...props ***REMOVED***: React.ComponentProps<"li">) ***REMOVED***
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className=***REMOVED***cn("group/menu-item relative", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  ***REMOVED***
    variants: ***REMOVED***
      variant: ***REMOVED***
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
  ***REMOVED***,
      size: ***REMOVED***
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
  ***REMOVED***,
***REMOVED***,
    defaultVariants: ***REMOVED***
      variant: "default",
      size: "default",
***REMOVED***,
  ***REMOVED***
)

function SidebarMenuButton(***REMOVED***
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
***REMOVED***: React.ComponentProps<"button"> & ***REMOVED***
  asChild?: boolean
  isActive?: boolean
  tooltip?: string | React.ComponentProps<typeof TooltipContent>
***REMOVED*** & VariantProps<typeof sidebarMenuButtonVariants>) ***REMOVED***
  const Comp = asChild ? Slot : "button"
  const ***REMOVED*** isMobile, state ***REMOVED*** = useSidebar()

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size=***REMOVED***size***REMOVED***
      data-active=***REMOVED***isActive***REMOVED***
      className=***REMOVED***cn(sidebarMenuButtonVariants(***REMOVED*** variant, size ***REMOVED***), className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )

  if (!tooltip) ***REMOVED***
    return button
  ***REMOVED***

  if (typeof tooltip === "string") ***REMOVED***
    tooltip = ***REMOVED***
      children: tooltip,
***REMOVED***
  ***REMOVED***

  return (
    <Tooltip>
      <TooltipTrigger asChild>***REMOVED***button***REMOVED***</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden=***REMOVED***state !== "collapsed" || isMobile***REMOVED***
        ***REMOVED***...tooltip***REMOVED***
      />
    </Tooltip>
  )
***REMOVED***

function SidebarMenuAction(***REMOVED***
  className,
  asChild = false,
  showOnHover = false,
  ...props
***REMOVED***: React.ComponentProps<"button"> & ***REMOVED***
  asChild?: boolean
  showOnHover?: boolean
***REMOVED***) ***REMOVED***
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      className=***REMOVED***cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function SidebarMenuBadge(***REMOVED***
  className,
  ...props
***REMOVED***: React.ComponentProps<"div">) ***REMOVED***
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className=***REMOVED***cn(
        "text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function SidebarMenuSkeleton(***REMOVED***
  className,
  showIcon = false,
  ...props
***REMOVED***: React.ComponentProps<"div"> & ***REMOVED***
  showIcon?: boolean
***REMOVED***) ***REMOVED***
  // Random width between 50 to 90%.
  const width = React.useMemo(() => ***REMOVED***
    return `$***REMOVED***Math.floor(Math.random() * 40) + 50***REMOVED***%`
  ***REMOVED***, [])

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className=***REMOVED***cn("flex h-8 items-center gap-2 rounded-md px-2", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    >
      ***REMOVED***showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )***REMOVED***
      <Skeleton
        className="h-4 max-w-(--skeleton-width) flex-1"
        data-sidebar="menu-skeleton-text"
        style=***REMOVED***
          ***REMOVED***
            "--skeleton-width": width,
      ***REMOVED*** as React.CSSProperties
    ***REMOVED***
      />
    </div>
  )
***REMOVED***

function SidebarMenuSub(***REMOVED*** className, ...props ***REMOVED***: React.ComponentProps<"ul">) ***REMOVED***
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className=***REMOVED***cn(
        "border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function SidebarMenuSubItem(***REMOVED***
  className,
  ...props
***REMOVED***: React.ComponentProps<"li">) ***REMOVED***
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className=***REMOVED***cn("group/menu-sub-item relative", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function SidebarMenuSubButton(***REMOVED***
  asChild = false,
  size = "md",
  isActive = false,
  className,
  ...props
***REMOVED***: React.ComponentProps<"a"> & ***REMOVED***
  asChild?: boolean
  size?: "sm" | "md"
  isActive?: boolean
***REMOVED***) ***REMOVED***
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size=***REMOVED***size***REMOVED***
      data-active=***REMOVED***isActive***REMOVED***
      className=***REMOVED***cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

export ***REMOVED***
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
***REMOVED***
