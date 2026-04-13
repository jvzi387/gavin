import { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { BookOpen, Code, Trophy, LayoutDashboard, Home as HomeIcon, Menu, X, Brain } from 'lucide-react';
import { ProgressProvider } from './store/useProgressStore';
import Home from './pages/Home';
import CourseList from './pages/CourseList';
import ModuleDetail from './pages/ModuleDetail';
import LessonView from './pages/LessonView';
import ExerciseView from './pages/ExerciseView';
import QuizView from './pages/QuizView';
import Dashboard from './pages/Dashboard';
import Achievements from './pages/Achievements';
import DataAnalysisBasics from './pages/DataAnalysisBasics';
import './App.css';

/* ------------------------------------------------------------------ */
/*  Sidebar navigation items                                          */
/* ------------------------------------------------------------------ */

const navItems = [
  { to: '/', label: '首页', icon: HomeIcon },
  { to: '/data-analysis-basics', label: '数据分析基础', icon: Brain },
  { to: '/modules', label: '课程中心', icon: BookOpen },
  { to: '/dashboard', label: '学习仪表盘', icon: LayoutDashboard },
  { to: '/achievements', label: '成就中心', icon: Trophy },
];

/* ------------------------------------------------------------------ */
/*  Layout shell                                                      */
/* ------------------------------------------------------------------ */

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close mobile sidebar on route change
  const handleNav = () => setSidebarOpen(false);

  return (
    <div style={styles.layout}>
      {/* ---- Mobile header ---- */}
      <header style={styles.mobileHeader}>
        <button
          style={styles.hamburger}
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <span style={styles.mobileBrand}>
          <span style={{ marginRight: 6 }}>&#x1f40d;</span> PyData 学堂
        </span>
      </header>

      {/* ---- Overlay ---- */}
      {sidebarOpen && (
        <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* ---- Sidebar ---- */}
      <aside
        style={{
          ...styles.sidebar,
          transform: sidebarOpen ? 'translateX(0)' : undefined,
        }}
      >
        {/* Brand */}
        <div style={styles.brand}>
          <span style={{ fontSize: 28, marginRight: 8 }}>&#x1f40d;</span>
          <span style={styles.brandText}>PyData 学堂</span>
        </div>

        {/* Nav links */}
        <nav style={styles.nav}>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={handleNav}
              style={({ isActive }) => ({
                ...styles.navLink,
                backgroundColor: isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
                color: isActive ? '#6366f1' : '#64748b',
                borderRight: isActive ? '3px solid #6366f1' : '3px solid transparent',
              })}
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div style={styles.sidebarFooter}>
          <div style={styles.sidebarFooterText}>
            <Code size={14} />
            <span>Python 数据分析学堂</span>
          </div>
        </div>
      </aside>

      {/* ---- Main content ---- */}
      <main style={styles.main}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/data-analysis-basics" element={<DataAnalysisBasics />} />
          <Route path="/modules" element={<CourseList />} />
          <Route path="/modules/:moduleId" element={<ModuleDetail />} />
          <Route path="/modules/:moduleId/lessons/:lessonId" element={<LessonView />} />
          <Route path="/modules/:moduleId/exercises" element={<ExerciseView />} />
          <Route path="/modules/:moduleId/quiz" element={<QuizView />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/achievements" element={<Achievements />} />
        </Routes>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  App root                                                          */
/* ------------------------------------------------------------------ */

export default function App() {
  return (
    <BrowserRouter>
      <ProgressProvider>
        <AppLayout />
      </ProgressProvider>
    </BrowserRouter>
  );
}

/* ------------------------------------------------------------------ */
/*  Styles                                                            */
/* ------------------------------------------------------------------ */

const styles: Record<string, React.CSSProperties> = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans SC', sans-serif",
    backgroundColor: '#f1f5f9',
  },

  /* Mobile header */
  mobileHeader: {
    display: 'none',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 56,
    padding: '0 16px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e2e8f0',
    zIndex: 1100,
  },
  hamburger: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#334155',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
  },
  mobileBrand: {
    fontSize: 18,
    fontWeight: 700,
    color: '#1e293b',
    marginLeft: 12,
  },

  /* Overlay */
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 1000,
  },

  /* Sidebar */
  sidebar: {
    width: 260,
    minWidth: 260,
    backgroundColor: '#fff',
    borderRight: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: 0,
    height: '100vh',
    overflowY: 'auto',
    zIndex: 1050,
    transition: 'transform 0.3s ease',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    padding: '24px 20px 20px',
    borderBottom: '1px solid #f1f5f9',
  },
  brandText: {
    fontSize: 20,
    fontWeight: 800,
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.3px',
  },
  nav: {
    flex: 1,
    padding: '12px 8px',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 16px',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  },
  sidebarFooter: {
    padding: '16px 20px',
    borderTop: '1px solid #f1f5f9',
  },
  sidebarFooterText: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    color: '#94a3b8',
  },

  /* Main */
  main: {
    flex: 1,
    minHeight: '100vh',
    overflowX: 'hidden',
  },
};
