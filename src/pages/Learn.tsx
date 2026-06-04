import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCourseById, Course, Chapter } from '../data/courses';
import CodeEditor from '../components/CodeEditor';

const Learn: React.FC = () => {
  const { courseId, chapterId } = useParams<{ courseId: string; chapterId: string }>();
  const course = getCourseById(courseId || '');
  const chapter = course?.chapters.find(ch => ch.id === chapterId);
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);

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

  const renderMarkdownContent = (content: string) => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let currentHeading = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.startsWith('# ')) {
        elements.push(<h2 key={i} className="text-xl font-bold mt-6 mb-3 text-gray-800">{line.slice(2)}</h2>);
        currentHeading = line.slice(2);
      } else if (line.startsWith('## ')) {
        elements.push(<h3 key={i} className="text-lg font-semibold mt-4 mb-2 text-gray-700">{line.slice(3)}</h3>);
      } else if (line.startsWith('### ')) {
        elements.push(<h4 key={i} className="text-md font-medium mt-3 mb-2 text-gray-600">{line.slice(4)}</h4>);
      } else if (line.startsWith('- ')) {
        elements.push(<li key={i} className="ml-4 text-gray-600">{line.slice(2)}</li>);
      } else if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
        elements.push(<li key={i} className="ml-4 text-gray-600">{line}</li>);
      } else if (line.trim()) {
        elements.push(<p key={i} className="text-gray-600 mb-3 leading-relaxed">{line}</p>);
      }
    }

    return elements;
  };

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

df = pd.DataFrame({
    'category': ['A', 'B', 'A', 'B', 'A', 'B', 'A', 'A'],
    'sub_category': ['X', 'X', 'Y', 'Y', 'X', 'X', 'Y', 'Y'],
    'value1': [10, 20, 30, 40, 50, 60, 70, 80],
    'value2': [100, 200, 300, 400, 500, 600, 700, 800]
})

print("原始数据:")
print(df)

# 1. 基础分组聚合
print("\n1. 按category分组，计算value1的总和:")
result1 = df.groupby('category')['value1'].sum()
print(result1)

# 2. 多列聚合
print("\n2. 按category分组，计算value1和value2的均值:")
result2 = df.groupby('category').agg({'value1': 'mean', 'value2': 'mean'})
print(result2)

# 3. 多级分组
print("\n3. 按category和sub_category分组，计算value1的总和:")
result3 = df.groupby(['category', 'sub_category'])['value1'].sum()
print(result3)

# 4. 重置索引
print("\n4. 重置索引:")
result4 = result3.reset_index()
print(result4)

# 5. 多函数聚合
print("\n5. 按category分组，计算value1的多个统计量:")
result5 = df.groupby('category')['value1'].agg(['sum', 'mean', 'max', 'min'])
print(result5)

# 6. 自定义聚合函数
print("\n6. 按category分组，计算value1的范围:")
def range_func(x):
    return x.max() - x.min()
result6 = df.groupby('category')['value1'].agg(range_func)
print(result6)`,
    'ch-2-2': `import pandas as pd
import numpy as np

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
print("\n1. 按类别和地区汇总销售额:")
pivot1 = df.pivot_table(values='sales', index='category', columns='region', aggfunc='sum')
print(pivot1)

# 2. 多值透视表
print("\n2. 同时汇总销售额和利润:")
pivot2 = df.pivot_table(values=['sales', 'profit'], index='category', columns='region', aggfunc='sum')
print(pivot2)

# 3. 添加总计
print("\n3. 添加总计:")
pivot3 = df.pivot_table(values='sales', index='category', columns='region', aggfunc='sum', margins=True, margins_name='总计')
print(pivot3)`
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
        {/* 侧边栏 - 课程目录 */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
            <h3 className="font-semibold text-gray-800 mb-4">📚 课程目录</h3>
            <nav className="space-y-1">
              {course.chapters.map((ch: Chapter, index: number) => (
                <button
                  key={ch.id}
                  onClick={() => handleChapterClick(ch.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    ch.id === chapterId
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  第{index + 1}章：{ch.title}
                </button>
              ))}
            </nav>

            {/* 学习资源 */}
            {course.resources && course.resources.length > 0 && (
              <div className="mt-6 pt-4 border-t">
                <h3 className="font-semibold text-gray-800 mb-3">📖 学习资源</h3>
                <ul className="space-y-2">
                  {course.resources.map((resource) => (
                    <li key={resource.id}>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {resource.type === 'video' && '🎬 '}
                        {resource.type === 'document' && '📄 '}
                        {resource.type === 'notebook' && '📓 '}
                        {resource.type === 'dataset' && '📊 '}
                        {resource.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* 主内容区 */}
        <div className="lg:w-3/4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">
              第{course.chapters.findIndex(ch => ch.id === chapter.id) + 1}章：{chapter.title}
            </h2>
            <p className="text-gray-600 mb-6">{chapter.description}</p>

            {/* 视频学习 */}
            {chapter.videoUrl && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">🎬 视频教程</h3>
                  <button
                    onClick={() => setShowVideo(!showVideo)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {showVideo ? '隐藏视频' : '播放视频'}
                  </button>
                </div>
                {showVideo && (
                  <div className="bg-gray-900 rounded-lg p-8 flex items-center justify-center">
                    <a 
                      href={chapter.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center text-white"
                    >
                      <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-4 hover:bg-blue-500 transition-colors">
                        <span className="text-4xl">▶</span>
                      </div>
                      <p className="text-lg">点击观看视频教程</p>
                      <p className="text-sm text-gray-400">{chapter.videoUrl}</p>
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* 章节内容 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">📝 学习内容</h3>
              <div className="prose prose-gray max-w-none">
                {renderMarkdownContent(chapter.content)}
              </div>
            </div>

            {/* 数据预览表格 */}
            {(chapterId === 'ch-1-1' || chapterId === 'ch-1-2') && (
              <div className="mt-6 mb-6">
                <h3 className="text-lg font-semibold mb-3">
                  📊 数据预览（user_orders.csv）
                  {chapterId === 'ch-1-2' && ' - 含缺失值'}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b bg-gray-50">order_id</th>
                        <th className="py-2 px-4 border-b bg-gray-50">user_id</th>
                        <th className="py-2 px-4 border-b bg-gray-50">product</th>
                        <th className="py-2 px-4 border-b bg-gray-50">region</th>
                        <th className="py-2 px-4 border-b bg-gray-50">amount</th>
                        <th className="py-2 px-4 border-b bg-gray-50">order_date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { order_id: 'ORD00001', user_id: '1234', product: '手机', region: '北京', amount: '2500', date: '2024-01-01' },
                        { order_id: 'ORD00002', user_id: '5678', product: '电脑', region: '上海', amount: '8999', date: '2024-01-02' },
                        { order_id: 'ORD00003', user_id: '1234', product: '耳机', region: '北京', amount: chapterId === 'ch-1-2' ? 'NaN' : '299', date: '2024-01-03' },
                        { order_id: 'ORD00004', user_id: '9012', product: '平板', region: chapterId === 'ch-1-2' ? 'NaN' : '广州', amount: '3499', date: '2024-01-04' },
                        { order_id: 'ORD00005', user_id: '5678', product: '充电器', region: '上海', amount: '129', date: '2024-01-05' },
                      ].map(row => (
                        <tr key={row.order_id}>
                          <td className="py-2 px-4 border-b">{row.order_id}</td>
                          <td className="py-2 px-4 border-b">{row.user_id}</td>
                          <td className="py-2 px-4 border-b">{row.product}</td>
                          <td className={`py-2 px-4 border-b ${row.region === 'NaN' ? 'text-gray-400' : ''}`}>{row.region}</td>
                          <td className={`py-2 px-4 border-b ${row.amount === 'NaN' ? 'text-gray-400' : ''}`}>{row.amount}</td>
                          <td className="py-2 px-4 border-b">{row.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-gray-500 mt-2">显示前5条数据</p>
              </div>
            )}

            {/* 代码练习 */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">💻 代码练习</h3>
              {chapter.exercises.length > 0 ? (
                chapter.exercises.map((exercise) => (
                  <div key={exercise.id} className="mb-6">
                    <h4 className="font-medium text-gray-800 mb-2">{exercise.title}</h4>
                    <p className="text-gray-600 text-sm mb-3">{exercise.description}</p>
                    <CodeEditor
                      starterCode={exercise.starterCode}
                      datasetGeneratorCode={exercise.datasetGeneratorCode}
                      title={exercise.title}
                      height="300px"
                    />
                  </div>
                ))
              ) : chapterCodeExamples[chapterId || ''] ? (
                <CodeEditor
                  starterCode={chapterCodeExamples[chapterId || '']}
                  title="代码练习"
                  height="400px"
                />
              ) : (
                <p className="text-gray-500">本章暂无代码练习</p>
              )}
            </div>

            {/* 导航按钮 */}
            <div className="mt-8 flex justify-between">
              {course.chapters.findIndex(ch => ch.id === chapter.id) > 0 && (
                <Link
                  to={`/learn/${courseId}/${course.chapters[course.chapters.findIndex(ch => ch.id === chapter.id) - 1].id}`}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                >
                  ← 上一章
                </Link>
              )}
              {course.chapters.findIndex(ch => ch.id === chapter.id) < course.chapters.length - 1 && (
                <Link
                  to={`/learn/${courseId}/${course.chapters[course.chapters.findIndex(ch => ch.id === chapter.id) + 1].id}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  下一章 →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;