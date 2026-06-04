export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  nickname: string;
  avatar: string;
  level: number;
  exp: number;
  achievements: string[];
  completedCourses: string[];
  completedExercises: string[];
  createdAt: number;
  lastLogin: number;
}

export interface AuthState {
  isLoggedIn: boolean;
  currentUser: User | null;
  token: string | null;
}

const defaultUsers: User[] = [
  {
    id: 'user-1',
    username: 'admin',
    email: 'admin@example.com',
    password: '123456',
    nickname: '数据分析大师',
    avatar: '👨‍💼',
    level: 10,
    exp: 9500,
    achievements: ['first_login', 'complete_first_course', 'data_explorer', 'code_master', 'speed_learner'],
    completedCourses: ['course-1', 'course-2', 'course-3', 'course-4', 'course-5'],
    completedExercises: ['ex-1-1-1', 'ex-1-2-1', 'ex-2-1-1', 'ex-2-2-1', 'ex-3-1-1'],
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    lastLogin: Date.now()
  },
  {
    id: 'user-2',
    username: 'student1',
    email: 'student1@example.com',
    password: '123456',
    nickname: '数据新手小白',
    avatar: '👨‍🎓',
    level: 3,
    exp: 1200,
    achievements: ['first_login', 'complete_first_course'],
    completedCourses: ['course-1'],
    completedExercises: ['ex-1-1-1'],
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    lastLogin: Date.now() - 2 * 24 * 60 * 60 * 1000
  },
  {
    id: 'user-3',
    username: 'data_pro',
    email: 'data_pro@example.com',
    password: '123456',
    nickname: '数据分析师',
    avatar: '👩‍💻',
    level: 7,
    exp: 5600,
    achievements: ['first_login', 'complete_first_course', 'data_explorer', 'code_master'],
    completedCourses: ['course-1', 'course-2', 'course-3', 'course-5'],
    completedExercises: ['ex-1-1-1', 'ex-1-2-1', 'ex-2-1-1', 'ex-3-1-1', 'ex-5-1-1'],
    createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
    lastLogin: Date.now() - 1 * 24 * 60 * 60 * 1000
  }
];

let users: User[] = JSON.parse(localStorage.getItem('users') || JSON.stringify(defaultUsers));
let currentUser: User | null = JSON.parse(localStorage.getItem('currentUser') || 'null');

export const auth = {
  login: (username: string, password: string): { success: boolean; message: string; user?: User } => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      user.lastLogin = Date.now();
      currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('users', JSON.stringify(users));
      return { success: true, message: '登录成功', user };
    }
    return { success: false, message: '用户名或密码错误' };
  },

  register: (username: string, email: string, password: string, nickname: string): { success: boolean; message: string; user?: User } => {
    if (users.find(u => u.username === username)) {
      return { success: false, message: '用户名已存在' };
    }
    if (users.find(u => u.email === email)) {
      return { success: false, message: '邮箱已被注册' };
    }
    
    const avatars = ['👨‍💼', '👩‍💼', '👨‍🎓', '👩‍🎓', '👨‍💻', '👩‍💻', '🧑‍💼', '🧑‍🎓', '🧑‍💻'];
    const newUser: User = {
      id: `user-${Date.now()}`,
      username,
      email,
      password,
      nickname: nickname || username,
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
      level: 1,
      exp: 0,
      achievements: [],
      completedCourses: [],
      completedExercises: [],
      createdAt: Date.now(),
      lastLogin: Date.now()
    };
    
    users.push(newUser);
    currentUser = newUser;
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return { success: true, message: '注册成功', user: newUser };
  },

  logout: () => {
    currentUser = null;
    localStorage.removeItem('currentUser');
  },

  getCurrentUser: (): User | null => {
    return currentUser;
  },

  isLoggedIn: (): boolean => {
    return currentUser !== null;
  },

  addExp: (amount: number): User | null => {
    if (!currentUser) return null;
    currentUser.exp += amount;
    const expNeeded = currentUser.level * 1000;
    if (currentUser.exp >= expNeeded) {
      currentUser.level += 1;
      currentUser.exp -= expNeeded;
    }
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    const idx = users.findIndex(u => u.id === currentUser!.id);
    if (idx !== -1) {
      users[idx] = currentUser;
      localStorage.setItem('users', JSON.stringify(users));
    }
    return currentUser;
  },

  completeCourse: (courseId: string): User | null => {
    if (!currentUser) return null;
    if (!currentUser.completedCourses.includes(courseId)) {
      currentUser.completedCourses.push(courseId);
      auth.addExp(500);
      if (currentUser.completedCourses.length === 1) {
        auth.unlockAchievement('complete_first_course');
      }
    }
    return currentUser;
  },

  completeExercise: (exerciseId: string): User | null => {
    if (!currentUser) return null;
    if (!currentUser.completedExercises.includes(exerciseId)) {
      currentUser.completedExercises.push(exerciseId);
      auth.addExp(100);
      if (currentUser.completedExercises.length === 10) {
        auth.unlockAchievement('code_master');
      }
    }
    return currentUser;
  },

  unlockAchievement: (achievementId: string): boolean => {
    if (!currentUser) return false;
    if (!currentUser.achievements.includes(achievementId)) {
      currentUser.achievements.push(achievementId);
      auth.addExp(200);
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      const idx = users.findIndex(u => u.id === currentUser!.id);
      if (idx !== -1) {
        users[idx] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
      }
      return true;
    }
    return false;
  },

  getAllUsers: (): User[] => {
    return users;
  },

  getLeaderboard: (): User[] => {
    return [...users].sort((a, b) => {
      const scoreA = a.level * 1000 + a.exp;
      const scoreB = b.level * 1000 + b.exp;
      return scoreB - scoreA;
    });
  }
};

export const achievements = {
  'first_login': {
    id: 'first_login',
    name: '初来乍到',
    description: '完成首次登录',
    icon: '👋',
    points: 50,
    unlocked: false
  },
  'complete_first_course': {
    id: 'complete_first_course',
    name: '初学者',
    description: '完成第一门课程',
    icon: '🎓',
    points: 200,
    unlocked: false
  },
  'data_explorer': {
    id: 'data_explorer',
    name: '数据探索者',
    description: '完成5个练习',
    icon: '🔍',
    points: 300,
    unlocked: false
  },
  'code_master': {
    id: 'code_master',
    name: '代码大师',
    description: '完成10个练习',
    icon: '💻',
    points: 500,
    unlocked: false
  },
  'speed_learner': {
    id: 'speed_learner',
    name: '速学者',
    description: '在一周内完成3门课程',
    icon: '⚡',
    points: 400,
    unlocked: false
  },
  'data_analyst': {
    id: 'data_analyst',
    name: '数据分析师',
    description: '完成所有初级课程',
    icon: '📊',
    points: 600,
    unlocked: false
  },
  'advanced_analyst': {
    id: 'advanced_analyst',
    name: '高级分析师',
    description: '完成所有中级课程',
    icon: '📈',
    points: 800,
    unlocked: false
  },
  'data_scientist': {
    id: 'data_scientist',
    name: '数据科学家',
    description: '完成所有课程',
    icon: '🏆',
    points: 1000,
    unlocked: false
  },
  'perfectionist': {
    id: 'perfectionist',
    name: '完美主义者',
    description: '完成所有练习',
    icon: '✨',
    points: 1200,
    unlocked: false
  },
  'streak_7': {
    id: 'streak_7',
    name: '连续7天学习',
    description: '连续7天每天至少完成一个练习',
    icon: '🔥',
    points: 350,
    unlocked: false
  }
};

export type AchievementKey = keyof typeof achievements;