import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Plane, BookOpen, Users, BarChart3, ClipboardCheck, Bell, LogOut, Menu, X, ChevronRight, Home } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  const { currentUser, logout, notifications } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  if (!currentUser) return <>{children}</>;

  const unreadCount = notifications.filter(n => n.userId === currentUser.id && !n.read).length;

  const listenerLinks = [
    { to: '/dashboard', label: 'Мой прогресс', icon: Home },
    { to: '/chapter/ch1', label: 'Глава 1', icon: BookOpen },
    { to: '/chapter/ch2', label: 'Глава 2', icon: BookOpen },
    { to: '/chapter/ch3', label: 'Глава 3', icon: BookOpen },
    { to: '/chapter/ch4', label: 'Глава 4', icon: BookOpen },
    { to: '/chapter/ch5', label: 'Глава 5', icon: BookOpen },
    { to: '/chapter/ch6', label: 'Глава 6', icon: BookOpen },
  ];

  const expertLinks = [
    { to: '/expert/queue', label: 'Очередь проверок', icon: ClipboardCheck },
  ];

  const adminLinks = [
    { to: '/admin/users', label: 'Пользователи', icon: Users },
    { to: '/admin/analytics', label: 'Аналитика', icon: BarChart3 },
    { to: '/admin/content', label: 'Контент', icon: BookOpen },
  ];

  const links = currentUser.role === 'LISTENER' ? listenerLinks :
    currentUser.role === 'EXPERT' ? expertLinks : adminLinks;

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 to-slate-800 text-white transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}>
        <div className="p-5 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Plane className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-sm">SkyAnalytics LMS</h1>
              <p className="text-xs text-slate-400">Авиа — Обучение</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                location.pathname === link.to || location.pathname.startsWith(link.to + '/')
                  ? 'bg-blue-600/30 text-blue-300'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-xs font-bold">
              {currentUser.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{currentUser.fullName}</p>
              <p className="text-xs text-slate-400">
                {currentUser.role === 'LISTENER' ? 'Слушатель' : currentUser.role === 'EXPERT' ? 'Эксперт' : 'Администратор'}
              </p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors w-full">
            <LogOut className="w-4 h-4" /> Выйти
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
              <ChevronRight className="w-4 h-4" />
              <span className="capitalize">
                {currentUser.role === 'LISTENER' ? 'Кабинет слушателя' : currentUser.role === 'EXPERT' ? 'Кабинет эксперта' : 'Панель администратора'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-slate-100 rounded-lg relative"
              >
                <Bell className="w-5 h-5 text-slate-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
                  <div className="p-3 border-b border-slate-100 font-semibold text-sm">Уведомления</div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.filter(n => n.userId === currentUser.id).length === 0 ? (
                      <p className="p-4 text-sm text-slate-500 text-center">Нет уведомлений</p>
                    ) : (
                      notifications.filter(n => n.userId === currentUser.id).map(n => (
                        <div key={n.id} className={`p-3 border-b border-slate-50 text-sm ${!n.read ? 'bg-blue-50' : ''}`}>
                          <p className="font-medium text-slate-800">{n.title}</p>
                          <p className="text-slate-500 text-xs mt-0.5">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
