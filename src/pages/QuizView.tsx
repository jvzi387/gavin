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
  Clock,
  Trophy,
  AlertTriangle,
  RotateCcw,
  FileQuestion,
  ListChecks,
  Code,
  Type,
} from 'lucide-react';
import { modules } from '../data/modules';
import { renderMarkdown } from '../utils/markdown';
import { pyodideManager } from '../utils/pyodide';
import { useProgress } from '../store/useProgressStore';
import type { Exercise } from '../types';

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

type QuizPhase = 'start' | 'inProgress' | 'results';

interface AnswerRecord {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function QuizView() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const mod = modules.find((m) => m.id === moduleId);
  const { saveQuizScore } = useProgress();

  const [phase, setPhase] = useState<QuizPhase>('start');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<AnswerRecord[]>([]);
  const [score, setScore] = useState(0);

  // Timer
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Code editor
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [runError, setRunError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  const quiz = mod?.quiz;
  const questions = quiz?.questions ?? [];
  const currentQuestion: Exercise | undefined = questions[currentIndex];

  // ---- Timer management ----
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const startTimer = useCallback(
    (minutes: number) => {
      setTimeLeft(minutes * 60);
      clearTimer();
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearTimer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    [clearTimer]
  );

  // Auto-submit when time runs out
  useEffect(() => {
    if (phase === 'inProgress' && timeLeft === 0 && quiz) {
      handleSubmitQuiz();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

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

  // Update editor when question changes
  useEffect(() => {
    if (viewRef.current && currentQuestion?.codeTemplate) {
      const newCode = currentQuestion.codeTemplate;
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: newCode,
        },
      });
      setCode(newCode);
    }
    setOutput('');
    setRunError(null);
  }, [currentIndex, currentQuestion?.codeTemplate]);

  // ---- Start quiz ----
  const handleStart = useCallback(() => {
    if (!quiz) return;
    setPhase('inProgress');
    setCurrentIndex(0);
    setAnswers({});
    setResults([]);
    setScore(0);
    startTimer(quiz.timeLimit);
  }, [quiz, startTimer]);

  // ---- Submit quiz ----
  const handleSubmitQuiz = useCallback(() => {
    if (!quiz) return;
    clearTimer();

    const answerResults: AnswerRecord[] = questions.map((q) => {
      const userAnswer = answers[q.id] ?? '';
      let correct = false;

      if (q.type === 'choice') {
        correct = userAnswer === q.answer;
      } else if (q.type === 'code') {
        const expected = String(q.answer).toLowerCase();
        correct = userAnswer.toLowerCase().includes(expected);
      } else if (q.type === 'fill') {
        correct = userAnswer.trim().toLowerCase() === String(q.answer).toLowerCase();
      }

      return {
        questionId: q.id,
        selectedAnswer: userAnswer,
        isCorrect: correct,
      };
    });

    const totalScore = answerResults.reduce(
      (sum, r, idx) => sum + (r.isCorrect ? questions[idx].score : 0),
      0
    );

    setResults(answerResults);
    setScore(totalScore);
    saveQuizScore(quiz.id, totalScore);
    setPhase('results');
  }, [quiz, questions, answers, clearTimer, saveQuizScore]);

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

  // ---- Select answer ----
  const selectAnswer = useCallback(
    (questionId: string, answer: string) => {
      setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    },
    []
  );

  // ---- Navigation ----
  const goToQuestion = (index: number) => {
    setCurrentIndex(index);
  };
  const goToPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };
  const goToNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  // ---- Format time ----
  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ---- Not found ----
  if (!mod || !quiz) {
    return (
      <div style={styles.notFound}>
        <h2>测评未找到</h2>
        <Link to="/modules" style={styles.backLink}>
          <ArrowLeft size={16} /> 返回课程列表
        </Link>
      </div>
    );
  }

  const passed = score >= quiz.passingScore;
  const totalPossible = questions.reduce((s, q) => s + q.score, 0);

  // ==================================================================
  //  START SCREEN
  // ==================================================================
  if (phase === 'start') {
    return (
      <div style={styles.page}>
        <div style={styles.breadcrumb}>
          <Link to="/modules" style={styles.backLink}>
            <ArrowLeft size={16} /> 课程列表
          </Link>
          <span style={styles.breadcrumbSep}>/</span>
          <Link to={`/modules/${mod.id}`} style={styles.backLink}>
            {mod.title}
          </Link>
          <span style={styles.breadcrumbSep}>/</span>
          <span style={styles.breadcrumbCurrent}>阶段测评</span>
        </div>

        <div style={styles.startCard}>
          <div style={styles.startIcon}>
            <Trophy size={48} color={mod.color} />
          </div>
          <h1 style={styles.startTitle}>{quiz.title}</h1>
          <p style={styles.startDesc}>{quiz.description}</p>

          <div style={styles.startMeta}>
            <div style={styles.startMetaItem}>
              <FileQuestion size={20} color="#6366f1" />
              <div>
                <span style={styles.startMetaLabel}>题目数量</span>
                <span style={styles.startMetaValue}>{questions.length} 题</span>
              </div>
            </div>
            <div style={styles.startMetaItem}>
              <Clock size={20} color="#f59e0b" />
              <div>
                <span style={styles.startMetaLabel}>时间限制</span>
                <span style={styles.startMetaValue}>{quiz.timeLimit} 分钟</span>
              </div>
            </div>
            <div style={styles.startMetaItem}>
              <Trophy size={20} color="#10b981" />
              <div>
                <span style={styles.startMetaLabel}>及格分数</span>
                <span style={styles.startMetaValue}>{quiz.passingScore} 分</span>
              </div>
            </div>
            <div style={styles.startMetaItem}>
              <ListChecks size={20} color="#8b5cf6" />
              <div>
                <span style={styles.startMetaLabel}>总分</span>
                <span style={styles.startMetaValue}>{totalPossible} 分</span>
              </div>
            </div>
          </div>

          <div style={styles.startWarning}>
            <AlertTriangle size={16} color="#f59e0b" />
            <span>开始后计时器将启动，时间耗尽将自动提交</span>
          </div>

          <button
            onClick={handleStart}
            style={{ ...styles.startBtn, backgroundColor: mod.color }}
          >
            开始测评
          </button>
        </div>
      </div>
    );
  }

  // ==================================================================
  //  IN PROGRESS SCREEN
  // ==================================================================
  if (phase === 'inProgress' && currentQuestion) {
    const isAnswered = !!answers[currentQuestion.id];
    const typeIcon =
      currentQuestion.type === 'choice' ? (
        <ListChecks size={16} />
      ) : currentQuestion.type === 'code' ? (
        <Code size={16} />
      ) : (
        <Type size={16} />
      );
    const typeLabel =
      currentQuestion.type === 'choice'
        ? '选择题'
        : currentQuestion.type === 'code'
        ? '编程题'
        : '填空题';
    const isTimeLow = timeLeft < 60;

    return (
      <div style={styles.page}>
        {/* Top bar */}
        <div style={styles.topBar}>
          <div style={styles.topBarLeft}>
            <Link to={`/modules/${mod.id}`} style={styles.topBackLink}>
              <ArrowLeft size={16} />
            </Link>
            <span style={styles.topTitle}>{quiz.title}</span>
          </div>
          <div
            style={{
              ...styles.timer,
              color: isTimeLow ? '#ef4444' : '#1e293b',
              backgroundColor: isTimeLow ? '#fef2f2' : '#f1f5f9',
            }}
          >
            <Clock size={16} />
            {formatTime(timeLeft)}
            {isTimeLow && (
              <span style={styles.timeWarning}>时间不足！</span>
            )}
          </div>
        </div>

        <div style={styles.quizLayout}>
          {/* Question sidebar */}
          <div style={styles.sidebar}>
            <h4 style={styles.sidebarTitle}>题目导航</h4>
            <div style={styles.sidebarGrid}>
              {questions.map((q, idx) => {
                const answered = !!answers[q.id];
                const isCurrent = idx === currentIndex;
                let dotStyle: React.CSSProperties = styles.sidebarDot;

                if (isCurrent) {
                  dotStyle = { ...dotStyle, ...styles.sidebarDotActive };
                } else if (answered) {
                  dotStyle = { ...dotStyle, ...styles.sidebarDotAnswered };
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => goToQuestion(idx)}
                    style={dotStyle}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            <div style={styles.sidebarLegend}>
              <span style={styles.legendItem}>
                <span style={styles.legendDotCurrent} /> 当前
              </span>
              <span style={styles.legendItem}>
                <span style={styles.legendDotAnswered} /> 已答
              </span>
              <span style={styles.legendItem}>
                <span style={styles.legendDotUnanswered} /> 未答
              </span>
            </div>
            <button
              onClick={handleSubmitQuiz}
              style={{ ...styles.submitQuizBtn, backgroundColor: mod.color }}
            >
              <Send size={16} />
              提交测评
            </button>
          </div>

          {/* Question content */}
          <div style={styles.questionArea}>
            <div style={styles.questionCard}>
              {/* Question header */}
              <div style={styles.questionHeader}>
                <span
                  style={{
                    ...styles.typeBadge,
                    backgroundColor:
                      currentQuestion.type === 'code'
                        ? '#fef3c7'
                        : currentQuestion.type === 'fill'
                        ? '#ede9fe'
                        : '#eef2ff',
                    color:
                      currentQuestion.type === 'code'
                        ? '#d97706'
                        : currentQuestion.type === 'fill'
                        ? '#7c3aed'
                        : '#6366f1',
                  }}
                >
                  {typeIcon}
                  {typeLabel}
                </span>
                <span style={styles.questionScore}>
                  {currentQuestion.score} 分
                </span>
              </div>

              {/* Question text */}
              <div style={styles.questionText}>
                <span style={styles.questionNumber}>
                  第 {currentIndex + 1} 题
                </span>
                <div
                  className="quiz-markdown"
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(currentQuestion.question),
                  }}
                />
              </div>

              {/* Choice options */}
              {currentQuestion.type === 'choice' &&
                currentQuestion.options && (
                  <div style={styles.optionsList}>
                    {currentQuestion.options.map((option, idx) => {
                      const isSelected =
                        answers[currentQuestion.id] === option;
                      return (
                        <div
                          key={idx}
                          style={{
                            ...styles.optionCard,
                            borderColor: isSelected
                              ? '#6366f1'
                              : '#e2e8f0',
                            backgroundColor: isSelected
                              ? '#eef2ff'
                              : '#f8fafc',
                          }}
                          onClick={() =>
                            selectAnswer(currentQuestion.id, option)
                          }
                        >
                          <span style={styles.optionRadio}>
                            <span
                              style={{
                                ...styles.radioOuter,
                                borderColor: isSelected
                                  ? '#6366f1'
                                  : '#cbd5e1',
                              }}
                            >
                              {isSelected && (
                                <span style={styles.radioInner} />
                              )}
                            </span>
                          </span>
                          <span style={styles.optionText}>{option}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

              {/* Code editor */}
              {currentQuestion.type === 'code' && (
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
                        {runError
                          ? `错误:\n${runError}`
                          : output || '（无输出）'}
                      </pre>
                    </div>
                  )}
                  {output && (
                    <button
                      onClick={() =>
                        selectAnswer(currentQuestion.id, output)
                      }
                      style={{
                        ...styles.useOutputBtn,
                        opacity: isAnswered ? 0.5 : 1,
                      }}
                    >
                      <CheckCircle2 size={14} />
                      {isAnswered
                        ? '已记录输出作为答案'
                        : '使用当前输出作为答案'}
                    </button>
                  )}
                </div>
              )}

              {/* Fill input */}
              {currentQuestion.type === 'fill' && (
                <div style={styles.fillSection}>
                  <input
                    type="text"
                    value={answers[currentQuestion.id] ?? ''}
                    onChange={(e) =>
                      selectAnswer(currentQuestion.id, e.target.value)
                    }
                    placeholder="请输入你的答案..."
                    style={styles.fillInput}
                  />
                </div>
              )}
            </div>

            {/* Question navigation */}
            <div style={styles.questionNav}>
              <button
                onClick={goToPrev}
                disabled={currentIndex === 0}
                style={{
                  ...styles.questionNavBtn,
                  opacity: currentIndex === 0 ? 0.4 : 1,
                }}
              >
                <ChevronLeft size={16} />
                上一题
              </button>
              <span style={styles.questionNavInfo}>
                {currentIndex + 1} / {questions.length}
              </span>
              {currentIndex < questions.length - 1 ? (
                <button onClick={goToNext} style={styles.questionNavBtn}>
                  下一题
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  style={{
                    ...styles.questionNavBtn,
                    backgroundColor: mod.color,
                    color: '#fff',
                    border: 'none',
                  }}
                >
                  <Send size={16} />
                  提交测评
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Inline spin animation */}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ==================================================================
  //  RESULTS SCREEN
  // ==================================================================
  if (phase === 'results') {
    const correctCount = results.filter((r) => r.isCorrect).length;

    return (
      <div style={styles.page}>
        <div style={styles.breadcrumb}>
          <Link to="/modules" style={styles.backLink}>
            <ArrowLeft size={16} /> 课程列表
          </Link>
          <span style={styles.breadcrumbSep}>/</span>
          <Link to={`/modules/${mod.id}`} style={styles.backLink}>
            {mod.title}
          </Link>
          <span style={styles.breadcrumbSep}>/</span>
          <span style={styles.breadcrumbCurrent}>测评结果</span>
        </div>

        {/* Score card */}
        <div
          style={{
            ...styles.resultCard,
            borderLeft: `5px solid ${passed ? '#10b981' : '#ef4444'}`,
          }}
        >
          <div style={styles.resultIcon}>
            {passed ? (
              <Trophy size={56} color="#10b981" />
            ) : (
              <XCircle size={56} color="#ef4444" />
            )}
          </div>
          <h1 style={styles.resultTitle}>
            {passed ? '恭喜通过！' : '未通过，再接再厉！'}
          </h1>
          <p style={styles.resultSubtitle}>{quiz.title}</p>

          {/* Score display */}
          <div style={styles.scoreDisplay}>
            <div style={styles.scoreCircle}>
              <span
                style={{
                  ...styles.scoreNumber,
                  color: passed ? '#10b981' : '#ef4444',
                }}
              >
                {score}
              </span>
              <span style={styles.scoreTotal}>/ {totalPossible}</span>
            </div>
            <div style={styles.scoreDetails}>
              <div style={styles.scoreDetailItem}>
                <span style={styles.scoreDetailLabel}>正确题数</span>
                <span style={styles.scoreDetailValue}>
                  {correctCount} / {questions.length}
                </span>
              </div>
              <div style={styles.scoreDetailItem}>
                <span style={styles.scoreDetailLabel}>及格分数</span>
                <span style={styles.scoreDetailValue}>
                  {quiz.passingScore} 分
                </span>
              </div>
              <div style={styles.scoreDetailItem}>
                <span style={styles.scoreDetailLabel}>得分率</span>
                <span
                  style={{
                    ...styles.scoreDetailValue,
                    color:
                      totalPossible > 0 && score / totalPossible >= 0.6
                        ? '#10b981'
                        : '#ef4444',
                  }}
                >
                  {totalPossible > 0
                    ? Math.round((score / totalPossible) * 100)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>

          {/* Score bar comparison */}
          <div style={styles.scoreBarSection}>
            <div style={styles.scoreBarRow}>
              <span style={styles.scoreBarLabel}>你的得分</span>
              <div style={styles.scoreBarBg}>
                <div
                  style={{
                    ...styles.scoreBarFill,
                    width: `${totalPossible > 0 ? (score / totalPossible) * 100 : 0}%`,
                    backgroundColor: passed ? '#10b981' : '#ef4444',
                  }}
                />
              </div>
              <span style={styles.scoreBarValue}>{score} 分</span>
            </div>
            <div style={styles.scoreBarRow}>
              <span style={styles.scoreBarLabel}>及格线</span>
              <div style={styles.scoreBarBg}>
                <div
                  style={{
                    ...styles.scoreBarFill,
                    width: `${(quiz.passingScore / totalPossible) * 100}%`,
                    backgroundColor: '#f59e0b',
                  }}
                />
              </div>
              <span style={styles.scoreBarValue}>
                {quiz.passingScore} 分
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div style={styles.resultActions}>
            <button
              onClick={handleStart}
              style={styles.retryBtn}
            >
              <RotateCcw size={16} />
              重新测评
            </button>
            <Link
              to={`/modules/${mod.id}`}
              style={{ ...styles.moduleBtn, backgroundColor: mod.color }}
            >
              返回模块
            </Link>
          </div>
        </div>

        {/* Question review */}
        <div style={styles.reviewCard}>
          <h3 style={styles.reviewTitle}>答题详情</h3>
          <div style={styles.reviewList}>
            {results.map((result, idx) => {
              const question = questions[idx];
              return (
                <div
                  key={question.id}
                  style={{
                    ...styles.reviewItem,
                    borderLeft: result.isCorrect
                      ? '3px solid #10b981'
                      : '3px solid #ef4444',
                  }}
                >
                  <div style={styles.reviewItemHeader}>
                    <span style={styles.reviewItemIndex}>
                      第 {idx + 1} 题
                    </span>
                    <span
                      style={{
                        ...styles.reviewItemBadge,
                        backgroundColor: result.isCorrect
                          ? '#ecfdf5'
                          : '#fef2f2',
                        color: result.isCorrect ? '#059669' : '#dc2626',
                      }}
                    >
                      {result.isCorrect ? (
                        <>
                          <CheckCircle2 size={14} /> 正确
                        </>
                      ) : (
                        <>
                          <XCircle size={14} /> 错误
                        </>
                      )}
                    </span>
                    <span style={styles.reviewItemScore}>
                      {result.isCorrect ? `+${question.score}` : '+0'} 分
                    </span>
                  </div>
                  <div
                    style={styles.reviewItemQuestion}
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdown(question.question),
                    }}
                  />
                  {!result.isCorrect && (
                    <div style={styles.reviewItemAnswer}>
                      <span style={styles.reviewAnswerLabel}>正确答案：</span>
                      <span style={styles.reviewAnswerValue}>
                        {question.type === 'choice'
                          ? question.answer
                          : question.answer}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

/* ------------------------------------------------------------------ */
/*  Styles                                                            */
/* ------------------------------------------------------------------ */

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: '32px 32px 60px',
    maxWidth: 1100,
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

  /* ===== START SCREEN ===== */
  startCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: '48px 40px',
    textAlign: 'center' as const,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    maxWidth: 600,
    margin: '0 auto',
  },
  startIcon: {
    width: 88,
    height: 88,
    borderRadius: '50%',
    backgroundColor: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
  },
  startTitle: {
    fontSize: 24,
    fontWeight: 800,
    color: '#1e293b',
    marginBottom: 8,
  },
  startDesc: {
    fontSize: 15,
    color: '#64748b',
    marginBottom: 32,
    lineHeight: 1.6,
  },
  startMeta: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
    marginBottom: 28,
  },
  startMetaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 16px',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    textAlign: 'left' as const,
  },
  startMetaLabel: {
    display: 'block',
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 2,
  },
  startMetaValue: {
    display: 'block',
    fontSize: 16,
    fontWeight: 700,
    color: '#1e293b',
  },
  startWarning: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '10px 16px',
    backgroundColor: '#fffbeb',
    border: '1px solid #fde68a',
    borderRadius: 10,
    fontSize: 13,
    color: '#92400e',
    marginBottom: 24,
  },
  startBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '14px 48px',
    color: '#fff',
    fontWeight: 700,
    fontSize: 16,
    borderRadius: 12,
    border: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },

  /* ===== IN PROGRESS ===== */
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: '12px 20px',
    marginBottom: 20,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  topBarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  topBackLink: {
    display: 'flex',
    alignItems: 'center',
    color: '#64748b',
    padding: 4,
  },
  topTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#1e293b',
  },
  timer: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 16px',
    borderRadius: 10,
    fontSize: 18,
    fontWeight: 800,
    fontFamily: "'Fira Code', monospace",
  },
  timeWarning: {
    fontSize: 12,
    fontWeight: 600,
    marginLeft: 4,
  },

  quizLayout: {
    display: 'flex',
    gap: 20,
    alignItems: 'flex-start',
  },

  /* Sidebar */
  sidebar: {
    width: 200,
    minWidth: 200,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    position: 'sticky' as const,
    top: 20,
  },
  sidebarTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: 14,
  },
  sidebarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 6,
    marginBottom: 14,
  },
  sidebarDot: {
    width: 36,
    height: 36,
    borderRadius: 8,
    border: '2px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    color: '#64748b',
    fontWeight: 600,
    fontSize: 13,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  sidebarDotActive: {
    borderColor: '#6366f1',
    backgroundColor: '#eef2ff',
    color: '#6366f1',
  },
  sidebarDotAnswered: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
    color: '#10b981',
  },
  sidebarLegend: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 6,
    marginBottom: 16,
    fontSize: 12,
    color: '#64748b',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  legendDotCurrent: {
    display: 'inline-block',
    width: 10,
    height: 10,
    borderRadius: 3,
    backgroundColor: '#6366f1',
  },
  legendDotAnswered: {
    display: 'inline-block',
    width: 10,
    height: 10,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  legendDotUnanswered: {
    display: 'inline-block',
    width: 10,
    height: 10,
    borderRadius: 3,
    backgroundColor: '#e2e8f0',
  },
  submitQuizBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    padding: '10px 16px',
    color: '#fff',
    fontWeight: 700,
    fontSize: 14,
    borderRadius: 10,
    border: 'none',
    cursor: 'pointer',
  },

  /* Question area */
  questionArea: {
    flex: 1,
    minWidth: 0,
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    marginBottom: 16,
  },
  questionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  questionScore: {
    fontSize: 14,
    fontWeight: 700,
    color: '#f59e0b',
  },
  questionText: {
    marginBottom: 24,
    fontSize: 15,
    lineHeight: 1.7,
    color: '#334155',
  },
  questionNumber: {
    display: 'block',
    fontSize: 13,
    fontWeight: 700,
    color: '#94a3b8',
    marginBottom: 8,
  },

  /* Options */
  optionsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 10,
  },
  optionCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 18px',
    borderRadius: 10,
    border: '2px solid',
    cursor: 'pointer',
    transition: 'all 0.2s',
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

  /* Code */
  codeSection: {
    marginBottom: 8,
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
  useOutputBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    padding: '8px 16px',
    backgroundColor: '#eef2ff',
    color: '#6366f1',
    fontWeight: 600,
    fontSize: 13,
    borderRadius: 8,
    border: '1px solid #c7d2fe',
    cursor: 'pointer',
  },

  /* Fill */
  fillSection: {
    marginBottom: 8,
  },
  fillInput: {
    width: '100%',
    padding: '12px 16px',
    fontSize: 15,
    borderRadius: 10,
    border: '2px solid #e2e8f0',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
    backgroundColor: '#f8fafc',
  },

  /* Question navigation */
  questionNav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: '12px 20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  questionNavBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 20px',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    border: '1px solid #e2e8f0',
    color: '#334155',
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  questionNavInfo: {
    fontSize: 14,
    fontWeight: 600,
    color: '#64748b',
  },

  /* ===== RESULTS SCREEN ===== */
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: '40px',
    textAlign: 'center' as const,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    marginBottom: 24,
  },
  resultIcon: {
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 800,
    color: '#1e293b',
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 15,
    color: '#64748b',
    marginBottom: 32,
  },
  scoreDisplay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
    marginBottom: 32,
    flexWrap: 'wrap' as const,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: '50%',
    backgroundColor: '#f8fafc',
    border: '4px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    fontSize: 36,
    fontWeight: 800,
    lineHeight: 1,
  },
  scoreTotal: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: 500,
  },
  scoreDetails: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 12,
    textAlign: 'left' as const,
  },
  scoreDetailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 24,
    padding: '8px 0',
    borderBottom: '1px solid #f1f5f9',
  },
  scoreDetailLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  scoreDetailValue: {
    fontSize: 14,
    fontWeight: 700,
    color: '#1e293b',
  },
  scoreBarSection: {
    maxWidth: 400,
    margin: '0 auto 32px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 10,
  },
  scoreBarRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  scoreBarLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: 500,
    width: 60,
    textAlign: 'right' as const,
  },
  scoreBarBg: {
    flex: 1,
    height: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 5,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 5,
    transition: 'width 0.6s ease',
  },
  scoreBarValue: {
    fontSize: 13,
    fontWeight: 700,
    color: '#1e293b',
    width: 50,
  },
  resultActions: {
    display: 'flex',
    justifyContent: 'center',
    gap: 16,
    flexWrap: 'wrap' as const,
  },
  retryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 28px',
    backgroundColor: '#f1f5f9',
    color: '#334155',
    fontWeight: 700,
    fontSize: 15,
    borderRadius: 10,
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  moduleBtn: {
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
    textDecoration: 'none',
    transition: 'opacity 0.2s',
  },

  /* Review */
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: 20,
  },
  reviewList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 12,
  },
  reviewItem: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: '18px 20px',
  },
  reviewItemHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  reviewItemIndex: {
    fontSize: 13,
    fontWeight: 700,
    color: '#64748b',
  },
  reviewItemBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '2px 10px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
  },
  reviewItemScore: {
    marginLeft: 'auto',
    fontSize: 13,
    fontWeight: 700,
    color: '#64748b',
  },
  reviewItemQuestion: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 1.6,
    marginBottom: 8,
  },
  reviewItemAnswer: {
    fontSize: 13,
    color: '#64748b',
    padding: '8px 12px',
    backgroundColor: '#fff',
    borderRadius: 8,
    border: '1px solid #e2e8f0',
  },
  reviewAnswerLabel: {
    fontWeight: 700,
    color: '#10b981',
  },
  reviewAnswerValue: {
    fontWeight: 600,
    color: '#1e293b',
  },
};
