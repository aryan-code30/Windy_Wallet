"use client";
import { type ReactNode, type InputHTMLAttributes, type SelectHTMLAttributes } from "react";

/* ── Card ────────────────────────────────────────────── */
export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-card p-7 mb-5 transition-shadow hover:shadow-hover ${className}`}>
      {children}
    </div>
  );
}

/* ── CardLabel ───────────────────────────────────────── */
export function CardLabel({ icon, children }: { icon?: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-[10.5px] font-bold text-gray-400 tracking-[1.3px] uppercase mb-5">
      {icon && (
        <span className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center text-sm flex-shrink-0">
          {icon}
        </span>
      )}
      {children}
    </div>
  );
}

/* ── Eyebrow ─────────────────────────────────────────── */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-1.5 bg-blue-50 text-primary rounded-full px-3 py-1 text-xs font-semibold mb-3">
      {children}
    </div>
  );
}

/* ── PageTitle + Grad ────────────────────────────────── */
export function PageTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-display text-[34px] leading-[1.12] font-extrabold tracking-tight text-gray-900 mb-2.5">
      {children}
    </h1>
  );
}
export function Grad({ children }: { children: ReactNode }) {
  return (
    <span style={{ background:"linear-gradient(90deg,#2563EB,#7C3AED)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
      {children}
    </span>
  );
}

/* ── Subtitle ────────────────────────────────────────── */
export function Subtitle({ children }: { children: ReactNode }) {
  return <p className="text-[15px] text-gray-500 leading-relaxed mb-8 max-w-xl">{children}</p>;
}

/* ── 2-column grid (responsive) ─────────────────────── */
export function Grid2({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

/* ── Field ───────────────────────────────────────────── */
export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-semibold text-gray-800 leading-none">{label}</label>
      {hint && <span className="text-[11px] text-gray-400">{hint}</span>}
      {children}
    </div>
  );
}

/* ── Input ───────────────────────────────────────────── */
type InputProps = InputHTMLAttributes<HTMLInputElement> & { dollar?: boolean };
export function Input({ dollar, className = "", ...props }: InputProps) {
  return (
    <div className="relative">
      {dollar && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400 pointer-events-none z-10">$</span>
      )}
      <input
        className={`w-full h-[42px] bg-gray-50 border border-transparent rounded-xl text-[14px] font-medium text-gray-900
          focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all
          ${dollar ? "pl-7 pr-3.5" : "px-3.5"} ${className}`}
        {...props}
      />
    </div>
  );
}

/* ── Select ──────────────────────────────────────────── */
type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode };
export function Select({ children, className = "", ...props }: SelectProps) {
  return (
    <select
      className={`w-full h-[42px] bg-gray-50 border border-transparent rounded-xl pl-3.5 pr-9 text-[14px] font-medium text-gray-900
        appearance-none cursor-pointer focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239CA3AF' stroke-width='1.8' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat", backgroundPosition: "right 13px center",
      }}
      {...props}
    >
      {children}
    </select>
  );
}

/* ── Toggle ──────────────────────────────────────────── */
export function Toggle({ checked, onChange, label, sub }: {
  checked: boolean; onChange: (v: boolean) => void; label: string; sub?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-gray-100 last:border-b-0">
      <div>
        <p className="text-[13.5px] font-semibold text-gray-900">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
        style={{ background: checked ? "#2563EB" : "#E5E7EB" }}
        role="switch" aria-checked={checked}
      >
        <span
          className="absolute top-[3px] w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-all duration-200"
          style={{ left: checked ? 23 : 3 }}
        />
      </button>
    </div>
  );
}

/* ── CheckCard ───────────────────────────────────────── */
export function CheckCard({ checked, onClick, emoji, label, sub, badge }: {
  checked: boolean; onClick: () => void;
  emoji: string; label: string; sub?: string; badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start gap-3 text-left p-4 rounded-xl border-[1.5px] transition-all duration-200 w-full
        ${checked ? "bg-blue-50 border-primary" : "bg-gray-50 border-transparent hover:border-gray-200 hover:bg-gray-100"}`}
    >
      <div className={`w-[18px] h-[18px] rounded-md flex-shrink-0 flex items-center justify-center mt-0.5 transition-all
        ${checked ? "bg-primary text-white" : "border-2 border-gray-300"}`}
        style={{ fontSize: 10, fontWeight: 700 }}>
        {checked ? "✓" : ""}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] font-semibold text-gray-900">{emoji} {label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5 leading-snug">{sub}</p>}
        {badge && (
          <span className="inline-block mt-1.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
    </button>
  );
}

/* ── Notice ──────────────────────────────────────────── */
const NOTICE: Record<string, string> = {
  info:    "bg-blue-50 text-blue-700 border-blue-100",
  error:   "bg-red-50 text-red-700 border-red-100",
  success: "bg-emerald-50 text-emerald-700 border-emerald-100",
  warning: "bg-amber-50 text-amber-800 border-amber-100",
};
export function Notice({ type="info", icon, className = "", children }: {
  type?: "info"|"error"|"success"|"warning"; icon?: string; className?: string; children: ReactNode;
}) {
  return (
    <div className={`flex items-start gap-2.5 px-4 py-3.5 rounded-xl border text-[13px] font-medium mb-4 ${NOTICE[type]} ${className}`}>
      {icon && <span className="flex-shrink-0 text-base mt-0.5">{icon}</span>}
      <span className="leading-snug">{children}</span>
    </div>
  );
}

/* ── Skeleton loader ─────────────────────────────────── */
export function Skeleton({ h = "h-5", w = "w-full", rounded = "rounded-lg", className = "" }: {
  h?: string; w?: string; rounded?: string; className?: string;
}) {
  return <div className={`${h} ${w} ${rounded} bg-gray-100 animate-pulse ${className}`} />;
}

/* ── Button ──────────────────────────────────────────── */
const BTN: Record<string, string> = {
  primary:   "text-white shadow-btn hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0",
  secondary: "bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100 hover:text-gray-700",
  accent:    "text-white hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0",
};
export function Btn({ variant="primary", children, className="", disabled, ...props }: {
  variant?: "primary"|"secondary"|"accent"; children: ReactNode;
  className?: string; disabled?: boolean; [k: string]: any;
}) {
  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-[13.5px]
        transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/30
        disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none
        ${BTN[variant]} ${className}`}
      style={
        variant === "primary"
          ? { background: "linear-gradient(135deg,#2563EB,#1D4ED8)" }
          : variant === "accent"
          ? { background: "linear-gradient(135deg,#7C3AED,#6D28D9)" }
          : undefined
      }
      {...props}
    >
      {children}
    </button>
  );
}

/* ── BtnRow ──────────────────────────────────────────── */
export function BtnRow({ children, center }: { children: ReactNode; center?: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 mt-8 ${center ? "justify-center" : "justify-end"}`}>
      {children}
    </div>
  );
}

/* ── Divider ─────────────────────────────────────────── */
export function Divider() {
  return <div className="h-px bg-gray-100 my-5" />;
}
