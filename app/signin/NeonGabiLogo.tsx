"use client";

import { useRef, useEffect } from "react";

declare global {
  interface Window {
    gsap: any;
  }
}

interface NeonGabiLogoProps {
  size?: "small" | "medium" | "large";
}

const NeonGabiLogo = ({ size = "medium" }: NeonGabiLogoProps) => {
  const logoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    script.onload = () => {
      if (window.gsap && logoRef.current) {
        initNeonAnimation();
      }
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const initNeonAnimation = () => {
    const { gsap } = window as any;
    const letters = logoRef.current?.querySelectorAll(".neon-letter");
    const subtitleLetters = logoRef.current?.querySelectorAll(
      ".neon-subtitle .neon-letter"
    );
    const border = logoRef.current?.querySelector(".neon-border");

    if (!letters || !subtitleLetters || !border) return;

    // gsap.set(letters, { opacity: 0, y: 20 });
    // gsap.set(subtitleLetters, { opacity: 0, y: 15 });
    // gsap.set(border, { opacity: 0, scale: 0.9 });

    const tl = gsap.timeline();

    tl.to(border, {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "power2.out",
    })
      .to(
        letters,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
        },
        "-=0.7"
      )
      .to(
        subtitleLetters,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.03,
          ease: "power2.out",
        },
        "-=0.2"
      );

    gsap.to(letters, {
      textShadow: `
        0 0 8px #FFDE59,
        0 0 16px #FFDE59,
        0 0 24px #FFDE59,
        0 0 32px #FFDE59
      `,
      duration: 2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 2,
    });

    setInterval(() => {
      const randomLetter =
        letters[Math.floor(Math.random() * letters.length)];
      gsap.to(randomLetter, {
        textShadow: `
          0 0 2px #FFDE59,
          0 0 4px #FFDE59,
          0 0 8px #FFDE59
        `,
        duration: 0.1,
        yoyo: true,
        repeat: 3,
      });
    }, 4000);
  };

  const sizeConfig = {
    small: {
      container: "w-24 h-16",
      mainText: "text-xl",
      subtitle: "text-xs",
      border: "w-24 h-16",
    },
    medium: {
      container: "w-32 h-20",
      mainText: "text-2xl",
      subtitle: "text-xs",
      border: "w-32 h-20",
    },
    large: {
      container: "w-40 h-24",
      mainText: "text-3xl",
      subtitle: "text-sm",
      border: "w-40 h-24",
    },
  };

  const config = sizeConfig[size];

  return (
    <>
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap");

        .neon-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .neon-text {
          font-family: "Orbitron", monospace;
          font-weight: 900;
          letter-spacing: 0.1em;
          color: #ffde59;
          text-shadow: 0 0 5px #ffde59, 0 0 10px #ffde59, 0 0 15px #ffde59,
            0 0 20px #ffde59;
          -webkit-text-stroke: 1px #ffde59;
          text-stroke: 1px #ffde59;
          line-height: 1;
        }

        .neon-subtitle {
          font-family: "Orbitron", monospace;
          font-weight: 400;
          letter-spacing: 0.2em;
          color: #ffde59;
          text-shadow: 0 0 3px #ffde59, 0 0 6px #ffde59, 0 0 9px #ffde59;
          -webkit-text-stroke: 0.5px #ffde59;
          text-stroke: 0.5px #ffde59;
          margin-top: 0.25rem;
        }

        .neon-border {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border: 2px solid #ffde59;
          border-radius: 12px;
          box-shadow: 0 0 5px #ffde59, 0 0 10px #ffde59, 0 0 15px #ffde59,
            inset 0 0 5px #ffde59;
          opacity: 0;
          z-index: 1;
        }

        .neon-letter {
          display: inline-block;
        }
      `}</style>

      <div ref={logoRef} className={`neon-container ${config.container}`}>
        <div className={`neon-border ${config.border}`}></div>

        <div className={`neon-text ${config.mainText} relative z-10`}>
          <span className="neon-letter">G</span>
          <span className="neon-letter">A</span>
          <span className="neon-letter">B</span>
          <span className="neon-letter">I</span>
        </div>

        <div className={`neon-subtitle ${config.subtitle} relative z-10`}>
          <span className="neon-letter">B</span>
          <span className="neon-letter">Y</span>
          <span className="neon-letter">&nbsp;</span>
          <span className="neon-letter">G</span>
          <span className="neon-letter">A</span>
          <span className="neon-letter">B</span>
          <span className="neon-letter">I</span>
          <span className="neon-letter">&nbsp;</span>
          <span className="neon-letter">S</span>
          <span className="neon-letter">A</span>
          <span className="neon-letter">M</span>
          <span className="neon-letter">I</span>
          <span className="neon-letter">A</span>
        </div>
      </div>
    </>
  );
};

export default NeonGabiLogo;
