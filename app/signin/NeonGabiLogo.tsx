"use client";

import { useRef, useEffect, useState } from "react";

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
  const subtitleRef = useRef<HTMLDivElement | null>(null);
  const [mainText, setMainText] = useState<string[]>([]);
  const [subtitleText, setSubtitleText] = useState<string[]>([]);

  useEffect(() => {
    setMainText("GABI".split(""));
    setSubtitleText("BY GABI SAMIA".split(""));
  }, []);

  useEffect(() => {
    if (mainText.length === 0) return;

    if (window.gsap) {
      initAnimation();
    } else {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
      script.onload = () => initAnimation();
      document.head.appendChild(script);
    }
  }, [mainText]);

  const initAnimation = () => {
    if (!logoRef.current || !subtitleRef.current || !window.gsap) return;
    const { gsap } = window;

    const mainLetters = logoRef.current.querySelectorAll(".main-letter");
    const subtitleLetters = subtitleRef.current.querySelectorAll(".subtitle-letter");

    gsap.set([mainLetters, subtitleLetters], { opacity: 0, scale: 0.9 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Fade & scale in main text
    tl.to(mainLetters, {
      opacity: 1,
      scale: 1,
      duration: 1.4,
      stagger: 0.1,
    });

    // Subtitle fade in
    tl.to(subtitleLetters, {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      stagger: 0.05,
    }, "-=0.6");

    // Continuous breathing glow for main text
    gsap.to(mainLetters, {
      textShadow: `
        0 0 15px #FFD700,
        0 0 30px #FFD700,
        0 0 50px #FFB347
      `,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    // Continuous breathing glow for subtitle
    gsap.to(subtitleLetters, {
      textShadow: `
        0 0 10px #FFD700,
        0 0 20px #FFB347
      `,
      duration: 3.5,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    // Gentle float animation
    gsap.to(logoRef.current, {
      y: -5,
      duration: 5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  };

  const sizeConfig = {
    small: {
      container: "w-80 h-40",
      mainText: "text-6xl",
      subtitle: "text-sm tracking-[0.4em]",
    },
    medium: {
      container: "w-96 h-48",
      mainText: "text-7xl",
      subtitle: "text-base tracking-[0.5em]",
    },
    large: {
      container: "w-[30rem] h-56",
      mainText: "text-8xl",
      subtitle: "text-lg tracking-[0.55em]",
    },
  };

  const config = sizeConfig[size];

  return (
    <>
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Montserrat:wght@300&display=swap");

        .neon-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: radial-gradient(
            ellipse at center,
            rgba(255, 215, 0, 0.12) 0%,
            transparent 70%
          );
          filter: drop-shadow(0 0 25px rgba(255, 215, 0, 0.6));
        }

        .main-text {
          font-family: "Playfair Display", serif;
          font-weight: 700;
          color: #ffd700;
          background: linear-gradient(45deg, #ffd700, #ffb347, #ffd700);
          -webkit-background-clip: text;
          background-clip: text;
          text-fill-color: transparent;
          letter-spacing: 0.04em;
        }

        .subtitle {
          font-family: "Montserrat", sans-serif;
          font-weight: 300;
          color: #e5c96f;
        }

        .main-letter,
        .subtitle-letter {
          display: inline-block;
          transition: transform 0.3s ease;
          opacity: 0;
        }

        .main-letter:hover,
        .subtitle-letter:hover {
          transform: scale(1.05);
          text-shadow: 0 0 20px #ffd700, 0 0 40px #ffb347;
        }
      `}</style>

      <div ref={logoRef} className={`neon-container ${config.container}`}>
        <div className={`main-text ${config.mainText}`}>
          {mainText.map((char, i) => (
            <span key={i} className="main-letter">{char}</span>
          ))}
        </div>
        <div ref={subtitleRef} className={`subtitle ${config.subtitle} mt-4`}>
          {subtitleText.map((char, i) => (
            <span key={i} className="subtitle-letter">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

export default NeonGabiLogo;
