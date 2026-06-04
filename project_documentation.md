# 📊 数据分析在线教育平台 - 项目文档

---

## 1. 项目概述

本项目是一个专为商务数据分析与应用专业学生设计的在线教育平台，提供完整的Python数据分析学习体验。

### 核心功能

| 功能模块 | 描述 |
|---------|------|
| 用户系统 | 登录、注册、个人中心、学习进度管理 |
| 课程系统 | 课程展示、章节学习、在线代码练习 |
| 成就系统 | 成就解锁、积分奖励、排行榜 |
| 代码编辑器 | 浏览器端Python执行环境 |

---

## 2. 技术栈

| 分类 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 前端框架 | React | 18.3.1 | UI组件库 |
| 类型系统 | TypeScript | 5.8.3 | 类型安全 |
| 构建工具 | Vite | 6.4.2 | 快速构建 |
| 样式框架 | Tailwind CSS | 3.4.17 | 原子化CSS |
| 路由管理 | React Router | 7.14.0 | 页面导航 |
| 代码编辑器 | Monaco Editor | 4.7.0 | 代码编辑组件 |
| Python运行 | Pyodide | 0.29.3 | 浏览器端Python |
| 图标库 | Lucide React | 0.511.0 | 图标组件 |
| 数据存储 | LocalStorage | - | 本地持久化 |

---

## 3. 项目结构

```
/workspace/
├── public/                    # 静态资源
│   └── favicon.svg           # 网站图标
├── src/                       # 源代码
│   ├── assets/               # 静态资源
│   │   └── react.svg
│   ├── components/           # 可复用组件
│   │   ├── CodeEditor.tsx    # 代码编辑器
│   │   ├── CourseModal.tsx   # 课程弹窗
│   │   └── Empty.tsx         # 空状态
│   ├── data/                 # 数据层
│   │   ├── analysis/         # 数据分析脚本
│   │   │   ├── advanced_analysis.py
│   │   │   ├── basket_analysis.py
│   │   │   ├── online_retail_analysis.py
│   │   │   └── supermarket_basket_analysis.py
│   │   ├── datasets/         # 数据集文件
│   │   │   ├── attendance.csv
│   │   │   ├── churn_data.csv
│   │   │   ├── customers.csv
│   │   │   ├── ecommerce_sales.csv
│   │   │   └── ...其他数据集
│   │   ├── courses.ts        # 课程数据
│   │   ├── projects.ts       # 项目数据
│   │   └── users.ts          # 用户与成就数据
│   ├── hooks/                # 自定义Hook
│   │   └── useTheme.ts       # 主题管理
│   ├── lib/                  # 工具库
│   │   ├── pyodide.ts        # Pyodide封装
│   │   ├── storage.ts        # 存储工具
│   │   └── utils.ts          # 通用工具
│   ├── pages/                # 页面组件
│   │   ├── Home.tsx          # 首页
│   │   ├── Courses.tsx       # 课程中心
│   │   ├── CourseDetail.tsx  # 课程详情
│   │   ├── Learn.tsx         # 学习页面
│   │   ├── Achievements.tsx  # 成就系统
│   │   ├── Profile.tsx       # 个人中心
│   │   ├── Login.tsx         # 登录页面
│   │   ├── Register.tsx      # 注册页面
│   │   └── ...其他页面
│   ├── App.tsx               # 应用入口
│   ├── main.tsx              # 主入口
│   └── index.css             # 全局样式
├── package.json              # 依赖配置
├── tsconfig.json             # TypeScript配置
├── vite.config.ts            # Vite配置
├── tailwind.config.js        # Tailwind配置
└── postcss.config.js         # PostCSS配置
```

---

## 4. 核心组件详解

### 4.1 课程弹窗组件

**文件**: [src/components/CourseModal.tsx](file:///workspace/src/components/CourseModal.tsx)

```tsx
interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CourseModal: React.FC<CourseModalProps> = ({ isOpen, onClose }) => {
  // 三段Python代码示例
  const codeSamples = [
    `import pandas as pd\nimport numpy as np\n\n# 读取CSV文件\ndf = pd.read_csv('user_orders.csv')\n\n# 查看数据形状\nprint("数据形状:", df.shape)\n\n# 查看数据类型\nprint("\\n数据类型:")\nprint(df.dtypes)\n\n# 查看统计描述\nprint("\\n统计描述:")\nprint(df.describe())`,
    `# 处理缺失值\nprint("缺失值统计:")\nprint(df.isnull().sum())\n\n# 金额列用中位数填充\nif 'amount' in df.columns:\n    df['amount'] = df['amount'].fillna(df['amount'].median())\n\n# 地区列用众数填充\nif 'region' in df.columns:\n    df['region'] = df['region'].fillna(df['region'].mode()[0])`,
    `# 删除重复订单\ndf = df.drop_duplicates(subset=['order_id'])\n\n# 过滤异常值\ndf = df[(df['amount'] > 0) & (df['amount'] <= 100000)]\n\n# 转换日期列\nif 'order_date' in df.columns:\n    df['order_date'] = pd.to_datetime(df['order_date'], errors='coerce')`
  ];
  
  // 点击背景关闭弹窗
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">📊 Pandas 数据清洗实战</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl">×</button>
        </div>
        {/* 代码示例展示 */}
        <div className="p-6 space-y-6">
          {codeSamples.map((code, index) => (
            <div key={index}>
              <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm mb-2">
                示例 {index + 1}
              </div>
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <pre className="p-4 text-green-400 text-sm font-mono overflow-x-auto">
                  <code>{code}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
        {/* 底部按钮 */}
        <div className="p-6 border-t flex justify-end">
          <button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
            开始学习
          </button>
        </div>
      </div>
    </div>
  );
};
```

### 4.2 首页组件

**文件**: [src/pages/Home.tsx](file:///workspace/src/pages/Home.tsx)

```tsx
const achievementData = [
  { id: "achievement-1", name: "✨ 初识数据", unlocked: false },
  { id: "achievement-2", name: "数据探索者", unlocked: false },
  { id: "achievement-3", name: "代码大师", unlocked: false },
];

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [achievements, setAchievements] = useState(achievementData);

  // 从localStorage加载成就状态
  useEffect(() => {
    const saved = localStorage.getItem("achievements");
    if (saved) {
      setAchievements(JSON.parse(saved));
    }
  }, []);

  // 保存成就状态
  const saveAchievements = (newAchievements: typeof achievementData) => {
    setAchievements(newAchievements);
    localStorage.setItem("achievements", JSON.stringify(newAchievements));
  };

  // 解锁成就
  const unlockAchievement = (id: string) => {
    const updated = achievements.map(a => 
      a.id === id ? { ...a, unlocked: true } : a
    );
    saveAchievements(updated);
  };

  // 关闭弹窗时解锁第一个成就
  const handleModalClose = () => {
    setIsModalOpen(false);
    unlockAchievement("achievement-1");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 英雄区 */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">数据分析在线教育平台</h1>
          <p className="text-xl mb-8">专为商务数据分析与应用专业学生设计</p>
          <div className="flex justify-center gap-4">
            <Link to="/courses" className="bg-white text-blue-600 px-6 py-3 rounded-md">
              浏览课程
            </Link>
            <Link to="/achievements" className="border-2 border-white text-white px-6 py-3 rounded-md">
              查看成就系统
            </Link>
          </div>
        </div>
      </section>

      {/* 数据分析基础模块 - 点击"开始学习"触发弹窗 */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-white text-blue-700 px-8 py-3 rounded-md"
        >
          开始学习
        </button>
      </section>

      {/* 成就展示 */}
      <section className="py-16 bg-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`bg-white rounded-lg p-6 flex flex-col items-center ${
                achievement.unlocked ? 'hover:-translate-y-1' : 'opacity-60'
              }`}
            >
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 text-4xl ${
                achievement.unlocked ? 'bg-gradient-to-br from-yellow-100 to-orange-100' : 'bg-gray-200'
              }`}>
                {achievement.unlocked ? '🏆' : '🔒'}
              </div>
              <p className={`font-semibold text-lg ${
                achievement.unlocked ? 'text-gray-800' : 'text-gray-500'
              }`}>
                {achievement.unlocked ? `${achievement.name} ✅` : achievement.name}
              </p>
              {achievement.unlocked && (
                <p className="text-xs text-green-600 mt-2">已解锁</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <CourseModal isOpen={isModalOpen} onClose={handleModalClose} />
    </div>
  );
}
```

### 4.3 用户认证模块

**文件**: [src/data/users.ts](file:///workspace/src/data/users.ts)

```tsx
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

// 成就定义
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
    description: '一周内完成3门课程',
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
    description: '连续7天每天完成至少一个练习',
    icon: '🔥',
    points: 350,
    unlocked: false
  }
};

// 认证API
export const auth = {
  login: (username: string, password: string) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      user.lastLogin = Date.now();
      currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true, message: '登录成功', user };
    }
    return { success: false, message: '用户名或密码错误' };
  },

  register: (username: string, email: string, password: string, nickname: string) => {
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

  addExp: (amount: number) => {
    if (!currentUser) return null;
    currentUser.exp += amount;
    const expNeeded = currentUser.level * 1000;
    if (currentUser.exp >= expNeeded) {
      currentUser.level += 1;
      currentUser.exp -= expNeeded;
    }
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    return currentUser;
  },

  unlockAchievement: (achievementId: string) => {
    if (!currentUser) return false;
    if (!currentUser.achievements.includes(achievementId)) {
      currentUser.achievements.push(achievementId);
      auth.addExp(200);
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      return true;
    }
    return false;
  },

  getLeaderboard: () => {
    return [...users].sort((a, b) => {
      const scoreA = a.level * 1000 + a.exp;
      const scoreB = b.level * 1000 + b.exp;
      return scoreB - scoreA;
    });
  }
};
```

### 4.4 路由配置

**文件**: [src/App.tsx](file:///workspace/src/App.tsx)

```tsx
function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setUser(auth.getCurrentUser());
  }, []);

  const handleLogout = () => {
    auth.logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <Link to="/" className="text-xl font-bold text-blue-600">数据分析教育平台</Link>
        <div className="flex justify-between items-center">
          <div className="flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600">首页</Link>
            <Link to="/courses" className="text-gray-700 hover:text-blue-600">课程中心</Link>
            <Link to="/achievements" className="text-gray-700 hover:text-blue-600">成就系统</Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/profile" className="flex items-center space-x-2">
                  <span>{user.avatar}</span>
                  <span>{user.nickname}</span>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Lv.{user.level}</span>
                </Link>
                <button onClick={handleLogout} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md">
                  登出
                </button>
              </>
            ) : (
              <button onClick={() => navigate('/login')} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                登录
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  if (!auth.isLoggedIn()) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={
            <>
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/courses/:id" element={<CourseDetail />} />
                  <Route path="/learn/:courseId/:chapterId" element={<Learn />} />
                  <Route path="/achievements" element={<Achievements />} />
                  <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
                </Routes>
              </main>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}
```

---

## 5. 课程数据结构

**文件**: [src/data/courses.ts](file:///workspace/src/data/courses.ts)

```tsx
export interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: '初级' | '中级' | '高级';
  category: string;
  coverColor: string;
  chapters: Chapter[];
  projectId?: string;
  videoUrl?: string;
  resources?: Resource[];
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  content: string;
  videoUrl?: string;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  datasetGeneratorCode: string;
  hints: string[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'video' | 'document' | 'notebook' | 'dataset';
  url: string;
  description: string;
}
```

---

## 6. 运行命令

```bash
# 安装依赖
npm install

# 开发模式（端口 5173）
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview

# 代码检查
npm run lint
```

---

## 7. 测试账号

| 账号 | 密码 | 描述 |
|------|------|------|
| admin | 123456 | 管理员账号，等级10 |
| student1 | 123456 | 学生账号，等级3 |
| data_pro | 123456 | 数据分析师，等级7 |

---

## 8. 功能测试清单

### 课程弹窗测试
- [ ] 点击"开始学习"按钮弹出白色模态框
- [ ] 弹窗显示 "📊 Pandas 数据清洗实战" 标题
- [ ] 弹窗包含三段Python代码示例
- [ ] 点击右上角 × 关闭弹窗
- [ ] 点击背景灰色区域关闭弹窗

### 成就系统测试
- [ ] 关闭弹窗后成就"✨ 初识数据"自动解锁
- [ ] 解锁的成就显示 ✅ 标记
- [ ] 刷新页面成就保持解锁状态
- [ ] 未解锁成就显示 🔒 且半透明

### 用户系统测试
- [ ] 登录功能正常
- [ ] 注册功能正常
- [ ] 个人中心显示学习进度
- [ ] 排行榜显示用户排名

---

## 9. 部署说明

### Cloudflare Pages 部署

1. **仓库准备**: 将代码推送到 GitHub/GitLab
2. **连接仓库**: 在 Cloudflare Pages 中连接您的仓库
3. **配置构建**:
   - 构建命令: `npm run build`
   - 构建输出目录: `dist`
4. **部署**: 点击部署按钮完成部署

---

## 10. 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| v1.0.0 | 2024-01-01 | 初始版本，基础课程系统 |
| v1.1.0 | 2024-01-15 | 添加成就系统和排行榜 |
| v1.2.0 | 2024-02-01 | 添加在线代码编辑器 |
| v1.3.0 | 2024-02-15 | 添加用户认证系统 |
| v1.4.0 | 2024-03-01 | 课程弹窗与成就解锁功能 |

---

*项目文档生成于 2026-06-04*