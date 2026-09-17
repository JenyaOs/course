import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, ListenerProgress, TaskSubmission, ExpertReview, Notification } from '../types';
import { users, initialProgress, submissions, reviews, notifications as initialNotifications } from '../data/mockData';

interface AppState {
  currentUser: User | null;
  progress: Record<string, ListenerProgress[]>;
  submissions: TaskSubmission[];
  reviews: ExpertReview[];
  notifications: Notification[];
  login: (email: string) => void;
  logout: () => void;
  updateProgress: (listenerId: string, chapterId: string, updates: Partial<ListenerProgress>) => void;
  addSubmission: (submission: TaskSubmission) => void;
  addReview: (review: ExpertReview) => void;
  markNotificationRead: (id: string) => void;
  getUserSubmissions: (listenerId: string, taskId: string) => TaskSubmission[];
  getPendingReviews: (expertId: string) => TaskSubmission[];
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<Record<string, ListenerProgress[]>>(initialProgress);
  const [submissionsState, setSubmissions] = useState<TaskSubmission[]>(submissions);
  const [reviewsState, setReviews] = useState<ExpertReview[]>(reviews);
  const [notificationsState, setNotifications] = useState<Notification[]>(initialNotifications);

  const login = useCallback((email: string) => {
    const user = users.find(u => u.email === email);
    if (user) setCurrentUser(user);
  }, []);

  const logout = useCallback(() => setCurrentUser(null), []);

  const updateProgress = useCallback((listenerId: string, chapterId: string, updates: Partial<ListenerProgress>) => {
    setProgress(prev => {
      const listenerProgress = prev[listenerId] || [];
      const idx = listenerProgress.findIndex(p => p.chapterId === chapterId);
      if (idx >= 0) {
        const updated = [...listenerProgress];
        updated[idx] = { ...updated[idx], ...updates };
        return { ...prev, [listenerId]: updated };
      }
      return prev;
    });
  }, []);

  const addSubmission = useCallback((submission: TaskSubmission) => {
    setSubmissions(prev => [...prev, submission]);
  }, []);

  const addReview = useCallback((review: ExpertReview) => {
    setReviews(prev => [...prev, review]);
    setSubmissions(prev => prev.map(s =>
      s.id === review.submissionId ? { ...s, status: review.status === 'ACCEPTED' ? 'ACCEPTED' as const : 'NEEDS_REWORK' as const } : s
    ));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const getUserSubmissions = useCallback((listenerId: string, taskId: string) => {
    return submissionsState.filter(s => s.listenerId === listenerId && s.taskId === taskId);
  }, [submissionsState]);

  const getPendingReviews = useCallback((expertId: string) => {
    const taskExpertMap: Record<string, string> = { 'e1-4': 'u2', 'e2-4': 'u3', 'e3-4': 'u2', 'e4-4': 'u3', 'e5-4': 'u2', 'e6-4': 'u3' };
    return submissionsState.filter(s => {
      const assignedExpert = taskExpertMap[s.taskId];
      return assignedExpert === expertId && s.status === 'ON_REVIEW';
    });
  }, [submissionsState]);

  return (
    <AppContext.Provider value={{
      currentUser, progress, submissions: submissionsState, reviews: reviewsState,
      notifications: notificationsState, login, logout, updateProgress,
      addSubmission, addReview, markNotificationRead, getUserSubmissions, getPendingReviews,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
