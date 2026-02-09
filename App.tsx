
import React, { useState, useEffect, useCallback } from 'react';
import { User, Transaction, Budget, Note, Theme, CustomTheme } from './types';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';
import BudgetPage from './pages/BudgetPage';
import Chat from './pages/Chat';
import Notes from './pages/Notes';
import Friends from './pages/Friends';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

interface Toast {
  message: string;
  type: 'info' | 'success' | 'warning';
  id: number;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('smartspend_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [view, setView] = useState<'dashboard' | 'transactions' | 'budget' | 'profile' | 'chat' | 'notes' | 'friends'>('dashboard');
  const [isAuth, setIsAuth] = useState<'login' | 'signup'>(user ? 'login' : 'login');
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('smartspend_theme');
    return (saved as Theme) || Theme.DARK;
  });

  const [customThemes, setCustomThemes] = useState<CustomTheme[]>(() => {
    const saved = localStorage.getItem('smartspend_custom_themes');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeCustomThemeId, setActiveCustomThemeId] = useState<string | null>(() => {
    return localStorage.getItem('smartspend_active_custom_id');
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('smartspend_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('smartspend_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('smartspend_theme', theme);
    localStorage.setItem('smartspend_custom_themes', JSON.stringify(customThemes));
    if (activeCustomThemeId) {
      localStorage.setItem('smartspend_active_custom_id', activeCustomThemeId);
    }
  }, [theme, customThemes, activeCustomThemeId]);

  const notify = useCallback((message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { message, type, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const handleLogout = () => {
    setUser(null);
    setView('dashboard');
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const currentCustomTheme = theme === Theme.CUSTOM ? customThemes.find(t => t.id === activeCustomThemeId) : null;

  if (!user) {
    return isAuth === 'login' ? (
      <Login onLogin={setUser} onSwitch={() => setIsAuth('signup')} />
    ) : (
      <Signup onSignup={setUser} onSwitch={() => setIsAuth('login')} />
    );
  }

  const renderView = () => {
    switch (view) {
      case 'dashboard': return <Dashboard user={user} setView={setView} />;
      case 'transactions': return <Transactions user={user} />;
      case 'budget': return <BudgetPage user={user} setUser={handleUserUpdate} />;
      case 'profile': return (
        <Profile 
          user={user} 
          onLogout={handleLogout} 
          onUpdateUser={handleUserUpdate} 
          theme={theme} 
          setTheme={setTheme} 
          customThemes={customThemes}
          setCustomThemes={setCustomThemes}
          activeCustomThemeId={activeCustomThemeId}
          setActiveCustomThemeId={setActiveCustomThemeId}
        />
      );
      case 'chat': return <Chat user={user} />;
      case 'notes': return <Notes user={user} />;
      case 'friends': return <Friends user={user} onNotify={notify} />;
      default: return <Dashboard user={user} setView={setView} />;
    }
  };

  const getThemeClasses = () => {
    if (theme === Theme.CUSTOM && currentCustomTheme) {
      return ''; 
    }
    switch (theme) {
      case Theme.LIGHT: return 'bg-slate-50 text-slate-900';
      case Theme.NEON: return 'bg-indigo-950 text-indigo-100';
      case Theme.CYBERPUNK: return 'bg-black text-yellow-400';
      case Theme.LUXURY: return 'bg-[#0a0a0a] text-[#d4af37]';
      case Theme.ATLANTIS: return 'bg-[#002b36] text-[#2aa198]';
      case Theme.MARS: return 'bg-[#1a0505] text-[#ff4d4d]';
      case Theme.LAVENDER: return 'bg-[#120a1a] text-[#e0b0ff]';
      case Theme.DARK:
      default: return 'bg-slate-950 text-slate-100';
    }
  };

  const customStyles = currentCustomTheme ? {
    backgroundColor: currentCustomTheme.bg,
    color: currentCustomTheme.text,
    '--accent-color': currentCustomTheme.accent,
  } as React.CSSProperties : {};

  return (
    <div 
      className={`flex h-screen overflow-hidden transition-all duration-500 ease-in-out ${getThemeClasses()}`}
      style={customStyles}
    >
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[50] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <Sidebar 
        currentView={view} 
        setView={(v) => { setView(v); setIsMobileMenuOpen(false); }} 
        user={user} 
        onLogout={handleLogout} 
        isOpen={isMobileMenuOpen}
      />
      
      <div className="fixed top-20 right-4 sm:right-6 z-[100] flex flex-col gap-3 pointer-events-none w-full max-w-[calc(100%-2rem)] sm:max-w-xs">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={`pointer-events-auto px-6 py-4 rounded-2xl glass border border-white/10 shadow-2xl animate-in slide-in-from-right duration-300 flex items-center space-x-3 w-full ${
              toast.type === 'success' ? 'border-emerald-500/50' : 
              toast.type === 'warning' ? 'border-rose-500/50' : 'border-sky-500/50'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              toast.type === 'success' ? 'bg-emerald-600/20 text-emerald-400' : 
              toast.type === 'warning' ? 'bg-rose-600/20 text-rose-400' : 'bg-sky-600/20 text-sky-400'
            }`}>
              <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : toast.type === 'warning' ? 'fa-exclamation-circle' : 'fa-bell'}`}></i>
            </div>
            <div className="min-w-0">
              <p className="text-inherit font-bold text-sm truncate">{toast.message}</p>
              <p className="text-[10px] opacity-50 uppercase font-black tracking-widest mt-0.5">Notification</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          user={user} 
          setView={setView} 
          theme={theme} 
          setTheme={setTheme} 
          toggleMobileMenu={() => setIsMobileMenuOpen(true)} 
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide">
          <div className="max-w-6xl mx-auto h-full pb-20 md:pb-0">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
