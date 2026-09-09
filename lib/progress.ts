export const STORAGE_KEY = 'system-architect-progress';
export const PROGRESS_VERSION = 2;

export type CardRating = 'again' | 'hard' | 'good' | 'easy';

export type CardSchedule = {
  dueAt: string;
  intervalDays: number;
  repetitions: number;
};

export type LearnerProgress = {
  version: number;
  completedLessonIds: string[];
  bookmarkedLessonIds: string[];
  quizScores: Record<string, number>;
  notes: Record<string, string>;
  worksheets: Record<string, Record<string, string>>;
  completedProblemIds: string[];
  cardSchedules: Record<string, CardSchedule>;
  lastLessonId?: string;
};

export const emptyProgress = (): LearnerProgress => ({
  version: PROGRESS_VERSION,
  completedLessonIds: [],
  bookmarkedLessonIds: [],
  quizScores: {},
  notes: {},
  worksheets: {},
  completedProblemIds: [],
  cardSchedules: {},
});

export function migrateProgress(value: unknown): LearnerProgress {
  if (!value || typeof value !== 'object') return emptyProgress();
  const raw = value as Partial<LearnerProgress>;
  const strings = (candidate: unknown) => Array.isArray(candidate) ? candidate.filter((item): item is string => typeof item === 'string') : [];
  const records = (candidate: unknown) => candidate && typeof candidate === 'object' && !Array.isArray(candidate) ? candidate as Record<string, never> : {};
  return {
    version: PROGRESS_VERSION,
    completedLessonIds: strings(raw.completedLessonIds),
    bookmarkedLessonIds: strings(raw.bookmarkedLessonIds),
    quizScores: records(raw.quizScores),
    notes: records(raw.notes),
    worksheets: records(raw.worksheets),
    completedProblemIds: strings(raw.completedProblemIds),
    cardSchedules: records(raw.cardSchedules),
    lastLessonId: typeof raw.lastLessonId === 'string' ? raw.lastLessonId : undefined,
  };
}

export function loadProgress(storage: Pick<Storage, 'getItem'>): LearnerProgress {
  try {
    const value = storage.getItem(STORAGE_KEY);
    return value ? migrateProgress(JSON.parse(value)) : emptyProgress();
  } catch {
    return emptyProgress();
  }
}

export function completionPercent(completed: string[], total: number) {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((new Set(completed).size / total) * 100));
}

export function scheduleReview(previous: CardSchedule | undefined, rating: CardRating, now = new Date()): CardSchedule {
  const repetitions = rating === 'again' ? 0 : (previous?.repetitions ?? 0) + 1;
  const base = previous?.intervalDays ?? 0;
  const intervalDays = rating === 'again' ? 0 : rating === 'hard' ? Math.max(1, Math.round(base * 1.4) || 1) : rating === 'good' ? Math.max(2, Math.round(base * 2.2) || 3) : Math.max(4, Math.round(base * 3.2) || 7);
  const due = new Date(now);
  if (rating === 'again') due.setMinutes(due.getMinutes() + 10);
  else due.setDate(due.getDate() + intervalDays);
  return { dueAt: due.toISOString(), intervalDays, repetitions };
}

export function isDue(schedule: CardSchedule | undefined, now = new Date()) {
  return !schedule || new Date(schedule.dueAt).getTime() <= now.getTime();
}

export function sanitizeYouTubeId(id: string) {
  return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
}
