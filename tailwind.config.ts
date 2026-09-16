import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
import plugin from "tailwindcss/plugin";

// ── Theme-aware palette ──────────────────────────────────────
// Components use plain classes (bg-white, text-gray-900, bg-blue-50 …).
// Each palette color resolves to a CSS variable, and the `.dark` class on
// <html> swaps those variables — so every component gets dark mode without
// needing `dark:` variants. Wrap sections that already sit on a dark or
// brand background in `.light-palette` to keep their original colors.

const FAMILIES = [
  "slate", "gray", "red", "orange", "amber", "yellow", "green", "emerald",
  "teal", "cyan", "sky", "blue", "indigo", "violet", "purple", "pink", "rose",
] as const;
const SHADES = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] as const;

const DARK_SURFACE = "#12151c";

// Neutral scale for dark mode: low shades become dark surfaces/borders,
// high shades become light text.
const DARK_GRAY: Record<(typeof SHADES)[number], string> = {
  "50": "#1a1e27", "100": "#232833", "200": "#2e3441", "300": "#475063",
  "400": "#8a93a6", "500": "#a3abbc", "600": "#bcc3d1", "700": "#d3d8e2",
  "800": "#e3e7ee", "900": "#f1f3f7", "950": "#f8f9fb",
};

type Rgb = [number, number, number];
const toRgb = (hex: string): Rgb => {
  const h = hex.replace("#", "");
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)) as Rgb;
};
const channels = (hex: string) => toRgb(hex).join(" ");
// Blend `hex` over the dark surface at `amount` opacity, as a solid color
const tint = (hex: string, amount: number) => {
  const c = toRgb(hex), s = toRgb(DARK_SURFACE);
  return c.map((v, i) => Math.round(v * amount + s[i] * (1 - amount))).join(" ");
};

const varName = (family: string, shade: string) => `--ww-${family}-${shade}`;

function lightVars() {
  const vars: Record<string, string> = {
    "--ww-surface": channels("#ffffff"),
    "--ww-primary-light": channels("#EFF6FF"),
    "--ww-primary-mid": channels("#BFDBFE"),
    "--ww-accent-light": channels("#F5F3FF"),
  };
  for (const f of FAMILIES) {
    const scale = colors[f] as Record<string, string>;
    for (const s of SHADES) vars[varName(f, s)] = channels(scale[s]);
  }
  return vars;
}

function darkVars() {
  const vars: Record<string, string> = {
    "--ww-surface": channels(DARK_SURFACE),
    "--ww-primary-light": tint(colors.blue[500], 0.14),
    "--ww-primary-mid": tint(colors.blue[500], 0.35),
    "--ww-accent-light": tint(colors.violet[500], 0.14),
  };
  for (const f of FAMILIES) {
    const scale = colors[f] as Record<string, string>;
    const neutral = f === "gray" || f === "slate";
    for (const s of SHADES) {
      let value: string;
      if (neutral) value = channels(DARK_GRAY[s]);
      else if (s === "50")  value = tint(scale["500"], 0.12);
      else if (s === "100") value = tint(scale["500"], 0.2);
      else if (s === "200") value = tint(scale["500"], 0.32);
      else if (s === "300") value = tint(scale["400"], 0.6);
      else if (s === "700") value = channels(scale["300"]);
      else if (s === "800") value = channels(scale["200"]);
      else if (s === "900") value = channels(scale["100"]);
      else if (s === "950") value = channels(scale["50"]);
      else value = channels(scale[s]); // 400–600 read well on both themes
      vars[varName(f, s)] = value;
    }
  }
  return vars;
}

const themeColor = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const paletteColors = Object.fromEntries(
  FAMILIES.map(f => [f, Object.fromEntries(SHADES.map(s => [s, themeColor(varName(f, s))]))]),
);

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        display: ["Sora", "sans-serif"],
      },
      colors: {
        ...paletteColors,
        primary: { DEFAULT: "#2563EB", light: themeColor("--ww-primary-light"), mid: themeColor("--ww-primary-mid") },
        accent:  { DEFAULT: "#7C3AED", light: themeColor("--ww-accent-light") },
      },
      // Only white *surfaces* follow the theme; text-white stays white
      backgroundColor: { white: themeColor("--ww-surface") },
      borderColor: { white: themeColor("--ww-surface") },
      boxShadow: {
        card: "0 4px 16px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
        hover: "0 12px 40px rgba(37,99,235,0.10), 0 4px 12px rgba(0,0,0,0.06)",
        btn:   "0 4px 14px rgba(37,99,235,0.35)",
        accentbtn: "0 4px 14px rgba(124,58,237,0.30)",
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      const light = lightVars();
      addBase({
        ":root": { ...light, colorScheme: "light" },
        ":root.dark": { ...darkVars(), colorScheme: "dark" },
        ".light-palette": light,
        "@media print": { ":root.dark": { ...light, colorScheme: "light" } },
      });
    }),
  ],
};
export default config;
