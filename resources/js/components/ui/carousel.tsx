import * as React from "react"
import useEmblaCarousel, ***REMOVED***
  type UseEmblaCarouselType,
***REMOVED*** from "embla-carousel-react"
import ***REMOVED*** ArrowLeft, ArrowRight ***REMOVED*** from "lucide-react"

import ***REMOVED*** cn ***REMOVED*** from "@/lib/utils"
import ***REMOVED*** Button ***REMOVED*** from "@/components/ui/button"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = ***REMOVED***
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
***REMOVED***

type CarouselContextProps = ***REMOVED***
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
***REMOVED*** & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() ***REMOVED***
  const context = React.useContext(CarouselContext)

  if (!context) ***REMOVED***
    throw new Error("useCarousel must be used within a <Carousel />")
  ***REMOVED***

  return context
***REMOVED***

function Carousel(***REMOVED***
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
***REMOVED***: React.ComponentProps<"div"> & CarouselProps) ***REMOVED***
  const [carouselRef, api] = useEmblaCarousel(
    ***REMOVED***
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
***REMOVED***,
    plugins
  )
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)

  const onSelect = React.useCallback((api: CarouselApi) => ***REMOVED***
    if (!api) return
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  ***REMOVED***, [])

  const scrollPrev = React.useCallback(() => ***REMOVED***
    api?.scrollPrev()
  ***REMOVED***, [api])

  const scrollNext = React.useCallback(() => ***REMOVED***
    api?.scrollNext()
  ***REMOVED***, [api])

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => ***REMOVED***
      if (event.key === "ArrowLeft") ***REMOVED***
        event.preventDefault()
        scrollPrev()
  ***REMOVED*** else if (event.key === "ArrowRight") ***REMOVED***
        event.preventDefault()
        scrollNext()
  ***REMOVED***
***REMOVED***,
    [scrollPrev, scrollNext]
  )

  React.useEffect(() => ***REMOVED***
    if (!api || !setApi) return
    setApi(api)
  ***REMOVED***, [api, setApi])

  React.useEffect(() => ***REMOVED***
    if (!api) return
    onSelect(api)
    api.on("reInit", onSelect)
    api.on("select", onSelect)

    return () => ***REMOVED***
      api?.off("select", onSelect)
***REMOVED***
  ***REMOVED***, [api, onSelect])

  return (
    <CarouselContext.Provider
      value=***REMOVED******REMOVED***
        carouselRef,
        api: api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
  ***REMOVED******REMOVED***
    >
      <div
        onKeyDownCapture=***REMOVED***handleKeyDown***REMOVED***
        className=***REMOVED***cn("relative", className)***REMOVED***
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        ***REMOVED***...props***REMOVED***
      >
        ***REMOVED***children***REMOVED***
      </div>
    </CarouselContext.Provider>
  )
***REMOVED***

function CarouselContent(***REMOVED*** className, ...props ***REMOVED***: React.ComponentProps<"div">) ***REMOVED***
  const ***REMOVED*** carouselRef, orientation ***REMOVED*** = useCarousel()

  return (
    <div
      ref=***REMOVED***carouselRef***REMOVED***
      className="overflow-hidden"
      data-slot="carousel-content"
    >
      <div
        className=***REMOVED***cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )***REMOVED***
        ***REMOVED***...props***REMOVED***
      />
    </div>
  )
***REMOVED***

function CarouselItem(***REMOVED*** className, ...props ***REMOVED***: React.ComponentProps<"div">) ***REMOVED***
  const ***REMOVED*** orientation ***REMOVED*** = useCarousel()

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className=***REMOVED***cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function CarouselPrevious(***REMOVED***
  className,
  variant = "outline",
  size = "icon",
  ...props
***REMOVED***: React.ComponentProps<typeof Button>) ***REMOVED***
  const ***REMOVED*** orientation, scrollPrev, canScrollPrev ***REMOVED*** = useCarousel()

  return (
    <Button
      data-slot="carousel-previous"
      variant=***REMOVED***variant***REMOVED***
      size=***REMOVED***size***REMOVED***
      className=***REMOVED***cn(
        "absolute size-8 rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -left-12 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )***REMOVED***
      disabled=***REMOVED***!canScrollPrev***REMOVED***
      onClick=***REMOVED***scrollPrev***REMOVED***
      ***REMOVED***...props***REMOVED***
    >
      <ArrowLeft />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
***REMOVED***

function CarouselNext(***REMOVED***
  className,
  variant = "outline",
  size = "icon",
  ...props
***REMOVED***: React.ComponentProps<typeof Button>) ***REMOVED***
  const ***REMOVED*** orientation, scrollNext, canScrollNext ***REMOVED*** = useCarousel()

  return (
    <Button
      data-slot="carousel-next"
      variant=***REMOVED***variant***REMOVED***
      size=***REMOVED***size***REMOVED***
      className=***REMOVED***cn(
        "absolute size-8 rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -right-12 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )***REMOVED***
      disabled=***REMOVED***!canScrollNext***REMOVED***
      onClick=***REMOVED***scrollNext***REMOVED***
      ***REMOVED***...props***REMOVED***
    >
      <ArrowRight />
      <span className="sr-only">Next slide</span>
    </Button>
  )
***REMOVED***

export ***REMOVED***
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
***REMOVED***
