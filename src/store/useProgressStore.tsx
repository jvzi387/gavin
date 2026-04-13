import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { UserProgress } from '../types';
import { achievements } from '../data/achievements';
import { modules } from '../data/modules';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProgressActions {
  completeLesson: (id: string) => void;
  completeExercise: (id: string) => void;
  saveQuizScore: (quizId: string, score: number) => void;
  unlockAchievement: (id: string) => void;
  checkAndUpdateStreak: () => void;
  resetProgress: () => void;
}

interface ProgressContextValue extends UserProgress, ProgressActions {
  firstCodeRun: boolean;
  perfectQuiz: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'pydata-edu-progress';

const DEFAULT_PROGRESS: UserProgress = {
  completedLessons: [],
  completedExercises: [],
  quizScores: {},
  achievements: [],
  totalPoints: 0,
  streakDays: 0,
  lastStudyDate: '',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw) as Partial<UserProgress>;
    return {
      completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
      completedExercises: Array.isArray(parsed.completedExercises) ? parsed.completedExercises : [],
      quizScores: parsed.quizScores && typeof parsed.quizScores === 'object' ? parsed.quizScores : {},
      achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
      totalPoints: typeof parsed.totalPoints === 'number' ? parsed.totalPoints : 0,
      streakDays: typeof parsed.streakDays === 'number' ? parsed.streakDays : 0,
      lastStudyDate: typeof parsed.lastStudyDate === 'string' ? parsed.lastStudyDate : '',
    };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

function persistProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage full or unavailable -- silently ignore
  }
}

/** Return today's date as a YYYY-MM-DD string in the local timezone. */
function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ---------------------------------------------------------------------------
// Achievement checking
// ---------------------------------------------------------------------------

function evaluateAchievements(progress: UserProgress): string[] {
  const newlyUnlocked: string[] = [];

  const tryUnlock = (id: string) => {
    if (!progress.achievements.includes(id)) {
      newlyUnlocked.push(id);
    }
  };

  // --- Progress achievements ---

  // first-lesson: complete at least 1 lesson
  if (progress.completedLessons.length >= 1) {
    tryUnlock('first-lesson');
  }

  // module completions
  for (const mod of modules) {
    const allLessonsDone = mod.lessons.every((l) => progress.completedLessons.includes(l.id));
    if (allLessonsDone) {
      tryUnlock(`module-${mod.order}-complete`);
    }
  }

  // all-complete: every module done
  const allModulesDone = modules.every((mod) =>
    mod.lessons.every((l) => progress.completedLessons.includes(l.id)),
  );
  if (allModulesDone) {
    tryUnlock('all-complete');
  }

  // --- Skill achievements ---

  // first-code
  if (progress.completedExercises.length >= 1) {
    tryUnlock('first-code');
  }

  // quiz passes
  const quizPassMap: Record<string, string> = {
    'pb-quiz': 'quiz-pass-1',
    'pd-quiz': 'quiz-pass-2',
    'dv-quiz': 'quiz-pass-3',
    'ba-quiz': 'quiz-pass-4',
  };
  for (const mod of modules) {
    const quizId = mod.quiz.id;
    const score = progress.quizScores[quizId];
    if (score !== undefined && score >= mod.quiz.passingScore) {
      const achId = quizPassMap[quizId];
      if (achId) tryUnlock(achId);
    }
  }

  // --- Challenge achievements ---

  // perfect-score: any quiz at 100
  const anyPerfect = Object.values(progress.quizScores).some((s) => s === 100);
  if (anyPerfect) {
    tryUnlock('perfect-score');
  }

  // exercise-master: all exercises across all modules
  const allExerciseIds = modules.flatMap((m) => m.exercises.map((e) => e.id));
  const allExercisesDone = allExerciseIds.length > 0 && allExerciseIds.every((id) => progress.completedExercises.includes(id));
  if (allExercisesDone) {
    tryUnlock('exercise-master');
  }

  // --- Streak achievements ---
  if (progress.streakDays >= 3) {
    tryUnlock('streak-3');
  }
  if (progress.streakDays >= 7) {
    tryUnlock('streak-7');
  }

  // --- Points achievements ---
  if (progress.totalPoints >= 100) {
    tryUnlock('points-100');
  }
  if (progress.totalPoints >= 500) {
    tryUnlock('points-500');
  }

  return newlyUnlocked;
}

function recalcPoints(progress: UserProgress): number {
  let pts = 0;
  for (const achId of progress.achievements) {
    const ach = achievements.find((a) => a.id === achId);
    if (ach) pts += ach.points;
  }
  return pts;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ProgressContext = createContext<ProgressContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);

  // Persist on every change
  useEffect(() => {
    persistProgress(progress);
  }, [progress]);

  // --- Derived booleans ---

  const firstCodeRun = useMemo(
    () => progress.completedExercises.length > 0,
    [progress.completedExercises],
  );

  const perfectQuiz = useMemo(
    () => Object.values(progress.quizScores).some((s) => s === 100),
    [progress.quizScores],
  );

  // --- Actions ---

  const completeLesson = useCallback((id: string) => {
    setProgress((prev) => {
      if (prev.completedLessons.includes(id)) return prev;

      const next: UserProgress = {
        ...prev,
        completedLessons: [...prev.completedLessons, id],
        lastStudyDate: todayStr(),
      };

      // Check achievements
      const newAchs = evaluateAchievements(next);
      if (newAchs.length > 0) {
        next.achievements = [...next.achievements, ...newAchs];
        next.totalPoints = recalcPoints(next);
      }

      return next;
    });
  }, []);

  const completeExercise = useCallback((id: string) => {
    setProgress((prev) => {
      if (prev.completedExercises.includes(id)) return prev;

      const next: UserProgress = {
        ...prev,
        completedExercises: [...prev.completedExercises, id],
        lastStudyDate: todayStr(),
      };

      const newAchs = evaluateAchievements(next);
      if (newAchs.length > 0) {
        next.achievements = [...next.achievements, ...newAchs];
        next.totalPoints = recalcPoints(next);
      }

      return next;
    });
  }, []);

  const saveQuizScore = useCallback((quizId: string, score: number) => {
    setProgress((prev) => {
      // Keep the highest score
      const existing = prev.quizScores[quizId] ?? 0;
      if (score <= existing) return prev;

      const next: UserProgress = {
        ...prev,
        quizScores: { ...prev.quizScores, [quizId]: score },
        lastStudyDate: todayStr(),
      };

      const newAchs = evaluateAchievements(next);
      if (newAchs.length > 0) {
        next.achievements = [...next.achievements, ...newAchs];
        next.totalPoints = recalcPoints(next);
      }

      return next;
    });
  }, []);

  const unlockAchievement = useCallback((id: string) => {
    setProgress((prev) => {
      if (prev.achievements.includes(id)) return prev;

      const next: UserProgress = {
        ...prev,
        achievements: [...prev.achievements, id],
      };
      next.totalPoints = recalcPoints(next);
      return next;
    });
  }, []);

  const checkAndUpdateStreak = useCallback(() => {
    setProgress((prev) => {
      const today = todayStr();

      // Already studied today -- nothing to do
      if (prev.lastStudyDate === today) return prev;

      const yesterday = (() => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      })();

      let newStreak = prev.streakDays;

      if (prev.lastStudyDate === yesterday) {
        // Consecutive day
        newStreak += 1;
      } else if (prev.lastStudyDate !== '') {
        // Streak broken
        newStreak = 1;
      } else {
        // First time
        newStreak = 1;
      }

      const next: UserProgress = {
        ...prev,
        streakDays: newStreak,
        lastStudyDate: today,
      };

      const newAchs = evaluateAchievements(next);
      if (newAchs.length > 0) {
        next.achievements = [...next.achievements, ...newAchs];
        next.totalPoints = recalcPoints(next);
      }

      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress({ ...DEFAULT_PROGRESS });
  }, []);

  // --- Context value (memoized) ---

  const value = useMemo<ProgressContextValue>(
    () => ({
      ...progress,
      firstCodeRun,
      perfectQuiz,
      completeLesson,
      completeExercise,
      saveQuizScore,
      unlockAchievement,
      checkAndUpdateStreak,
      resetProgress,
    }),
    [progress, firstCodeRun, perfectQuiz, completeLesson, completeExercise, saveQuizScore, unlockAchievement, checkAndUpdateStreak, resetProgress],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error('useProgress must be used within a <ProgressProvider>');
  }
  return ctx;
}
