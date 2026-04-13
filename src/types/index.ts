// 课程模块定义
export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number; // 预计学习时间（分钟）
  content: string; // Markdown 格式的课程内容
  codeExample?: string; // 示例代码
  keyPoints: string[]; // 要点
}

export interface Exercise {
  id: string;
  type: 'choice' | 'code' | 'fill';
  question: string;
  options?: string[]; // 选择题选项
  answer: string | string[]; // 正确答案
  codeTemplate?: string; // 编程题代码模板
  hint?: string;
  score: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  timeLimit: number; // 分钟
  questions: Exercise[];
  passingScore: number; // 及格分数
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  lessons: Lesson[];
  exercises: Exercise[];
  quiz: Quiz;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: string;
  category: 'progress' | 'skill' | 'challenge' | 'streak';
  points: number;
}

export interface UserProgress {
  completedLessons: string[];
  completedExercises: string[];
  quizScores: Record<string, number>;
  achievements: string[];
  totalPoints: number;
  streakDays: number;
  lastStudyDate: string;
}
