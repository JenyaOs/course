import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { chapters, chapterElements, theoryContents, testConfigs, artifactTemplates, practicalTasks, extraMaterials } from '../data/mockData';
import { VideoPlayer, TestRunner, FileUploader, RubricScorer, StatusBadge, Card, MaterialIcon } from '../components/shared';
import { BookOpen, ClipboardCheck, FileText, PenTool, Shield, Library, ArrowLeft, CheckCircle2, Lock, AlertCircle, ExternalLink, Download, MessageSquare } from 'lucide-react';

const elementIcons: Record<string, React.ReactNode> = {
  'THEORY': <BookOpen className="w-4 h-4" />,
  'TEST': <ClipboardCheck className="w-4 h-4" />,
  'ARTIFACT_OVERVIEW': <FileText className="w-4 h-4" />,
  'PRACTICAL_TASK': <PenTool className="w-4 h-4" />,
  'EXPERT_REVIEW': <Shield className="w-4 h-4" />,
  'EXTRA_MATERIALS': <Library className="w-4 h-4" />,
};

export function ChapterPage() {
  const { id: chapterId } = useParams<{ id: string }>();
  const { currentUser, progress, updateProgress, getUserSubmissions, addSubmission, reviews } = useApp();
  const [activeTab, setActiveTab] = useState(0);
  const [submittedFiles, setSubmittedFiles] = useState<File[]>([]);
  const [submissionComment, setSubmissionComment] = useState('');
  const [submissionLinks, setSubmissionLinks] = useState('');
  const [reviewScores, setReviewScores] = useState<Record<string, number>>({});
  const [reviewComment, setReviewComment] = useState('');
  const [reviewStatus, setReviewStatus] = useState<'ACCEPTED' | 'NEEDS_REWORK' | null>(null);

  if (!chapterId || !currentUser) return null;
  const chapter = chapters.find(c => c.id === chapterId);
  if (!chapter) return null;

  const elements = chapterElements[chapterId] || [];
  const listenerProgress = progress[currentUser.id]?.find(p => p.chapterId === chapterId);
  const isUnlocked = listenerProgress?.unlocked ?? false;

  if (!isUnlocked) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Lock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-slate-700">Глава заблокирована</h2>
          <p className="text-sm text-slate-500 mt-1">Сначала завершите предыдущую главу</p>
          <Link to="/dashboard" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
            Вернуться к прогрессу
          </Link>
        </div>
      </div>
    );
  }

  const theory = theoryContents[elements[0]?.id];
  const testConfig = testConfigs[elements[1]?.id];
  const artifact = artifactTemplates[elements[2]?.id];
  const task = practicalTasks[elements[3]?.id];
  const materials = extraMaterials[elements[5]?.id] || [];
  const userSubmissions = currentUser.role === 'LISTENER' ? getUserSubmissions(currentUser.id, elements[3]?.id) : [];
  const latestSubmission = userSubmissions[userSubmissions.length - 1];
  const latestReview = latestSubmission ? reviews.find(r => r.submissionId === latestSubmission.id) : null;

  const canAccessTest = (listenerProgress?.theoryWatchedPercent ?? 0) >= (theory?.minWatchPercent ?? 80);
  const canAccessTask = listenerProgress?.testPassed ?? false;
  const canSeeReview = userSubmissions.length > 0;

  const handleTestSubmit = (answers: Record<string, string[]>) => {
    if (!testConfig) return;
    let correct = 0;
    testConfig.questions.forEach(q => {
      const userAnswers = answers[q.id] || [];
      const isCorrect = q.correctOptionIds.length === userAnswers.length && q.correctOptionIds.every(id => userAnswers.includes(id));
      if (isCorrect) correct++;
    });
    const score = Math.round((correct / testConfig.questions.length) * 100);
    const passed = score >= testConfig.passingScore;
    updateProgress(currentUser.id, chapterId, {
      testPassed: passed,
      testScore: score,
      testAttempts: (listenerProgress?.testAttempts ?? 0) + 1,
    });
  };

  const handleTaskSubmit = () => {
    if (!task) return;
    const submission = {
      id: `sub-${Date.now()}`,
      listenerId: currentUser.id,
      taskId: elements[3].id,
      attemptNumber: userSubmissions.length + 1,
      files: submittedFiles.map(f => ({ name: f.name, size: f.size, url: '#' })),
      externalLinks: submissionLinks.split('\n').filter(l => l.trim()),
      comment: submissionComment,
      status: 'ON_REVIEW' as const,
      submittedAt: new Date().toISOString(),
    };
    addSubmission(submission);
    setSubmittedFiles([]);
    setSubmissionComment('');
    setSubmissionLinks('');
  };

  const tabs = elements.map((el, idx) => ({
    ...el,
    icon: elementIcons[el.type],
    disabled: el.type === 'TEST' && !canAccessTest,
    disabledReason: el.type === 'TEST' ? `Просмотрите ≥${theory?.minWatchPercent}% видео` : undefined,
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link to="/dashboard" className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Прогресс
        </Link>
        <span className="text-slate-400">/</span>
        <span className="text-slate-600">Глава {chapter.order}: {chapter.title}</span>
      </div>

      {/* Chapter header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="text-4xl">{chapter.icon}</div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Глава {chapter.order}: {chapter.title}</h1>
            <p className="text-blue-100 mt-1">{chapter.mainQuestion}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {chapter.topics.map(topic => (
                <span key={topic} className="px-2 py-0.5 bg-white/20 rounded text-xs">{topic}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-slate-200">
          {tabs.map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && setActiveTab(idx)}
              disabled={tab.disabled}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === idx
                  ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                  : tab.disabled
                  ? 'border-transparent text-slate-300 cursor-not-allowed'
                  : 'border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`}
              title={tab.disabledReason}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.title}</span>
              <span className="sm:hidden">{tab.order}</span>
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* THEORY TAB */}
          {activeTab === 0 && theory && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">{theory.videoTitle}</h2>
                <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                  Мин. просмотр: {theory.minWatchPercent}%
                </span>
              </div>
              <VideoPlayer
                title={theory.videoTitle}
                durationSec={theory.videoDurationSec}
                onProgress={(percent) => updateProgress(currentUser.id, chapterId, { theoryWatchedPercent: Math.max(listenerProgress?.theoryWatchedPercent ?? 0, percent) })}
              />
              <div className="prose prose-sm max-w-none">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div dangerouslySetInnerHTML={{ __html: theory.content.replace(/## (.*)/g, '<h3 class="text-lg font-bold text-slate-800 mt-4 mb-2">$1</h3>').replace(/### (.*)/g, '<h4 class="text-sm font-semibold text-slate-700 mt-3 mb-1">$1</h4>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n- /g, '<br/>• ').replace(/\n(\d+)\. /g, '<br/>$1. ').replace(/\n/g, '<br/>') }} />
                </div>
              </div>
              {!canAccessTest && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <p className="text-sm text-amber-700">Просмотрите ≥{theory.minWatchPercent}% видео для разблокировки теста</p>
                </div>
              )}
              {canAccessTest && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <p className="text-sm text-green-700">Тест разблокирован! Перейдите на вкладку «Тест»</p>
                </div>
              )}
            </div>
          )}

          {/* TEST TAB */}
          {activeTab === 1 && testConfig && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">Тестирование</h2>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>Проходной: {testConfig.passingScore}%</span>
                  <span>•</span>
                  <span>Попыток: {testConfig.maxAttempts}</span>
                  <span>•</span>
                  <span>Время: {testConfig.timeLimitMin} мин</span>
                </div>
              </div>
              {!canAccessTest ? (
                <div className="text-center py-12">
                  <Lock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600">Просмотрите ≥{theory?.minWatchPercent}% видео для доступа к тесту</p>
                </div>
              ) : listenerProgress?.testPassed ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-lg font-semibold text-green-700">Тест пройден!</p>
                  <p className="text-sm text-slate-500 mt-1">Ваш результат: {listenerProgress.testScore}%</p>
                </div>
              ) : (
                <TestRunner
                  questions={testConfig.questions}
                  timeLimitMin={testConfig.timeLimitMin}
                  passingScore={testConfig.passingScore}
                  onSubmit={handleTestSubmit}
                />
              )}
            </div>
          )}

          {/* ARTIFACT TAB */}
          {activeTab === 2 && artifact && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-slate-800">Обзор артефакта</h2>
              <Card>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">{artifact.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{artifact.description}</p>
                    <div className="flex gap-3 mt-4">
                      <a href={artifact.templateFileUrl} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700">
                        <Download className="w-3.5 h-3.5" /> Скачать шаблон
                      </a>
                      <a href={artifact.externalLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-xs rounded-lg hover:bg-slate-200">
                        <ExternalLink className="w-3.5 h-3.5" /> Открыть в Confluence
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h4 className="font-medium text-sm text-slate-700 mb-3">Пример заполнения:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-500 mb-2">Раздел 1: Участники</p>
                    <div className="space-y-1">
                      <p className="text-sm text-slate-700">• ФИО, должность</p>
                      <p className="text-sm text-slate-700">• Роль в проекте</p>
                      <p className="text-sm text-slate-700">• Контактная информация</p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-500 mb-2">Раздел 2: Повестка</p>
                    <div className="space-y-1">
                      <p className="text-sm text-slate-700">• Обсуждаемые вопросы</p>
                      <p className="text-sm text-slate-700">• Время на каждый пункт</p>
                      <p className="text-sm text-slate-700">• Ответственный</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PRACTICAL TASK TAB */}
          {activeTab === 3 && task && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-slate-800">Практическое задание</h2>
              {!canAccessTask ? (
                <div className="text-center py-12">
                  <Lock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600">Пройдите тест для доступа к заданию</p>
                </div>
              ) : (
                <>
                  <Card>
                    <h3 className="font-semibold text-slate-800 mb-2">{task.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{task.contextText}</p>
                  </Card>

                  <Card>
                    <h4 className="font-medium text-sm text-slate-700 mb-3">Входные материалы:</h4>
                    <div className="space-y-2">
                      {task.inputMaterials.map((mat, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                          <FileText className="w-4 h-4 text-slate-500" />
                          <span className="text-sm text-slate-700">{mat.name}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card>
                    <h4 className="font-medium text-sm text-slate-700 mb-3">Критерии оценки:</h4>
                    <div className="space-y-2">
                      {task.rubric.map(c => (
                        <div key={c.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-slate-700">{c.name}</p>
                            <p className="text-xs text-slate-500">{c.description}</p>
                          </div>
                          <span className="text-xs font-bold text-blue-600">{c.maxPoints} баллов</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {latestSubmission && latestSubmission.status !== 'NEEDS_REWORK' && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={latestSubmission.status} />
                        <span className="text-sm text-green-700">Попытка #{latestSubmission.attemptNumber}</span>
                      </div>
                    </div>
                  )}

                  {(!latestSubmission || latestSubmission.status === 'NEEDS_REWORK') && (
                    <Card>
                      <h4 className="font-medium text-sm text-slate-700 mb-3">
                        {latestSubmission?.status === 'NEEDS_REWORK' ? `Доработка (попытка #${latestSubmission.attemptNumber + 1})` : 'Загрузка работы'}
                      </h4>
                      {latestSubmission?.status === 'NEEDS_REWORK' && latestReview && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm font-medium text-red-700">Комментарий эксперта:</p>
                          <p className="text-sm text-red-600 mt-1">{latestReview.feedbackComment}</p>
                        </div>
                      )}
                      <FileUploader onFilesChange={setSubmittedFiles} />
                      <div className="mt-4">
                        <label className="text-sm font-medium text-slate-700">Ссылки (Confluence/Miro):</label>
                        <textarea
                          value={submissionLinks}
                          onChange={(e) => setSubmissionLinks(e.target.value)}
                          placeholder="https://..."
                          className="mt-1 w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={2}
                        />
                      </div>
                      <div className="mt-4">
                        <label className="text-sm font-medium text-slate-700">Комментарий:</label>
                        <textarea
                          value={submissionComment}
                          onChange={(e) => setSubmissionComment(e.target.value)}
                          placeholder="Описание выполненной работы..."
                          className="mt-1 w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                        />
                      </div>
                      <button
                        onClick={handleTaskSubmit}
                        disabled={submittedFiles.length === 0}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Отправить на проверку
                      </button>
                    </Card>
                  )}
                </>
              )}
            </div>
          )}

          {/* EXPERT REVIEW TAB */}
          {activeTab === 4 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-slate-800">Экспертная проверка</h2>
              {!canSeeReview ? (
                <div className="text-center py-12">
                  <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600">Сначала отправьте работу на проверку</p>
                </div>
              ) : latestSubmission && latestReview ? (
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl border ${latestReview.status === 'ACCEPTED' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <StatusBadge status={latestReview.status} />
                      <span className="text-sm text-slate-600">Попытка #{latestSubmission.attemptNumber}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-700">Балл: {latestReview.totalScore} / {task?.rubric.reduce((a, c) => a + c.maxPoints, 0)}</p>
                  </div>
                  <Card>
                    <h4 className="font-medium text-sm text-slate-700 mb-3">Оценка по критериям:</h4>
                    <div className="space-y-2">
                      {task?.rubric.map(c => (
                        <div key={c.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                          <span className="text-sm text-slate-700">{c.name}</span>
                          <span className="text-sm font-bold text-blue-600">{latestReview.scores[c.id] || 0} / {c.maxPoints}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                  {latestReview.feedbackComment && (
                    <Card>
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-slate-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-sm text-slate-700">Комментарий эксперта:</h4>
                          <p className="text-sm text-slate-600 mt-1">{latestReview.feedbackComment}</p>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-amber-600" />
                  </div>
                  <p className="text-slate-600">Работа на проверке у эксперта</p>
                  <p className="text-sm text-slate-400 mt-1">Ожидайте результат</p>
                </div>
              )}
            </div>
          )}

          {/* EXTRA MATERIALS TAB */}
          {activeTab === 5 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-slate-800">Дополнительные материалы</h2>
              <div className="space-y-3">
                {materials.map(mat => (
                  <Card key={mat.id} className="flex items-center gap-4 hover:border-blue-300 cursor-pointer transition-colors">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <MaterialIcon type={mat.type} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-slate-800">{mat.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {mat.type === 'ARTICLE' ? 'Статья' : mat.type === 'GLOSSARY' ? 'Глоссарий' : mat.type === 'REGULATION' ? 'Нормативный документ' : 'Книга'}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
