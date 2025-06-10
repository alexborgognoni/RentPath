import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

function Collapsible(***REMOVED***
  ...props
***REMOVED***: React.ComponentProps<typeof CollapsiblePrimitive.Root>) ***REMOVED***
  return <CollapsiblePrimitive.Root data-slot="collapsible" ***REMOVED***...props***REMOVED*** />
***REMOVED***

function CollapsibleTrigger(***REMOVED***
  ...props
***REMOVED***: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) ***REMOVED***
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function CollapsibleContent(***REMOVED***
  ...props
***REMOVED***: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) ***REMOVED***
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

export ***REMOVED*** Collapsible, CollapsibleTrigger, CollapsibleContent ***REMOVED***
