"use client"

import { memo, useEffect, useRef } from "react"
import Image from "next/image"
import { gsap } from "gsap"

const carouselImages = [
  "/carousel/barber1.jpg",
  "/carousel/model1.jpg",
  "/carousel/barber2.jpg",
]

const ImageCarousel = () => {
  const imagesRef = useRef<(HTMLDivElement | null)[]>([])
  const currentIndexRef = useRef(0)
  const animationTl = useRef<GSAPTimeline | null>(null)
  const timeoutId = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    imagesRef.current.forEach((img, index) => {
      if (img) {
        gsap.set(img, {
          opacity: index === 0 ? 1 : 0,
          scale: 1,
          rotation: 0,
          filter: "blur(0px)",
          zIndex: index === 0 ? 3 : 1,
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          willChange: "opacity, transform",
        })
      }
    })

    if (imagesRef.current[0]) {
      gsap.fromTo(
        imagesRef.current[0],
        { scale: 1.1, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: "power3.out", delay: 0.5 }
      )
    }
  }, [])

  const animateToNextImage = (nextIndex: number) => {
    if (animationTl.current) {
      animationTl.current.kill()
      animationTl.current = null
    }

    const currentImage = imagesRef.current[currentIndexRef.current]
    const nextImage = imagesRef.current[nextIndex]

    if (currentImage && nextImage) {
      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut", duration: 1 },
        onComplete: () => {
          currentIndexRef.current = nextIndex
        },
      })

      tl.to(currentImage, {
        opacity: 0,
        scale: 1.15,
        rotation: 1,
        filter: "blur(2px)",
        duration: 1,
      })

      tl.fromTo(
        nextImage,
        {
          opacity: 0,
          scale: 0.85,
          rotation: -1,
          filter: "blur(1px)",
          zIndex: 2,
        },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power3.out",
          zIndex: 3,
        },
        "-=0.6"
      )

      tl.set(currentImage, { zIndex: 1, rotation: 0, filter: "blur(0px)", scale: 1 })

      animationTl.current = tl
    }
  }

  useEffect(() => {
    const cycle = () => {
      const nextIndex = (currentIndexRef.current + 1) % carouselImages.length
      animateToNextImage(nextIndex)
      timeoutId.current = setTimeout(cycle, 5000)
    }

    timeoutId.current = setTimeout(cycle, 5000)

    return () => {
      if (timeoutId.current) clearTimeout(timeoutId.current)
      if (animationTl.current) animationTl.current.kill()
    }
  }, [])

  return (
    <div className="hidden lg:block lg:w-1/2 h-full relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        {carouselImages.map((imageSrc, index) => (
          <div
            key={index}
            ref={(el) => {
              imagesRef.current[index] = el
            }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={imageSrc}
              alt={`Carousel image ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="50vw"
            />
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 via-black/20 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#FFDE59]/10 to-transparent pointer-events-none" />
    </div>
  )
}

export default memo(ImageCarousel)
