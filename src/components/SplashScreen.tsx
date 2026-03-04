"use client";
import { useState, useEffect } from "react";

export default function SplashScreen({ onEnter }: { onEnter: () => void }) {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [counter, setCounter] = useState(0);

  // Animate savings counter
  useEffect(() => {
    const target = 2840;
    const duration = 1800;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current = Math.min(current + increment, target);
      setCounter(Math.round(current));
      if (current >= target) clearInterval(interval);
    }, duration / steps);
    return () => clearInterval(interval);
  }, []);

  const handleEnter = () => {
    setExiting(true);
    setTimeout(() => { setVisible(false); onEnter(); }, 500);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center px-6 transition-all duration-500 ${
        exiting ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
      style={{ background: "linear-gradient(135deg,#0F172A 0%,#1E1B4B 50%,#0F172A 100%)" }}
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse"
          style={{ background: "radial-gradient(circle,#2563EB,transparent)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl animate-pulse"
          style={{ background: "radial-gradient(circle,#7C3AED,transparent)", animationDelay: "0.8s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl"
          style={{ background: "radial-gradient(circle,#06B6D4,transparent)" }} />
      </div>

      {/* Chicago skyline silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-10 pointer-events-none"
        style={{
          background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,120 L0,80 L40,80 L40,40 L60,40 L60,60 L80,60 L80,20 L100,20 L100,60 L120,60 L120,50 L140,50 L140,70 L160,70 L160,30 L180,30 L180,70 L200,70 L200,40 L220,40 L220,70 L240,70 L240,50 L260,50 L260,10 L280,10 L280,50 L300,50 L300,60 L320,60 L320,45 L340,45 L340,60 L360,60 L360,80 L400,80 L400,50 L420,50 L420,80 L440,80 L440,60 L460,60 L460,80 L500,80 L500,40 L520,40 L520,80 L540,80 L540,60 L560,60 L560,80 L600,80 L600,50 L620,50 L620,80 L640,80 L640,55 L660,55 L660,80 L680,80 L680,45 L700,45 L700,80 L720,80 L720,60 L740,60 L740,80 L760,80 L760,50 L780,50 L780,70 L800,70 L800,80 L840,80 L840,55 L860,55 L860,80 L880,80 L880,40 L900,40 L900,80 L920,80 L920,65 L940,65 L940,80 L960,80 L960,50 L980,50 L980,80 L1000,80 L1000,60 L1020,60 L1020,80 L1060,80 L1060,45 L1080,45 L1080,80 L1100,80 L1100,60 L1120,60 L1120,80 L1160,80 L1160,70 L1200,70 L1200,120 Z' fill='white'/%3E%3C/svg%3E") bottom/cover no-repeat`,
        }}
      />

      <div className="relative z-10 text-center max-w-lg mx-auto">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-2xl"
            style={{ background: "linear-gradient(135deg,#2563EB,#7C3AED)" }}>
            🌬
          </div>
          <div className="text-left">
            <div className="font-display text-[36px] font-black leading-none text-white tracking-tight">
              Windy<span style={{
                background: "linear-gradient(90deg,#60A5FA,#A78BFA)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>Wallet</span>
            </div>
            <div className="text-[11px] text-blue-300/70 tracking-[3px] uppercase mt-1">Chicago Loop · 2026</div>
          </div>
        </div>

        {/* Headline */}
        <h1 className="font-display text-[42px] sm:text-[52px] font-black text-white leading-[1.05] tracking-tight mb-4">
          Stop Overpaying<br />
          <span style={{
            background: "linear-gradient(90deg,#60A5FA,#A78BFA,#34D399)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            on Loop Life.
          </span>
        </h1>

        <p className="text-blue-200/70 text-[16px] leading-relaxed mb-8 max-w-sm mx-auto">
          Real Chicago pricing. Honest comparisons.<br />Built for the Loop. Built for you.
        </p>

        {/* Live counter */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-8 py-5 mb-8 inline-block">
          <p className="text-[11px] font-bold uppercase tracking-widest text-blue-300/60 mb-1">
            Loop residents save avg / year
          </p>
          <p className="font-display text-[52px] font-black text-white leading-none">
            ${counter.toLocaleString()}
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {["📱 Mobile","📡 Internet","🚇 Transit","🛡 Insurance","🏷 Discounts","🏙 Loop Tools"].map(t => (
            <span key={t}
              className="bg-white/10 border border-white/20 backdrop-blur rounded-full px-3 py-1.5 text-[12px] font-semibold text-white/80">
              {t}
            </span>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handleEnter}
          className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-full font-black text-[16px] text-white
            transition-all duration-200 hover:scale-105 hover:shadow-2xl active:scale-95"
          style={{ background: "linear-gradient(135deg,#2563EB 0%,#7C3AED 100%)" }}
        >
          <span>Analyze My Bills</span>
          <span className="group-hover:translate-x-1 transition-transform duration-200 text-xl">→</span>
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ background: "linear-gradient(135deg,#1D4ED8,#6D28D9)", zIndex: -1 }} />
        </button>

        <p className="text-white/30 text-[11px] mt-5">
          Free · No login · Chicago Loop only · Takes 2 minutes
        </p>
      </div>
    </div>
  );
}
