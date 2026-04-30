import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCourseById } from '../data/courses';
import CodeEditor from '../components/CodeEditor';

const Learn: React.FC = () => {
  const { courseId, chapterId } = useParams<{ courseId: string; chapterId: string }>();
  const course = getCourseById(courseId || '');
  const chapter = course?.chapters.find(ch => ch.id === chapterId);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [chapterId]);

  const handleChapterClick = (chapterId: string) => {
    navigate(`/learn/${courseId}/${chapterId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  

  if (!course || !chapter) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">章节不存在</h1>
        <p className="text-gray-600">抱歉，您访问的章节不存在。</p>
        <Link 
          to={`/courses/${courseId}`} 
          className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          返回课程详情
        </Link>
      </div>
    );
  }

  // 渲染章节内容
  const renderChapterContent = (content: string) => {
    // 简单的Markdown解析，提取代码块
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let inCodeBlock = false;
    let codeBlock = '';
    let currentText = '';

    for (const line of lines) {
      if (line.startsWith('```python')) {
        inCodeBlock = true;
        if (currentText) {
          elements.push(
            <div key={elements.length} className="mb-4">
              {currentText.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-2">{paragraph}</p>
              ))}
            </div>
          );
          currentText = '';
        }
      } else if (line.startsWith('```')) {
        inCodeBlock = false;
        elements.push(
          <div key={elements.length} className="mb-6">
            <CodeEditor
              starterCode={codeBlock}
              title={`代码示例 ${elements.filter(el => el.type === CodeEditor).length + 1}`}
              height="300px"
            />
          </div>
        );
        codeBlock = '';
      } else if (inCodeBlock) {
        codeBlock += line + '\n';
      } else {
        currentText += line + '\n';
      }
    }

    if (currentText) {
      elements.push(
        <div key={elements.length} className="mb-4">
          {currentText.split('\n').map((paragraph, i) => (
            <p key={i} className="mb-2">{paragraph}</p>
          ))}
        </div>
      );
    }

    return elements;
  };

  // 根据章节ID添加相应的代码示例
  const chapterCodeExamples: Record<string, string> = {
    'ch-1-1': `import pandas as pd
import numpy as np

# 读取CSV文件
df = pd.read_csv('user_orders.csv')

# 查看数据形状
print("数据形状:", df.shape)

# 查看数据类型
print("\n数据类型:")
print(df.dtypes)

# 查看统计描述
print("\n统计描述:")
print(df.describe())

# 查看前5行数据
print("\n前5行数据:")
print(df.head())

# 查看后5行数据
print("\n后5行数据:")
print(df.tail())`,
    'ch-1-2': `import pandas as pd
import numpy as np

# 创建包含缺失值的示例数据
df = pd.DataFrame({
    'name': ['Alice', 'Bob', 'Charlie', 'David', 'Eve'],
    'age': [25, np.nan, 35, 40, np.nan],
    'salary': [50000, 60000, np.nan, 80000, 90000],
    'department': ['HR', 'IT', 'IT', np.nan, 'HR']
})

print("原始数据:")
print(df)

# 检查缺失值
print("\n缺失值统计:")
print(df.isnull().sum())

# 1. 数值型数据填充
# 用中位数填充年龄
print("\n1. 用中位数填充年龄:")
df['age'] = df['age'].fillna(df['age'].median())
print(df)

# 用均值填充薪资
print("\n2. 用均值填充薪资:")
df['salary'] = df['salary'].fillna(df['salary'].mean())
print(df)

# 2. 分类数据填充
# 用众数填充部门
print("\n3. 用众数填充部门:")
df['department'] = df['department'].fillna(df['department'].mode()[0])
print(df)

# 3. 删除缺失值
# 创建包含缺失值的新数据
print("\n4. 删除包含缺失值的行:")
df_with_nan = pd.DataFrame({
    'name': ['Alice', 'Bob', 'Charlie'],
    'age': [25, np.nan, 35],
    'salary': [50000, 60000, np.nan]
})
print("原始数据:")
print(df_with_nan)
print("删除缺失值后:")
print(df_with_nan.dropna())`,
    'ch-2-1': `import pandas as pd
import numpy as np

# Create sample data
df = pd.DataFrame({
    'category': ['A', 'B', 'A', 'B', 'A', 'B', 'A', 'A'],
    'sub_category': ['X', 'X', 'Y', 'Y', 'X', 'X', 'Y', 'Y'],
    'value1': [10, 20, 30, 40, 50, 60, 70, 80],
    'value2': [100, 200, 300, 400, 500, 600, 700, 800]
})

print("Original data:")
print(df)

# 1. Basic groupby aggregation
print("\n1. Group by category, calculate sum of value1:")
result1 = df.groupby('category')['value1'].sum()
print(result1)

# 2. Multi-column aggregation
print("\n2. Group by category, calculate mean of value1 and value2:")
result2 = df.groupby('category').agg({'value1': 'mean', 'value2': 'mean'})
print(result2)

# 3. Multi-level grouping
print("\n3. Group by category and sub_category, calculate sum of value1:")
result3 = df.groupby(['category', 'sub_category'])['value1'].sum()
print(result3)

# 4. Reset index
print("\n4. Reset index:")
result4 = result3.reset_index()
print(result4)

# 5. Multi-function aggregation
print("\n5. Group by category, calculate multiple statistics for value1:")
result5 = df.groupby('category')['value1'].agg(['sum', 'mean', 'max', 'min'])
print(result5)

# 6. Custom aggregation function
print("\n6. Group by category, calculate range of value1:")
def range_func(x):
    return x.max() - x.min()

result6 = df.groupby('category')['value1'].agg(range_func)
print(result6)`, 
    'ch-2-2': `import pandas as pd
import numpy as np

# 创建示例数据
df = pd.DataFrame({
    'date': pd.date_range('2024-01-01', periods=12, freq='M'),
    'category': ['A', 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'B'],
    'region': ['North', 'South', 'North', 'South', 'North', 'South', 'North', 'South', 'North', 'South', 'North', 'South'],
    'sales': np.random.randint(1000, 10000, 12),
    'profit': np.random.randint(100, 1000, 12)
})

print("原始数据:")
print(df)

# 1. 基本透视表
print("\n1. 基本透视表 - 按类别和地区汇总销售额:")
pivot1 = df.pivot_table(
    values='sales',
    index='category',
    columns='region',
    aggfunc='sum'
)
print(pivot1)

# 2. 多值透视表
print("\n2. 多值透视表 - 同时汇总销售额和利润:")
pivot2 = df.pivot_table(
    values=['sales', 'profit'],
    index='category',
    columns='region',
    aggfunc='sum'
)
print(pivot2)

# 3. 多函数透视表
print("\n3. 多函数透视表 - 计算销售额的总和和平均值:")
pivot3 = df.pivot_table(
    values='sales',
    index='category',
    columns='region',
    aggfunc=['sum', 'mean']
)
print(pivot3)

# 4. 添加总计
print("\n4. 添加总计:")
pivot4 = df.pivot_table(
    values='sales',
    index='category',
    columns='region',
    aggfunc='sum',
    margins=True,
    margins_name='总计'
)
print(pivot4)

# 5. 处理缺失值
print("\n5. 处理缺失值:")
# 创建包含缺失值的数据
df_with_nan = df.copy()
df_with_nan.loc[2, 'sales'] = np.nan
df_with_nan.loc[5, 'profit'] = np.nan

pivot5 = df_with_nan.pivot_table(
    values=['sales', 'profit'],
    index='category',
    columns='region',
    aggfunc='sum',
    fill_value=0
)
print(pivot5)

# 6. 多级索引透视表
print("\n6. 多级索引透视表:")
pivot6 = df.pivot_table(
    values='sales',
    index=['category', 'region'],
    columns=df['date'].dt.quarter,
    aggfunc='sum'
)
print(pivot6)`
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to={`/courses/${courseId}`} className="text-blue-600 hover:underline mr-4">
          ← 返回课程详情
        </Link>
        <h1 className="text-3xl font-bold">{course.title}</h1>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">第{course.chapters.findIndex(ch => ch.id === chapter.id) + 1}章：{chapter.title}</h2>
            <p className="text-gray-600 mb-6">{chapter.description}</p>
            
            {/* 数据预览表格 */}
            {chapterId === 'ch-1-1' && (
              <div className="mt-6 mb-6">
                <h3 className="text-lg font-semibold mb-3">数据预览（user_orders.csv）</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">order_id</th>
                        <th className="py-2 px-4 border-b">user_id</th>
                        <th className="py-2 px-4 border-b">product</th>
                        <th className="py-2 px-4 border-b">region</th>
                        <th className="py-2 px-4 border-b">amount</th>
                        <th className="py-2 px-4 border-b">order_date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-4 border-b">ORD00001</td>
                        <td className="py-2 px-4 border-b">1234</td>
                        <td className="py-2 px-4 border-b">手机</td>
                        <td className="py-2 px-4 border-b">北京</td>
                        <td className="py-2 px-4 border-b">2500</td>
                        <td className="py-2 px-4 border-b">2024-01-01</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">ORD00002</td>
                        <td className="py-2 px-4 border-b">5678</td>
                        <td className="py-2 px-4 border-b">电脑</td>
                        <td className="py-2 px-4 border-b">上海</td>
                        <td className="py-2 px-4 border-b">8999</td>
                        <td className="py-2 px-4 border-b">2024-01-02</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">ORD00003</td>
                        <td className="py-2 px-4 border-b">1234</td>
                        <td className="py-2 px-4 border-b">耳机</td>
                        <td className="py-2 px-4 border-b">北京</td>
                        <td className="py-2 px-4 border-b">299</td>
                        <td className="py-2 px-4 border-b">2024-01-03</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">ORD00004</td>
                        <td className="py-2 px-4 border-b">9012</td>
                        <td className="py-2 px-4 border-b">平板</td>
                        <td className="py-2 px-4 border-b">广州</td>
                        <td className="py-2 px-4 border-b">3499</td>
                        <td className="py-2 px-4 border-b">2024-01-04</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">ORD00005</td>
                        <td className="py-2 px-4 border-b">5678</td>
                        <td className="py-2 px-4 border-b">充电器</td>
                        <td className="py-2 px-4 border-b">上海</td>
                        <td className="py-2 px-4 border-b">129</td>
                        <td className="py-2 px-4 border-b">2024-01-05</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">ORD00006</td>
                        <td className="py-2 px-4 border-b">1234</td>
                        <td className="py-2 px-4 border-b">电脑</td>
                        <td className="py-2 px-4 border-b">北京</td>
                        <td className="py-2 px-4 border-b">7999</td>
                        <td className="py-2 px-4 border-b">2024-01-06</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">ORD00007</td>
                        <td className="py-2 px-4 border-b">9012</td>
                        <td className="py-2 px-4 border-b">手机</td>
                        <td className="py-2 px-4 border-b">广州</td>
                        <td className="py-2 px-4 border-b">3299</td>
                        <td className="py-2 px-4 border-b">2024-01-07</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">ORD00008</td>
                        <td className="py-2 px-4 border-b">5678</td>
                        <td className="py-2 px-4 border-b">平板</td>
                        <td className="py-2 px-4 border-b">上海</td>
                        <td className="py-2 px-4 border-b">2999</td>
                        <td className="py-2 px-4 border-b">2024-01-08</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">ORD00009</td>
                        <td className="py-2 px-4 border-b">1234</td>
                        <td className="py-2 px-4 border-b">耳机</td>
                        <td className="py-2 px-4 border-b">北京</td>
                        <td className="py-2 px-4 border-b">399</td>
                        <td className="py-2 px-4 border-b">2024-01-09</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">ORD00010</td>
                        <td className="py-2 px-4 border-b">9012</td>
                        <td className="py-2 px-4 border-b">充电器</td>
                        <td className="py-2 px-4 border-b">广州</td>
                        <td className="py-2 px-4 border-b">99</td>
                        <td className="py-2 px-4 border-b">2024-01-10</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">ORD00011</td>
                        <td className="py-2 px-4 border-b">4321</td>
                        <td className="py-2 px-4 border-b">手机</td>
                        <td className="py-2 px-4 border-b">深圳</td>
                        <td className="py-2 px-4 border-b">2999</td>
                        <td className="py-2 px-4 border-b">2024-01-11</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">ORD00012</td>
                        <td className="py-2 px-4 border-b">8765</td>
                        <td className="py-2 px-4 border-b">电脑</td>
                        <td className="py-2 px-4 border-b">杭州</td>
                        <td className="py-2 px-4 border-b">6999</td>
                        <td className="py-2 px-4 border-b">2024-01-12</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">ORD00013</td>
                        <td className="py-2 px-4 border-b">4321</td>
                        <td className="py-2 px-4 border-b">平板</td>
                        <td className="py-2 px-4 border-b">深圳</td>
                        <td className="py-2 px-4 border-b">3199</td>
                        <td className="py-2 px-4 border-b">2024-01-13</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">ORD00014</td>
                        <td className="py-2 px-4 border-b">8765</td>
                        <td className="py-2 px-4 border-b">耳机</td>
                        <td className="py-2 px-4 border-b">杭州</td>
                        <td className="py-2 px-4 border-b">249</td>
                        <td className="py-2 px-4 border-b">2024-01-14</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">ORD00015</td>
                        <td className="py-2 px-4 border-b">4321</td>
                        <td className="py-2 px-4 border-b">充电器</td>
                        <td className="py-2 px-4 border-b">深圳</td>
                        <td className="py-2 px-4 border-b">89</td>
                        <td className="py-2 px-4 border-b">2024-01-15</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">ORD00016</td>
                        <td className="py-2 px-4 border-b">8765</td>
                        <td className="py-2 px-4 border-b">手机</td>
                        <td className="py-2 px-4 border-b">杭州</td>
                        <td className="py-2 px-4 border-b">2799</td>
                        <td className="py-2 px-4 border-b">2024-01-16</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">ORD00017</td>
                        <td className="py-2 px-4 border-b">1234</td>
                        <td className="py-2 px-4 border-b">电脑</td>
                        <td className="py-2 px-4 border-b">北京</td>
                        <td className="py-2 px-4 border-b">9999</td>
                        <td className="py-2 px-4 border-b">2024-01-17</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">ORD00018</td>
                        <td className="py-2 px-4 border-b">5678</td>
                        <td className="py-2 px-4 border-b">平板</td>
                        <td className="py-2 px-4 border-b">上海</td>
                        <td className="py-2 px-4 border-b">3299</td>
                        <td className="py-2 px-4 border-b">2024-01-18</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">ORD00019</td>
                        <td className="py-2 px-4 border-b">9012</td>
                        <td className="py-2 px-4 border-b">耳机</td>
                        <td className="py-2 px-4 border-b">广州</td>
                        <td className="py-2 px-4 border-b">349</td>
                        <td className="py-2 px-4 border-b">2024-01-19</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">ORD00020</td>
                        <td className="py-2 px-4 border-b">4321</td>
                        <td className="py-2 px-4 border-b">充电器</td>
                        <td className="py-2 px-4 border-b">深圳</td>
                        <td className="py-2 px-4 border-b">119</td>
                        <td className="py-2 px-4 border-b">2024-01-20</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-gray-500 mt-2">共20条数据</p>
              </div>
            )}

            {chapterId === 'ch-1-2' && (
              <div className="mt-6 mb-6">
                <h3 className="text-lg font-semibold mb-3">数据预览（user_orders.csv - 含缺失值）</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">order_id</th>
                        <th className="py-2 px-4 border-b">amount</th>
                        <th className="py-2 px-4 border-b">region</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-4 border-b">ORD00001</td>
                        <td className="py-2 px-4 border-b">2500</td>
                        <td className="py-2 px-4 border-b">北京</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">ORD00002</td>
                        <td className="py-2 px-4 border-b text-gray-400">NaN</td>
                        <td className="py-2 px-4 border-b">上海</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">ORD00003</td>
                        <td className="py-2 px-4 border-b">299</td>
                        <td className="py-2 px-4 border-b text-gray-400">NaN</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">ORD00004</td>
                        <td className="py-2 px-4 border-b">3499</td>
                        <td className="py-2 px-4 border-b">广州</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">ORD00005</td>
                        <td className="py-2 px-4 border-b">129</td>
                        <td className="py-2 px-4 border-b">上海</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">ORD00006</td>
                        <td className="py-2 px-4 border-b text-gray-400">NaN</td>
                        <td className="py-2 px-4 border-b">北京</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">ORD00007</td>
                        <td className="py-2 px-4 border-b">3299</td>
                        <td className="py-2 px-4 border-b">广州</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">ORD00008</td>
                        <td className="py-2 px-4 border-b">2999</td>
                        <td className="py-2 px-4 border-b text-gray-400">NaN</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">ORD00009</td>
                        <td className="py-2 px-4 border-b">399</td>
                        <td className="py-2 px-4 border-b">北京</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">ORD00010</td>
                        <td className="py-2 px-4 border-b text-gray-400">NaN</td>
                        <td className="py-2 px-4 border-b">深圳</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">ORD00011</td>
                        <td className="py-2 px-4 border-b">2999</td>
                        <td className="py-2 px-4 border-b">深圳</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">ORD00012</td>
                        <td className="py-2 px-4 border-b">6999</td>
                        <td className="py-2 px-4 border-b">杭州</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-gray-500 mt-2">共12条数据（部分包含缺失值）</p>
              </div>
            )}

            {chapterId === 'ch-2-1' && (
              <div className="mt-6 mb-6">
                <h3 className="text-lg font-semibold mb-3">数据预览（ecommerce_sales.csv）</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">order_date</th>
                        <th className="py-2 px-4 border-b">user_id</th>
                        <th className="py-2 px-4 border-b">category</th>
                        <th className="py-2 px-4 border-b">quantity</th>
                        <th className="py-2 px-4 border-b">sales</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-01</td>
                        <td className="py-2 px-4 border-b">10001</td>
                        <td className="py-2 px-4 border-b">电子产品</td>
                        <td className="py-2 px-4 border-b">2</td>
                        <td className="py-2 px-4 border-b">3980</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-02</td>
                        <td className="py-2 px-4 border-b">10002</td>
                        <td className="py-2 px-4 border-b">服装</td>
                        <td className="py-2 px-4 border-b">3</td>
                        <td className="py-2 px-4 border-b">890</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-03</td>
                        <td className="py-2 px-4 border-b">10003</td>
                        <td className="py-2 px-4 border-b">食品</td>
                        <td className="py-2 px-4 border-b">1</td>
                        <td className="py-2 px-4 border-b">98</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-04</td>
                        <td className="py-2 px-4 border-b">10004</td>
                        <td className="py-2 px-4 border-b">家居</td>
                        <td className="py-2 px-4 border-b">2</td>
                        <td className="py-2 px-4 border-b">998</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-05</td>
                        <td className="py-2 px-4 border-b">10005</td>
                        <td className="py-2 px-4 border-b">美妆</td>
                        <td className="py-2 px-4 border-b">4</td>
                        <td className="py-2 px-4 border-b">798</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-06</td>
                        <td className="py-2 px-4 border-b">10001</td>
                        <td className="py-2 px-4 border-b">电子产品</td>
                        <td className="py-2 px-4 border-b">1</td>
                        <td className="py-2 px-4 border-b">1999</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-07</td>
                        <td className="py-2 px-4 border-b">10002</td>
                        <td className="py-2 px-4 border-b">食品</td>
                        <td className="py-2 px-4 border-b">5</td>
                        <td className="py-2 px-4 border-b">245</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-08</td>
                        <td className="py-2 px-4 border-b">10003</td>
                        <td className="py-2 px-4 border-b">家居</td>
                        <td className="py-2 px-4 border-b">3</td>
                        <td className="py-2 px-4 border-b">1497</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-09</td>
                        <td className="py-2 px-4 border-b">10004</td>
                        <td className="py-2 px-4 border-b">服装</td>
                        <td className="py-2 px-4 border-b">2</td>
                        <td className="py-2 px-4 border-b">598</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-10</td>
                        <td className="py-2 px-4 border-b">10005</td>
                        <td className="py-2 px-4 border-b">美妆</td>
                        <td className="py-2 px-4 border-b">3</td>
                        <td className="py-2 px-4 border-b">599</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-11</td>
                        <td className="py-2 px-4 border-b">10001</td>
                        <td className="py-2 px-4 border-b">食品</td>
                        <td className="py-2 px-4 border-b">2</td>
                        <td className="py-2 px-4 border-b">198</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-12</td>
                        <td className="py-2 px-4 border-b">10002</td>
                        <td className="py-2 px-4 border-b">电子产品</td>
                        <td className="py-2 px-4 border-b">4</td>
                        <td className="py-2 px-4 border-b">7996</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-13</td>
                        <td className="py-2 px-4 border-b">10003</td>
                        <td className="py-2 px-4 border-b">美妆</td>
                        <td className="py-2 px-4 border-b">1</td>
                        <td className="py-2 px-4 border-b">199</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-14</td>
                        <td className="py-2 px-4 border-b">10004</td>
                        <td className="py-2 px-4 border-b">家居</td>
                        <td className="py-2 px-4 border-b">1</td>
                        <td className="py-2 px-4 border-b">499</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-15</td>
                        <td className="py-2 px-4 border-b">10005</td>
                        <td className="py-2 px-4 border-b">服装</td>
                        <td className="py-2 px-4 border-b">4</td>
                        <td className="py-2 px-4 border-b">1196</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-gray-500 mt-2">共15条数据</p>
              </div>
            )}

            {chapterId === 'ch-2-2' && (
              <div className="mt-6 mb-6">
                <h3 className="text-lg font-semibold mb-3">数据预览（ecommerce_sales.csv）</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">order_date</th>
                        <th className="py-2 px-4 border-b">category</th>
                        <th className="py-2 px-4 border-b">quantity</th>
                        <th className="py-2 px-4 border-b">sales</th>
                        <th className="py-2 px-4 border-b">month</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-01</td>
                        <td className="py-2 px-4 border-b">电子产品</td>
                        <td className="py-2 px-4 border-b">2</td>
                        <td className="py-2 px-4 border-b">3980</td>
                        <td className="py-2 px-4 border-b">2024-01</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-02</td>
                        <td className="py-2 px-4 border-b">服装</td>
                        <td className="py-2 px-4 border-b">3</td>
                        <td className="py-2 px-4 border-b">890</td>
                        <td className="py-2 px-4 border-b">2024-01</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-03</td>
                        <td className="py-2 px-4 border-b">食品</td>
                        <td className="py-2 px-4 border-b">1</td>
                        <td className="py-2 px-4 border-b">98</td>
                        <td className="py-2 px-4 border-b">2024-01</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-04</td>
                        <td className="py-2 px-4 border-b">家居</td>
                        <td className="py-2 px-4 border-b">2</td>
                        <td className="py-2 px-4 border-b">998</td>
                        <td className="py-2 px-4 border-b">2024-01</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-05</td>
                        <td className="py-2 px-4 border-b">美妆</td>
                        <td className="py-2 px-4 border-b">4</td>
                        <td className="py-2 px-4 border-b">798</td>
                        <td className="py-2 px-4 border-b">2024-01</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-02-01</td>
                        <td className="py-2 px-4 border-b">电子产品</td>
                        <td className="py-2 px-4 border-b">1</td>
                        <td className="py-2 px-4 border-b">1999</td>
                        <td className="py-2 px-4 border-b">2024-02</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-02-02</td>
                        <td className="py-2 px-4 border-b">服装</td>
                        <td className="py-2 px-4 border-b">2</td>
                        <td className="py-2 px-4 border-b">598</td>
                        <td className="py-2 px-4 border-b">2024-02</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-02-03</td>
                        <td className="py-2 px-4 border-b">食品</td>
                        <td className="py-2 px-4 border-b">3</td>
                        <td className="py-2 px-4 border-b">147</td>
                        <td className="py-2 px-4 border-b">2024-02</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-02-04</td>
                        <td className="py-2 px-4 border-b">家居</td>
                        <td className="py-2 px-4 border-b">3</td>
                        <td className="py-2 px-4 border-b">1497</td>
                        <td className="py-2 px-4 border-b">2024-02</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-02-05</td>
                        <td className="py-2 px-4 border-b">美妆</td>
                        <td className="py-2 px-4 border-b">2</td>
                        <td className="py-2 px-4 border-b">398</td>
                        <td className="py-2 px-4 border-b">2024-02</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-03-01</td>
                        <td className="py-2 px-4 border-b">电子产品</td>
                        <td className="py-2 px-4 border-b">4</td>
                        <td className="py-2 px-4 border-b">7996</td>
                        <td className="py-2 px-4 border-b">2024-03</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-03-02</td>
                        <td className="py-2 px-4 border-b">服装</td>
                        <td className="py-2 px-4 border-b">1</td>
                        <td className="py-2 px-4 border-b">299</td>
                        <td className="py-2 px-4 border-b">2024-03</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-03-03</td>
                        <td className="py-2 px-4 border-b">食品</td>
                        <td className="py-2 px-4 border-b">5</td>
                        <td className="py-2 px-4 border-b">245</td>
                        <td className="py-2 px-4 border-b">2024-03</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-03-04</td>
                        <td className="py-2 px-4 border-b">家居</td>
                        <td className="py-2 px-4 border-b">1</td>
                        <td className="py-2 px-4 border-b">499</td>
                        <td className="py-2 px-4 border-b">2024-03</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-03-05</td>
                        <td className="py-2 px-4 border-b">美妆</td>
                        <td className="py-2 px-4 border-b">3</td>
                        <td className="py-2 px-4 border-b">599</td>
                        <td className="py-2 px-4 border-b">2024-03</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-gray-500 mt-2">共15条数据（按月份分组）</p>
              </div>
            )}

            {chapterId === 'ch-3-1' && (
              <div className="mt-6 mb-6">
                <h3 className="text-lg font-semibold mb-3">数据预览（customers.csv 和 orders.csv）</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium mb-2 text-gray-700">customers.csv（用户信息）</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200 text-sm">
                        <thead>
                          <tr>
                            <th className="py-1 px-2 border-b">user_id</th>
                            <th className="py-1 px-2 border-b">name</th>
                            <th className="py-1 px-2 border-b">region</th>
                            <th className="py-1 px-2 border-b">level</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="py-1 px-2 border-b">10001</td>
                            <td className="py-1 px-2 border-b">用户1</td>
                            <td className="py-1 px-2 border-b">北京</td>
                            <td className="py-1 px-2 border-b">黄金</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-2 border-b">10002</td>
                            <td className="py-1 px-2 border-b">用户2</td>
                            <td className="py-1 px-2 border-b">上海</td>
                            <td className="py-1 px-2 border-b">普通</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-2 border-b">10003</td>
                            <td className="py-1 px-2 border-b">用户3</td>
                            <td className="py-1 px-2 border-b">广州</td>
                            <td className="py-1 px-2 border-b">白金</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-2 border-b">10004</td>
                            <td className="py-1 px-2 border-b">用户4</td>
                            <td className="py-1 px-2 border-b">深圳</td>
                            <td className="py-1 px-2 border-b">普通</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-2 border-b">10005</td>
                            <td className="py-1 px-2 border-b">用户5</td>
                            <td className="py-1 px-2 border-b">杭州</td>
                            <td className="py-1 px-2 border-b">钻石</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">共5条数据</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-gray-700">orders.csv（订单信息）</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200 text-sm">
                        <thead>
                          <tr>
                            <th className="py-1 px-2 border-b">order_id</th>
                            <th className="py-1 px-2 border-b">user_id</th>
                            <th className="py-1 px-2 border-b">amount</th>
                            <th className="py-1 px-2 border-b">order_date</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="py-1 px-2 border-b">ORD00001</td>
                            <td className="py-1 px-2 border-b">10001</td>
                            <td className="py-1 px-2 border-b">2500</td>
                            <td className="py-1 px-2 border-b">2024-01-01</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-2 border-b">ORD00002</td>
                            <td className="py-1 px-2 border-b">10002</td>
                            <td className="py-1 px-2 border-b">899</td>
                            <td className="py-1 px-2 border-b">2024-01-02</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-2 border-b">ORD00003</td>
                            <td className="py-1 px-2 border-b">10001</td>
                            <td className="py-1 px-2 border-b">299</td>
                            <td className="py-1 px-2 border-b">2024-01-03</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-2 border-b">ORD00004</td>
                            <td className="py-1 px-2 border-b">10003</td>
                            <td className="py-1 px-2 border-b">3499</td>
                            <td className="py-1 px-2 border-b">2024-01-04</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-2 border-b">ORD00005</td>
                            <td className="py-1 px-2 border-b">10004</td>
                            <td className="py-1 px-2 border-b">129</td>
                            <td className="py-1 px-2 border-b">2024-01-05</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-2 border-b">ORD00006</td>
                            <td className="py-1 px-2 border-b">10005</td>
                            <td className="py-1 px-2 border-b">7999</td>
                            <td className="py-1 px-2 border-b">2024-01-06</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-2 border-b">ORD00007</td>
                            <td className="py-1 px-2 border-b">10002</td>
                            <td className="py-1 px-2 border-b">3299</td>
                            <td className="py-1 px-2 border-b">2024-01-07</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-2 border-b">ORD00008</td>
                            <td className="py-1 px-2 border-b">10003</td>
                            <td className="py-1 px-2 border-b">2999</td>
                            <td className="py-1 px-2 border-b">2024-01-08</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">共8条数据</p>
                  </div>
                </div>
              </div>
            )}

            {chapterId === 'ch-4-1' && (
              <div className="mt-6 mb-6">
                <h3 className="text-lg font-semibold mb-3">数据预览（attendance.csv）</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">name</th>
                        <th className="py-2 px-4 border-b">date</th>
                        <th className="py-2 px-4 border-b">check_in</th>
                        <th className="py-2 px-4 border-b">check_out</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-4 border-b">员工1</td>
                        <td className="py-2 px-4 border-b">2024-03-01</td>
                        <td className="py-2 px-4 border-b">08:25</td>
                        <td className="py-2 px-4 border-b">18:30</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">员工2</td>
                        <td className="py-2 px-4 border-b">2024-03-01</td>
                        <td className="py-2 px-4 border-b">09:45</td>
                        <td className="py-2 px-4 border-b">19:15</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">员工3</td>
                        <td className="py-2 px-4 border-b">2024-03-02</td>
                        <td className="py-2 px-4 border-b">22:30</td>
                        <td className="py-2 px-4 border-b">02:15</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">员工1</td>
                        <td className="py-2 px-4 border-b">2024-03-02</td>
                        <td className="py-2 px-4 border-b">08:15</td>
                        <td className="py-2 px-4 border-b">18:45</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">员工4</td>
                        <td className="py-2 px-4 border-b">2024-03-03</td>
                        <td className="py-2 px-4 border-b">08:50</td>
                        <td className="py-2 px-4 border-b">18:00</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">员工2</td>
                        <td className="py-2 px-4 border-b">2024-03-03</td>
                        <td className="py-2 px-4 border-b">09:00</td>
                        <td className="py-2 px-4 border-b">17:30</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">员工3</td>
                        <td className="py-2 px-4 border-b">2024-03-04</td>
                        <td className="py-2 px-4 border-b">23:00</td>
                        <td className="py-2 px-4 border-b">03:30</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">员工1</td>
                        <td className="py-2 px-4 border-b">2024-03-04</td>
                        <td className="py-2 px-4 border-b">08:30</td>
                        <td className="py-2 px-4 border-b">18:15</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">员工4</td>
                        <td className="py-2 px-4 border-b">2024-03-05</td>
                        <td className="py-2 px-4 border-b">08:45</td>
                        <td className="py-2 px-4 border-b">19:00</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">员工2</td>
                        <td className="py-2 px-4 border-b">2024-03-05</td>
                        <td className="py-2 px-4 border-b">09:15</td>
                        <td className="py-2 px-4 border-b">18:45</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-gray-500 mt-2">共10条数据（包含跨天加班的情况）</p>
              </div>
            )}

            {chapterId === 'ch-5-1' && (
              <div className="mt-6 mb-6">
                <h3 className="text-lg font-semibold mb-3">数据预览（weather_data.csv）</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">date</th>
                        <th className="py-2 px-4 border-b">temp_high</th>
                        <th className="py-2 px-4 border-b">temp_low</th>
                        <th className="py-2 px-4 border-b">rainfall</th>
                        <th className="py-2 px-4 border-b">wind_speed</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-01</td>
                        <td className="py-2 px-4 border-b">12.5</td>
                        <td className="py-2 px-4 border-b">3.2</td>
                        <td className="py-2 px-4 border-b">0.0</td>
                        <td className="py-2 px-4 border-b">5.2</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-02</td>
                        <td className="py-2 px-4 border-b">14.1</td>
                        <td className="py-2 px-4 border-b">5.8</td>
                        <td className="py-2 px-4 border-b">8.5</td>
                        <td className="py-2 px-4 border-b">7.8</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-03</td>
                        <td className="py-2 px-4 border-b">11.8</td>
                        <td className="py-2 px-4 border-b">2.1</td>
                        <td className="py-2 px-4 border-b">0.0</td>
                        <td className="py-2 px-4 border-b">3.5</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-04</td>
                        <td className="py-2 px-4 border-b">13.6</td>
                        <td className="py-2 px-4 border-b">6.4</td>
                        <td className="py-2 px-4 border-b">15.2</td>
                        <td className="py-2 px-4 border-b">9.2</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-05</td>
                        <td className="py-2 px-4 border-b">15.3</td>
                        <td className="py-2 px-4 border-b">7.8</td>
                        <td className="py-2 px-4 border-b">0.0</td>
                        <td className="py-2 px-4 border-b">4.8</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-06</td>
                        <td className="py-2 px-4 border-b">16.2</td>
                        <td className="py-2 px-4 border-b">8.3</td>
                        <td className="py-2 px-4 border-b">2.3</td>
                        <td className="py-2 px-4 border-b">6.1</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-07</td>
                        <td className="py-2 px-4 border-b">14.8</td>
                        <td className="py-2 px-4 border-b">6.9</td>
                        <td className="py-2 px-4 border-b">12.8</td>
                        <td className="py-2 px-4 border-b">8.5</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-08</td>
                        <td className="py-2 px-4 border-b">13.2</td>
                        <td className="py-2 px-4 border-b">5.5</td>
                        <td className="py-2 px-4 border-b">0.0</td>
                        <td className="py-2 px-4 border-b">4.2</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-09</td>
                        <td className="py-2 px-4 border-b">15.6</td>
                        <td className="py-2 px-4 border-b">7.2</td>
                        <td className="py-2 px-4 border-b">5.6</td>
                        <td className="py-2 px-4 border-b">5.9</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-10</td>
                        <td className="py-2 px-4 border-b">17.1</td>
                        <td className="py-2 px-4 border-b">8.8</td>
                        <td className="py-2 px-4 border-b">0.0</td>
                        <td className="py-2 px-4 border-b">3.8</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-gray-500 mt-2">共10条数据</p>
              </div>
            )}

            {chapterId === 'ch-6-1' && (
              <div className="mt-6 mb-6">
                <h3 className="text-lg font-semibold mb-3">数据预览（stock_data.csv）</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">date</th>
                        <th className="py-2 px-4 border-b">open</th>
                        <th className="py-2 px-4 border-b">high</th>
                        <th className="py-2 px-4 border-b">low</th>
                        <th className="py-2 px-4 border-b">close</th>
                        <th className="py-2 px-4 border-b">volume</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-01</td>
                        <td className="py-2 px-4 border-b">100.50</td>
                        <td className="py-2 px-4 border-b">102.30</td>
                        <td className="py-2 px-4 border-b">98.70</td>
                        <td className="py-2 px-4 border-b">101.20</td>
                        <td className="py-2 px-4 border-b">523400</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-02</td>
                        <td className="py-2 px-4 border-b">101.50</td>
                        <td className="py-2 px-4 border-b">103.80</td>
                        <td className="py-2 px-4 border-b">100.20</td>
                        <td className="py-2 px-4 border-b">102.90</td>
                        <td className="py-2 px-4 border-b">487200</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-03</td>
                        <td className="py-2 px-4 border-b">103.00</td>
                        <td className="py-2 px-4 border-b">104.50</td>
                        <td className="py-2 px-4 border-b">101.80</td>
                        <td className="py-2 px-4 border-b">103.50</td>
                        <td className="py-2 px-4 border-b">612500</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-04</td>
                        <td className="py-2 px-4 border-b">103.20</td>
                        <td className="py-2 px-4 border-b">105.10</td>
                        <td className="py-2 px-4 border-b">102.50</td>
                        <td className="py-2 px-4 border-b">104.80</td>
                        <td className="py-2 px-4 border-b">558700</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-05</td>
                        <td className="py-2 px-4 border-b">104.50</td>
                        <td className="py-2 px-4 border-b">106.20</td>
                        <td className="py-2 px-4 border-b">103.80</td>
                        <td className="py-2 px-4 border-b">105.90</td>
                        <td className="py-2 px-4 border-b">492100</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-08</td>
                        <td className="py-2 px-4 border-b">106.00</td>
                        <td className="py-2 px-4 border-b">107.50</td>
                        <td className="py-2 px-4 border-b">104.90</td>
                        <td className="py-2 px-4 border-b">107.20</td>
                        <td className="py-2 px-4 border-b">587600</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-09</td>
                        <td className="py-2 px-4 border-b">107.50</td>
                        <td className="py-2 px-4 border-b">108.80</td>
                        <td className="py-2 px-4 border-b">106.20</td>
                        <td className="py-2 px-4 border-b">108.50</td>
                        <td className="py-2 px-4 border-b">634200</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-10</td>
                        <td className="py-2 px-4 border-b">108.80</td>
                        <td className="py-2 px-4 border-b">109.50</td>
                        <td className="py-2 px-4 border-b">107.30</td>
                        <td className="py-2 px-4 border-b">108.00</td>
                        <td className="py-2 px-4 border-b">456800</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-11</td>
                        <td className="py-2 px-4 border-b">107.80</td>
                        <td className="py-2 px-4 border-b">108.50</td>
                        <td className="py-2 px-4 border-b">106.80</td>
                        <td className="py-2 px-4 border-b">107.50</td>
                        <td className="py-2 px-4 border-b">512300</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">2024-01-12</td>
                        <td className="py-2 px-4 border-b">107.20</td>
                        <td className="py-2 px-4 border-b">109.00</td>
                        <td className="py-2 px-4 border-b">106.50</td>
                        <td className="py-2 px-4 border-b">108.80</td>
                        <td className="py-2 px-4 border-b">598700</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-gray-500 mt-2">共10条数据（股票OHLC数据）</p>
              </div>
            )}

            {chapterId === 'ch-7-1' && (
              <div className="mt-6 mb-6">
                <h3 className="text-lg font-semibold mb-3">数据预览（user_reviews.csv）</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">review_id</th>
                        <th className="py-2 px-4 border-b">user_id</th>
                        <th className="py-2 px-4 border-b">nickname</th>
                        <th className="py-2 px-4 border-b">review_text</th>
                        <th className="py-2 px-4 border-b">rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-4 border-b">REV00001</td>
                        <td className="py-2 px-4 border-b">1234</td>
                        <td className="py-2 px-4 border-b">开心123</td>
                        <td className="py-2 px-4 border-b">商品质量很好，非常满意！</td>
                        <td className="py-2 px-4 border-b">5</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">REV00002</td>
                        <td className="py-2 px-4 border-b">5678</td>
                        <td className="py-2 px-4 border-b">user_abc</td>
                        <td className="py-2 px-4 border-b">物流速度快，包装完好。</td>
                        <td className="py-2 px-4 border-b">4</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">REV00003</td>
                        <td className="py-2 px-4 border-b">9012</td>
                        <td className="py-2 px-4 border-b">购物达人888</td>
                        <td className="py-2 px-4 border-b">差强人意，有些小问题。</td>
                        <td className="py-2 px-4 border-b">3</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">REV00004</td>
                        <td className="py-2 px-4 border-b">3456</td>
                        <td className="py-2 px-4 border-b">vip张</td>
                        <td className="py-2 px-4 border-b">退货很方便，客服态度好。</td>
                        <td className="py-2 px-4 border-b">4</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">REV00005</td>
                        <td className="py-2 px-4 border-b">7890</td>
                        <td className="py-2 px-4 border-b">超级买家666</td>
                        <td className="py-2 px-4 border-b">价格实惠，值得购买。</td>
                        <td className="py-2 px-4 border-b">5</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">REV00006</td>
                        <td className="py-2 px-4 border-b">1111</td>
                        <td className="py-2 px-4 border-b">小明同学</td>
                        <td className="py-2 px-4 border-b">产品不错，物流慢了点。</td>
                        <td className="py-2 px-4 border-b">4</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">REV00007</td>
                        <td className="py-2 px-4 border-b">2222</td>
                        <td className="py-2 px-4 border-b">爱购物的猫</td>
                        <td className="py-2 px-4 border-b">非常满意，下次还来！</td>
                        <td className="py-2 px-4 border-b">5</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">REV00008</td>
                        <td className="py-2 px-4 border-b">3333</td>
                        <td className="py-2 px-4 border-b">TechGeek</td>
                        <td className="py-2 px-4 border-b">质量一般，价格偏高。</td>
                        <td className="py-2 px-4 border-b">2</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">REV00009</td>
                        <td className="py-2 px-4 border-b">4444</td>
                        <td className="py-2 px-4 border-b">快乐购物</td>
                        <td className="py-2 px-4 border-b">客服很耐心，问题解决了。</td>
                        <td className="py-2 px-4 border-b">4</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">REV00010</td>
                        <td className="py-2 px-4 border-b">5555</td>
                        <td className="py-2 px-4 border-b">Shopaholic</td>
                        <td className="py-2 px-4 border-b">总体满意，推荐购买。</td>
                        <td className="py-2 px-4 border-b">5</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-gray-500 mt-2">共10条数据（昵称包含中英文混合）</p>
              </div>
            )}

            {chapterId === 'ch-8-1' && (
              <div className="mt-6 mb-6">
                <h3 className="text-lg font-semibold mb-3">数据预览（numpy_data_normal.csv 和 numpy_data_uniform.csv）</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium mb-2 text-gray-700">numpy_data_normal.csv（正态分布）</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200 text-sm">
                        <thead>
                          <tr>
                            <th className="py-1 px-2 border-b">f1</th>
                            <th className="py-1 px-2 border-b">f2</th>
                            <th className="py-1 px-2 border-b">f3</th>
                            <th className="py-1 px-2 border-b">f4</th>
                            <th className="py-1 px-2 border-b">f5</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="py-1 px-2 border-b">0.4967</td>
                            <td className="py-1 px-2 border-b">-0.1383</td>
                            <td className="py-1 px-2 border-b">0.6477</td>
                            <td className="py-1 px-2 border-b">1.5230</td>
                            <td className="py-1 px-2 border-b">-0.2342</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-2 border-b">-0.2341</td>
                            <td className="py-1 px-2 border-b">1.5792</td>
                            <td className="py-1 px-2 border-b">0.7674</td>
                            <td className="py-1 px-2 border-b">-0.4695</td>
                            <td className="py-1 px-2 border-b">0.5426</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-2 border-b">0.5425</td>
                            <td className="py-1 px-2 border-b">0.4565</td>
                            <td className="py-1 px-2 border-b">0.2341</td>
                            <td className="py-1 px-2 border-b">1.5328</td>
                            <td className="py-1 px-2 border-b">-0.4296</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-2 border-b">-0.6948</td>
                            <td className="py-1 px-2 border-b">0.5184</td>
                            <td className="py-1 px-2 border-b">-0.6017</td>
                            <td className="py-1 px-2 border-b">0.3310</td>
                            <td className="py-1 px-2 border-b">2.1214</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-2 border-b">1.3562</td>
                            <td className="py-1 px-2 border-b">-0.1454</td>
                            <td className="py-1 px-2 border-b">0.5828</td>
                            <td className="py-1 px-2 border-b">-0.8603</td>
                            <td className="py-1 px-2 border-b">0.3143</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-2 border-b">0.0505</td>
                            <td className="py-1 px-2 border-b">1.5338</td>
                            <td className="py-1 px-2 border-b">-0.3636</td>
                            <td className="py-1 px-2 border-b">0.1882</td>
                            <td className="py-1 px-2 border-b">1.3612</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">共6条数据（μ=0, σ=1）</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-gray-700">numpy_data_uniform.csv（均匀分布）</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200 text-sm">
                        <thead>
                          <tr>
                            <th className="py-1 px-2 border-b">a</th>
                            <th className="py-1 px-2 border-b">b</th>
                            <th className="py-1 px-2 border-b">c</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="py-1 px-2 border-b">37.454</td>
                            <td className="py-1 px-2 border-b">95.071</td>
                            <td className="py-1 px-2 border-b">73.199</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-2 border-b">59.865</td>
                            <td className="py-1 px-2 border-b">15.601</td>
                            <td className="py-1 px-2 border-b">15.599</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-2 border-b">53.425</td>
                            <td className="py-1 px-2 border-b">89.204</td>
                            <td className="py-1 px-2 border-b.">5.818</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-2 border-b">77.401</td>
                            <td className="py-1 px-2 border-b">92.688</td>
                            <td className="py-1 px-2 border-b">86.611</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-2 border-b">67.245</td>
                            <td className="py-1 px-2 border-b">78.648</td>
                            <td className="py-1 px-2 border-b">10.236</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-2 border-b">81.981</td>
                            <td className="py-1 px-2 border-b">7.586</td>
                            <td className="py-1 px-2 border-b">79.641</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">共6条数据（[0, 100]区间）</p>
                  </div>
                </div>
              </div>
            )}

            {chapterId === 'ch-9-1' && (
              <div className="mt-6 mb-6">
                <h3 className="text-lg font-semibold mb-3">数据预览（performance_data.csv）</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">price</th>
                        <th className="py-2 px-4 border-b">quantity</th>
                        <th className="py-2 px-4 border-b">discount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-4 border-b">234.56</td>
                        <td className="py-2 px-4 border-b">2</td>
                        <td className="py-2 px-4 border-b">0.15</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">567.89</td>
                        <td className="py-2 px-4 border-b">5</td>
                        <td className="py-2 px-4 border-b">0.08</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">123.45</td>
                        <td className="py-2 px-4 border-b">1</td>
                        <td className="py-2 px-4 border-b">0.20</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">890.12</td>
                        <td className="py-2 px-4 border-b">3</td>
                        <td className="py-2 px-4 border-b">0.10</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">456.78</td>
                        <td className="py-2 px-4 border-b">4</td>
                        <td className="py-2 px-4 border-b">0.25</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">789.01</td>
                        <td className="py-2 px-4 border-b">2</td>
                        <td className="py-2 px-4 border-b">0.12</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">321.45</td>
                        <td className="py-2 px-4 border-b">6</td>
                        <td className="py-2 px-4 border-b">0.18</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">654.32</td>
                        <td className="py-2 px-4 border-b">1</td>
                        <td className="py-2 px-4 border-b">0.05</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">987.65</td>
                        <td className="py-2 px-4 border-b">3</td>
                        <td className="py-2 px-4 border-b">0.22</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">111.11</td>
                        <td className="py-2 px-4 border-b">10</td>
                        <td className="py-2 px-4 border-b">0.30</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-gray-500 mt-2">共10条数据（用于性能测试的数据集）</p>
              </div>
            )}

            {chapterId === 'ch-10-1' && (
              <div className="mt-6 mb-6">
                <h3 className="text-lg font-semibold mb-3">数据预览（churn_data.csv）</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">customer_id</th>
                        <th className="py-2 px-4 border-b">age</th>
                        <th className="py-2 px-4 border-b">tenure</th>
                        <th className="py-2 px-4 border-b">income</th>
                        <th className="py-2 px-4 border-b">credit_score</th>
                        <th className="py-2 px-4 border-b">products_count</th>
                        <th className="py-2 px-4 border-b">is_active</th>
                        <th className="py-2 px-4 border-b">balance</th>
                        <th className="py-2 px-4 border-b">churn</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-4 border-b">CUST000001</td>
                        <td className="py-2 px-4 border-b">32</td>
                        <td className="py-2 px-4 border-b">24</td>
                        <td className="py-2 px-4 border-b">5234.56</td>
                        <td className="py-2 px-4 border-b">680</td>
                        <td className="py-2 px-4 border-b">2</td>
                        <td className="py-2 px-4 border-b">1</td>
                        <td className="py-2 px-4 border-b">8923.45</td>
                        <td className="py-2 px-4 border-b">0</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">CUST000002</td>
                        <td className="py-2 px-4 border-b">45</td>
                        <td className="py-2 px-4 border-b">3</td>
                        <td className="py-2 px-4 border-b">3456.78</td>
                        <td className="py-2 px-4 border-b">550</td>
                        <td className="py-2 px-4 border-b">1</td>
                        <td className="py-2 px-4 border-b">0</td>
                        <td className="py-2 px-4 border-b">2345.67</td>
                        <td className="py-2 px-4 border-b">1</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">CUST000003</td>
                        <td className="py-2 px-4 border-b">28</td>
                        <td className="py-2 px-4 border-b">48</td>
                        <td className="py-2 px-4 border-b">6789.01</td>
                        <td className="py-2 px-4 border-b">720</td>
                        <td className="py-2 px-4 border-b">3</td>
                        <td className="py-2 px-4 border-b">1</td>
                        <td className="py-2 px-4 border-b">12345.67</td>
                        <td className="py-2 px-4 border-b">0</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">CUST000004</td>
                        <td className="py-2 px-4 border-b">55</td>
                        <td className="py-2 px-4 border-b">12</td>
                        <td className="py-2 px-4 border-b">2890.12</td>
                        <td className="py-2 px-4 border-b">590</td>
                        <td className="py-2 px-4 border-b">1</td>
                        <td className="py-2 px-4 border-b">0</td>
                        <td className="py-2 px-4 border-b">4567.89</td>
                        <td className="py-2 px-4 border-b">1</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">CUST000005</td>
                        <td className="py-2 px-4 border-b">38</td>
                        <td className="py-2 px-4 border-b">36</td>
                        <td className="py-2 px-4 border-b">5678.90</td>
                        <td className="py-2 px-4 border-b">700</td>
                        <td className="py-2 px-4 border-b">2</td>
                        <td className="py-2 px-4 border-b">1</td>
                        <td className="py-2 px-4 border-b">9876.54</td>
                        <td className="py-2 px-4 border-b">0</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">CUST000006</td>
                        <td className="py-2 px-4 border-b">42</td>
                        <td className="py-2 px-4 border-b">6</td>
                        <td className="py-2 px-4 border-b">4123.45</td>
                        <td className="py-2 px-4 border-b">620</td>
                        <td className="py-2 px-4 border-b">1</td>
                        <td className="py-2 px-4 border-b">0</td>
                        <td className="py-2 px-4 border-b">1567.89</td>
                        <td className="py-2 px-4 border-b">1</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">CUST000007</td>
                        <td className="py-2 px-4 border-b">35</td>
                        <td className="py-2 px-4 border-b">42</td>
                        <td className="py-2 px-4 border-b">7890.12</td>
                        <td className="py-2 px-4 border-b">750</td>
                        <td className="py-2 px-4 border-b">3</td>
                        <td className="py-2 px-4 border-b">1</td>
                        <td className="py-2 px-4 border-b">15432.10</td>
                        <td className="py-2 px-4 border-b">0</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">CUST000008</td>
                        <td className="py-2 px-4 border-b">58</td>
                        <td className="py-2 px-4 border-b">9</td>
                        <td className="py-2 px-4 border-b">3987.65</td>
                        <td className="py-2 px-4 border-b">580</td>
                        <td className="py-2 px-4 border-b">1</td>
                        <td className="py-2 px-4 border-b">0</td>
                        <td className="py-2 px-4 border-b">3210.45</td>
                        <td className="py-2 px-4 border-b">1</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">CUST000009</td>
                        <td className="py-2 px-4 border-b">31</td>
                        <td className="py-2 px-4 border-b">30</td>
                        <td className="py-2 px-4 border-b">6234.56</td>
                        <td className="py-2 px-4 border-b">710</td>
                        <td className="py-2 px-4 border-b">2</td>
                        <td className="py-2 px-4 border-b">1</td>
                        <td className="py-2 px-4 border-b">8765.43</td>
                        <td className="py-2 px-4 border-b">0</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">CUST000010</td>
                        <td className="py-2 px-4 border-b">48</td>
                        <td className="py-2 px-4 border-b">15</td>
                        <td className="py-2 px-4 border-b">4567.89</td>
                        <td className="py-2 px-4 border-b">600</td>
                        <td className="py-2 px-4 border-b">1</td>
                        <td className="py-2 px-4 border-b">0</td>
                        <td className="py-2 px-4 border-b">5432.10</td>
                        <td className="py-2 px-4 border-b">1</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-gray-500 mt-2">共10条数据（银行客户流失预测数据）</p>
              </div>
            )}
            
            {/* 章节内容 */}
            <div className="prose max-w-none">
              {renderChapterContent(chapter.content)}
            </div>
            
            {/* 代码示例 */}
            {chapterCodeExamples[chapterId] && (
              <div className="mt-6 mb-6">
                <h3 className="text-lg font-semibold mb-3">代码示例</h3>
                <CodeEditor
                  starterCode={chapterCodeExamples[chapterId]}
                  title="代码示例"
                  height="400px"
                />
              </div>
            )}
            
          </div>
        </div>
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold mb-4">章节列表</h3>
            <div className="space-y-2">
              {course.chapters.map((ch, index) => (
                <button 
                  key={ch.id} 
                  onClick={() => handleChapterClick(ch.id)}
                  className={`block w-full p-2 rounded-md transition-colors text-left ${ch.id === chapterId ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                >
                  <p className="font-medium">第{index + 1}章：{ch.title}</p>
                  <div className="text-xs text-gray-500">
                    {ch.id === chapterId ? '正在学习' : '未学习'}
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-8">
              <h3 className="font-semibold mb-4">练习</h3>
              <div className="space-y-4">
                {chapter.exercises.map((exercise, index) => (
                  <div key={exercise.id} className="rounded-lg border border-gray-200 overflow-hidden">
                    <div className="p-3 bg-gray-50 border-b border-gray-200">
                      <h6 className="font-medium">{index + 1}. {exercise.title}</h6>
                      <p className="text-gray-600 text-xs mt-1">{exercise.description}</p>
                    </div>
                    <div className="p-3">
                      <CodeEditor
                        starterCode={exercise.starterCode}
                        datasetGeneratorCode={exercise.datasetGeneratorCode}
                        title={`练习 ${index + 1}`}
                        height="250px"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;