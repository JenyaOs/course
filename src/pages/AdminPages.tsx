import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { users, chapters } from '../data/mockData';
import { Card, ProgressBar } from '../components/shared';
import { Users, Shield, BookOpen, Plus, Edit, Search, BarChart3, TrendingUp, Clock, CheckCircle2, UserCheck, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredUsers = users.filter(u =>
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roleLabels: Record<string, string> = { LISTENER: 'Слушатель', EXPERT: 'Эксперт', ADMIN: 'Администратор' };
  const roleColors: Record<string, string> = { LISTENER: 'bg-green-100 text-green-700', EXPERT: 'bg-amber-100 text-amber-700', ADMIN: 'bg-purple-100 text-purple-700' };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Пользователи</h1>
          <p className="text-slate-500 text-sm mt-1">Управление учётными записями</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Добавить
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Поиск по имени или email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Пользователь</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Email</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Роль</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">
                        {user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="text-sm font-medium text-slate-800">{user.fullName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">{user.email}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                      {roleLabels[user.role]}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button className="p-1.5 hover:bg-slate-100 rounded-lg">
                      <Edit className="w-4 h-4 text-slate-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Добавить пользователя</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">ФИО</label>
                <input type="text" className="mt-1 w-full p-2 border border-slate-300 rounded-lg text-sm" placeholder="Иванов Иван Иванович" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input type="email" className="mt-1 w-full p-2 border border-slate-300 rounded-lg text-sm" placeholder="user@airline.ru" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Роль</label>
                <select className="mt-1 w-full p-2 border border-slate-300 rounded-lg text-sm">
                  <option value="LISTENER">Слушатель</option>
                  <option value="EXPERT">Эксперт</option>
                  <option value="ADMIN">Администратор</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Отмена</button>
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminAnalyticsPage() {
  const { progress } = useApp();

  const listeners = users.filter(u => u.role === 'LISTENER');
  const experts = users.filter(u => u.role === 'EXPERT');

  // Progress data for chart
  const progressData = listeners.map(listener => {
    const lp = progress[listener.id] || [];
    const completed = lp.filter(p => p.theoryWatchedPercent >= 80 && p.testPassed && p.taskAccepted).length;
    return {
      name: listener.fullName.split(' ').slice(0, 2).join(' '),
      completed,
      total: chapters.length,
      percent: Math.round((completed / chapters.length) * 100),
    };
  });

  // Chapter completion data
  const chapterData = chapters.map(ch => {
    let theoryDone = 0, testDone = 0, taskDone = 0;
    listeners.forEach(l => {
      const lp = progress[l.id]?.find(p => p.chapterId === ch.id);
      if (lp) {
        if (lp.theoryWatchedPercent >= 80) theoryDone++;
        if (lp.testPassed) testDone++;
        if (lp.taskAccepted) taskDone++;
      }
    });
    return {
      name: `Гл. ${ch.order}`,
      theory: theoryDone,
      test: testDone,
      task: taskDone,
    };
  });

  // Expert load
  const expertLoad = experts.map(expert => ({
    name: expert.fullName.split(' ').slice(0, 2).join(' '),
    pending: Math.floor(Math.random() * 3) + 1,
    completed: Math.floor(Math.random() * 5) + 3,
    avgTime: (Math.random() * 24 + 4).toFixed(1),
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Аналитика</h1>
        <p className="text-slate-500 text-sm mt-1">Дашборд прогресса и метрик</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800">{listeners.length}</p>
            <p className="text-xs text-slate-500">Слушателей</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800">{listeners.filter(l => (progress[l.id] || []).filter(p => p.taskAccepted).length === 6).length}</p>
            <p className="text-xs text-slate-500">Завершили курс</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800">{listeners.filter(l => (progress[l.id] || []).some(p => p.testAttempts >= 2)).length}</p>
            <p className="text-xs text-slate-500">Нужна помощь</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800">{Math.round(listeners.reduce((acc, l) => acc + ((progress[l.id] || []).filter(p => p.taskAccepted).length / 6 * 100), 0) / listeners.length)}%</p>
            <p className="text-xs text-slate-500">Средний прогресс</p>
          </div>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Listener progress */}
        <Card>
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Прогресс слушателей
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="completed" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Глав завершено" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Chapter completion */}
        <Card>
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Прогресс по главам
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chapterData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="theory" fill="#3b82f6" name="Теория" stackId="a" />
              <Bar dataKey="test" fill="#10b981" name="Тест" stackId="a" />
              <Bar dataKey="task" fill="#f59e0b" name="Задание" stackId="a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Expert load */}
      <Card>
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4" /> Нагрузка экспертов
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 text-xs font-semibold text-slate-500 uppercase">Эксперт</th>
                <th className="text-center py-2 text-xs font-semibold text-slate-500 uppercase">На проверке</th>
                <th className="text-center py-2 text-xs font-semibold text-slate-500 uppercase">Проверено</th>
                <th className="text-center py-2 text-xs font-semibold text-slate-500 uppercase">Ср. время (ч)</th>
              </tr>
            </thead>
            <tbody>
              {expertLoad.map((expert, idx) => (
                <tr key={idx} className="border-b border-slate-100">
                  <td className="py-3 text-sm font-medium text-slate-800">{expert.name}</td>
                  <td className="py-3 text-center">
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">{expert.pending}</span>
                  </td>
                  <td className="py-3 text-center">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">{expert.completed}</span>
                  </td>
                  <td className="py-3 text-center text-sm text-slate-600">{expert.avgTime} ч</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detailed progress table */}
      <Card>
        <h3 className="font-semibold text-slate-800 mb-4">Детальный прогресс слушателей</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 text-xs font-semibold text-slate-500 uppercase">Слушатель</th>
                {chapters.map(ch => (
                  <th key={ch.id} className="text-center py-2 text-xs font-semibold text-slate-500 uppercase">Гл.{ch.order}</th>
                ))}
                <th className="text-center py-2 text-xs font-semibold text-slate-500 uppercase">Прогресс</th>
              </tr>
            </thead>
            <tbody>
              {listeners.map(listener => {
                const lp = progress[listener.id] || [];
                const completedCount = lp.filter(p => p.theoryWatchedPercent >= 80 && p.testPassed && p.taskAccepted).length;
                return (
                  <tr key={listener.id} className="border-b border-slate-100">
                    <td className="py-3 text-sm font-medium text-slate-800">{listener.fullName.split(' ').slice(0, 2).join(' ')}</td>
                    {chapters.map(ch => {
                      const chProg = lp.find(p => p.chapterId === ch.id);
                      const isComplete = chProg && chProg.theoryWatchedPercent >= 80 && chProg.testPassed && chProg.taskAccepted;
                      const isStarted = chProg && (chProg.theoryWatchedPercent > 0 || chProg.testPassed);
                      return (
                        <td key={ch.id} className="py-3 text-center">
                          {isComplete ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                          ) : isStarted ? (
                            <div className="w-4 h-4 bg-amber-400 rounded-full mx-auto" />
                          ) : (
                            <div className="w-4 h-4 bg-slate-200 rounded-full mx-auto" />
                          )}
                        </td>
                      );
                    })}
                    <td className="py-3">
                      <div className="w-24 mx-auto">
                        <ProgressBar percent={Math.round((completedCount / 6) * 100)} size="sm" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export function AdminContentPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Управление контентом</h1>
        <p className="text-slate-500 text-sm mt-1">Главы, элементы, тесты и задания</p>
      </div>

      <div className="space-y-4">
        {chapters.map(chapter => (
          <Card key={chapter.id}>
            <div className="flex items-start gap-4">
              <div className="text-3xl">{chapter.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">Глава {chapter.order}: {chapter.title}</h3>
                  <button className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">Редактировать</button>
                </div>
                <p className="text-sm text-slate-500 mt-1">{chapter.mainQuestion}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {chapter.topics.map(topic => (
                    <span key={topic} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">{topic}</span>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-500 mb-2">Элементы главы:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {['Теория', 'Тест', 'Артефакт', 'Задание', 'Ревью', 'Материалы'].map((el, idx) => (
                      <div key={idx} className="p-2 bg-slate-50 rounded-lg text-center">
                        <p className="text-xs font-medium text-slate-700">{el}</p>
                        <p className="text-[10px] text-green-600 mt-0.5">✓ Настроен</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
