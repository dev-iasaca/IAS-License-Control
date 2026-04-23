import type { LucideIcon } from 'lucide-react';
import { ChevronDown, X } from 'lucide-react';

export type AccentColor = 'teal' | 'emerald' | 'sky' | 'blue' | 'amber' | 'rose';

const BTN_BG: Record<AccentColor, string> = {
  teal: 'bg-teal-500 hover:bg-teal-600',
  emerald: 'bg-emerald-500 hover:bg-emerald-600',
  sky: 'bg-sky-500 hover:bg-sky-600',
  blue: 'bg-blue-500 hover:bg-blue-600',
  amber: 'bg-amber-500 hover:bg-amber-600',
  rose: 'bg-rose-500 hover:bg-rose-600',
};

const BADGE_BG: Record<AccentColor, string> = {
  teal: 'bg-teal-50 text-teal-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  sky: 'bg-sky-50 text-sky-600',
  blue: 'bg-blue-50 text-blue-600',
  amber: 'bg-amber-50 text-amber-700',
  rose: 'bg-rose-50 text-rose-600',
};

export function ActionBtn({
  icon: Icon,
  color,
  children,
  onClick,
}: {
  icon: LucideIcon;
  color: AccentColor;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 text-white text-xs font-medium px-3.5 py-2 rounded-md shadow-sm transition-colors ${BTN_BG[color]}`}
    >
      <Icon className="w-4 h-4" />
      {children}
    </button>
  );
}

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5">
      {children}
    </div>
  );
}

type FilterInputProps = { label?: string; chip?: string };

export function FilterInput({ label, chip }: FilterInputProps) {
  if (chip) {
    return (
      <div className="flex items-center justify-between w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-md">
        <span className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-700 px-2 py-0.5 rounded">
          <X className="w-3 h-3 text-gray-400" /> {chip}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
      </div>
    );
  }
  if (!label) return <div />;
  return (
    <button
      type="button"
      className="flex items-center justify-between w-full px-3 py-2 text-xs text-gray-400 bg-white border border-gray-200 rounded-md hover:border-gray-300"
    >
      <span>{label}</span>
      <ChevronDown className="w-3.5 h-3.5" />
    </button>
  );
}

export function Badge({
  color = 'teal',
  children,
}: {
  color?: AccentColor;
  children: React.ReactNode;
}) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${BADGE_BG[color]}`}>
      {children}
    </span>
  );
}
