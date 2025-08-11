"use client"

import { useRef, useEffect } from "react"
import Image from "next/image"
import { gsap } from "gsap"

const images = [
  "/girl-dash.jpg",
  "/girl-dash-2.jpg",
  "/girl-dash-3.jpg",
]

export function ImageCarousel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const imagesRef = useRef<(HTMLImageElement | null)[]>([])

  useEffect(() => {
    const imgs = imagesRef.current.filter(Boolean) as HTMLImageElement[]
    if (!imgs.length) return

    // Initialize: only show first image, hide others
    gsap.set(imgs, { autoAlpha: 0, x: 50 })
    gsap.set(imgs[0], { autoAlpha: 1, x: 0 })

    let currentIndex = 0

    const timeline = gsap.timeline({ repeat: -1, defaults: { duration: 1, ease: "power2.inOut" } })

    for (let i = 0; i < imgs.length; i++) {
      const nextIndex = (i + 1) % imgs.length
      timeline.to(imgs[i], { autoAlpha: 0, x: -50, duration: 1, delay: 3 }) // fade out current
      timeline.to(imgs[nextIndex], { autoAlpha: 1, x: 0, duration: 1 }) // fade in next
    }

    return () => {
      timeline.kill()
      gsap.set(imgs, { clearProps: "all" })
    }
  }, [])

  return (
    <div 
      ref={containerRef} 
      className="relative w-[650px] h-[450px] rounded-3xl overflow-hidden"
      aria-label="Image carousel"
    >
      {images.map((src, i) => (
        <Image
          key={i}
          ref={(el) => (imagesRef.current[i] = el)}
          src={src}
          alt={`Carousel image ${i + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="object-contain absolute top-0 left-0 rounded-3xl"
          priority={i === 0}
        />
      ))}
    </div>
  )
}
