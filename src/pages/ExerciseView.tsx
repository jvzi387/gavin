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
  XCircle,
  Play,
  Loader2,
  Send,
  Trophy,
  Code,
  ListChecks,
  Type,
} from 'lucide-react';
import { modules } from '../data/modules';
import { renderMarkdown } from '../utils/markdown';
import { pyodideManager } from '../utils/pyodide';
import { useProgress } from '../store/useProgressStore';
import type { Exercise } from '../types';

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function ExerciseView() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const mod = modules.find((m) => m.id === moduleId);
  const { completedExercises, completeExercise } = useProgress();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [fillAnswer, setFillAnswer] = useState('');
  const [code, setCode] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [output, setOutput] = useState('');
  const [runError, setRunError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  // Code editor refs
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  const exercises = mod?.exercises ?? [];
  const currentExercise: Exercise | undefined = exercises[currentIndex];
  const isExerciseCompleted = currentExercise
    ? completedExercises.includes(currentExercise.id)
    : false;
  const completedCount = exercises.filter((e) =>
    completedExercises.includes(e.id)
  ).length;

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
        cmPlaceholder('# 在这里编写你的代码...'),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update editor when exercise changes
  useEffect(() => {
    if (viewRef.current && currentExercise?.codeTemplate) {
      const newCode = currentExercise.codeTemplate;
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: newCode,
        },
      });
      setCode(newCode);
    }
    // Reset state
    setSelectedAnswer('');
    setFillAnswer('');
    setSubmitted(false);
    setIsCorrect(false);
    setOutput('');
    setRunError(null);
  }, [currentIndex, currentExercise?.codeTemplate]);

  // ---- Submit answer ----
  const handleSubmit = useCallback(() => {
    if (!currentExercise) return;

    let correct = false;

    if (currentExercise.type === 'choice') {
      correct = selectedAnswer === currentExercise.answer;
    } else if (currentExercise.type === 'fill') {
      correct = fillAnswer.trim().toLowerCase() === String(currentExercise.answer).toLowerCase();
    } else if (currentExercise.type === 'code') {
      // For code exercises, check if output contains the expected answer
      const expected = String(currentExercise.answer).toLowerCase();
      correct = output.toLowerCase().includes(expected);
    }

    setIsCorrect(correct);
    setSubmitted(true);

    if (correct) {
      completeExercise(currentExercise.id);
    }
  }, [currentExercise, selectedAnswer, fillAnswer, output, completeExercise]);

  // ---- Run code ----
  const handleRun = useCallback(async () => {
    if (!code.trim()) return;
    setRunning(true);
    setOutput('');
    setRunError(null);

    const result = await pyodideManager.runCode(code);
    setOutput(result.output);
    setRunError(result.error);
    setRunning(false);
  }, [code]);

  // ---- Navigation ----
  const goToPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };
  const goToNext = () => {
    if (currentIndex < exercises.length - 1) setCurrentIndex(currentIndex + 1);
  };

  // ---- Not found ----
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

  if (exercises.length === 0) {
    return (
      <div style={styles.notFound}>
        <h2>暂无练习题</h2>
        <Link to={`/modules/${mod.id}`} style={styles.backLink}>
          <ArrowLeft size={16} /> 返回模块
        </Link>
      </div>
    );
  }

  if (!currentExercise) return null;

  const typeIcon =
    currentExercise.type === 'choice' ? (
      <ListChecks size={18} />
    ) : currentExercise.type === 'code' ? (
      <Code size={18} />
    ) : (
      <Type size={18} />
    );
  const typeLabel =
    currentExercise.type === 'choice'
      ? '选择题'
      : currentExercise.type === 'code'
      ? '编程题'
      : '填空题';
  const typeBg =
    currentExercise.type === 'code'
      ? '#fef3c7'
      : currentExercise.type === 'fill'
      ? '#ede9fe'
      : '#eef2ff';
  const typeColor =
    currentExercise.type === 'code'
      ? '#d97706'
      : currentExercise.type === 'fill'
      ? '#7c3aed'
      : '#6366f1';

  return (
    <div style={styles.page}>
      {/* Breadcrumb */}
      <div style={styles.breadcrumb}>
        <Link to="/modules" style={styles.backLink}>
          <ArrowLeft size={16} /> 课程列表
        </Link>
        <span style={styles.breadcrumbSep}>/</span>
        <Link to={`/modules/${mod.id}`} style={styles.backLink}>
          {mod.title}
        </Link>
        <span style={styles.breadcrumbSep}>/</span>
        <span style={styles.breadcrumbCurrent}>练习中心</span>
      </div>

      {/* Progress bar */}
      <div style={styles.progressCard}>
        <div style={styles.progressHeader}>
          <Trophy size={18} color={mod.color} />
          <span style={styles.progressTitle}>练习进度</span>
          <span style={styles.progressCount}>
            {completedCount} / {exercises.length} 已完成
          </span>
        </div>
        <div style={styles.progressBarBg}>
          <div
            style={{
              ...styles.progressBarFill,
              width: `${(completedCount / exercises.length) * 100}%`,
              backgroundColor: mod.color,
            }}
          />
        </div>
      </div>

      {/* Exercise card */}
      <div style={styles.exerciseCard}>
        {/* Exercise header */}
        <div style={styles.exerciseHeader}>
          <div style={styles.exerciseHeaderLeft}>
            <span
              style={{
                ...styles.typeBadge,
                backgroundColor: typeBg,
                color: typeColor,
              }}
            >
              {typeIcon}
              {typeLabel}
            </span>
            <span style={styles.exerciseIndex}>
              第 {currentIndex + 1} / {exercises.length} 题
            </span>
          </div>
          <span style={styles.scoreBadge}>{currentExercise.score} 分</span>
        </div>

        {/* Question */}
        <div style={styles.questionSection}>
          <div
            className="exercise-markdown"
            dangerouslySetInnerHTML={{
              __html: renderMarkdown(currentExercise.question),
            }}
          />
        </div>

        {/* Choice options */}
        {currentExercise.type === 'choice' && currentExercise.options && (
          <div style={styles.optionsList}>
            {currentExercise.options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isAnswer = option === currentExercise.answer;
              let optionStyle: React.CSSProperties = styles.optionCard;

              if (submitted) {
                if (isAnswer) {
                  optionStyle = { ...optionStyle, ...styles.optionCorrect };
                } else if (isSelected && !isAnswer) {
                  optionStyle = { ...optionStyle, ...styles.optionIncorrect };
                }
              } else if (isSelected) {
                optionStyle = { ...optionStyle, ...styles.optionSelected };
              }

              return (
                <div
                  key={idx}
                  style={optionStyle}
                  onClick={() => !submitted && setSelectedAnswer(option)}
                >
                  <span style={styles.optionRadio}>
                    {submitted && isAnswer ? (
                      <CheckCircle2 size={20} color="#10b981" />
                    ) : submitted && isSelected && !isAnswer ? (
                      <XCircle size={20} color="#ef4444" />
                    ) : (
                      <span
                        style={{
                          ...styles.radioOuter,
                          borderColor: isSelected ? '#6366f1' : '#cbd5e1',
                        }}
                      >
                        {isSelected && <span style={styles.radioInner} />}
                      </span>
                    )}
                  </span>
                  <span style={styles.optionText}>{option}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Fill input */}
        {currentExercise.type === 'fill' && (
          <div style={styles.fillSection}>
            <input
              type="text"
              value={fillAnswer}
              onChange={(e) => setFillAnswer(e.target.value)}
              placeholder="请输入你的答案..."
              disabled={submitted}
              style={{
                ...styles.fillInput,
                borderColor: submitted
                  ? isCorrect
                    ? '#10b981'
                    : '#ef4444'
                  : '#e2e8f0',
              }}
            />
          </div>
        )}

        {/* Code editor */}
        {currentExercise.type === 'code' && (
          <div style={styles.codeSection}>
            <div style={styles.codeHeader}>
              <span style={styles.codeLabel}>代码编辑器</span>
              <button
                onClick={handleRun}
                disabled={running}
                style={{
                  ...styles.runBtn,
                  opacity: running ? 0.7 : 1,
                }}
              >
                {running ? (
                  <Loader2
                    size={14}
                    style={{ animation: 'spin 1s linear infinite' }}
                  />
                ) : (
                  <Play size={14} />
                )}
                {running ? '运行中...' : '运行代码'}
              </button>
            </div>
            <div ref={editorRef} style={styles.editorContainer} />
            {(output || runError) && (
              <div style={styles.outputPanel}>
                <div style={styles.outputHeader}>
                  <span style={styles.outputLabel}>输出结果</span>
                </div>
                <pre
                  style={{
                    ...styles.outputContent,
                    color: runError ? '#fca5a5' : '#a7f3d0',
                  }}
                >
                  {runError ? `错误:\n${runError}` : output || '（无输出）'}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Hint */}
        {currentExercise.hint && submitted && !isCorrect && (
          <div style={styles.hintBox}>
            <span style={styles.hintLabel}>提示：</span>
            {currentExercise.hint}
          </div>
        )}

        {/* Feedback */}
        {submitted && (
          <div
            style={{
              ...styles.feedbackBox,
              backgroundColor: isCorrect ? '#ecfdf5' : '#fef2f2',
              borderColor: isCorrect ? '#10b981' : '#ef4444',
            }}
          >
            {isCorrect ? (
              <>
                <CheckCircle2 size={20} color="#10b981" />
                <span style={{ color: '#059669', fontWeight: 600 }}>
                  回答正确！得 {currentExercise.score} 分
                </span>
              </>
            ) : (
              <>
                <XCircle size={20} color="#ef4444" />
                <span style={{ color: '#dc2626', fontWeight: 600 }}>
                  回答错误，请查看提示后重试
                </span>
              </>
            )}
          </div>
        )}

        {/* Submit button */}
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={
              (currentExercise.type === 'choice' && !selectedAnswer) ||
              (currentExercise.type === 'fill' && !fillAnswer.trim())
            }
            style={{
              ...styles.submitBtn,
              opacity:
                (currentExercise.type === 'choice' && !selectedAnswer) ||
                (currentExercise.type === 'fill' && !fillAnswer.trim())
                  ? 0.5
                  : 1,
              backgroundColor: mod.color,
            }}
          >
            <Send size={16} />
            提交答案
          </button>
        )}

        {/* Completed badge */}
        {isExerciseCompleted && submitted && isCorrect && (
          <div style={styles.completedBanner}>
            <CheckCircle2 size={16} color="#10b981" />
            <span>本题已完成</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={styles.navRow}>
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          style={{
            ...styles.navBtn,
            opacity: currentIndex === 0 ? 0.4 : 1,
          }}
        >
          <ChevronLeft size={18} />
          上一题
        </button>
        <button
          onClick={goToNext}
          disabled={currentIndex === exercises.length - 1}
          style={{
            ...styles.navBtn,
            opacity: currentIndex === exercises.length - 1 ? 0.4 : 1,
          }}
        >
          下一题
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Back to module */}
      <div style={styles.backToModule}>
        <Link
          to={`/modules/${mod.id}`}
          style={{ ...styles.moduleLink, color: mod.color }}
        >
          <ArrowLeft size={16} /> 返回模块
        </Link>
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
    maxWidth: 860,
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

  /* Progress */
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: '16px 20px',
    marginBottom: 24,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  progressHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: '#1e293b',
    flex: 1,
  },
  progressCount: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: 600,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 0.4s ease',
  },

  /* Exercise card */
  exerciseCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    marginBottom: 24,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  exerciseHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  exerciseHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  typeBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 12px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
  },
  exerciseIndex: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: 500,
  },
  scoreBadge: {
    fontSize: 13,
    fontWeight: 700,
    color: '#f59e0b',
    backgroundColor: '#fffbeb',
    padding: '4px 12px',
    borderRadius: 8,
  },

  /* Question */
  questionSection: {
    marginBottom: 24,
    fontSize: 15,
    lineHeight: 1.7,
    color: '#334155',
  },

  /* Options */
  optionsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 10,
    marginBottom: 24,
  },
  optionCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 18px',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    border: '2px solid #e2e8f0',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  optionSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#eef2ff',
  },
  optionCorrect: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
  },
  optionIncorrect: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  optionRadio: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    minWidth: 24,
  },
  radioOuter: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    borderRadius: '50%',
    border: '2px solid',
    transition: 'border-color 0.2s',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: '#6366f1',
  },
  optionText: {
    fontSize: 14,
    fontWeight: 500,
    color: '#334155',
    lineHeight: 1.5,
  },

  /* Fill */
  fillSection: {
    marginBottom: 24,
  },
  fillInput: {
    width: '100%',
    padding: '12px 16px',
    fontSize: 15,
    borderRadius: 10,
    border: '2px solid',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
    backgroundColor: '#f8fafc',
  },

  /* Code */
  codeSection: {
    marginBottom: 24,
  },
  codeHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  codeLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: '#e2e8f0',
  },
  runBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 16px',
    backgroundColor: '#10b981',
    color: '#fff',
    fontWeight: 600,
    fontSize: 13,
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
  },
  editorContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1e293b',
  },
  outputPanel: {
    marginTop: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#0f172a',
    border: '1px solid #334155',
  },
  outputHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6px 12px',
    backgroundColor: '#1e293b',
    borderBottom: '1px solid #334155',
  },
  outputLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: '#94a3b8',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  outputContent: {
    padding: '12px 14px',
    margin: 0,
    fontFamily: "'Fira Code', 'JetBrains Mono', 'Consolas', monospace",
    fontSize: 13,
    lineHeight: 1.7,
    whiteSpace: 'pre-wrap' as const,
    wordBreak: 'break-word' as const,
    maxHeight: 250,
    overflowY: 'auto' as const,
  },

  /* Hint */
  hintBox: {
    padding: '12px 16px',
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: 10,
    fontSize: 14,
    color: '#1e40af',
    marginBottom: 16,
  },
  hintLabel: {
    fontWeight: 700,
  },

  /* Feedback */
  feedbackBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '14px 18px',
    borderRadius: 10,
    border: '1px solid',
    fontSize: 15,
    marginBottom: 16,
  },

  /* Submit */
  submitBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 28px',
    color: '#fff',
    fontWeight: 700,
    fontSize: 15,
    borderRadius: 10,
    border: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },

  /* Completed */
  completedBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '10px 16px',
    backgroundColor: '#ecfdf5',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    color: '#059669',
    marginTop: 12,
  },

  /* Navigation */
  navRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 24,
  },
  navBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 20px',
    backgroundColor: '#fff',
    borderRadius: 10,
    border: '1px solid #e2e8f0',
    color: '#334155',
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },

  /* Back */
  backToModule: {
    textAlign: 'center' as const,
  },
  moduleLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 14,
    fontWeight: 600,
  },
};
