import { describe, expect, it } from 'vitest';
import { courseStats, lessons, problems, resources, tracks } from '../lib/course-data';
import { completionPercent, emptyProgress, isDue, migrateProgress, sanitizeYouTubeId, scheduleReview } from '../lib/progress';

describe('course manifest', () => {
  it('contains the complete source inventories', () => {
    expect(tracks).toHaveLength(13);
    expect(courseStats.hldProblems).toBe(45);
    expect(courseStats.lldProblems).toBe(33);
    expect(courseStats.videos).toBe(37);
    expect(courseStats.papers).toBe(10);
    expect(resources.filter(item => item.kind === 'case-study')).toHaveLength(6);
  });

  it('uses stable unique identifiers and slugs', () => {
    expect(new Set(lessons.map(item => item.id)).size).toBe(lessons.length);
    expect(new Set(lessons.map(item => item.slug)).size).toBe(lessons.length);
    expect(new Set(problems.map(item => item.id)).size).toBe(problems.length);
    expect(new Set(problems.map(item => item.slug)).size).toBe(problems.length);
  });

  it('gives every lesson the complete learning shape', () => {
    for (const lesson of lessons) {
      expect(lesson.summary.length).toBeGreaterThan(60);
      expect(lesson.mentalModel.length).toBeGreaterThan(40);
      expect(lesson.example.length).toBeGreaterThan(60);
      expect(lesson.tradeoffs).toHaveLength(3);
      expect(lesson.mistakes).toHaveLength(3);
      expect(lesson.quiz.options).toHaveLength(4);
    }
  });

  it('gives every design problem a complete rubric', () => {
    for (const problem of problems) {
      expect(problem.focus).toHaveLength(5);
      expect(problem.rubric).toHaveLength(5);
      if (problem.kind === 'LLD') expect(problem.javaStarter).toContain('public final class');
    }
  });

  it('accepts only safe YouTube identifiers', () => {
    for (const video of resources.filter(item => item.kind === 'video')) {
      expect(sanitizeYouTubeId(video.videoId ?? '')).toBe(video.videoId);
    }
    expect(sanitizeYouTubeId('bad/id?x=1')).toBeNull();
  });
});

describe('local progress', () => {
  it('recovers safely from invalid legacy data', () => {
    expect(migrateProgress(null)).toEqual(emptyProgress());
    expect(migrateProgress({ completedLessonIds: ['lesson-001', 4], version: 1 }).completedLessonIds).toEqual(['lesson-001']);
  });

  it('calculates bounded completion', () => {
    expect(completionPercent(['a', 'a', 'b'], 4)).toBe(50);
    expect(completionPercent([], 0)).toBe(0);
  });

  it('schedules deterministic reviews', () => {
    const now = new Date('2026-09-09T00:00:00.000Z');
    const good = scheduleReview(undefined, 'good', now);
    expect(good.intervalDays).toBe(3);
    expect(isDue(good, now)).toBe(false);
    expect(scheduleReview(good, 'again', now).intervalDays).toBe(0);
  });
});
