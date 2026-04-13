import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Brain,
  Eye,
  Code2,
  Sparkles,
  TrendingUp,
  Route,
  GitCompareArrows,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  Layers,
  Zap,
  Target,
  BookOpen,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Knowledge Framework Data                                           */
/* ------------------------------------------------------------------ */

interface SubSection {
  title: string;
  items: string[];
}

interface Section {
  id: string;
  number: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  desc: string;
  subs: SubSection[];
}

const sections: Section[] = [
  {
    id: 'ai-basics',
    number: '0',
    title: 'AI 协作基础能力',
    icon: <Brain size={24} />,
    color: '#6366f1',
    bg: '#eef2ff',
    desc: '掌握与 AI 高效协作的核心能力，学会用 AI 加速学习与开发',
    subs: [
      {
        title: '0.1 提示工程（Prompt Engineering）',
        items: ['结构化提示词设计', '链式提示分解复杂任务'],
      },
      {
        title: '0.2 AI 编程工具实操',
        items: [
          'AI IDE（Cursor / Windsurf / Continue）',
          '代码助手（Copilot / ChatGPT Code Interpreter）',
          '读懂并判断 AI 生成代码的正确性',
        ],
      },
      {
        title: '0.3 版本控制与复现意识',
        items: ['Git 管理 AI 生成脚本', '记录 AI 对话上下文以便复现'],
      },
    ],
  },
  {
    id: 'data-understanding',
    number: '1',
    title: '数据理解与"人机校验"能力',
    icon: <Eye size={24} />,
    color: '#10b981',
    bg: '#ecfdf5',
    desc: '培养数据直觉，学会识别数据质量问题，建立人机校验思维',
    subs: [
      {
        title: '1.1 探索性分析（EDA）思维',
        items: [
          '数据类型、缺失值、异常值、分布、相关性',
          '稳健统计指标（中位数 vs 均值）',
        ],
      },
      {
        title: '1.2 数据质量问题识别',
        items: ['识别 AI 清洗代码中的错误', '常见数据陷阱（偏差、泄漏等）'],
      },
      {
        title: '1.3 业务理解与问题拆解',
        items: [
          '模糊业务问题 → 可验证数据问题',
          '设计分析流程分步实现',
        ],
      },
    ],
  },
  {
    id: 'python-core',
    number: '2',
    title: 'Python 核心（轻语法，重逻辑）',
    icon: <Code2 size={24} />,
    color: '#f59e0b',
    bg: '#fffbeb',
    desc: '聚焦数据处理核心逻辑，理解操作本质而非死记语法',
    subs: [
      {
        title: '2.1 Pandas / Polars 核心操作',
        items: [
          '筛选、分组、聚合、连接、窗口函数',
          '长宽转换（melt / pivot）',
          '读懂链式操作（pipe / assign / query）',
        ],
      },
      {
        title: '2.2 数据处理核心概念',
        items: [
          '缺失值处理逻辑',
          '数据类型转换（category / datetime）',
          '多表关系',
        ],
      },
      {
        title: '2.3 Numpy（了解即可）',
        items: ['广播、向量化运算概念'],
      },
    ],
  },
  {
    id: 'ai-collab-skills',
    number: '3',
    title: '与 AI 协作的分析核心技能',
    icon: <Sparkles size={24} />,
    color: '#ef4444',
    bg: '#fef2f2',
    desc: '学会在 AI 辅助下完成高质量数据分析，掌握校验与修正能力',
    subs: [
      {
        title: '3.1 特征工程与数据准备',
        items: [
          '设计特征思路（时间、交叉、分组统计）',
          '验证 AI 生成特征是否合理',
          '了解自动化特征工程工具',
        ],
      },
      {
        title: '3.2 可视化的"控制与修正"',
        items: [
          '修改图表细节（标题、坐标轴、图例、颜色）',
          '判断图表是否误导',
          '选择合适的图表类型',
        ],
      },
      {
        title: '3.3 统计学与推断（防 AI 胡说）',
        items: [
          '判断检验前提是否满足',
          '解读 p 值（而非仅信"显著"）',
          '识别虚假相关与混淆变量',
        ],
      },
      {
        title: '3.4 分析可复现性',
        items: [
          '生成可重复运行的分析流程',
          '使用配置文件管理参数',
          '了解协作工具（Jupyter / Quarto / marimo）',
        ],
      },
    ],
  },
  {
    id: 'advanced-analysis',
    number: '4',
    title: 'AI 增强的高级分析（选学 / 按需深入）',
    icon: <TrendingUp size={24} />,
    color: '#8b5cf6',
    bg: '#f5f3ff',
    desc: '进阶分析技能，根据实际需求选择性深入学习',
    subs: [
      {
        title: '4.1 时间序列分析',
        items: [
          '设定季节性周期、节假日、异常点',
          '业务导向的评估指标',
        ],
      },
      {
        title: '4.2 因果推断基础',
        items: [
          '理解 A/B 检验、双重差分、倾向性得分匹配',
          '质疑因果图与混淆因素',
        ],
      },
      {
        title: '4.3 简单预测与优化',
        items: [
          '回归、分类、聚类',
          '重点：过拟合评估、业务解释性、部署可行性',
          '理解偏差-方差、交叉验证、混淆矩阵',
        ],
      },
    ],
  },
  {
    id: 'learning-path',
    number: '5',
    title: '建议学习路径（AI 协作视角）',
    icon: <Route size={24} />,
    color: '#0ea5e9',
    bg: '#f0f9ff',
    desc: '4 周实战学习计划，从 AI 辅助入门到独立完成分析项目',
    subs: [
      {
        title: '5.1 第一周',
        items: ['用 AI 做完整小分析（CSV → 结论）'],
      },
      {
        title: '5.2 第二周',
        items: ['学习数据质量与统计陷阱（不写代码）'],
      },
      {
        title: '5.3 第三周',
        items: ['Pandas / Polars 核心逻辑 + 修改 AI 错误代码'],
      },
      {
        title: '5.4 第四周',
        items: [
          '完成 3 个项目（电商、金融、运营）',
          '先写分析大纲 → AI 实现 → 人工校验与修正 → 输出业务结论',
        ],
      },
    ],
  },
];

const comparisonData = [
  { traditional: '记忆 API、语法细节', ai_era: '理解数据结构与操作逻辑' },
  { traditional: '手写所有分析代码', ai_era: '设计流程 + 校验 AI 输出' },
  { traditional: '算法推导与调参', ai_era: '问题拆解 + 结果验证 + 业务判断' },
  { traditional: '复杂可视化编码', ai_era: '快速生成 + 精准修改' },
  { traditional: '重复性清洗工作', ai_era: '定义数据质量规则' },
];

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function DataAnalysisBasics() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sections.map((s) => s.id))
  );

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => setExpandedSections(new Set(sections.map((s) => s.id)));
  const collapseAll = () => setExpandedSections(new Set());

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <Link to="/" style={styles.backLink}>
          <ArrowLeft size={20} />
          <span>返回首页</span>
        </Link>
        <div style={styles.headerContent}>
          <div style={styles.headerIconWrap}>
            <BookOpen size={32} color="#6366f1" />
          </div>
          <div>
            <h1 style={styles.headerTitle}>AI 时代 Python 数据分析知识框架</h1>
            <p style={styles.headerDesc}>
              面向商务数据分析与应用专业 &middot; 从基础到进阶的系统化学习路线
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={styles.quickStats}>
        <div style={styles.quickStatItem}>
          <Layers size={18} color="#6366f1" />
          <span><strong>6</strong> 大知识板块</span>
        </div>
        <div style={styles.quickStatItem}>
          <BookOpen size={18} color="#10b981" />
          <span><strong>20+</strong> 核心知识节点</span>
        </div>
        <div style={styles.quickStatItem}>
          <Target size={18} color="#f59e0b" />
          <span><strong>4 周</strong> 建议学习周期</span>
        </div>
        <div style={styles.quickStatItem}>
          <Zap size={18} color="#ef4444" />
          <span>AI 协作视角</span>
        </div>
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <button onClick={expandAll} style={styles.controlBtn}>
          展开全部
        </button>
        <button onClick={collapseAll} style={styles.controlBtn}>
          收起全部
        </button>
      </div>

      {/* Sections */}
      <div style={styles.sectionsContainer}>
        {sections.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          return (
            <div key={section.id} style={styles.sectionCard}>
              {/* Section Header */}
              <div
                style={styles.sectionHeader}
                onClick={() => toggleSection(section.id)}
              >
                <div style={styles.sectionHeaderLeft}>
                  <div
                    style={{
                      ...styles.sectionIcon,
                      backgroundColor: section.bg,
                      color: section.color,
                    }}
                  >
                    {section.icon}
                  </div>
                  <div>
                    <div style={styles.sectionNumber}>第 {section.number} 章</div>
                    <h2 style={styles.sectionTitle}>{section.title}</h2>
                    <p style={styles.sectionDesc}>{section.desc}</p>
                  </div>
                </div>
                <div style={{ ...styles.chevron, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}>
                  <ChevronDown size={22} color="#94a3b8" />
                </div>
              </div>

              {/* Section Content */}
              {isExpanded && (
                <div style={styles.sectionContent}>
                  {section.subs.map((sub, idx) => (
                    <div key={idx} style={styles.subSection}>
                      <h3 style={styles.subTitle}>
                        <ChevronRight size={16} style={{ color: section.color, flexShrink: 0, marginTop: 3 }} />
                        {sub.title}
                      </h3>
                      <ul style={styles.itemList}>
                        {sub.items.map((item, i) => (
                          <li key={i} style={styles.item}>
                            <span style={{ ...styles.itemDot, backgroundColor: section.color }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Comparison Table */}
      <div style={styles.comparisonSection}>
        <div style={styles.comparisonHeader}>
          <GitCompareArrows size={24} color="#6366f1" />
          <h2 style={styles.comparisonTitle}>核心转变总结（传统 vs AI 时代）</h2>
        </div>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, backgroundColor: '#fef2f2', color: '#991b1b' }}>
                  <span style={styles.thIcon}>📚</span> 传统重点
                </th>
                <th style={{ ...styles.th, backgroundColor: '#ecfdf5', color: '#065f46' }}>
                  <span style={styles.thIcon}>🤖</span> AI 时代重点
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, i) => (
                <tr key={i}>
                  <td style={{ ...styles.td, color: '#64748b' }}>
                    <span style={styles.crossIcon}>✕</span> {row.traditional}
                  </td>
                  <td style={{ ...styles.td, color: '#1e293b', fontWeight: 500 }}>
                    <span style={styles.checkIcon}>✓</span> {row.ai_era}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA */}
      <div style={styles.ctaSection}>
        <div style={styles.ctaCard}>
          <Lightbulb size={36} color="#f59e0b" />
          <h3 style={styles.ctaTitle}>准备好开始了吗？</h3>
          <p style={styles.ctaDesc}>
            按照 4 周学习路径，结合 AI 工具，系统掌握数据分析核心能力
          </p>
          <div style={styles.ctaButtons}>
            <Link to="/modules" style={styles.ctaPrimary}>
              进入课程学习 <ChevronRight size={16} />
            </Link>
            <Link to="/" style={styles.ctaSecondary}>
              返回首页
            </Link>
          </div>
        </div>
      </div>
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

  /* Header */
  header: {
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)',
    padding: '40px 32px 36px',
    color: '#fff',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    marginBottom: 24,
    fontWeight: 500,
  },
  headerContent: {
    maxWidth: 900,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: 20,
  },
  headerIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 800,
    marginBottom: 8,
    letterSpacing: '-0.3px',
  },
  headerDesc: {
    fontSize: 15,
    opacity: 0.9,
    fontWeight: 400,
  },

  /* Quick Stats */
  quickStats: {
    maxWidth: 900,
    margin: '-20px auto 0',
    padding: '0 24px',
    position: 'relative' as const,
    zIndex: 10,
  },
  quickStatItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    padding: '10px 18px',
    borderRadius: 10,
    fontSize: 13,
    color: '#475569',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    marginRight: 10,
    marginBottom: 10,
  },

  /* Controls */
  controls: {
    maxWidth: 900,
    margin: '24px auto 0',
    padding: '0 24px',
    display: 'flex',
    gap: 10,
  },
  controlBtn: {
    padding: '8px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    backgroundColor: '#fff',
    color: '#64748b',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
  },

  /* Sections */
  sectionsContainer: {
    maxWidth: 900,
    margin: '20px auto 0',
    padding: '0 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },
  sectionHeaderLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 16,
    flex: 1,
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  sectionNumber: {
    fontSize: 12,
    fontWeight: 600,
    color: '#94a3b8',
    marginBottom: 2,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 1.5,
  },
  chevron: {
    transition: 'transform 0.25s ease',
    flexShrink: 0,
    marginTop: 12,
  },
  sectionContent: {
    padding: '0 24px 24px',
    paddingLeft: 88,
  },
  subSection: {
    marginBottom: 20,
  },
  subTitle: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    fontSize: 15,
    fontWeight: 600,
    color: '#334155',
    marginBottom: 10,
  },
  itemList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 14,
    color: '#475569',
    lineHeight: 1.5,
  },
  itemDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    flexShrink: 0,
  },

  /* Comparison Table */
  comparisonSection: {
    maxWidth: 900,
    margin: '40px auto 0',
    padding: '0 24px',
  },
  comparisonHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  comparisonTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: '#1e293b',
  },
  tableWrap: {
    backgroundColor: '#fff',
    borderRadius: 16,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  th: {
    padding: '16px 20px',
    fontSize: 15,
    fontWeight: 700,
    textAlign: 'left' as const,
  },
  thIcon: {
    marginRight: 8,
  },
  td: {
    padding: '14px 20px',
    fontSize: 14,
    lineHeight: 1.6,
    borderTop: '1px solid #f1f5f9',
  },
  crossIcon: {
    color: '#ef4444',
    marginRight: 8,
    fontWeight: 700,
  },
  checkIcon: {
    color: '#10b981',
    marginRight: 8,
    fontWeight: 700,
  },

  /* CTA */
  ctaSection: {
    maxWidth: 900,
    margin: '40px auto 0',
    padding: '0 24px 40px',
  },
  ctaCard: {
    background: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)',
    borderRadius: 20,
    padding: '40px 32px',
    textAlign: 'center' as const,
    border: '1px solid #fde68a',
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: '#92400e',
    marginBottom: 10,
    marginTop: 16,
  },
  ctaDesc: {
    fontSize: 15,
    color: '#a16207',
    marginBottom: 24,
    lineHeight: 1.6,
  },
  ctaButtons: {
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
    flexWrap: 'wrap' as const,
  },
  ctaPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '12px 28px',
    backgroundColor: '#6366f1',
    color: '#fff',
    fontWeight: 600,
    fontSize: 15,
    borderRadius: 10,
    boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
  },
  ctaSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '12px 28px',
    backgroundColor: '#fff',
    color: '#64748b',
    fontWeight: 600,
    fontSize: 15,
    borderRadius: 10,
    border: '1px solid #e2e8f0',
  },
};
