import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  BookOpen,
  Dumbbell,
  FileQuestion,
  Clock,
  Trophy,
  ChevronRight,
} from 'lucide-react';
import { modules } from '../data/modules';
import { useProgress } from '../store/useProgressStore';

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

type TabKey = 'lessons' | 'exercises' | 'quiz';

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function ModuleDetail() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const mod = modules.find((m) => m.id === moduleId);
  const { completedLessons, completedExercises, quizScores } = useProgress();
  const [activeTab, setActiveTab] = useState<TabKey>('lessons');

  if (!mod) {
    return (
      <div style={styles.notFound}>
        <h2>模块未找到</h2>
        <Link to="/modules" style={styles.backLink}>
          <ArrowLeft size={16} /> 返回课程列表
        </Link>
      </div>
    );
  }

  const doneLessons = mod.lessons.filter((l) => completedLessons.includes(l.id)).length;
  const doneExercises = mod.exercises.filter((e) => completedExercises.includes(e.id)).length;
  const quizScore = quizScores[mod.quiz.id];
  const quizPassed = quizScore !== undefined && quizScore >= mod.quiz.passingScore;

  const tabs: { key: TabKey; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: 'lessons', label: '课程学习', icon: <BookOpen size={16} />, count: doneLessons },
    { key: 'exercises', label: '练习中心', icon: <Dumbbell size={16} />, count: doneExercises },
    { key: 'quiz', label: '阶段测评', icon: <FileQuestion size={16} /> },
  ];

  return (
    <div style={styles.page}>
      {/* Back link */}
      <Link to="/modules" style={styles.backLink}>
        <ArrowLeft size={16} /> 返回课程列表
      </Link>

      {/* Module header */}
      <div
        style={{
          ...styles.header,
          borderLeft: `5px solid ${mod.color}`,
        }}
      >
        <div style={styles.headerTop}>
          <span style={{ fontSize: 44 }}>{mod.icon}</span>
          <div>
            <h1 style={styles.headerTitle}>{mod.title}</h1>
            <p style={styles.headerDesc}>{mod.description}</p>
          </div>
        </div>
        <div style={styles.headerStats}>
          <span style={styles.headerStat}>
            <BookOpen size={16} /> {doneLessons}/{mod.lessons.length} 课时
          </span>
          <span style={styles.headerStat}>
            <Dumbbell size={16} /> {doneExercises}/{mod.exercises.length} 练习
          </span>
          {quizScore !== undefined && (
            <span style={styles.headerStat}>
              <Trophy size={16} /> 测评 {quizScore} 分
              {quizPassed && <span style={styles.passedBadge}>已通过</span>}
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabBar}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              ...styles.tab,
              color: activeTab === t.key ? mod.color : '#64748b',
              borderBottom: activeTab === t.key ? `2px solid ${mod.color}` : '2px solid transparent',
            }}
          >
            {t.icon}
            <span>{t.label}</span>
            {t.count !== undefined && (
              <span
                style={{
                  ...styles.tabCount,
                  backgroundColor: activeTab === t.key ? mod.color : '#e2e8f0',
                  color: activeTab === t.key ? '#fff' : '#64748b',
                }}
              >
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={styles.tabContent}>
        {/* ---- Lessons ---- */}
        {activeTab === 'lessons' && (
          <div style={styles.list}>
            {mod.lessons.map((lesson, idx) => {
              const done = completedLessons.includes(lesson.id);
              return (
                <Link
                  key={lesson.id}
                  to={`/modules/${mod.id}/lessons/${lesson.id}`}
                  style={{
                    ...styles.listItem,
                    borderLeft: done ? `3px solid ${mod.color}` : '3px solid #e2e8f0',
                  }}
                >
                  <div style={styles.listItemLeft}>
                    {done ? (
                      <CheckCircle2 size={22} color={mod.color} />
                    ) : (
                      <Circle size={22} color="#cbd5e1" />
                    )}
                    <div>
                      <div style={styles.listItemTitle}>
                        <span style={styles.listItemIndex}>第 {idx + 1} 课</span>
                        {lesson.title}
                      </div>
                      <div style={styles.listItemMeta}>
                        <Clock size={13} /> {lesson.duration} 分钟 &middot; {lesson.description}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={18} color="#cbd5e1" />
                </Link>
              );
            })}
          </div>
        )}

        {/* ---- Exercises ---- */}
        {activeTab === 'exercises' && (
          <div>
            <div style={styles.exerciseHeader}>
              <h3 style={styles.exerciseTitle}>练习题目</h3>
              <span style={styles.exerciseProgress}>
                已完成 {doneExercises}/{mod.exercises.length}
              </span>
            </div>
            <div style={styles.list}>
              {mod.exercises.map((ex, idx) => {
                const done = completedExercises.includes(ex.id);
                return (
                  <div
                    key={ex.id}
                    style={{
                      ...styles.listItem,
                      borderLeft: done ? `3px solid #10b981` : '3px solid #e2e8f0',
                    }}
                  >
                    <div style={styles.listItemLeft}>
                      {done ? (
                        <CheckCircle2 size={22} color="#10b981" />
                      ) : (
                        <Circle size={22} color="#cbd5e1" />
                      )}
                      <div>
                        <div style={styles.listItemTitle}>
                          <span
                            style={{
                              ...styles.typeBadge,
                              backgroundColor: ex.type === 'code' ? '#fef3c7' : '#eef2ff',
                              color: ex.type === 'code' ? '#d97706' : '#6366f1',
                            }}
                          >
                            {ex.type === 'code' ? '编程题' : '选择题'}
                          </span>
                          练习 {idx + 1}
                        </div>
                        <div style={styles.listItemMeta}>
                          {ex.score} 分 &middot; {ex.question.slice(0, 60)}...
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---- Quiz ---- */}
        {activeTab === 'quiz' && (
          <div style={styles.quizCard}>
            <div style={styles.quizIcon}>
              <Trophy size={40} color={mod.color} />
            </div>
            <h3 style={styles.quizTitle}>{mod.quiz.title}</h3>
            <p style={styles.quizDesc}>{mod.quiz.description}</p>

            <div style={styles.quizMeta}>
              <div style={styles.quizMetaItem}>
                <span style={styles.quizMetaLabel}>题目数量</span>
                <span style={styles.quizMetaValue}>{mod.quiz.questions.length} 题</span>
              </div>
              <div style={styles.quizMetaItem}>
                <span style={styles.quizMetaLabel}>时间限制</span>
                <span style={styles.quizMetaValue}>{mod.quiz.timeLimit} 分钟</span>
              </div>
              <div style={styles.quizMetaItem}>
                <span style={styles.quizMetaLabel}>及格分数</span>
                <span style={styles.quizMetaValue}>{mod.quiz.passingScore} 分</span>
              </div>
            </div>

            {quizScore !== undefined && (
              <div
                style={{
                  ...styles.scoreBanner,
                  backgroundColor: quizPassed ? '#ecfdf5' : '#fef2f2',
                  color: quizPassed ? '#059669' : '#dc2626',
                }}
              >
                当前得分：<strong>{quizScore}</strong> 分
                {quizPassed ? ' -- 已通过' : ' -- 未通过，请再接再厉'}
              </div>
            )}

            <Link
              to={`/modules/${mod.id}/quiz`}
              style={{ ...styles.quizButton, backgroundColor: mod.color }}
            >
              {quizScore !== undefined ? '重新测评' : '开始测评'}
              <ChevronRight size={18} />
            </Link>
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
    maxWidth: 900,
    margin: '0 auto',
  },
  notFound: {
    textAlign: 'center' as const,
    padding: '80px 20px',
    color: '#64748b',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
    fontWeight: 500,
  },
  header: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    marginBottom: 24,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  headerTop: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 800,
    color: '#1e293b',
    marginBottom: 6,
  },
  headerDesc: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 1.6,
  },
  headerStats: {
    display: 'flex',
    gap: 20,
    flexWrap: 'wrap' as const,
  },
  headerStat: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 13,
    color: '#64748b',
    fontWeight: 500,
  },
  passedBadge: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: 600,
    color: '#10b981',
    backgroundColor: '#ecfdf5',
    padding: '2px 8px',
    borderRadius: 10,
  },

  /* Tabs */
  tabBar: {
    display: 'flex',
    gap: 4,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: '6px',
    marginBottom: 24,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  tab: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '10px 12px',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    backgroundColor: 'transparent',
    transition: 'all 0.2s',
  },
  tabCount: {
    fontSize: 11,
    fontWeight: 700,
    padding: '1px 7px',
    borderRadius: 10,
  },
  tabContent: {
    minHeight: 300,
  },

  /* List */
  list: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 8,
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: '16px 20px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
    cursor: 'pointer',
    transition: 'transform 0.15s, box-shadow 0.15s',
    textDecoration: 'none',
    color: 'inherit',
  },
  listItemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    flex: 1,
    minWidth: 0,
  },
  listItemTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 15,
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: 4,
  },
  listItemIndex: {
    fontSize: 12,
    fontWeight: 600,
    color: '#94a3b8',
    backgroundColor: '#f1f5f9',
    padding: '2px 8px',
    borderRadius: 6,
  },
  listItemMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 13,
    color: '#94a3b8',
  },
  typeBadge: {
    fontSize: 11,
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: 6,
  },

  /* Exercises */
  exerciseHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  exerciseTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: '#1e293b',
  },
  exerciseProgress: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: 500,
  },

  /* Quiz */
  quizCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: '40px 32px',
    textAlign: 'center' as const,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  quizIcon: {
    width: 72,
    height: 72,
    borderRadius: '50%',
    backgroundColor: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  },
  quizTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: 8,
  },
  quizDesc: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
  },
  quizMeta: {
    display: 'flex',
    justifyContent: 'center',
    gap: 32,
    marginBottom: 24,
  },
  quizMetaItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 4,
  },
  quizMetaLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  quizMetaValue: {
    fontSize: 16,
    fontWeight: 700,
    color: '#1e293b',
  },
  scoreBanner: {
    padding: '12px 20px',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 24,
  },
  quizButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '12px 32px',
    color: '#fff',
    fontWeight: 700,
    fontSize: 15,
    borderRadius: 10,
    border: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
};
