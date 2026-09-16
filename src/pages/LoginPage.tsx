import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Plane, Shield, BookOpen, Users } from 'lucide-react';

export function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string>('listener');

  const roleEmails: Record<string, string> = {
    listener: 'listener1@airline.ru',
    expert: 'expert1@airline.ru',
    admin: 'admin@airline.ru',
  };

  const handleLogin = () => {
    login(roleEmails[selectedRole]);
    const routes: Record<string, string> = { listener: '/dashboard', expert: '/expert/queue', admin: '/admin/users' };
    navigate(routes[selectedRole]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
            <Plane className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">SkyAnalytics LMS</h1>
          <p className="text-blue-200 mt-2">Система обучения аналитиков</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-4">Вход в систему</h2>
          <p className="text-sm text-blue-200 mb-6">Выберите роль для демонстрации:</p>

          <div className="space-y-3 mb-6">
            <button
              onClick={() => setSelectedRole('listener')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                selectedRole === 'listener' ? 'border-blue-400 bg-blue-500/20' : 'border-white/10 hover:border-white/30'
              }`}
            >
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-medium text-sm">Слушатель</p>
                <p className="text-blue-200 text-xs">Junior-аналитик, проходит курс</p>
              </div>
            </button>

            <button
              onClick={() => setSelectedRole('expert')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                selectedRole === 'expert' ? 'border-blue-400 bg-blue-500/20' : 'border-white/10 hover:border-white/30'
              }`}
            >
              <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-medium text-sm">Эксперт (Ментор)</p>
                <p className="text-blue-200 text-xs">Senior-аналитик, проверяет задания</p>
              </div>
            </button>

            <button
              onClick={() => setSelectedRole('admin')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                selectedRole === 'admin' ? 'border-blue-400 bg-blue-500/20' : 'border-white/10 hover:border-white/30'
              }`}
            >
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-medium text-sm">Администратор</p>
                <p className="text-blue-200 text-xs">HR/руководитель, управляет контентом</p>
              </div>
            </button>
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-blue-500/30"
          >
            Войти как {selectedRole === 'listener' ? 'Слушатель' : selectedRole === 'expert' ? 'Эксперт' : 'Администратор'}
          </button>

          <p className="text-center text-xs text-blue-300 mt-4">
            Демонстрационный режим • Корпоративный SSO
          </p>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-blue-300/60">© 2024 АвиаАналитика • Все права защищены</p>
        </div>
      </div>
    </div>
  );
}
