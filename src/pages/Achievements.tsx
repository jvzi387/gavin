import { Star, Lock, Trophy, TrendingUp, Zap, Flame } from 'lucide-react';
import { achievements } from '../data/achievements';
import { useProgress } from '../store/useProgressStore';

/* ------------------------------------------------------------------ */
/*  Category config                                                   */
/* ------------------------------------------------------------------ */

const categoryConfig: Record<
  string,
  { label: string; icon: React.ReactNode; color: string; bg: string }
> = {
  progress: {
    label: '学习进度',
    icon: <TrendingUp size={18} />,
    color: '#6366f1',
    bg: '#eef2ff',
  },
  skill: {
    label: '技能认证',
    icon: <Zap size={18} />,
    color: '#10b981',
    bg: '#ecfdf5',
  },
  challenge: {
    label: '挑战成就',
    icon: <Trophy size={18} />,
    color: '#f59e0b',
    bg: '#fffbeb',
  },
  streak: {
    label: '连续学习',
    icon: <Flame size={18} />,
    color: '#ef4444',
    bg: '#fef2f2',
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function Achievements() {
  const { achievements: unlockedIds, totalPoints } = useProgress();

  // Group achievements by category
  const categories = Object.keys(categoryConfig) as Array<keyof typeof categoryConfig>;

  const unlockedCount = unlockedIds.length;
  const totalCount = achievements.length;

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>成就中心</h1>
        <p style={styles.subtitle}>
          完成学习任务，解锁成就徽章，积累积分
        </p>
      </div>

      {/* Points overview */}
      <div style={styles.pointsCard}>
        <div style={styles.pointsLeft}>
          <div style={styles.pointsIcon}>
            <Star size={32} color="#f59e0b" />
          </div>
          <div>
            <div style={styles.pointsValue}>{totalPoints}</div>
            <div style={styles.pointsLabel}>累计积分</div>
          </div>
        </div>
        <div style={styles.pointsDivider} />
        <div style={styles.pointsRight}>
          <div style={styles.pointsValue}>
            {unlockedCount}/{totalCount}
          </div>
          <div style={styles.pointsLabel}>已解锁成就</div>
        </div>
      </div>

      {/* Overall progress */}
      <div style={styles.overallWrap}>
        <div style={styles.overallBarBg}>
          <div
            style={{
              ...styles.overallBarFill,
              width: `${totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0}%`,
            }}
          />
        </div>
        <span style={styles.overallLabel}>
          {totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0}% 完成
        </span>
      </div>

      {/* Categories */}
      {categories.map((cat) => {
        const config = categoryConfig[cat];
        const items = achievements.filter((a) => a.category === cat);
        if (items.length === 0) return null;

        const catUnlocked = items.filter((a) => unlockedIds.includes(a.id)).length;

        return (
          <div key={cat} style={styles.categorySection}>
            {/* Category header */}
            <div style={styles.categoryHeader}>
              <div
                style={{
                  ...styles.categoryIcon,
                  backgroundColor: config.bg,
                  color: config.color,
                }}
              >
                {config.icon}
              </div>
              <div>
                <h2 style={styles.categoryTitle}>{config.label}</h2>
                <span style={styles.categoryCount}>
                  {catUnlocked}/{items.length} 已解锁
                </span>
              </div>
            </div>

            {/* Achievement grid */}
            <div style={styles.achGrid}>
              {items.map((ach) => {
                const unlocked = unlockedIds.includes(ach.id);

                return (
                  <div
                    key={ach.id}
                    style={{
                      ...styles.achCard,
                      opacity: unlocked ? 1 : 0.55,
                      border: unlocked ? `1px solid ${config.color}30` : '1px solid #f1f5f9',
                    }}
                  >
                    {/* Icon */}
                    <div
                      style={{
                        ...styles.achIconWrap,
                        backgroundColor: unlocked ? config.bg : '#f1f5f9',
                      }}
                    >
                      <span style={{ fontSize: 32, filter: unlocked ? 'none' : 'grayscale(1)' }}>
                        {ach.icon}
                      </span>
                      {!unlocked && (
                        <div style={styles.lockOverlay}>
                          <Lock size={16} color="#94a3b8" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={styles.achTitle}>{ach.title}</div>
                    <div style={styles.achDesc}>{ach.description}</div>

                    {/* Points */}
                    <div
                      style={{
                        ...styles.achPoints,
                        color: unlocked ? config.color : '#cbd5e1',
                      }}
                    >
                      +{ach.points} 积分
                    </div>

                    {/* Status */}
                    {unlocked && (
                      <div
                        style={{
                          ...styles.unlockedBadge,
                          backgroundColor: config.bg,
                          color: config.color,
                        }}
                      >
                        已解锁
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
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
  header: {
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: 800,
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
  },

  /* Points card */
  pointsCard: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: '28px 32px',
    marginBottom: 20,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  pointsLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  pointsIcon: {
    width: 60,
    height: 60,
    borderRadius: '50%',
    backgroundColor: '#fffbeb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsValue: {
    fontSize: 28,
    fontWeight: 800,
    color: '#1e293b',
  },
  pointsLabel: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
  },
  pointsDivider: {
    width: 1,
    height: 48,
    backgroundColor: '#e2e8f0',
    margin: '0 32px',
  },
  pointsRight: {
    textAlign: 'center' as const,
  },

  /* Overall progress */
  overallWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 36,
  },
  overallBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  overallBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #6366f1, #a78bfa)',
    borderRadius: 4,
    transition: 'width 0.6s ease',
  },
  overallLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: '#6366f1',
    whiteSpace: 'nowrap' as const,
  },

  /* Category */
  categorySection: {
    marginBottom: 36,
  },
  categoryHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 18,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: 2,
  },
  categoryCount: {
    fontSize: 13,
    color: '#94a3b8',
  },

  /* Achievement grid */
  achGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: 14,
  },
  achCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: '24px 16px',
    textAlign: 'center' as const,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    position: 'relative' as const,
  },
  achIconWrap: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px',
    position: 'relative' as const,
  },
  lockOverlay: {
    position: 'absolute' as const,
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: '50%',
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  achTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: 4,
  },
  achDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 1.5,
    marginBottom: 8,
    minHeight: 36,
  },
  achPoints: {
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 8,
  },
  unlockedBadge: {
    display: 'inline-block',
    fontSize: 11,
    fontWeight: 600,
    padding: '3px 12px',
    borderRadius: 12,
  },
};
