import { Link } from 'react-router-dom';
import { BookOpen, Code, Trophy, Zap, ArrowRight, Brain, ChevronRight } from 'lucide-react';
import { modules } from '../data/modules';
import { useProgress } from '../store/useProgressStore';

/* ------------------------------------------------------------------ */
/*  Feature cards data                                                */
/* ------------------------------------------------------------------ */

const features = [
  {
    icon: <BookOpen size={28} />,
    title: '完整课程体系',
    desc: '从 Python 基础到商务数据分析实战，循序渐进的课程设计',
    color: '#6366f1',
    bg: '#eef2ff',
  },
  {
    icon: <Code size={28} />,
    title: '在线代码运行',
    desc: '内置代码编辑器，边学边练，即时看到运行结果',
    color: '#10b981',
    bg: '#ecfdf5',
  },
  {
    icon: <Zap size={28} />,
    title: '互动式学习',
    desc: '丰富的练习题和阶段测评，巩固所学知识',
    color: '#f59e0b',
    bg: '#fffbeb',
  },
  {
    icon: <Trophy size={28} />,
    title: '成就激励系统',
    desc: '解锁成就、积累积分，让学习更有动力',
    color: '#ef4444',
    bg: '#fef2f2',
  },
];

/* ------------------------------------------------------------------ */
/*  Stats data                                                        */
/* ------------------------------------------------------------------ */

const stats = [
  { value: '4', label: '课程模块' },
  { value: '15+', label: '精选课时' },
  { value: '50+', label: '练习题目' },
  { value: '16', label: '成就徽章' },
];

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function Home() {
  const { completedLessons } = useProgress();

  return (
    <div style={styles.page}>
      {/* ========== Hero ========== */}
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <h1 style={styles.heroTitle}>Python 数据分析在线学堂</h1>
          <p style={styles.heroSubtitle}>
            商务数据分析与应用专业 &middot; 从零基础到实战应用
          </p>
          <Link to="/modules" style={styles.ctaButton}>
            开始学习 <ArrowRight size={18} style={{ marginLeft: 6 }} />
          </Link>
        </div>
      </section>

      {/* ========== Features ========== */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>平台特色</h2>
        <div style={styles.featureGrid}>
          {features.map((f) => (
            <div key={f.title} style={styles.featureCard}>
              <div style={{ ...styles.featureIcon, backgroundColor: f.bg, color: f.color }}>
                {f.icon}
              </div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========== Data Analysis Basics Banner ========== */}
      <section style={styles.section}>
        <Link to="/data-analysis-basics" style={styles.basicsBanner}>
          <div style={styles.basicsBannerLeft}>
            <div style={styles.basicsIconWrap}>
              <Brain size={32} color="#6366f1" />
            </div>
            <div>
              <h2 style={styles.basicsBannerTitle}>📖 数据分析基础</h2>
              <p style={styles.basicsBannerDesc}>
                AI 时代 Python 数据分析知识框架 — 从 AI 协作基础到高级分析，系统化学习路线
              </p>
              <div style={styles.basicsTags}>
                <span style={styles.basicsTag}>🤖 AI 协作</span>
                <span style={styles.basicsTag}>📊 6 大板块</span>
                <span style={styles.basicsTag}>📅 4 周路径</span>
                <span style={styles.basicsTag}>🔄 传统 vs AI 对比</span>
              </div>
            </div>
          </div>
          <div style={styles.basicsBannerRight}>
            <span style={styles.basicsBannerBtn}>
              查看知识框架 <ChevronRight size={16} />
            </span>
          </div>
        </Link>
      </section>

      {/* ========== Module overview ========== */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>课程模块</h2>
        <div style={styles.moduleGrid}>
          {modules.map((mod) => {
            const done = mod.lessons.filter((l) => completedLessons.includes(l.id)).length;
            const total = mod.lessons.length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;

            return (
              <Link
                key={mod.id}
                to={`/modules/${mod.id}`}
                style={{ ...styles.moduleCard, borderLeft: `4px solid ${mod.color}` }}
              >
                <span style={{ fontSize: 36 }}>{mod.icon}</span>
                <div style={styles.moduleCardBody}>
                  <h3 style={styles.moduleTitle}>{mod.title}</h3>
                  <p style={styles.moduleDesc}>{mod.description}</p>
                  <div style={styles.progressBarWrap}>
                    <div style={styles.progressBarBg}>
                      <div
                        style={{ ...styles.progressBarFill, width: `${pct}%`, backgroundColor: mod.color }}
                      />
                    </div>
                    <span style={styles.progressLabel}>
                      {done}/{total} 课时 &middot; {pct}%
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ========== Stats ========== */}
      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          {stats.map((s) => (
            <div key={s.label} style={styles.statCard}>
              <div style={styles.statValue}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Styles                                                            */
/* ------------------------------------------------------------------ */

const styles: Record<string, React.CSSProperties> = {
  page: {
    paddingBottom: 60,
  },

  /* Hero */
  hero: {
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)',
    padding: '72px 32px 64px',
    textAlign: 'center' as const,
    color: '#fff',
  },
  heroInner: {
    maxWidth: 720,
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: 38,
    fontWeight: 800,
    lineHeight: 1.2,
    marginBottom: 16,
    letterSpacing: '-0.5px',
  },
  heroSubtitle: {
    fontSize: 18,
    opacity: 0.9,
    marginBottom: 32,
    fontWeight: 400,
  },
  ctaButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '14px 36px',
    backgroundColor: '#fff',
    color: '#6366f1',
    fontWeight: 700,
    fontSize: 16,
    borderRadius: 12,
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },

  /* Section */
  section: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '48px 24px',
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: 28,
    textAlign: 'center' as const,
  },

  /* Features */
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
    gap: 20,
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: '28px 24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  featureIcon: {
    width: 52,
    height: 52,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: 8,
  },
  featureDesc: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 1.6,
  },

  /* Module cards */
  moduleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 20,
  },

  /* Data Analysis Basics Banner */
  basicsBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
    background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #faf5ff 100%)',
    border: '1px solid #e0e7ff',
    borderRadius: 20,
    padding: '28px 32px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  basicsBannerLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 20,
    flex: 1,
  },
  basicsIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(99,102,241,0.15)',
    flexShrink: 0,
  },
  basicsBannerTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: 6,
  },
  basicsBannerDesc: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 1.6,
    marginBottom: 12,
  },
  basicsTags: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap' as const,
  },
  basicsTag: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 12px',
    backgroundColor: '#fff',
    borderRadius: 20,
    fontSize: 12,
    color: '#475569',
    border: '1px solid #e2e8f0',
  },
  basicsBannerRight: {
    flexShrink: 0,
  },
  basicsBannerBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '10px 20px',
    backgroundColor: '#6366f1',
    color: '#fff',
    fontWeight: 600,
    fontSize: 14,
    borderRadius: 10,
    whiteSpace: 'nowrap' as const,
    boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
  },
  moduleCard: {
    display: 'flex',
    gap: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
  moduleCardBody: {
    flex: 1,
    minWidth: 0,
  },
  moduleTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: 6,
  },
  moduleDesc: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 1.5,
    marginBottom: 14,
  },
  progressBarWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 0.4s ease',
  },
  progressLabel: {
    fontSize: 12,
    color: '#94a3b8',
    whiteSpace: 'nowrap' as const,
  },

  /* Stats */
  statsSection: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '0 24px 48px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: 16,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: '28px 20px',
    textAlign: 'center' as const,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 800,
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
  },
};
