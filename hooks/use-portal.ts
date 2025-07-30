import { useRef, useEffect } from "react"

function createPortalElement(id: string) {
  const element = document.createElement("div")
  element.setAttribute("id", id)
  document.body.appendChild(element)
  return element
}

export function usePortal(id: string) {
  const portalRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const existingPortal = document.getElementById(id)
    const portal = existingPortal || createPortalElement(id)

    portalRef.current = portal

    return () => {
      if (!existingPortal && portal.parentNode) {
        portal.parentNode.removeChild(portal)
      }
    }
  }, [id])

  return portalRef.current
}
