"use client";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type ViewMode = "desktop" | "mobile";

interface ViewModeCtx {
  mode: ViewMode;
  setMode: (m: ViewMode) => void;
}

const Ctx = createContext<ViewModeCtx>({ mode: "desktop", setMode: () => {} });

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ViewMode>("desktop");

  // Read from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ww_view_mode") as ViewMode | null;
      if (saved === "mobile" || saved === "desktop") setModeState(saved);
    } catch {}
  }, []);

  const setMode = (m: ViewMode) => {
    setModeState(m);
    try { localStorage.setItem("ww_view_mode", m); } catch {}
  };

  return <Ctx.Provider value={{ mode, setMode }}>{children}</Ctx.Provider>;
}

export const useViewMode = () => useContext(Ctx);
