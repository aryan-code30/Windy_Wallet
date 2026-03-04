"use client";
import { useEffect, useRef, useState } from "react";

interface Props {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export default function CountUp({ value, duration = 1200, prefix = "", suffix = "", decimals = 2, className = "" }: Props) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);
  const startValRef = useRef(0);

  useEffect(() => {
    startValRef.current = display;
    startRef.current = null;
    cancelAnimationFrame(frameRef.current);

    const target = value;
    const from = startValRef.current;

    const tick = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (target - from) * eased;
      setDisplay(current);
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value]);

  return (
    <span className={className}>
      {prefix}{display.toFixed(decimals)}{suffix}
    </span>
  );
}
