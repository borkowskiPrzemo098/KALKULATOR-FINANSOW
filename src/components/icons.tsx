import type { CSSProperties } from "react";

// Autorski, minimalny zestaw ikon liniowych (jeden grubość obrysu, jeden
// styl zakończeń) — świadomie zamiast emoji/glifów Unicode.
type IconProps = { className?: string; style?: CSSProperties };

export function MarkIcon({ className, style }: IconProps) {
  // Znak marki: stylizowany sejf/skarbiec — okrąg z pokrętłem.
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="12.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 8v2.2M16 21.8V24M8 16h2.2M21.8 16H24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowUpRightIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M6 14L14 6M14 6H7.5M14 6v6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowDownRightIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M6 6L14 14M14 14H7.5M14 14V7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlusIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function TrashIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M4.5 6h11M8.5 6V4.5h3V6M6 6l.6 9a1 1 0 001 .9h4.8a1 1 0 001-.9L14 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PencilIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M12.6 3.4a1.6 1.6 0 012.3 0l1.7 1.7a1.6 1.6 0 010 2.3L6.5 17.5l-4 1 1-4L12.6 3.4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M11 5l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function ShieldIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M10 2.5l6 2.2v4.6c0 4-2.6 6.9-6 8.2-3.4-1.3-6-4.2-6-8.2V4.7l6-2.2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7.3 10l2 2 3.4-3.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LogoutIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M8 17H5a1.5 1.5 0 01-1.5-1.5v-11A1.5 1.5 0 015 3h3M13.5 14l3.5-4-3.5-4M17 10H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LockIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} style={style} aria-hidden="true">
      <rect x="4.5" y="9" width="11" height="8" rx="1.6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.8 9V6.5a3.2 3.2 0 016.4 0V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ChevronLeftIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M12.5 5L7.5 10l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronRightIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M7.5 5l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function RepeatIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M4 9V7.5A2.5 2.5 0 016.5 5H15M15 5l-2.3-2.3M15 5l-2.3 2.3M16 11v1.5A2.5 2.5 0 0113.5 15H5M5 15l2.3-2.3M5 15l2.3 2.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TagIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M10.5 3.5H16a.5.5 0 01.5.5v5.5a1 1 0 01-.29.7l-6.3 6.3a1 1 0 01-1.42 0l-5.5-5.5a1 1 0 010-1.42l6.3-6.3a1 1 0 01.71-.29z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="13.2" cy="6.8" r="1.1" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

/* --- Ikony kategorii budżetowych — jeden spójny styl liniowy --- */

export function FoodIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M5 2.5v6a1.5 1.5 0 003 0v-6M6.5 2.5V9M8 2.5v6M13.5 2.5c-1.4 0-2.3 1.6-2.3 3.6 0 1.6.8 2.6 1.8 2.9V17M13.5 2.5v14.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HomeIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M3.5 9.5L10 3.5l6.5 6M5.5 8v8h9V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.3 16V11.8h3.4V16" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function CarIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M3 12.5l1.3-4.3A1.6 1.6 0 015.8 7h8.4a1.6 1.6 0 011.5 1.2l1.3 4.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="2.6" y="12.5" width="14.8" height="3.3" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="6" cy="15.8" r="1.1" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="14" cy="15.8" r="1.1" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function HeartPulseIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M3 8.4c0-2.3 1.8-3.9 3.9-3.9 1.2 0 2.3.6 3.1 1.6.8-1 1.9-1.6 3.1-1.6 2.1 0 3.9 1.6 3.9 3.9 0 3.6-4.2 6.4-7 8.4-2.8-2-7-4.8-7-8.4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M5 9.5h1.8l1-2 1.4 3.4 1-1.4h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PopcornIcon({ className, style }: IconProps) {
  // rozrywka
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M6.5 7h7l-.9 9a1 1 0 01-1 .9H8.4a1 1 0 01-1-.9l-.9-9z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M5.7 7a1.6 1.6 0 113.1-.7 1.6 1.6 0 013.1 0A1.6 1.6 0 1114.3 7" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M9 9.5l.4 6.5M11 9.5l-.4 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function BagIcon({ className, style }: IconProps) {
  // zakupy
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M5.5 6.5h9l.7 9.5a1 1 0 01-1 1.1H5.8a1 1 0 01-1-1.1l.7-9.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M7.3 6.5V5a2.7 2.7 0 015.4 0v1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function BoltIcon({ className, style }: IconProps) {
  // rachunki/media
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M11 2.5L4.5 11h4l-.8 6.5L15.5 9h-4l.5-6.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

export function BookIcon({ className, style }: IconProps) {
  // edukacja
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M10 5.2c-1-1-2.7-1.7-6-1.7v10.5c3.3 0 5 .7 6 1.7 1-1 2.7-1.7 6-1.7V3.5c-3.3 0-5 .7-6 1.7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M10 5.2v10.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function BriefcaseIcon({ className, style }: IconProps) {
  // wynagrodzenie / praca
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} style={style} aria-hidden="true">
      <rect x="3" y="6.5" width="14" height="9" rx="1.4" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 6.5V5a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0113 5v1.5M3 10.5h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function PiggyBankIcon({ className, style }: IconProps) {
  // oszczędności
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M4 10.5a5 5 0 015-4.8c2.1 0 3.3.9 4 1.8h1.5a1 1 0 011 1V11a1 1 0 01-1 1h-.8l-.7 2H10l-.5-1.5H8L7.5 14H5l-.5-2.2A2.7 2.7 0 014 10.5z" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round" />
      <circle cx="12.3" cy="9.3" r=".7" fill="currentColor" />
      <path d="M6 6.2l.5-1.7 1.4 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DotsIcon({ className, style }: IconProps) {
  // inne
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} style={style} aria-hidden="true">
      <circle cx="5" cy="10" r="1.2" fill="currentColor" />
      <circle cx="10" cy="10" r="1.2" fill="currentColor" />
      <circle cx="15" cy="10" r="1.2" fill="currentColor" />
    </svg>
  );
}

export const CATEGORY_ICONS = {
  food: FoodIcon,
  home: HomeIcon,
  car: CarIcon,
  health: HeartPulseIcon,
  entertainment: PopcornIcon,
  shopping: BagIcon,
  bills: BoltIcon,
  education: BookIcon,
  salary: BriefcaseIcon,
  savings: PiggyBankIcon,
  other: DotsIcon,
} as const;

export type CategoryIconKey = keyof typeof CATEGORY_ICONS;

export const CATEGORY_ICON_LABELS: Record<CategoryIconKey, string> = {
  food: "Jedzenie",
  home: "Dom",
  car: "Transport",
  health: "Zdrowie",
  entertainment: "Rozrywka",
  shopping: "Zakupy",
  bills: "Rachunki",
  education: "Edukacja",
  salary: "Wynagrodzenie",
  savings: "Oszczędności",
  other: "Inne",
};

export function CategoryIcon({
  icon,
  className,
  style,
}: {
  icon: string;
  className?: string;
  style?: CSSProperties;
}) {
  const Icon =
    CATEGORY_ICONS[icon as CategoryIconKey] ?? CATEGORY_ICONS.other;
  return <Icon className={className} style={style} />;
}
