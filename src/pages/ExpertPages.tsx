import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { users, chapters, practicalTasks, chapterElements } from '../data/mockData';
import { Card, RubricScorer, StatusBadge } from '../components/shared';
import { ClipboardCheck, User, Calendar, FileText, ExternalLink, MessageSquare, CheckCircle, XCircle, Send, ArrowLeft } from 'lucide-react';

export function ExpertQueuePage() {
  const { currentUser, getPendingReviews, submissions, reviews } = useApp();
  if (!currentUser || currentUser.role !== 'EXPERT') return null;

  const pendingTasks = getPendingReviews(currentUser.id);

  const getListenerName = (listenerId: string) => users.find(u => u.id === listenerId)?.fullName || 'Неизвестный';
  const getTaskTitle = (taskId: string) => {
    for (const chId of Object.keys(practicalTasks)) {
      if (chId === taskId) return practicalTasks[chId].title;
    }
    return 'Неизвестное задание';
  };
  const getChapterForTask = (taskId: string) => {
    for (const [chId, elements] of Object.entries(chapterElements)) {
      if (elements.some(e => e.id === taskId)) {
        return chapters.find(c => c.id === chId);
      }
    }
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Очередь проверок</h1>
        <p className="text-slate-500 text-sm mt-1">Работы слушателей, ожидающие вашей оценки</p>
      </div>

      {pendingTasks.length === 0 ? (
        <Card className="text-center py-12">
          <ClipboardCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600">Нет работ на проверке</p>
          <p className="text-sm text-slate-400 mt-1">Все задания проверены!</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {pendingTasks.map(submission => {
            const chapter = getChapterForTask(submission.taskId);
            return (
              <Link
                key={submission.id}
                to={`/expert/review/${submission.id}`}
                className="block p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">{getTaskTitle(submission.taskId)}</h3>
                    <div className="flex items-center gap-4 mt-1.5">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <User className="w-3.5 h-3.5" />
                        {getListenerName(submission.listenerId)}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(submission.submittedAt).toLocaleDateString('ru-RU')}
                      </div>
                      {chapter && (
                        <span className="text-xs text-slate-400">Глава {chapter.order}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <StatusBadge status={submission.status} />
                      <span className="text-xs text-slate-400">Попытка #{submission.attemptNumber}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Completed reviews */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Проверенные работы</h2>
        {submissions.filter(s => s.status === 'ACCEPTED' || s.status === 'NEEDS_REWORK').map(submission => {
          const review = reviews.find(r => r.submissionId === submission.id);
          const chapter = getChapterForTask(submission.taskId);
          return (
            <div key={submission.id} className="p-4 bg-white rounded-xl border border-slate-200 mb-3">
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${submission.status === 'ACCEPTED' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {submission.status === 'ACCEPTED' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-slate-800">{getTaskTitle(submission.taskId)}</p>
                  <p className="text-xs text-slate-500">{getListenerName(submission.listenerId)} • {chapter ? `Глава ${chapter.order}` : ''}</p>
                </div>
                <StatusBadge status={submission.status} />
                {review && <span className="text-sm font-bold text-blue-600">{review.totalScore} баллов</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ExpertReviewPage() {
  const { submissionId } = useParams<{ submissionId: string }>();

  const { currentUser, submissions, reviews, addReview } = useApp();
  const [scores, setScores] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState<'ACCEPTED' | 'NEEDS_REWORK' | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!currentUser || currentUser.role !== 'EXPERT') return null;

  if (!submissionId) return null;
  const submission = submissions.find(s => s.id === submissionId);
  if (!submission) return (
    <div className="text-center py-12">
      <p className="text-slate-600">Работа не найдена</p>
      <Link to="/expert/queue" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Вернуться к очереди</Link>
    </div>
  );

  const task = practicalTasks[submission.taskId];
  if (!task) return null;

  const listener = users.find(u => u.id === submission.listenerId);
  const existingReview = reviews.find(r => r.submissionId === submissionId);

  const allScored = task.rubric.every(c => scores[c.id] !== undefined);
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const maxScore = task.rubric.reduce((a, c) => a + c.maxPoints, 0);

  const handleSubmitReview = () => {
    if (!status || !allScored) return;
    addReview({
      id: `rev-${Date.now()}`,
      submissionId: submission.id,
      expertId: currentUser.id,
      status,
      scores,
      totalScore,
      feedbackComment: feedback,
      reviewedAt: new Date().toISOString(),
    });
    setSubmitted(true);
  };

  if (existingReview || submitted) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800">Проверка завершена!</h2>
          <p className="text-slate-500 mt-2">Результат отправлен слушателю</p>
          <Link to="/expert/queue" className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg text-sm">
            Вернуться к очереди
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm">
        <Link to="/expert/queue" className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Очередь
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-800">Проверка работы</h1>
        <p className="text-slate-500 text-sm mt-1">{task.title}</p>
      </div>

      {/* Submission info */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-500 mb-1">Слушатель</p>
            <p className="font-medium text-slate-800">{listener?.fullName}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Дата отправки</p>
            <p className="font-medium text-slate-800">{new Date(submission.submittedAt).toLocaleDateString('ru-RU')}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Попытка</p>
            <p className="font-medium text-slate-800">#{submission.attemptNumber}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Статус</p>
            <StatusBadge status={submission.status} />
          </div>
        </div>
      </Card>

      {/* Submitted files */}
      <Card>
        <h3 className="font-semibold text-slate-800 mb-3">Загруженные файлы</h3>
        <div className="space-y-2">
          {submission.files.map((file, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
              <FileText className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-700">{file.name}</span>
              <span className="text-xs text-slate-400">({(file.size / 1024).toFixed(0)} КБ)</span>
            </div>
          ))}
        </div>
        {submission.externalLinks.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-slate-500 mb-2">Внешние ссылки:</p>
            {submission.externalLinks.map((link, idx) => (
              <a key={idx} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                <ExternalLink className="w-3.5 h-3.5" /> {link}
              </a>
            ))}
          </div>
        )}
        {submission.comment && (
          <div className="mt-4 p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Комментарий слушателя:</p>
            <p className="text-sm text-slate-700">{submission.comment}</p>
          </div>
        )}
      </Card>

      {/* Task context */}
      <Card>
        <h3 className="font-semibold text-slate-800 mb-2">Контекст задания</h3>
        <p className="text-sm text-slate-600">{task.contextText}</p>
      </Card>

      {/* Rubric scoring */}
      <Card>
        <h3 className="font-semibold text-slate-800 mb-4">Оценка по рубрике</h3>
        <RubricScorer
          criteria={task.rubric}
          scores={scores}
          onScoreChange={(id, points) => setScores(prev => ({ ...prev, [id]: points }))}
        />
      </Card>

      {/* Feedback and status */}
      <Card>
        <h3 className="font-semibold text-slate-800 mb-4">Решение</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Комментарий для слушателя:</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Ваши замечания и рекомендации..."
              className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setStatus('ACCEPTED')}
              disabled={!allScored}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors ${
                status === 'ACCEPTED' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <CheckCircle className="w-4 h-4 inline mr-1.5" /> Принять работу
            </button>
            <button
              onClick={() => setStatus('NEEDS_REWORK')}
              disabled={!allScored}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors ${
                status === 'NEEDS_REWORK' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <XCircle className="w-4 h-4 inline mr-1.5" /> Вернуть на доработку
            </button>
          </div>
          <button
            onClick={handleSubmitReview}
            disabled={!status || !allScored}
            className="w-full py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Отправить результат
          </button>
          {!allScored && (
            <p className="text-xs text-amber-600 text-center">Заполните все критерии рубрики перед отправкой</p>
          )}
        </div>
      </Card>
    </div>
  );
}
