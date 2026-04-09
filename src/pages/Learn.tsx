import React from 'react';
import { useParams } from 'react-router-dom';

const Learn: React.FC = () => {
  const { courseId, chapterId } = useParams<{ courseId: string; chapterId: string }>();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">学习模块</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">章节标题</h2>
            <div className="mb-6">
              <h3 className="font-semibold mb-2">视频学习</h3>
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">视频播放器</span>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold mb-2">文档阅读</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  这里是文档内容，包含详细的学习资料和知识点讲解。
                </p>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold mb-2">代码练习</h3>
              <div className="bg-gray-900 text-white p-4 rounded-lg">
                <pre className="text-sm">
                  <code>
{`# 请在这里编写代码
import pandas as pd

# 创建一个简单的DataFrame
df = pd.DataFrame({
    'name': ['Alice', 'Bob', 'Charlie'],
    'age': [25, 30, 35],
    'city': ['New York', 'London', 'Paris']
})

# 打印DataFrame
print(df)`}
                  </code>
                </pre>
                <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors">
                  运行代码
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold mb-4">章节列表</h3>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((chapter) => (
                <div key={chapter} className={`p-2 rounded-md ${chapter === parseInt(chapterId || '1') ? 'bg-blue-100' : 'hover:bg-gray-100'}`}>
                  <p className="font-medium">第{chapter}章：章节标题</p>
                  <div className="text-xs text-gray-500">
                    {chapter === parseInt(chapterId || '1') ? '正在学习' : '未学习'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;