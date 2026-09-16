import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Clock, FileText, Download, ExternalLink, Upload, X, CheckCircle, AlertCircle, Star, BookOpen, Scale, File, ChevronDown } from 'lucide-react';

// ============ VideoPlayer ============
export function VideoPlayer({ title, durationSec, onProgress }: { title: string; durationSec: number; onProgress: (percent: number) => void }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          const next = Math.min(prev + (100 / (durationSec / 2)), 100);
          onProgress(Math.round(next));
          if (next >= 100) { setPlaying(false); }
          return next;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, durationSec]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const currentTime = (progress / 100) * durationSec;

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden">
      <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Plane className="w-10 h-10 text-blue-400" />
            </div>
            <p className="text-white font-medium">{title}</p>
            <p className="text-slate-400 text-sm mt-1">Авиационная аналитика</p>
          </div>
        </div>
        <button
          onClick={() => setPlaying(!playing)}
          className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
        >
          {playing ? <Pause className="w-16 h-16 text-white/80" /> : <Play className="w-16 h-16 text-white/80" />}
        </button>
      </div>
      <div className="p-3">
        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden mb-2">
          <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{formatTime(currentTime)} / {formatTime(durationSec)}</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setMuted(!muted)} className="hover:text-white">
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button className="hover:text-white"><Maximize className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Plane({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
    </svg>
  );
}

// ============ TestRunner ============
interface TestRunnerProps {
  questions: { id: string; order: number; questionText: string; type: string; options: { id: string; text: string }[]; correctOptionIds: string[]; explanation: string }[];
  timeLimitMin: number;
  passingScore: number;
  onSubmit: (answers: Record<string, string[]>) => void;
}

export function TestRunner({ questions, timeLimitMin, passingScore, onSubmit }: TestRunnerProps) {
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimitMin * 60);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<{ passed: boolean; score: number; explanations: { questionId: string; correct: boolean; explanation: string }[] } | null>(null);

  useEffect(() => {
    if (submitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { handleSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted]);

  const handleAnswer = (questionId: string, optionId: string, type: string) => {
    if (submitted) return;
    setAnswers(prev => {
      const current = prev[questionId] || [];
      if (type === 'SINGLE_CHOICE' || type === 'TRUE_FALSE') {
        return { ...prev, [questionId]: [optionId] };
      }
      const exists = current.includes(optionId);
      return { ...prev, [questionId]: exists ? current.filter(id => id !== optionId) : [...current, optionId] };
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    let correct = 0;
    const explanations: { questionId: string; correct: boolean; explanation: string }[] = [];
    questions.forEach(q => {
      const userAnswers = answers[q.id] || [];
      const isCorrect = q.correctOptionIds.length === userAnswers.length && q.correctOptionIds.every(id => userAnswers.includes(id));
      if (isCorrect) correct++;
      explanations.push({ questionId: q.id, correct: isCorrect, explanation: q.explanation });
    });
    const score = Math.round((correct / questions.length) * 100);
    setResults({ passed: score >= passingScore, score, explanations });
    onSubmit(answers);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const q = questions[currentQ];
  const answeredCount = Object.keys(answers).length;

  if (results) {
    return (
      <div className="space-y-4">
        <div className={`p-6 rounded-xl text-center ${results.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="text-4xl mb-2">{results.passed ? '🎉' : '😔'}</div>
          <h3 className={`text-xl font-bold ${results.passed ? 'text-green-800' : 'text-red-800'}`}>
            {results.passed ? 'Тест пройден!' : 'Тест не пройден'}
          </h3>
          <p className="text-2xl font-bold mt-2">{results.score}%</p>
          <p className="text-sm text-slate-600 mt-1">Проходной балл: {passingScore}%</p>
        </div>
        <div className="space-y-3">
          {questions.map((question, idx) => {
            const exp = results.explanations[idx];
            return (
              <div key={question.id} className={`p-4 rounded-lg border ${exp.correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <div className="flex items-start gap-2">
                  {exp.correct ? <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /> : <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />}
                  <div>
                    <p className="font-medium text-sm">{question.questionText}</p>
                    <p className="text-xs text-slate-600 mt-1">{exp.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-600">Вопрос {currentQ + 1} из {questions.length}</span>
          <span className="text-sm text-slate-400">|</span>
          <span className="text-sm text-slate-600">Отвечено: {answeredCount}/{questions.length}</span>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-mono ${timeLeft < 60 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
          <Clock className="w-4 h-4" />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <p className="font-medium text-lg mb-4">{q.questionText}</p>
        <div className="space-y-2">
          {q.options.map(option => {
            const selected = (answers[q.id] || []).includes(option.id);
            return (
              <button
                key={option.id}
                onClick={() => handleAnswer(q.id, option.id, q.type)}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                  selected ? 'border-blue-500 bg-blue-50 text-blue-800' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected ? 'border-blue-500 bg-blue-500' : 'border-slate-300'}`}>
                    {selected && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className="text-sm">{option.text}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
          disabled={currentQ === 0}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 disabled:opacity-30"
        >
          ← Предыдущий
        </button>
        <div className="flex gap-2">
          {currentQ < questions.length - 1 ? (
            <button
              onClick={() => setCurrentQ(currentQ + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Следующий →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
            >
              Завершить тест
            </button>
          )}
        </div>
      </div>

      {/* Question dots */}
      <div className="flex gap-1.5 justify-center flex-wrap">
        {questions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentQ(idx)}
            className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
              idx === currentQ ? 'bg-blue-600 text-white' :
              answers[questions[idx].id] ? 'bg-green-100 text-green-700' :
              'bg-slate-100 text-slate-500'
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============ FileUploader ============
export function FileUploader({ onFilesChange, maxFiles = 5, maxSizeMB = 50 }: { onFilesChange: (files: File[]) => void; maxFiles?: number; maxSizeMB?: number }) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const valid = Array.from(newFiles).filter(f => f.size <= maxSizeMB * 1024 * 1024);
    const updated = [...files, ...valid].slice(0, maxFiles);
    setFiles(updated);
    onFilesChange(updated);
  };

  const removeFile = (idx: number) => {
    const updated = files.filter((_, i) => i !== idx);
    setFiles(updated);
    onFilesChange(updated);
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400'}`}
      >
        <Upload className="w-10 h-10 mx-auto text-slate-400 mb-3" />
        <p className="text-sm font-medium text-slate-700">Перетащите файлы сюда</p>
        <p className="text-xs text-slate-500 mt-1">или нажмите для выбора</p>
        <p className="text-xs text-slate-400 mt-2">PDF, DOCX, XLSX, PNG, JPG, SVG (до {maxSizeMB} МБ)</p>
        <input
          type="file"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg cursor-pointer hover:bg-blue-700">
          Выбрать файлы
        </label>
      </div>
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2">
                <File className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-700">{file.name}</span>
                <span className="text-xs text-slate-400">({(file.size / 1024).toFixed(0)} КБ)</span>
              </div>
              <button onClick={() => removeFile(idx)} className="p-1 hover:bg-slate-200 rounded">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ RubricScorer ============
export function RubricScorer({ criteria, scores, onScoreChange }: { criteria: { id: string; name: string; description: string; maxPoints: number }[]; scores: Record<string, number>; onScoreChange: (criterionId: string, points: number) => void }) {
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const maxTotal = criteria.reduce((a, c) => a + c.maxPoints, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
        <span className="text-sm font-medium">Общий балл:</span>
        <span className="text-lg font-bold text-blue-600">{totalScore} / {maxTotal}</span>
      </div>
      {criteria.map(criterion => (
        <div key={criterion.id} className="p-4 border border-slate-200 rounded-lg">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-medium text-sm">{criterion.name}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{criterion.description}</p>
            </div>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">макс. {criterion.maxPoints}</span>
          </div>
          <input
            type="range"
            min={0}
            max={criterion.maxPoints}
            value={scores[criterion.id] || 0}
            onChange={(e) => onScoreChange(criterion.id, parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-slate-400">0</span>
            <span className="text-sm font-bold text-blue-600">{scores[criterion.id] || 0}</span>
            <span className="text-xs text-slate-400">{criterion.maxPoints}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============ ProgressBar ============
export function ProgressBar({ percent, label, size = 'md' }: { percent: number; label?: string; size?: 'sm' | 'md' | 'lg' }) {
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };
  return (
    <div>
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-slate-600">{label}</span>
          <span className="text-xs text-slate-500">{percent}%</span>
        </div>
      )}
      <div className={`${heights[size]} bg-slate-200 rounded-full overflow-hidden`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${percent >= 100 ? 'bg-green-500' : percent >= 50 ? 'bg-blue-500' : 'bg-amber-500'}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  );
}

// ============ StatusBadge ============
export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'DRAFT': 'bg-slate-100 text-slate-700',
    'SUBMITTED': 'bg-blue-100 text-blue-700',
    'ON_REVIEW': 'bg-amber-100 text-amber-700',
    'NEEDS_REWORK': 'bg-red-100 text-red-700',
    'ACCEPTED': 'bg-green-100 text-green-700',
  };
  const labels: Record<string, string> = {
    'DRAFT': 'Черновик',
    'SUBMITTED': 'Отправлено',
    'ON_REVIEW': 'На проверке',
    'NEEDS_REWORK': 'На доработке',
    'ACCEPTED': 'Принято',
  };
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-slate-100 text-slate-700'}`}>
      {labels[status] || status}
    </span>
  );
}

// ============ Card ============
export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-xl border border-slate-200 p-5 ${className}`}>{children}</div>;
}

// ============ MaterialIcon ============
export function MaterialIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    'ARTICLE': <FileText className="w-4 h-4 text-blue-500" />,
    'GLOSSARY': <BookOpen className="w-4 h-4 text-purple-500" />,
    'REGULATION': <Scale className="w-4 h-4 text-amber-500" />,
    'BOOK': <BookOpen className="w-4 h-4 text-green-500" />,
  };
  return <>{icons[type] || <File className="w-4 h-4 text-slate-500" />}</>;
}
