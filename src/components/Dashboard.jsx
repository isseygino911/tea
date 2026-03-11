import { useAuth } from '../context/AuthContext';
import { AdminDashboard } from './dashboard/AdminDashboard';
import { UserDashboard } from './dashboard/UserDashboard';
import { useState, useEffect } from 'react';
import { LoadingBar } from './ui/LoadingBar';

export const Dashboard = () => {
  const { user, authChecked } = useAuth();
  const [dashboardType, setDashboardType] = useState(null);

  // Lock in the dashboard type on first render to prevent switching during auth validation
  useEffect(() => {
    if (user && !dashboardType) {
      const isAdmin = user?.is_admin === true || user?.is_admin === 1;
      setDashboardType(isAdmin ? 'admin' : 'user');
    }
  }, [user, dashboardType]);

  // Show loading until we know which dashboard to render
  if (!dashboardType) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <LoadingBar text="Loading dashboard..." />
      </div>
    );
  }

  return dashboardType === 'admin' ? <AdminDashboard /> : <UserDashboard />;
};
