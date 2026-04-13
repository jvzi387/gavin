import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { EditorView, keymap, placeholder as cmPlaceholder } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { basicSetup } from 'codemirror';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Play,
  Loader2,
  Lightbulb,
  Clock,
} from 'lucide-react';
import { modules } from '../data/modules';
import { renderMarkdown } from '../utils/markdown';
import { pyodideManager } from '../utils/pyodide';
import { useProgress } from '../store/useProgressStore';

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function LessonView() {
  const { moduleId, lessonId } = useParams<{
    moduleId: string;
    lessonId: string;
  }>();
  const mod = modules.find((m) => m.id === moduleId);
  const lesson = mod?.lessons.find((l) => l.id === lessonId);
  const { completedLessons, completeLesson } = useProgress();

  // Code editor state
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  const [code, setCode] = useState(lesson?.codeExample ?? '');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [pyodideLoading, setPyodideLoading] = useState(false);

  // Mark lesson as complete
  const isCompleted = lesson ? completedLessons.includes(lesson.id) : false;

  const handleComplete = useCallback(() => {
    if (lesson) completeLesson(lesson.id);
  }, [lesson, completeLesson]);

  // Navigation helpers
  const lessonIndex = lesson && mod ? mod.lessons.findIndex((l) => l.id === lesson.id) : -1;
  const prevLesson = mod && lessonIndex > 0 ? mod.lessons[lessonIndex - 1] : null;
  const nextLesson =
    mod && lessonIndex >= 0 && lessonIndex < mod.lessons.length - 1
      ? mod.lessons[lessonIndex + 1]
      : null;

  // ---- CodeMirror setup ----
  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: code,
      extensions: [
        basicSetup,
        python(),
        oneDark,
        keymap.of([
          {
            key: 'Tab',
            run: ({ state: s, dispatch }) => {
              dispatch(
                s.update(s.replaceSelection('    '), {
                  scrollIntoView: true,
                  userEvent: 'input',
                })
              );
              return true;
            },
          },
        ]),
        cmPlaceholder('# 在这里编写 Python 代码...'),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            setCode(update.state.doc.toString());
          }
        }),
        EditorView.theme({
          '&': {
            borderRadius: 8,
            fontSize: '14px',
            border: '1px solid #334155',
          },
          '.cm-scroller': {
            fontFamily: "'Fira Code', 'JetBrains Mono', 'Consolas', monospace",
            overflow: 'auto',
          },
          '.cm-content': {
            padding: '8px 0',
          },
          '.cm-gutters': {
            borderRadius: '8px 0 0 8px',
          },
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // Only re-create editor on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update editor content when lesson changes
  useEffect(() => {
    if (viewRef.current && lesson?.codeExample) {
      const newCode = lesson.codeExample;
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: newCode,
        },
      });
      setCode(newCode);
      setOutput('');
      setError(null);
    }
  }, [lessonId, lesson?.codeExample]);

  // ---- Run code ----
  const handleRun = useCallback(async () => {
    if (!code.trim()) return;
    setRunning(true);
    setOutput('');
    setError(null);

    if (!pyodideReady && !pyodideLoading) {
      setPyodideLoading(true);
    }

    const result = await pyodideManager.runCode(code);
    setOutput(result.output);
    setError(result.error);
    setRunning(false);
    setPyodideReady(pyodideManager.isReady());
    setPyodideLoading(false);
  }, [code, pyodideReady, pyodideLoading]);

  // ---- Not found ----
  if (!mod || !lesson) {
    return (
      <div style={styles.notFound}>
        <h2>课程未找到</h2>
        <p style={{ color: '#64748b', marginBottom: 16 }}>
          请检查链接是否正确
        </p>
        <Link to="/modules" style={styles.backLink}>
          <ArrowLeft size={16} /> 返回课程列表
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Breadcrumb / back */}
      <div style={styles.breadcrumb}>
        <Link to="/modules" style={styles.backLink}>
          <ArrowLeft size={16} /> 课程列表
        </Link>
        <span style={styles.breadcrumbSep}>/</span>
        <Link to={`/modules/${mod.id}`} style={styles.backLink}>
          {mod.title}
        </Link>
        <span style={styles.breadcrumbSep}>/</span>
        <span style={styles.breadcrumbCurrent}>{lesson.title}</span>
      </div>

      {/* Lesson header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>{lesson.title}</h1>
          <p style={styles.description}>{lesson.description}</p>
          <div style={styles.meta}>
            <span style={styles.metaItem}>
              <Clock size={14} /> 预计 {lesson.duration} 分钟
            </span>
            <span style={styles.metaItem}>
              第 {lessonIndex + 1} / {mod.lessons.length} 课
            </span>
            {isCompleted && (
              <span style={styles.completedBadge}>
                <CheckCircle2 size={14} /> 已完成
              </span>
            )}
          </div>
        </div>
        {!isCompleted && (
          <button
            onClick={handleComplete}
            style={{
              ...styles.completeBtn,
              backgroundColor: mod.color,
            }}
          >
            <CheckCircle2 size={18} />
            标记完成
          </button>
        )}
      </div>

      {/* Lesson content (rendered markdown) */}
      <div style={styles.contentCard}>
        <div
          className="lesson-markdown"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(lesson.content) }}
        />
      </div>

      {/* Key points */}
      <div style={styles.keyPointsCard}>
        <h3 style={styles.keyPointsTitle}>
          <Lightbulb size={18} /> 本课要点
        </h3>
        <ul style={styles.keyPointsList}>
          {lesson.keyPoints.map((point, i) => (
            <li key={i} style={styles.keyPointItem}>
              <span style={styles.keyPointBullet}>{i + 1}</span>
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Code editor section */}
      <div style={styles.editorCard}>
        <div style={styles.editorHeader}>
          <h3 style={styles.editorTitle}>代码编辑器</h3>
          <button
            onClick={handleRun}
            disabled={running}
            style={{
              ...styles.runBtn,
              opacity: running ? 0.7 : 1,
            }}
          >
            {running ? (
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <Play size={16} />
            )}
            {running ? '运行中...' : '运行代码'}
          </button>
        </div>

        {/* Loading indicator */}
        {pyodideLoading && !pyodideReady && (
          <div style={styles.loadingBar}>
            <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
            <span>正在加载 Python 运行环境（首次加载可能需要几秒钟）...</span>
          </div>
        )}

        {/* Editor container */}
        <div ref={editorRef} style={styles.editorContainer} />

        {/* Output panel */}
        {(output || error) && (
          <div style={styles.outputPanel}>
            <div style={styles.outputHeader}>
              <span style={styles.outputLabel}>输出结果</span>
            </div>
            <pre
              style={{
                ...styles.outputContent,
                color: error ? '#fca5a5' : '#a7f3d0',
              }}
            >
              {error ? `错误:\n${error}` : output || '（无输出）'}
            </pre>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={styles.navRow}>
        {prevLesson ? (
          <Link
            to={`/modules/${mod.id}/lessons/${prevLesson.id}`}
            style={styles.navBtn}
          >
            <ChevronLeft size={18} />
            <div>
              <span style={styles.navBtnLabel}>上一课</span>
              <span style={styles.navBtnTitle}>{prevLesson.title}</span>
            </div>
          </Link>
        ) : (
          <div />
        )}
        {nextLesson ? (
          <Link
            to={`/modules/${mod.id}/lessons/${nextLesson.id}`}
            style={{ ...styles.navBtn, textAlign: 'right' as const }}
          >
            <div>
              <span style={styles.navBtnLabel}>下一课</span>
              <span style={styles.navBtnTitle}>{nextLesson.title}</span>
            </div>
            <ChevronRight size={18} />
          </Link>
        ) : (
          <Link
            to={`/modules/${mod.id}/exercises`}
            style={{ ...styles.navBtn, textAlign: 'right' as const, backgroundColor: mod.color, color: '#fff' }}
          >
            <div>
              <span style={{ ...styles.navBtnLabel, color: 'rgba(255,255,255,0.8)' }}>进入练习</span>
              <span style={styles.navBtnTitle}>练习中心</span>
            </div>
            <ChevronRight size={18} />
          </Link>
        )}
      </div>

      {/* Inline spin animation */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
    fontWeight: 500,
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
    flexWrap: 'wrap' as const,
  },
  breadcrumbSep: {
    color: '#cbd5e1',
    fontSize: 14,
  },
  breadcrumbCurrent: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: 600,
  },

  /* Header */
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    marginBottom: 24,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    gap: 16,
    flexWrap: 'wrap' as const,
  },
  headerLeft: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 26,
    fontWeight: 800,
    color: '#1e293b',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#64748b',
    lineHeight: 1.6,
    marginBottom: 12,
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap' as const,
  },
  metaItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: 500,
  },
  completedBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 13,
    fontWeight: 600,
    color: '#10b981',
    backgroundColor: '#ecfdf5',
    padding: '3px 10px',
    borderRadius: 10,
  },
  completeBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 24px',
    color: '#fff',
    fontWeight: 700,
    fontSize: 15,
    borderRadius: 10,
    border: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    whiteSpace: 'nowrap' as const,
  },

  /* Content */
  contentCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: '28px 32px',
    marginBottom: 24,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },

  /* Key points */
  keyPointsCard: {
    backgroundColor: '#fffbeb',
    borderRadius: 16,
    padding: '24px 28px',
    marginBottom: 24,
    border: '1px solid #fde68a',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
  keyPointsTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 17,
    fontWeight: 700,
    color: '#92400e',
    marginBottom: 16,
  },
  keyPointsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 10,
  },
  keyPointItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    fontSize: 14,
    color: '#78350f',
    lineHeight: 1.6,
  },
  keyPointBullet: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    minWidth: 24,
    borderRadius: '50%',
    backgroundColor: '#fbbf24',
    color: '#fff',
    fontSize: 12,
    fontWeight: 700,
  },

  /* Code editor */
  editorCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  editorHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  editorTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#e2e8f0',
  },
  runBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 20px',
    backgroundColor: '#10b981',
    color: '#fff',
    fontWeight: 600,
    fontSize: 14,
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  loadingBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 12px',
    marginBottom: 12,
    backgroundColor: 'rgba(99,102,241,0.15)',
    borderRadius: 8,
    color: '#a5b4fc',
    fontSize: 13,
  },
  editorContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 0,
  },
  outputPanel: {
    marginTop: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#0f172a',
    border: '1px solid #334155',
  },
  outputHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 14px',
    backgroundColor: '#1e293b',
    borderBottom: '1px solid #334155',
  },
  outputLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: '#94a3b8',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  outputContent: {
    padding: '14px 16px',
    margin: 0,
    fontFamily: "'Fira Code', 'JetBrains Mono', 'Consolas', monospace",
    fontSize: 13,
    lineHeight: 1.7,
    whiteSpace: 'pre-wrap' as const,
    wordBreak: 'break-word' as const,
    maxHeight: 300,
    overflowY: 'auto' as const,
  },

  /* Navigation */
  navRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
  },
  navBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '16px 20px',
    backgroundColor: '#fff',
    borderRadius: 12,
    border: '1px solid #e2e8f0',
    textDecoration: 'none',
    color: '#1e293b',
    transition: 'transform 0.15s, box-shadow 0.15s',
    maxWidth: '45%',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  },
  navBtnLabel: {
    display: 'block',
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: 500,
    marginBottom: 2,
  },
  navBtnTitle: {
    display: 'block',
    fontSize: 14,
    fontWeight: 600,
    color: 'inherit',
  },
};
