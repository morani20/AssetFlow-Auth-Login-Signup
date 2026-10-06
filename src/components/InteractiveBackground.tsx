import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  baseAlpha: number;
}

export const InteractiveBackground: React.FC = () => {
  const { activeSlide } = useApp();
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePosRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      mousePosRef.current = { x, y };

      if (spotlightRef.current) {
        spotlightRef.current.style.background = `
          radial-gradient(130px circle at ${x}px ${y}px, rgba(0, 210, 255, 0.28) 0%, transparent 70%),
          radial-gradient(650px circle at ${x}px ${y}px, rgba(0, 102, 255, 0.22) 0%, rgba(0, 102, 255, 0.05) 45%, transparent 75%)
        `;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Subtle interactive node particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const particleCount = Math.min(Math.floor((width * height) / 28000), 40);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const alpha = Math.random() * 0.35 + 0.1;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.6 + 0.8,
        alpha: alpha,
        baseAlpha: alpha,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0) p1.x = width;
        if (p1.x > width) p1.x = 0;
        if (p1.y < 0) p1.y = height;
        if (p1.y > height) p1.y = 0;

        const dxMouse = mousePosRef.current.x - p1.x;
        const dyMouse = mousePosRef.current.y - p1.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distMouse < 180) {
          p1.alpha = Math.min(p1.baseAlpha + (1 - distMouse / 180) * 0.45, 0.75);
        } else {
          p1.alpha += (p1.baseAlpha - p1.alpha) * 0.05;
        }

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 163, 255, ${p1.alpha})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const lineAlpha = (1 - dist / 120) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 102, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none bg-[#040C1A]">
      
      {/* =========================================================================
          THEME 0: LOW-POLY CRYSTALLINE FACETS (Matching Image 1)
          ========================================================================= */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          activeSlide === 0 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <svg
          className="absolute inset-0 w-full h-full object-cover"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Angular polygonal facets across screen */}
          <polygon points="0,0 480,0 240,320 0,260" fill="#0A1E3E" opacity="0.85" />
          <polygon points="480,0 1100,0 780,340 240,320" fill="#061329" opacity="0.9" />
          <polygon points="1100,0 1560,0 1340,300 780,340" fill="#0D2750" opacity="0.8" />
          <polygon points="1560,0 1920,0 1920,380 1340,300" fill="#081833" opacity="0.88" />

          <polygon points="0,260 240,320 180,680 0,600" fill="#07162E" opacity="0.9" />
          <polygon points="240,320 780,340 520,720 180,680" fill="#0F2B57" opacity="0.75" />
          <polygon points="780,340 1340,300 1180,740 520,720" fill="#0A1F42" opacity="0.85" />
          <polygon points="1340,300 1920,380 1760,780 1180,740" fill="#112F5E" opacity="0.7" />

          <polygon points="0,600 180,680 200,1080 0,1080" fill="#050F22" opacity="0.95" />
          <polygon points="180,680 520,720 620,1080 200,1080" fill="#0C2448" opacity="0.82" />
          <polygon points="520,720 1180,740 1080,1080 620,1080" fill="#081731" opacity="0.9" />
          <polygon points="1180,740 1760,780 1680,1080 1080,1080" fill="#0E2851" opacity="0.78" />
          <polygon points="1760,780 1920,380 1920,1080 1680,1080" fill="#061225" opacity="0.92" />

          {/* Facet Edge Highlights */}
          <line x1="240" y1="320" x2="780" y2="340" stroke="#0066FF" strokeWidth="1" opacity="0.25" />
          <line x1="780" y1="340" x2="520" y2="720" stroke="#00A3FF" strokeWidth="1" opacity="0.2" />
          <line x1="1180" y1="740" x2="1760" y2="780" stroke="#0066FF" strokeWidth="1" opacity="0.3" />
        </svg>
      </div>

      {/* =========================================================================
          THEME 1: LUMINOUS AURORA WAVE RIBBON (Matching Image 2)
          ========================================================================= */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          activeSlide === 1 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Deep ambient dark blue base */}
        <div className="absolute inset-0 bg-[#040C1A]" />

        {/* Diagonal Soft Luminous Nebula Ribbon */}
        <div
          className="absolute -bottom-32 -left-20 w-[1400px] h-[900px] pointer-events-none transform -rotate-12"
          style={{
            background:
              'radial-gradient(ellipse at 40% 60%, rgba(0, 102, 255, 0.45) 0%, rgba(0, 70, 180, 0.25) 35%, rgba(0, 30, 90, 0.1) 60%, transparent 80%)',
            filter: 'blur(75px)',
          }}
        />

        {/* Focused Electric Blue Ribbon Curve */}
        <svg
          className="absolute inset-0 w-full h-full opacity-65"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-100 800 C 250 680, 520 450, 900 350 C 1200 270, 1400 120, 1600 -50"
            stroke="url(#blue-ribbon-grad)"
            strokeWidth="110"
            strokeLinecap="round"
            filter="blur(55px)"
          />
          <path
            d="M-50 780 C 300 660, 560 440, 930 330 C 1220 250, 1420 110, 1620 -40"
            stroke="#00D2FF"
            strokeWidth="14"
            strokeLinecap="round"
            opacity="0.65"
            filter="blur(16px)"
          />
          <defs>
            <linearGradient id="blue-ribbon-grad" x1="0" y1="800" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0044CC" />
              <stop offset="45%" stopColor="#0066FF" />
              <stop offset="75%" stopColor="#00C8FF" />
              <stop offset="100%" stopColor="#0044CC" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* =========================================================================
          THEME 2: DIAGONAL ARCHITECTURAL SLANTED STRIPES (Matching Image 3)
          ========================================================================= */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          activeSlide === 2 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -42deg,
              #040c1a 0px,
              #040c1a 45px,
              #07162f 45px,
              #0a2044 90px,
              #051022 90px,
              #051022 135px,
              #0c254e 135px,
              #071731 180px
            )`,
            opacity: 0.9,
          }}
        />
        {/* Smooth Vignette Mask across stripes */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0066FF]/20 via-transparent to-[#040C1A]/80 pointer-events-none" />
      </div>

      {/* =========================================================================
          THEME 3: CURVED DOTTED WAVE FIELD / DATA MATRIX (Matching Image 4)
          ========================================================================= */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          activeSlide === 3 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <svg
          className="absolute inset-0 w-full h-full opacity-60"
          viewBox="0 0 1440 900"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="dot-field-glow" cx="20%" cy="70%" r="55%">
              <stop offset="0%" stopColor="#0066FF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#040C1A" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-field-glow)" />

          {/* Flowing Array of Dotted Curves */}
          {[...Array(24)].map((_, rowIndex) => {
            const yOffset = 250 + rowIndex * 28;
            const amp = 90 + rowIndex * 7;
            return (
              <path
                key={rowIndex}
                d={`M -50 ${yOffset + 180} C 280 ${yOffset - amp}, 600 ${yOffset + amp}, 1500 ${yOffset - 120}`}
                fill="none"
                stroke={rowIndex % 3 === 0 ? '#00D2FF' : '#0066FF'}
                strokeWidth={rowIndex % 4 === 0 ? '2' : '1.2'}
                strokeDasharray="4 16"
                strokeOpacity={Math.max(0.12, 0.7 - rowIndex * 0.025)}
              />
            );
          })}
        </svg>
      </div>

      {/* =========================================================================
          THEME 4: ANGULAR PRISMATIC LIGHT BEAMS (Matching Image 5)
          ========================================================================= */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          activeSlide === 4 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <svg
          className="absolute inset-0 w-full h-full object-cover"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Deep chiseled background bevel planes */}
          <polygon points="0,0 850,0 450,1080 0,1080" fill="#06142a" />
          <polygon points="850,0 1550,0 1050,1080 450,1080" fill="#091e3e" />
          <polygon points="1550,0 1920,0 1920,1080 1050,1080" fill="#051022" />

          {/* Sharp Glowing Diagonal Laser Beams */}
          <line
            x1="850"
            y1="0"
            x2="450"
            y2="1080"
            stroke="#00A3FF"
            strokeWidth="3.5"
            strokeOpacity="0.8"
            filter="drop-shadow(0 0 12px #0066FF)"
          />
          <line
            x1="850"
            y1="0"
            x2="450"
            y2="1080"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeOpacity="0.9"
          />

          <line
            x1="1550"
            y1="0"
            x2="1050"
            y2="1080"
            stroke="#00D2FF"
            strokeWidth="2.5"
            strokeOpacity="0.65"
            filter="drop-shadow(0 0 10px #0066FF)"
          />

          {/* Prismatic ambient highlights */}
          <circle cx="850" cy="120" r="280" fill="#0066FF" opacity="0.22" filter="blur(70px)" />
          <circle cx="550" cy="800" r="320" fill="#00A3FF" opacity="0.25" filter="blur(80px)" />
        </svg>
      </div>

      {/* =========================================================================
          GLOBAL INTERACTIVE MOUSE SPOTLIGHT (100% Mathematically Centered on Mouse Cursor)
          ========================================================================= */}
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: `
            radial-gradient(130px circle at -1000px -1000px, rgba(0, 210, 255, 0.28) 0%, transparent 70%),
            radial-gradient(650px circle at -1000px -1000px, rgba(0, 102, 255, 0.22) 0%, rgba(0, 102, 255, 0.05) 45%, transparent 75%)
          `,
        }}
      />

      {/* HTML5 Canvas for connected node particles floating across scenes */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-50 z-20 pointer-events-none" />

    </div>
  );
};

