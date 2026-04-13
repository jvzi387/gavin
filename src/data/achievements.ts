import type { Achievement } from '../types';

export const achievements: Achievement[] = [
  // 进度类
  {
    id: 'first-lesson',
    title: '初出茅庐',
    description: '完成第一节课的学习',
    icon: '🌟',
    condition: 'complete_lesson_1',
    category: 'progress',
    points: 10
  },
  {
    id: 'module-1-complete',
    title: 'Python 入门者',
    description: '完成 Python 基础入门全部课程',
    icon: '🐍',
    condition: 'complete_module_python-basics',
    category: 'progress',
    points: 50
  },
  {
    id: 'module-2-complete',
    title: '数据处理达人',
    description: '完成 Pandas 数据处理全部课程',
    icon: '🐼',
    condition: 'complete_module_pandas-data',
    category: 'progress',
    points: 50
  },
  {
    id: 'module-3-complete',
    title: '可视化专家',
    description: '完成数据可视化全部课程',
    icon: '📊',
    condition: 'complete_module_data-viz',
    category: 'progress',
    points: 50
  },
  {
    id: 'module-4-complete',
    title: '分析大师',
    description: '完成商务数据分析实战全部课程',
    icon: '💼',
    condition: 'complete_module_business-analysis',
    category: 'progress',
    points: 50
  },
  {
    id: 'all-complete',
    title: '全栈数据分析师',
    description: '完成所有课程模块',
    icon: '🏆',
    condition: 'complete_all_modules',
    category: 'progress',
    points: 100
  },
  // 技能类
  {
    id: 'first-code',
    title: '代码新手',
    description: '第一次在编辑器中运行 Python 代码',
    icon: '💻',
    condition: 'run_first_code',
    category: 'skill',
    points: 15
  },
  {
    id: 'quiz-pass-1',
    title: '基础达标',
    description: '通过 Python 基础测评',
    icon: '✅',
    condition: 'pass_quiz_pb-quiz',
    category: 'skill',
    points: 30
  },
  {
    id: 'quiz-pass-2',
    title: '数据处理认证',
    description: '通过 Pandas 测评',
    icon: '✅',
    condition: 'pass_quiz_pd-quiz',
    category: 'skill',
    points: 30
  },
  {
    id: 'quiz-pass-3',
    title: '可视化认证',
    description: '通过数据可视化测评',
    icon: '✅',
    condition: 'pass_quiz_dv-quiz',
    category: 'skill',
    points: 30
  },
  {
    id: 'quiz-pass-4',
    title: '实战认证',
    description: '通过商务分析综合测评',
    icon: '✅',
    condition: 'pass_quiz_ba-quiz',
    category: 'skill',
    points: 30
  },
  // 挑战类
  {
    id: 'perfect-score',
    title: '满分学霸',
    description: '在任意测评中获得满分',
    icon: '💯',
    condition: 'perfect_quiz_score',
    category: 'challenge',
    points: 50
  },
  {
    id: 'exercise-master',
    title: '练习达人',
    description: '完成所有模块的全部练习',
    icon: '📝',
    condition: 'complete_all_exercises',
    category: 'challenge',
    points: 60
  },
  // 连续学习
  {
    id: 'streak-3',
    title: '三日连续',
    description: '连续3天登录学习',
    icon: '🔥',
    condition: 'streak_3',
    category: 'streak',
    points: 20
  },
  {
    id: 'streak-7',
    title: '一周坚持',
    description: '连续7天登录学习',
    icon: '🔥',
    condition: 'streak_7',
    category: 'streak',
    points: 40
  },
  {
    id: 'points-100',
    title: '百分先锋',
    description: '累计获得100积分',
    icon: '⭐',
    condition: 'points_100',
    category: 'challenge',
    points: 0
  },
  {
    id: 'points-500',
    title: '五百精英',
    description: '累计获得500积分',
    icon: '🌟',
    condition: 'points_500',
    category: 'challenge',
    points: 0
  }
];
