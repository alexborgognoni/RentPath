import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import ***REMOVED*** CheckIcon, ChevronRightIcon, CircleIcon ***REMOVED*** from "lucide-react"

import ***REMOVED*** cn ***REMOVED*** from "@/lib/utils"

function DropdownMenu(***REMOVED***
  ...props
***REMOVED***: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) ***REMOVED***
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" ***REMOVED***...props***REMOVED*** />
***REMOVED***

function DropdownMenuPortal(***REMOVED***
  ...props
***REMOVED***: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) ***REMOVED***
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" ***REMOVED***...props***REMOVED*** />
  )
***REMOVED***

function DropdownMenuTrigger(***REMOVED***
  ...props
***REMOVED***: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) ***REMOVED***
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function DropdownMenuContent(***REMOVED***
  className,
  sideOffset = 4,
  ...props
***REMOVED***: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) ***REMOVED***
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset=***REMOVED***sideOffset***REMOVED***
        className=***REMOVED***cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md",
          className
        )***REMOVED***
        ***REMOVED***...props***REMOVED***
      />
    </DropdownMenuPrimitive.Portal>
  )
***REMOVED***

function DropdownMenuGroup(***REMOVED***
  ...props
***REMOVED***: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) ***REMOVED***
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" ***REMOVED***...props***REMOVED*** />
  )
***REMOVED***

function DropdownMenuItem(***REMOVED***
  className,
  inset,
  variant = "default",
  ...props
***REMOVED***: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & ***REMOVED***
  inset?: boolean
  variant?: "default" | "destructive"
***REMOVED***) ***REMOVED***
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset=***REMOVED***inset***REMOVED***
      data-variant=***REMOVED***variant***REMOVED***
      className=***REMOVED***cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive-foreground data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/40 data-[variant=destructive]:focus:text-destructive-foreground data-[variant=destructive]:*:[svg]:!text-destructive-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function DropdownMenuCheckboxItem(***REMOVED***
  className,
  children,
  checked,
  ...props
***REMOVED***: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) ***REMOVED***
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className=***REMOVED***cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )***REMOVED***
      checked=***REMOVED***checked***REMOVED***
      ***REMOVED***...props***REMOVED***
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      ***REMOVED***children***REMOVED***
    </DropdownMenuPrimitive.CheckboxItem>
  )
***REMOVED***

function DropdownMenuRadioGroup(***REMOVED***
  ...props
***REMOVED***: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) ***REMOVED***
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function DropdownMenuRadioItem(***REMOVED***
  className,
  children,
  ...props
***REMOVED***: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) ***REMOVED***
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className=***REMOVED***cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      ***REMOVED***children***REMOVED***
    </DropdownMenuPrimitive.RadioItem>
  )
***REMOVED***

function DropdownMenuLabel(***REMOVED***
  className,
  inset,
  ...props
***REMOVED***: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & ***REMOVED***
  inset?: boolean
***REMOVED***) ***REMOVED***
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset=***REMOVED***inset***REMOVED***
      className=***REMOVED***cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function DropdownMenuSeparator(***REMOVED***
  className,
  ...props
***REMOVED***: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) ***REMOVED***
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className=***REMOVED***cn("bg-border -mx-1 my-1 h-px", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function DropdownMenuShortcut(***REMOVED***
  className,
  ...props
***REMOVED***: React.ComponentProps<"span">) ***REMOVED***
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className=***REMOVED***cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function DropdownMenuSub(***REMOVED***
  ...props
***REMOVED***: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) ***REMOVED***
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" ***REMOVED***...props***REMOVED*** />
***REMOVED***

function DropdownMenuSubTrigger(***REMOVED***
  className,
  inset,
  children,
  ...props
***REMOVED***: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & ***REMOVED***
  inset?: boolean
***REMOVED***) ***REMOVED***
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset=***REMOVED***inset***REMOVED***
      className=***REMOVED***cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    >
      ***REMOVED***children***REMOVED***
      <ChevronRightIcon className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  )
***REMOVED***

function DropdownMenuSubContent(***REMOVED***
  className,
  ...props
***REMOVED***: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) ***REMOVED***
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className=***REMOVED***cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-lg",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

export ***REMOVED***
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
***REMOVED***
