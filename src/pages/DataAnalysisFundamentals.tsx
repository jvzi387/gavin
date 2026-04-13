import React from 'react';

const DataAnalysisFundamentals: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">AI 时代 Python 数据分析知识框架</h1>
      
      <div className="bg-white rounded-lg shadow-md p-8">
        {/* 0. AI 协作基础能力 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">0. AI 协作基础能力</h2>
          <div className="ml-6">
            <h3 className="text-xl font-semibold mb-2">0.1 提示工程（Prompt Engineering）</h3>
            <ul className="list-disc ml-6 mb-4 space-y-1">
              <li>结构化提示词设计</li>
              <li>链式提示分解复杂任务</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-2">0.2 AI 编程工具实操</h3>
            <ul className="list-disc ml-6 mb-4 space-y-1">
              <li>AI IDE（Cursor / Windsurf / Continue）</li>
              <li>代码助手（Copilot / ChatGPT Code Interpreter）</li>
              <li>读懂并判断 AI 生成代码的正确性</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-2">0.3 版本控制与复现意识</h3>
            <ul className="list-disc ml-6 mb-4 space-y-1">
              <li>Git 管理 AI 生成脚本</li>
              <li>记录 AI 对话上下文以便复现</li>
            </ul>
          </div>
        </section>
        
        <hr className="border-gray-200 my-8" />
        
        {/* 1. 数据理解与“人机校验”能力 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">1. 数据理解与“人机校验”能力</h2>
          <div className="ml-6">
            <h3 className="text-xl font-semibold mb-2">1.1 探索性分析（EDA）思维</h3>
            <ul className="list-disc ml-6 mb-4 space-y-1">
              <li>数据类型、缺失值、异常值、分布、相关性</li>
              <li>稳健统计指标（中位数 vs 均值）</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-2">1.2 数据质量问题识别</h3>
            <ul className="list-disc ml-6 mb-4 space-y-1">
              <li>识别 AI 清洗代码中的错误</li>
              <li>常见数据陷阱（偏差、泄漏等）</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-2">1.3 业务理解与问题拆解</h3>
            <ul className="list-disc ml-6 mb-4 space-y-1">
              <li>模糊业务问题 → 可验证数据问题</li>
              <li>设计分析流程分步实现</li>
            </ul>
          </div>
        </section>
        
        <hr className="border-gray-200 my-8" />
        
        {/* 2. Python 核心 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">2. Python 核心（轻语法，重逻辑）</h2>
          <div className="ml-6">
            <h3 className="text-xl font-semibold mb-2">2.1 Pandas / Polars 核心操作</h3>
            <ul className="list-disc ml-6 mb-4 space-y-1">
              <li>筛选、分组、聚合、连接、窗口函数</li>
              <li>长宽转换（melt / pivot）</li>
              <li>读懂链式操作（pipe / assign / query）</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-2">2.2 数据处理核心概念</h3>
            <ul className="list-disc ml-6 mb-4 space-y-1">
              <li>缺失值处理逻辑</li>
              <li>数据类型转换（category / datetime）</li>
              <li>多表关系</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-2">2.3 Numpy（了解即可）</h3>
            <ul className="list-disc ml-6 mb-4 space-y-1">
              <li>广播、向量化运算概念</li>
            </ul>
          </div>
        </section>
        
        <hr className="border-gray-200 my-8" />
        
        {/* 3. 与 AI 协作的分析核心技能 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">3. 与 AI 协作的分析核心技能</h2>
          <div className="ml-6">
            <h3 className="text-xl font-semibold mb-2">3.1 特征工程与数据准备</h3>
            <ul className="list-disc ml-6 mb-4 space-y-1">
              <li>设计特征思路（时间、交叉、分组统计）</li>
              <li>验证 AI 生成特征是否合理</li>
              <li>了解自动化特征工程工具</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-2">3.2 可视化的“控制与修正”</h3>
            <ul className="list-disc ml-6 mb-4 space-y-1">
              <li>修改图表细节（标题、坐标轴、图例、颜色）</li>
              <li>判断图表是否误导</li>
              <li>选择合适的图表类型</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-2">3.3 统计学与推断（防 AI 胡说）</h3>
            <ul className="list-disc ml-6 mb-4 space-y-1">
              <li>判断检验前提是否满足</li>
              <li>解读 p 值（而非仅信“显著”）</li>
              <li>识别虚假相关与混淆变量</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-2">3.4 分析可复现性</h3>
            <ul className="list-disc ml-6 mb-4 space-y-1">
              <li>生成可重复运行的分析流程</li>
              <li>使用配置文件管理参数</li>
              <li>了解协作工具（Jupyter / Quarto / marimo）</li>
            </ul>
          </div>
        </section>
        
        <hr className="border-gray-200 my-8" />
        
        {/* 4. AI 增强的高级分析 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">4. AI 增强的高级分析（选学 / 按需深入）</h2>
          <div className="ml-6">
            <h3 className="text-xl font-semibold mb-2">4.1 时间序列分析</h3>
            <ul className="list-disc ml-6 mb-4 space-y-1">
              <li>设定季节性周期、节假日、异常点</li>
              <li>业务导向的评估指标</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-2">4.2 因果推断基础</h3>
            <ul className="list-disc ml-6 mb-4 space-y-1">
              <li>理解 A/B 检验、双重差分、倾向性得分匹配</li>
              <li>质疑因果图与混淆因素</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-2">4.3 简单预测与优化</h3>
            <ul className="list-disc ml-6 mb-4 space-y-1">
              <li>回归、分类、聚类</li>
              <li>重点：过拟合评估、业务解释性、部署可行性</li>
              <li>理解偏差-方差、交叉验证、混淆矩阵</li>
            </ul>
          </div>
        </section>
        
        <hr className="border-gray-200 my-8" />
        
        {/* 5. 建议学习路径 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">5. 建议学习路径（AI 协作视角）</h2>
          <div className="ml-6">
            <h3 className="text-xl font-semibold mb-2">5.1 第一周</h3>
            <ul className="list-disc ml-6 mb-4 space-y-1">
              <li>用 AI 做完整小分析（CSV → 结论）</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-2">5.2 第二周</h3>
            <ul className="list-disc ml-6 mb-4 space-y-1">
              <li>学习数据质量与统计陷阱（不写代码）</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-2">5.3 第三周</h3>
            <ul className="list-disc ml-6 mb-4 space-y-1">
              <li>Pandas / Polars 核心逻辑 + 修改 AI 错误代码</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-2">5.4 第四周</h3>
            <ul className="list-disc ml-6 mb-4 space-y-1">
              <li>完成 3 个项目（电商、金融、运营）</li>
              <ul className="list-disc ml-6 mb-4 space-y-1">
                <li>先写分析大纲</li>
                <li>AI 实现</li>
                <li>人工校验与修正</li>
                <li>输出业务结论</li>
              </ul>
            </ul>
          </div>
        </section>
        
        <hr className="border-gray-200 my-8" />
        
        {/* 6. 核心转变总结 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">6. 核心转变总结（传统 vs AI 时代）</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 p-4 text-left">传统重点</th>
                  <th className="border border-gray-200 p-4 text-left">AI 时代重点</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 p-4">记忆 API、语法细节</td>
                  <td className="border border-gray-200 p-4">理解数据结构与操作逻辑</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 p-4">手写所有分析代码</td>
                  <td className="border border-gray-200 p-4">设计流程 + 校验 AI 输出</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-4">算法推导与调参</td>
                  <td className="border border-gray-200 p-4">问题拆解 + 结果验证 + 业务判断</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 p-4">复杂可视化编码</td>
                  <td className="border border-gray-200 p-4">快速生成 + 精准修改</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-4">重复性清洗工作</td>
                  <td className="border border-gray-200 p-4">定义数据质量规则</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DataAnalysisFundamentals;