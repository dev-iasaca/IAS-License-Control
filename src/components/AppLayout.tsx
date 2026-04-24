import { useEffect, useMemo, useRef, useState } from 'react';
import { Bell, FileText, LogOut } from 'lucide-react';
import type { Route } from '../App';
import Sidebar from './Sidebar';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { fetchExpiringLicenses, type ExpiringLicense } from '../lib/license-expiring-data';

type Props = {
  children: React.ReactNode;
  currentRoute: Route;
  onNavigate: (r: Route) => void;
};

function initialOf(name: string): string {
  const trimmed = name.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : '?';
}

export default function AppLayout({ children, currentRoute, onNavigate }: Props) {
  const { user, signOut } = useAuth();
  const [displayName, setDisplayName] = useState<string>('');
  const [warnings, setWarnings] = useState<ExpiringLicense[]>([]);
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    const email = user?.email ?? '';
    const metaName = (user?.user_metadata?.full_name as string | undefined) ?? '';
    const fallback = metaName || (email ? email.split('@')[0] : '');
    setDisplayName(fallback);
    if (!email) return;
    (async () => {
      const { data } = await supabase
        .from('accounts')
        .select('username, full_name')
        .eq('email', email)
        .maybeSingle<{ username: string | null; full_name: string | null }>();
      if (cancelled) return;
      const accountName = data?.full_name?.trim() || data?.username?.trim() || '';
      if (accountName) setDisplayName(accountName);
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await fetchExpiringLicenses();
        if (cancelled) return;
        setWarnings(rows.filter((r) => r.monthsRemaining > 0 && r.monthsRemaining <= 3));
      } catch {
        if (!cancelled) setWarnings([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!bellOpen) return;
    const handler = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [bellOpen]);

  const warningCount = warnings.length;
  const initial = useMemo(() => initialOf(displayName), [displayName]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar currentRoute={currentRoute} onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-100">
          <div className="flex items-center justify-end gap-4 px-6 py-3">
            <div className="relative" ref={bellRef}>
              <button
                type="button"
                onClick={() => setBellOpen((v) => !v)}
                className="relative p-1.5 text-gray-500 hover:text-gray-700"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {warningCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full px-1.5 min-w-[18px] h-[18px] flex items-center justify-center">
                    {warningCount > 99 ? '99+' : warningCount}
                  </span>
                )}
              </button>

              {bellOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-lg shadow-lg z-30 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Warning Licenses</span>
                    <span className="text-xs text-gray-400">≤ 3 bulan</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {warningCount === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-gray-500">
                        Tidak ada license dengan status warning.
                      </div>
                    ) : (
                      warnings.map((w) => (
                        <button
                          key={w.id}
                          type="button"
                          onClick={() => {
                            setBellOpen(false);
                            onNavigate('license-expiring');
                          }}
                          className="w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="text-xs font-medium text-gray-800 truncate">
                                {w.name || w.nik || '-'}
                              </div>
                              <div className="text-[11px] text-gray-500 truncate">
                                {w.licenseName || '-'}
                              </div>
                              <div className="text-[11px] text-gray-400 mt-0.5">
                                Berakhir: {w.endDate || '-'}
                              </div>
                            </div>
                            <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700">
                              {w.monthsRemaining} Bulan
                            </span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <span className="text-sm text-gray-600 hidden sm:inline">
                Hi, <span className="text-teal-600 font-medium">{displayName || '...'}</span>
              </span>
              <div className="w-8 h-8 bg-teal-400 text-white font-semibold rounded-md flex items-center justify-center text-sm">
                {initial}
              </div>
              <button
                type="button"
                onClick={() => {
                  void signOut();
                }}
                className="ml-1 p-1.5 text-gray-400 hover:text-gray-600"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="bg-white border-t border-gray-100 mt-6">
          <div className="flex items-center justify-between px-6 py-3 text-xs text-gray-500">
            <div className="flex items-center gap-5">
              <span className="inline-flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Digi HC Policy
              </span>
              <a className="hover:text-gray-700" href="#">Handbook</a>
              <a className="hover:text-gray-700" href="#">FAQ</a>
            </div>
            <span>© 2026</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
