"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const SidebarContext = React.createContext<{
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  collapsible: "classic" | "modern" | "none"
  side: "left" | "right"
}>({
  open: true,
  setOpen: () => {},
  collapsible: "classic",
  side: "left",
})

export const useSidebar = () => React.useContext(SidebarContext)

export const SidebarProvider = ({
  children,
  defaultOpen = true,
  collapsible = "classic",
  side = "left",
}: {
  children: React.ReactNode
  defaultOpen?: boolean
  collapsible?: "classic" | "modern" | "none"
  side?: "left" | "right"
}) => {
  const [open, setOpen] = React.useState(defaultOpen)
  return (
    <SidebarContext.Provider value={{ open, setOpen, collapsible, side }}>
      {children}
    </SidebarContext.Provider>
  )
}

const sidebarVariants = cva(
  "fixed top-0 z-20 h-screen transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        inset:
          "top-4 h-[calc(100vh-2rem)] rounded-xl border data-[side=left]:left-4 data-[side=right]:right-4",
      },
      state: {
        open: "w-64",
        closed: "w-16",
      },
    },
    defaultVariants: {
      variant: "default",
      state: "open",
    },
  }
)

export interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  collapsible?: "classic" | "modern" | "none"
  side?: "left" | "right"
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      className,
      variant,
      collapsible: localCollapsible,
      side: localSide,
      ...props
    },
    ref
  ) => {
    const { open, collapsible, side } = useSidebar()
    return (
      <div
        ref={ref}
        className={cn(
          sidebarVariants({
            variant,
            state: open ? "open" : "closed",
          }),
          "group/sidebar-wrapper"
        )}
        data-side={localSide ?? side}
        {...props}
      />
    )
  }
)
Sidebar.displayName = "Sidebar"

const sidebarHeaderVariants = cva("flex items-center", {
  variants: {
    state: {
      open: "justify-between",
      closed: "justify-center",
    },
  },
  defaultVariants: {
    state: "open",
  },
})

export interface SidebarHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarHeaderVariants> {}

const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, ...props }, ref) => {
    const { open } = useSidebar()
    return (
      <div
        ref={ref}
        className={cn(sidebarHeaderVariants({ state: open ? "open" : "closed" }), className)}
        {...props}
      />
    )
  }
)
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex-grow", className)} {...props} />
))
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-auto", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col", className)} {...props} />
))
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { open } = useSidebar()
  return (
    <div
      ref={ref}
      className={cn(
        "px-4 py-2 text-xs font-semibold text-muted-foreground",
        open ? "block" : "hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupHeader.displayName = "SidebarGroupHeader"

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col", className)} {...props} />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul ref={ref} className={cn("space-y-1", className)} {...props} />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors",
  {
    variants: {
      isActive: {
        true: "bg-primary text-primary-foreground",
        false:
          "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10",
        sm: "h-9",
        lg: "h-11",
      },
    },
    defaultVariants: {
      isActive: false,
      size: "default",
    },
  }
)

export interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof sidebarMenuButtonVariants> {
  asChild?: boolean
}

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ className, size, isActive, asChild, ...props }, ref) => {
  const Comp = asChild ? "div" : "button"
  return (
    <Comp
      ref={ref}
      className={cn(sidebarMenuButtonVariants({ size, isActive, className }))}
      {...props}
    />
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarRail = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { open, setOpen, collapsible, side } = useSidebar()
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (collapsible === "modern" && triggerRef.current) {
      triggerRef.current.style.transform = `translateX(${
        side === "left" ? (open ? "0" : "-100%") : open ? "0" : "100%"
      })`
    }
  }, [open, collapsible, side])

  if (collapsible === "none") return null

  return (
    <div
      ref={ref}
      className={cn(
        "absolute top-1/2 -translate-y-1/2",
        side === "left" ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2",
        className
      )}
      {...props}
    >
      <button
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 ease-in-out",
          collapsible === "modern" && "absolute"
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            "h-4 w-4 transition-transform duration-300 ease-in-out",
            open ? "rotate-0" : "rotate-180"
          )}
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
    </div>
  )
})
SidebarRail.displayName = "SidebarRail"

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { open } = useSidebar()
  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-300 ease-in-out",
        "lg:ml-64",
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { setOpen } = useSidebar()
  return (
    <button
      ref={ref}
      className={cn("lg:hidden", className)}
      onClick={() => setOpen(true)}
      {...props}
    />
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupHeader,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarInset,
  SidebarTrigger,
}
