export interface CourseFormData {
  topic: string;
  level: 'beginner' | 'intermediate';
  duration: 'short' | 'medium' | 'long';
}

export interface Question {
  question: string;
  options: string[];
  correct: string;
}

export interface Lesson {
  number: number;
  title: string;
  explanation: string;
  examples: string[];
  practiceQuestions: string[];
  resources?: string[];
}

export interface Course {
  title: string;
  lessons: Lesson[];
  quiz: Question[];
  finalProject: string;
}

export interface GenerationState {
  isGenerating: boolean;
  error: string | null;
  progress: string;
}