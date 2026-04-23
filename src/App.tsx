import { useEffect, useState } from 'react';
import LoginPage from './pages/LoginPage';
import RoleSelectPage from './pages/RoleSelectPage';
import MasterEmployeePage from './pages/MasterEmployeePage';
import MasterAccountPage from './pages/MasterAccountPage';
import MasterLicensePage from './pages/MasterLicensePage';
import MasterVendorPage from './pages/MasterVendorPage';
import MasterJobFamilyPage from './pages/MasterJobFamilyPage';
import MasterPositionPage from './pages/MasterPositionPage';
import MasterAreaPage from './pages/MasterAreaPage';
import LicenseExpiringPage from './pages/LicenseExpiringPage';
import LicenseResumePage from './pages/LicenseResumePage';
import { useAuth } from './lib/auth';

export type Route =
  | 'login'
  | 'role-select'
  | 'license-expiring'
  | 'license-resume'
  | 'master-employee'
  | 'master-account'
  | 'master-license'
  | 'master-vendor'
  | 'master-job-family'
  | 'master-position'
  | 'master-area';

const HOME: Route = 'license-expiring';

function App() {
  const { session, loading } = useAuth();
  const [route, setRoute] = useState<Route>('login');

  useEffect(() => {
    if (loading) return;
    if (!session && route !== 'login') {
      setRoute('login');
    } else if (session && route === 'login') {
      setRoute(HOME);
    }
  }, [session, loading, route]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-sm text-gray-500">Memuat sesi...</div>
      </div>
    );
  }

  if (!session) {
    return <LoginPage />;
  }

  if (route === 'role-select') {
    return (
      <RoleSelectPage
        onSelect={() => setRoute(HOME)}
        onBack={() => setRoute('login')}
      />
    );
  }
  if (route === 'master-employee') {
    return <MasterEmployeePage currentRoute={route} onNavigate={setRoute} />;
  }
  if (route === 'master-account') {
    return <MasterAccountPage currentRoute={route} onNavigate={setRoute} />;
  }
  if (route === 'master-license') {
    return <MasterLicensePage currentRoute={route} onNavigate={setRoute} />;
  }
  if (route === 'master-vendor') {
    return <MasterVendorPage currentRoute={route} onNavigate={setRoute} />;
  }
  if (route === 'master-job-family') {
    return <MasterJobFamilyPage currentRoute={route} onNavigate={setRoute} />;
  }
  if (route === 'master-position') {
    return <MasterPositionPage currentRoute={route} onNavigate={setRoute} />;
  }
  if (route === 'master-area') {
    return <MasterAreaPage currentRoute={route} onNavigate={setRoute} />;
  }
  if (route === 'license-resume') {
    return <LicenseResumePage currentRoute={route} onNavigate={setRoute} />;
  }
  return <LicenseExpiringPage currentRoute={route} onNavigate={setRoute} />;
}

export default App;
