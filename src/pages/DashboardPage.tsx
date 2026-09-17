import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { chapters } from '../data/mockData';
import { ProgressBar, Card } from '../components/shared';
import { Lock, CheckCircle2, Circle, AlertCircle, Trophy, Target, BookOpen, TrendingUp } from 'lucide-react';

export function DashboardPage() {
  const { currentUser, progress } = useApp();
  if (!currentUser) return null;

  const listenerProgress = progress[currentUser.id] || [];
  const completedChapters = listenerProgress.filter(p => p.theoryWatchedPercent >= 80 && p.testPassed && p.taskAccepted).length;
  const overallPercent = Math.round((completedChapters / chapters.length) * 100);
  const testsPassed = listenerProgress.filter(p => p.testPassed).length;
  const tasksAccepted = listenerProgress.filter(p => p.taskAccepted).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Мой прогресс</h1>
          <p className="text-slate-500 text-sm mt-1">Обучающий курс для аналитиков авиакомпании</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
          <Trophy className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-bold text-blue-700">{overallPercent}% завершено</span>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{completedChapters}/6</p>
            <p className="text-xs text-slate-500">Глав завершено</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{testsPassed}/6</p>
            <p className="text-xs text-slate-500">Тестов пройдено</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{tasksAccepted}/6</p>
            <p className="text-xs text-slate-500">Заданий принято</p>
          </div>
        </Card>
      </div>

      {/* Overall progress */}
      <Card>
        <ProgressBar percent={overallPercent} label="Общий прогресс курса" size="lg" />
      </Card>

      {/* Chapters list */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-800">Главы курса</h2>
        {chapters.map((chapter, idx) => {
          const chProgress = listenerProgress.find(p => p.chapterId === chapter.id);
          const isUnlocked = chProgress?.unlocked ?? (idx === 0);
          const isCompleted = chProgress && chProgress.theoryWatchedPercent >= 80 && chProgress.testPassed && chProgress.taskAccepted;
          const chapterPercent = chProgress ? Math.round(
            ((chProgress.theoryWatchedPercent >= 80 ? 33 : chProgress.theoryWatchedPercent / 80 * 33) +
            (chProgress.testPassed ? 33 : 0) +
            (chProgress.taskAccepted ? 34 : 0))
          ) : 0;

          return (
            <Link
              key={chapter.id}
              to={isUnlocked ? `/chapter/${chapter.id}` : '#'}
              className={`block p-4 rounded-xl border transition-all ${
                isUnlocked
                  ? 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md cursor-pointer'
                  : 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
              }`}
              onClick={(e) => !isUnlocked && e.preventDefault()}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                  isCompleted ? 'bg-green-100' : isUnlocked ? 'bg-blue-50' : 'bg-slate-100'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-6 h-6 text-green-600" /> :
                   isUnlocked ? <span>{chapter.icon}</span> :
                   <Lock className="w-5 h-5 text-slate-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-800">Глава {chapter.order}: {chapter.title}</h3>
                    {isCompleted && <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Завершено</span>}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{chapter.mainQuestion}</p>
                  {isUnlocked && (
                    <div className="mt-2">
                      <ProgressBar percent={chapterPercent} size="sm" />
                    </div>
                  )}
                </div>
                {!isUnlocked && (
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Заблокировано</p>
                    <p className="text-xs text-slate-400">Завершите главу {chapter.order - 1}</p>
                  </div>
                )}
              </div>

              {isUnlocked && chProgress && (
                <div className="flex gap-4 mt-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    {chProgress.theoryWatchedPercent >= 80 ?
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> :
                      <Circle className="w-3.5 h-3.5 text-slate-300" />}
                    <span className="text-xs text-slate-600">Теория ({chProgress.theoryWatchedPercent}%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {chProgress.testPassed ?
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> :
                      <Circle className="w-3.5 h-3.5 text-slate-300" />}
                    <span className="text-xs text-slate-600">Тест {chProgress.testPassed ? `(${chProgress.testScore}%)` : ''}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {chProgress.taskAccepted ?
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> :
                      <Circle className="w-3.5 h-3.5 text-slate-300" />}
                    <span className="text-xs text-slate-600">Задание</span>
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
