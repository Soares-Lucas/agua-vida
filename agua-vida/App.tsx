import React, { useState, useEffect } from 'react';
import { User } from './types';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { mockUser } from './mockData';

const API_URL = process.env.API_URL || 'http://localhost:8000';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    // Set dark mode as default, but check user preference
    if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme') as 'light' | 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Assume backend is running on port 8000
        const response = await fetch(`${API_URL}/api/current_user`);
        if (response.ok) {
          const userData = await response.json();
          // Use functional update to avoid race condition with test drive login
          setUser(currentUser => currentUser ?? (userData && userData.id ? userData : null));
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleTestDriveLogin = () => {
    setUser(mockUser);
  };

  const handleLogout = () => {
    // This will be handled by navigating to the logout link, which clears the cookie
    // For test drive, it just returns to the login page.
    setUser(null);
  };
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-blue-950"><p className="text-slate-500">Carregando...</p></div>;
  }

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200">
      {user ? (
        <DashboardPage 
          user={user} 
          onLogout={handleLogout}
          isTestDrive={user.id === mockUser.id}
          theme={theme}
          onThemeToggle={toggleTheme}
        />
      ) : (
        <LoginPage onTestDriveLogin={handleTestDriveLogin} />
      )}
    </div>
  );
};

export default App;
