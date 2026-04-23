import { Bell, FileText, LogOut } from 'lucide-react';
import type { Route } from '../App';
import Sidebar from './Sidebar';
import { useAuth } from '../lib/auth';

type Props = {
  children: React.ReactNode;
  currentRoute: Route;
  onNavigate: (r: Route) => void;
};

export default function AppLayout({ children, currentRoute, onNavigate }: Props) {
  const { signOut } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar currentRoute={currentRoute} onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-100">
          <div className="flex items-center justify-end gap-4 px-6 py-3">
            <button
              type="button"
              className="relative p-1.5 text-gray-500 hover:text-gray-700"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full px-1.5 min-w-[18px] h-[18px] flex items-center justify-center">
                145
              </span>
            </button>

            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <span className="text-sm text-gray-600 hidden sm:inline">
                Hi, <span className="text-teal-600 font-medium">Aldhytya Nugraha</span>
              </span>
              <div className="w-8 h-8 bg-teal-400 text-white font-semibold rounded-md flex items-center justify-center text-sm">
                A
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
