import type { AccentColor } from './shared';

const BAR_BG: Record<AccentColor, string> = {
  teal: 'bg-teal-500',
  emerald: 'bg-emerald-500',
  sky: 'bg-sky-500',
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
};

export type BarItem = {
  label: string;
  value: number;
  color?: AccentColor;
  suffix?: string;
};

type Props = {
  items: BarItem[];
  defaultColor?: AccentColor;
  labelWidth?: string;
};

export default function BarList({ items, defaultColor = 'teal', labelWidth = 'w-48' }: Props) {
  const max = items.reduce((m, i) => Math.max(m, i.value), 0) || 1;

  return (
    <div className="space-y-2.5">
      {items.map((item, i) => {
        const pct = Math.max(4, Math.round((item.value / max) * 100));
        const color = item.color ?? defaultColor;
        return (
          <div key={`${item.label}-${i}`} className="flex items-center gap-3 text-xs">
            <div className={`${labelWidth} flex-shrink-0 text-gray-600 truncate`} title={item.label}>
              {item.label}
            </div>
            <div className="flex-1 bg-gray-100 rounded-sm h-6 overflow-hidden">
              <div
                className={`h-full ${BAR_BG[color]} rounded-sm flex items-center justify-end px-2 transition-all`}
                style={{ width: `${pct}%` }}
              >
                <span className="text-[11px] font-medium text-white whitespace-nowrap">
                  {item.value}
                  {item.suffix ?? ''}
                </span>
              </div>
            </div>
          </div>
        );
      })}
      {items.length === 0 && (
        <div className="text-center text-xs text-gray-400 py-6">Tidak ada data.</div>
      )}
    </div>
  );
}
