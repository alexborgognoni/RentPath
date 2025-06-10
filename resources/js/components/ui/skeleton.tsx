import ***REMOVED*** cn ***REMOVED*** from "@/lib/utils"

function Skeleton(***REMOVED*** className, ...props ***REMOVED***: React.ComponentProps<"div">) ***REMOVED***
  return (
    <div
      data-slot="skeleton"
      className=***REMOVED***cn("bg-primary/10 animate-pulse rounded-md", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

export ***REMOVED*** Skeleton ***REMOVED***
