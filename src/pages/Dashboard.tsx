import { Link } from 'react-router-dom';
import {
  BookOpen,
  Dumbbell,
  Trophy,
  Flame,
  Star,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { modules } from '../data/modules';
import { achievements } from '../data/achievements';
import { useProgress } from '../store/useProgressStore';

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function getMotivation(pct: number): string {
  if (pct === 0) return '万事开头难，迈出第一步，你就已经超越了大多数人！';
  if (pct < 25) return '你已经开始了学习之旅，坚持下去，每天都有新收获！';
  if (pct < 50) return '学习进度稳步推进，你的努力正在积累，继续保持！';
  if (pct < 75) return '太棒了！你已经掌握了一半以上的内容，胜利在望！';
  if (pct < 100) return '冲刺阶段！你已经接近终点，再加把劲就能完成！';
  return '恭喜你完成了所有课程！你是真正的数据分析达人！';
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function Dashboard() {
  const {
    completedLessons,
    completedExercises,
    quizScores,
    achievements: unlockedIds,
    totalPoints,
    streakDays,
  } = useProgress();

  // Aggregate stats
  const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0);
  const totalExercises = modules.reduce((s, m) => s + m.exercises.length, 0);
  const totalQuizzes = modules.length;
  const passedQuizzes = modules.filter(
    (m) => quizScores[m.quiz.id] !== undefined && quizScores[m.quiz.id] >= m.quiz.passingScore,
  ).length;
  const overallPct = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;

  // Recent achievements (last 4 unlocked)
  const recentAchs = unlockedIds
    .slice(-4)
    .reverse()
    .map((id) => achievements.find((a) => a.id === id))
    .filter(Boolean);

  const statCards = [
    { icon: <BookOpen size={22} />, label: '已完成课时', value: completedLessons.length, total: totalLessons, color: '#6366f1' },
    { icon: <Dumbbell size={22} />, label: '已完成练习', value: completedExercises.length, total: totalExercises, color: '#10b981' },
    { icon: <Trophy size={22} />, label: '通过测评', value: passedQuizzes, total: totalQuizzes, color: '#f59e0b' },
    { icon: <Star size={22} />, label: '总积分', value: totalPoints, total: null, color: '#ef4444' },
  ];

  return (
    <div style={styles.page}>
      {/* Welcome */}
      <div style={styles.welcome}>
        <div>
          <h1 style={styles.welcomeTitle}>学习仪表盘</h1>
          <p style={styles.welcomeSub}>
            {streakDays > 0 && (
              <span style={styles.streakBadge}>
                <Flame size={16} /> 连续学习 {streakDays} 天
              </span>
            )}
          </p>
        </div>
        <div style={styles.welcomePoints}>
          <Star size={20} color="#f59e0b" />
          <span style={styles.pointsValue}>{totalPoints}</span>
          <span style={styles.pointsLabel}>积分</span>
        </div>
      </div>

      {/* Stat cards */}
      <div style={styles.statGrid}>
        {statCards.map((s) => (
          <div key={s.label} style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: s.color + '15', color: s.color }}>
              {s.icon}
            </div>
            <div style={styles.statValue}>{s.value}</div>
            <div style={styles.statLabel}>{s.label}</div>
            {s.total !== null && (
              <div style={styles.statTotal}>共 {s.total}</div>
            )}
          </div>
        ))}
      </div>

      {/* Overall progress */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>
          <TrendingUp size={18} /> 总体学习进度
        </h2>
        <div style={styles.overallBarWrap}>
          <div style={styles.overallBarBg}>
            <div
              style={{
                ...styles.overallBarFill,
                width: `${overallPct}%`,
              }}
            />
          </div>
          <span style={styles.overallPct}>{overallPct}%</span>
        </div>
        <p style={styles.motivation}>{getMotivation(overallPct)}</p>
      </div>

      {/* Module progress */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>
          <BookOpen size={18} /> 模块进度
        </h2>
        <div style={styles.moduleList}>
          {modules.map((mod) => {
            const done = mod.lessons.filter((l) => completedLessons.includes(l.id)).length;
            const total = mod.lessons.length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            return (
              <Link
                key={mod.id}
                to={`/modules/${mod.id}`}
                style={styles.moduleRow}
              >
                <span style={{ fontSize: 28 }}>{mod.icon}</span>
                <div style={styles.moduleRowBody}>
                  <div style={styles.moduleRowTop}>
                    <span style={styles.moduleRowTitle}>{mod.title}</span>
                    <span style={styles.moduleRowPct}>{pct}%</span>
                  </div>
                  <div style={styles.moduleBarBg}>
                    <div
                      style={{
                        ...styles.moduleBarFill,
                        width: `${pct}%`,
                        backgroundColor: mod.color,
                      }}
                    />
                  </div>
                  <span style={styles.moduleRowMeta}>{done}/{total} 课时</span>
                </div>
                <ArrowRight size={16} color="#cbd5e1" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent achievements */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>
          <Trophy size={18} /> 最近成就
        </h2>
        {recentAchs.length === 0 ? (
          <p style={styles.emptyText}>暂无成就，开始学习来解锁你的第一个成就吧！</p>
        ) : (
          <div style={styles.achGrid}>
            {recentAchs.map((ach) =>
              ach ? (
                <div key={ach.id} style={styles.achCard}>
                  <span style={{ fontSize: 32 }}>{ach.icon}</span>
                  <div style={styles.achTitle}>{ach.title}</div>
                  <div style={styles.achDesc}>{ach.description}</div>
                  <div style={styles.achPoints}>+{ach.points} 积分</div>
                </div>
              ) : null,
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Styles                                                            */
/* ------------------------------------------------------------------ */

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: '32px 32px 60px',
    maxWidth: 960,
    margin: '0 auto',
  },

  /* Welcome */
  welcome: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: 800,
    color: '#1e293b',
    marginBottom: 8,
  },
  welcomeSub: {
    fontSize: 14,
    color: '#64748b',
  },
  streakBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 13,
    fontWeight: 600,
    color: '#f59e0b',
    backgroundColor: '#fffbeb',
    padding: '4px 12px',
    borderRadius: 20,
  },
  welcomePoints: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: '12px 20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  pointsValue: {
    fontSize: 22,
    fontWeight: 800,
    color: '#1e293b',
  },
  pointsLabel: {
    fontSize: 13,
    color: '#94a3b8',
  },

  /* Stat cards */
  statGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: '22px 20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    textAlign: 'center' as const,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 800,
    color: '#1e293b',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: 500,
  },
  statTotal: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },

  /* Card */
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    marginBottom: 24,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 17,
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: 20,
  },

  /* Overall progress */
  overallBarWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
  },
  overallBarBg: {
    flex: 1,
    height: 12,
    backgroundColor: '#e2e8f0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  overallBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
    borderRadius: 6,
    transition: 'width 0.6s ease',
  },
  overallPct: {
    fontSize: 18,
    fontWeight: 800,
    color: '#6366f1',
    minWidth: 48,
    textAlign: 'right' as const,
  },
  motivation: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 1.6,
    fontStyle: 'italic',
  },

  /* Module list */
  moduleList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 12,
  },
  moduleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '14px 16px',
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    transition: 'background 0.2s',
    textDecoration: 'none',
    color: 'inherit',
  },
  moduleRowBody: {
    flex: 1,
    minWidth: 0,
  },
  moduleRowTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  moduleRowTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1e293b',
  },
  moduleRowPct: {
    fontSize: 13,
    fontWeight: 700,
    color: '#6366f1',
  },
  moduleBarBg: {
    height: 5,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  moduleBarFill: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 0.4s ease',
  },
  moduleRowMeta: {
    fontSize: 12,
    color: '#94a3b8',
  },

  /* Achievements */
  achGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: 12,
  },
  achCard: {
    textAlign: 'center' as const,
    padding: '18px 12px',
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    border: '1px solid #f1f5f9',
  },
  achTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#1e293b',
    marginTop: 8,
    marginBottom: 4,
  },
  achDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 1.4,
    marginBottom: 6,
  },
  achPoints: {
    fontSize: 12,
    fontWeight: 600,
    color: '#f59e0b',
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center' as const,
    padding: '20px 0',
  },
};
