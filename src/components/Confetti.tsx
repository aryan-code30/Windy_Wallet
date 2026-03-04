"use client";
import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  life: number;
  maxLife: number;
  shape: "rect" | "circle" | "star";
}

export default function Confetti({ trigger }: { trigger: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const firedRef = useRef(false);

  const COLORS = ["#2563EB","#7C3AED","#10B981","#F59E0B","#EF4444","#EC4899","#06B6D4","#84CC16"];

  const spawnBurst = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const count = 140;
    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const speed = 4 + Math.random() * 8;
      particles.current.push({
        x: w / 2 + (Math.random() - 0.5) * 200,
        y: -10,
        vx: Math.cos(angle) * speed * 0.7,
        vy: Math.sin(angle) * speed * 0.5 + 3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 5 + Math.random() * 8,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        life: 0,
        maxLife: 120 + Math.random() * 80,
        shape: ["rect","circle","star"][Math.floor(Math.random() * 3)] as Particle["shape"],
      });
    }
  };

  const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) => {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const outerAngle = (i * Math.PI * 2) / 5 - Math.PI / 2;
      const innerAngle = outerAngle + Math.PI / 5;
      if (i === 0) ctx.moveTo(cx + Math.cos(outerAngle) * r, cy + Math.sin(outerAngle) * r);
      else ctx.lineTo(cx + Math.cos(outerAngle) * r, cy + Math.sin(outerAngle) * r);
      ctx.lineTo(cx + Math.cos(innerAngle) * r * 0.4, cy + Math.sin(innerAngle) * r * 0.4);
    }
    ctx.closePath();
    ctx.fill();
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.current = particles.current.filter(p => {
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.18; // gravity
      p.vx *= 0.99;
      p.rotation += p.rotationSpeed;

      const alpha = Math.max(0, 1 - p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      if (p.shape === "rect") {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else if (p.shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        drawStar(ctx, 0, 0, p.size / 2);
      }
      ctx.restore();

      return p.life < p.maxLife && p.y < canvas.height + 20;
    });

    if (particles.current.length > 0) {
      animRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    if (trigger && !firedRef.current) {
      firedRef.current = true;
      spawnBurst();
      setTimeout(spawnBurst, 300);
      setTimeout(spawnBurst, 600);
      animRef.current = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [trigger]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[90]"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
