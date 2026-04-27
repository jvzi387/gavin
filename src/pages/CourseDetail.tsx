import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courses, getCourseById } from '../data/courses';
import CodeEditor from '../components/CodeEditor';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const course = getCourseById(id || '');
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});
  const [selectedExercise, setSelectedExercise] = useState<{ chapterId: string; exerciseId: string } | null>(null);

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">课程不存在</h1>
        <p className="text-gray-600">抱歉，您访问的课程不存在。</p>
        <button 
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          onClick={() => navigate('/courses')}
        >
          返回课程列表
        </button>
      </div>
    );
  }

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  const handleExerciseSelect = (chapterId: string, exerciseId: string) => {
    setSelectedExercise({ chapterId, exerciseId });
  };

  const renderChapterContent = (content: string, chapterId: string) => {
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

    // 根据章节ID添加相应的代码示例
    const chapterCodeExamples: Record<string, string> = {
      'ch-1-1': `import pandas as pd
import numpy as np

# 读取CSV文件
df = pd.read_csv('data.csv')

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

# 创建示例数据
df = pd.DataFrame({
    'category': ['A', 'B', 'A', 'B', 'A', 'B', 'A', 'A'],
    'sub_category': ['X', 'X', 'Y', 'Y', 'X', 'X', 'Y', 'Y'],
    'value1': [10, 20, 30, 40, 50, 60, 70, 80],
    'value2': [100, 200, 300, 400, 500, 600, 700, 800]
})

print("原始数据:")
print(df)

# 1. 基本分组聚合
print("\n1. 按类别分组，计算value1的总和:")
result1 = df.groupby('category')['value1'].sum()
print(result1)

# 2. 多列聚合
print("\n2. 按类别分组，计算value1和value2的均值:")
result2 = df.groupby('category').agg({'value1': 'mean', 'value2': 'mean'})
print(result2)

# 3. 多级分组
print("\n3. 按类别和子类别分组，计算value1的总和:")
result3 = df.groupby(['category', 'sub_category'])['value1'].sum()
print(result3)

# 4. 重置索引
print("\n4. 重置索引:")
result4 = result3.reset_index()
print(result4)

# 5. 多函数聚合
print("\n5. 按类别分组，计算value1的多个统计量:")
result5 = df.groupby('category')['value1'].agg(['sum', 'mean', 'max', 'min'])
print(result5)

# 6. 自定义聚合函数
print("\n6. 按类别分组，计算value1的范围:")
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

    // 如果当前章节有对应的代码示例，添加到内容末尾
    if (chapterCodeExamples[chapterId]) {
      elements.push(
        <div key={elements.length} className="mt-6 mb-6">
          <h3 className="text-lg font-semibold mb-3">代码示例</h3>
          <CodeEditor
            starterCode={chapterCodeExamples[chapterId]}
            title={`代码示例 ${elements.filter(el => el.type === CodeEditor).length + 1}`}
            height="400px"
          />
        </div>
      );
      
      // 添加练习用的代码框
      elements.push(
        <div key={elements.length} className="mt-8 mb-6">
          <h3 className="text-lg font-semibold mb-3">练习代码框</h3>
          <p className="text-gray-600 mb-3">请在此处编写代码进行练习：</p>
          <CodeEditor
            starterCode={`# 请在此处编写代码进行练习
# 例如：
# import pandas as pd
# import numpy as np

# 1. 创建一个示例数据框
# 2. 进行数据处理
# 3. 分析结果`}
            title="练习代码"
            height="300px"
          />
        </div>
      );
    }

    return elements;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">课程详情</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <div className={`h-64 ${course.coverColor} rounded-lg flex items-center justify-center mb-4`}>
              <span className="text-gray-600 font-medium">课程封面</span>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700">难度</h3>
                <p>{course.difficulty}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">分类</h3>
                <p>{course.category}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">章节数</h3>
                <p>{course.chapters.length}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">练习数</h3>
                <p>{course.chapters.reduce((total, chapter) => total + chapter.exercises.length, 0)}</p>
              </div>
              <div className="flex justify-center">
                <button 
                  className="w-3/4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    // 自动展开第一章
                    setExpandedChapters(prev => ({
                      ...prev,
                      [course.chapters[0].id]: true
                    }));
                    // 滚动到第一章
                    setTimeout(() => {
                      const chapterElement = document.getElementById(`chapter-${course.chapters[0].id}`);
                      if (chapterElement) {
                        chapterElement.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 100);
                  }}
                >
                  开始学习
                </button>
              </div>
            </div>
          </div>
          <div className="md:w-2/3">
            <h2 className="text-2xl font-bold mb-4">{course.title}</h2>
            <p className="text-gray-600 mb-6">
              {course.description}
            </p>
            <h3 className="text-xl font-semibold mb-4">课程章节</h3>
            <div className="space-y-6">
              {course.chapters.map((chapter, index) => (
                <div key={chapter.id} id={`chapter-${chapter.id}`} className="border-b pb-6">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleChapter(chapter.id)}
                  >
                    <h4 className="font-medium text-lg">第{index + 1}章：{chapter.title}</h4>
                    <span className="text-gray-400">
                      {expandedChapters[chapter.id] ? '▼' : '▶'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{chapter.description}</p>
                  <p className="text-gray-500 text-xs mt-1">包含 {chapter.exercises.length} 个练习</p>
                  
                  {expandedChapters[chapter.id] && (
                    <div className="mt-4 space-y-6 pl-4 border-l-2 border-gray-100">
                      <div className="prose max-w-none">
                        {renderChapterContent(chapter.content, chapter.id)}
                      </div>
                      
                      <div className="mt-6">
                        <h5 className="font-medium text-gray-700 mb-3">章节练习</h5>
                        <div className="space-y-3">
                          {chapter.exercises.map((exercise, exerciseIndex) => (
                            <div 
                              key={exercise.id} 
                              className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedExercise?.exerciseId === exercise.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}`}
                              onClick={() => handleExerciseSelect(chapter.id, exercise.id)}
                            >
                              <h6 className="font-medium">{exerciseIndex + 1}. {exercise.title}</h6>
                              <p className="text-gray-600 text-xs mt-1">{exercise.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedExercise && (
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">练习</h3>
            {course.chapters.map(chapter => {
              const exercise = chapter.exercises.find(ex => ex.id === selectedExercise.exerciseId);
              if (exercise) {
                return (
                  <div key={exercise.id}>
                    <h4 className="font-medium text-lg mb-2">{exercise.title}</h4>
                    <p className="text-gray-600 mb-4">{exercise.description}</p>
                    
                    {exercise.hints.length > 0 && (
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                        <h5 className="font-medium text-yellow-800 mb-2">提示</h5>
                        <ul className="list-disc list-inside text-yellow-700 text-sm space-y-1">
                          {exercise.hints.map((hint, index) => (
                            <li key={index}>{hint}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <CodeEditor
                      starterCode={exercise.starterCode}
                      datasetGeneratorCode={exercise.datasetGeneratorCode}
                      title={exercise.title}
                    />
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;