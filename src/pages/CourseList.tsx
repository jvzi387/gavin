import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { modules } from '../data/modules';
import { useProgress } from '../store/useProgressStore';

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function CourseList() {
  const { completedLessons } = useProgress();

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>课程中心</h1>
        <p style={styles.subtitle}>选择一个模块，开始你的 Python 数据分析学习之旅</p>
      </div>

      {/* Module grid */}
      <div style={styles.grid}>
        {modules.map((mod) => {
          const done = mod.lessons.filter((l) => completedLessons.includes(l.id)).length;
          const total = mod.lessons.length;
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;
          const isComplete = pct === 100;

          return (
            <Link
              key={mod.id}
              to={`/modules/${mod.id}`}
              style={{
                ...styles.card,
                borderTop: `4px solid ${mod.color}`,
              }}
            >
              {/* Icon & badge */}
              <div style={styles.cardTop}>
                <span style={styles.cardIcon}>{mod.icon}</span>
                {isComplete && (
                  <span style={styles.completeBadge}>
                    <CheckCircle2 size={14} /> 已完成
                  </span>
                )}
              </div>

              {/* Title & description */}
              <h2 style={styles.cardTitle}>{mod.title}</h2>
              <p style={styles.cardDesc}>{mod.description}</p>

              {/* Meta */}
              <div style={styles.meta}>
                <span style={styles.metaItem}>
                  <Clock size={14} /> {mod.lessons.length} 课时
                </span>
                <span style={styles.metaItem}>
                  {mod.exercises.length} 练习
                </span>
              </div>

              {/* Progress bar */}
              <div style={styles.progressWrap}>
                <div style={styles.progressBg}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: `${pct}%`,
                      backgroundColor: mod.color,
                    }}
                  />
                </div>
                <span style={styles.progressText}>
                  {done}/{total} &middot; {pct}%
                </span>
              </div>

              {/* CTA */}
              <div style={styles.ctaRow}>
                <span style={{ ...styles.cta, color: mod.color }}>
                  {pct === 0 ? '开始学习' : isComplete ? '复习课程' : '继续学习'}
                  <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Styles                                                            */
/* ------------------------------------------------------------------ */

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: '40px 32px 60px',
    maxWidth: 1100,
    margin: '0 auto',
  },
  header: {
    marginBottom: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardIcon: {
    fontSize: 40,
  },
  completeBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 12,
    fontWeight: 600,
    color: '#10b981',
    backgroundColor: '#ecfdf5',
    padding: '4px 10px',
    borderRadius: 20,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 1.6,
    marginBottom: 16,
    flex: 1,
  },
  meta: {
    display: 'flex',
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 13,
    color: '#94a3b8',
  },
  progressWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  progressBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 0.4s ease',
  },
  progressText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: 600,
    whiteSpace: 'nowrap' as const,
  },
  ctaRow: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  cta: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 14,
    fontWeight: 600,
    transition: 'gap 0.2s',
  },
};
