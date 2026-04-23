import { useState } from 'react';
import {
  BarChart3,
  CalendarClock,
  ChevronDown,
  KeyRound,
  LayoutGrid,
} from 'lucide-react';
import type { Route } from '../App';

type Props = { currentRoute: Route; onNavigate: (r: Route) => void };

export default function Sidebar({ currentRoute, onNavigate }: Props) {
  const [open, setOpen] = useState(true);
  const groupActive =
    currentRoute === 'master-employee' ||
    currentRoute === 'master-account' ||
    currentRoute === 'master-license' ||
    currentRoute === 'master-vendor' ||
    currentRoute === 'master-job-family' ||
    currentRoute === 'master-position' ||
    currentRoute === 'master-area';

  return (
    <aside className="hidden md:flex w-64 bg-white border-r border-gray-100 flex-shrink-0 flex-col">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-sm">
            <KeyRound className="w-4 h-4 text-white" />
          </div>
          <span className="text-gray-800 font-semibold text-sm tracking-wide">
            IAS <span className="text-teal-500">LICENSE CONTROL</span>
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-5">
        <div className="px-6 mb-3">
          <span className="text-[11px] font-semibold text-gray-400 tracking-[0.18em]">
            DASHBOARD
          </span>
        </div>

        <div className="px-3 mb-5 space-y-0.5">
          <button
            type="button"
            onClick={() => onNavigate('license-expiring')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              currentRoute === 'license-expiring'
                ? 'bg-teal-50 text-teal-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <CalendarClock className="w-4 h-4" />
            License Expiring
          </button>
          <button
            type="button"
            onClick={() => onNavigate('license-resume')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              currentRoute === 'license-resume'
                ? 'bg-teal-50 text-teal-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            License Resume
          </button>
        </div>

        <div className="px-6 mb-3">
          <span className="text-[11px] font-semibold text-gray-400 tracking-[0.18em]">
            MASTER DATA
          </span>
        </div>

        <div className="px-3">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              groupActive
                ? 'bg-teal-50 text-teal-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="inline-flex items-center gap-2.5">
              <LayoutGrid className="w-4 h-4" />
              Master Data
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${open ? '' : '-rotate-90'}`}
            />
          </button>

          {open && (
            <div className="mt-1 ml-5 pl-3 border-l border-gray-100 py-1 space-y-0.5">
              <SideLink
                active={currentRoute === 'master-employee'}
                onClick={() => onNavigate('master-employee')}
              >
                Master Employee
              </SideLink>
              <SideLink
                active={currentRoute === 'master-account'}
                onClick={() => onNavigate('master-account')}
              >
                Master Account
              </SideLink>
              <SideLink
                active={currentRoute === 'master-license'}
                onClick={() => onNavigate('master-license')}
              >
                Master License
              </SideLink>
              <SideLink
                active={currentRoute === 'master-vendor'}
                onClick={() => onNavigate('master-vendor')}
              >
                Master Vendor
              </SideLink>
              <SideLink
                active={currentRoute === 'master-job-family'}
                onClick={() => onNavigate('master-job-family')}
              >
                Master Job Family
              </SideLink>
              <SideLink
                active={currentRoute === 'master-position'}
                onClick={() => onNavigate('master-position')}
              >
                Master Jabatan
              </SideLink>
              <SideLink
                active={currentRoute === 'master-area'}
                onClick={() => onNavigate('master-area')}
              >
                Master Area
              </SideLink>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}

function SideLink({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left flex items-center gap-2 px-2 py-1.5 text-sm rounded transition-colors ${
        active
          ? 'text-teal-600 font-medium'
          : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      <span className="text-gray-300">–</span>
      {children}
    </button>
  );
}
