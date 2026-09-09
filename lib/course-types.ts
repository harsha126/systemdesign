export type Track = {
  id: string;
  order: number;
  title: string;
  description: string;
  accent: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type Lesson = {
  id: string;
  slug: string;
  trackId: string;
  title: string;
  category: string;
  duration: number;
  level: 'foundation' | 'intermediate' | 'advanced';
  summary: string;
  mentalModel: string;
  example: string;
  tradeoffs: string[];
  mistakes: string[];
  prerequisites: string[];
  quiz: QuizQuestion;
  source: 'original' | 'hld-repo' | 'lld-repo';
};

export type DesignProblem = {
  id: string;
  slug: string;
  kind: 'HLD' | 'LLD';
  title: string;
  level: 'Easy' | 'Medium' | 'Hard';
  duration: number;
  prompt: string;
  focus: string[];
  rubric: string[];
  sourceUrl: string;
  videoId?: string;
  javaStarter?: string;
};

export type Resource = {
  id: string;
  title: string;
  kind: 'video' | 'channel' | 'paper' | 'case-study' | 'repository' | 'book';
  url: string;
  description: string;
  videoId?: string;
};

export type ReviewCard = {
  id: string;
  lessonId: string;
  front: string;
  back: string;
};
