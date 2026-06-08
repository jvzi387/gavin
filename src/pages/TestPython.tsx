import React from 'react';
import CodeEditor from '../components/CodeEditor';

export default function TestPython() {
  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🐍 Python 在线执行环境</h1>
      <p style={{ color: '#666', marginBottom: '24px' }}>
        支持所有 Python 语法，可直接运行 pandas、numpy 等数据分析代码
      </p>

      {/* 基础示例 */}
      <h3>基础语法示例</h3>
      <CodeEditor
        starterCode={`# 基础语法测试
print("Hello World!")

# 循环
for i in range(5):
    print(f"数字: {i}")

# 列表推导式
squares = [x**2 for x in range(10)]
print(f"平方数: {squares}")`}
        title="Python 基础练习"
        height="300px"
      />

      {/* 数据分析示例 */}
      <h3 style={{ marginTop: '32px' }}>数据分析示例</h3>
      <CodeEditor
        starterCode={`import pandas as pd
import numpy as np

# 创建销售数据
data = {
    '产品': ['A', 'B', 'C', 'A', 'B', 'C'],
    '销量': [100, 150, 80, 120, 180, 90],
    '价格': [50, 30, 80, 55, 28, 85]
}

df = pd.DataFrame(data)
print("=== 数据表 ===")
print(df)

print("\\n=== 按产品统计 ===")
stats = df.groupby('产品').agg({
    '销量': ['sum', 'mean'],
    '价格': 'mean'
}).round(2)
print(stats)

# 计算总收入
df['收入'] = df['销量'] * df['价格']
print("\\n=== 总收入 ===")
print(f"总收入: ¥{df['收入'].sum():,.0f}")`}
        title="Pandas 数据分析"
        height="400px"
      />
    </div>
  );
}