import React from 'react';
import { useParams } from 'react-router-dom';

const Practice: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">练习测评</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">章节练习</h2>
        <div className="space-y-6">
          {[1, 2, 3].map((question) => (
            <div key={question} className="border-b pb-4">
              <h3 className="font-semibold mb-2">问题 {question}：这是一个测试问题</h3>
              <div className="space-y-2 mb-4">
                <div className="flex items-center">
                  <input type="radio" id={`q${question}-a`} name={`q${question}`} className="mr-2" />
                  <label htmlFor={`q${question}-a`}>选项 A</label>
                </div>
                <div className="flex items-center">
                  <input type="radio" id={`q${question}-b`} name={`q${question}`} className="mr-2" />
                  <label htmlFor={`q${question}-b`}>选项 B</label>
                </div>
                <div className="flex items-center">
                  <input type="radio" id={`q${question}-c`} name={`q${question}`} className="mr-2" />
                  <label htmlFor={`q${question}-c`}>选项 C</label>
                </div>
                <div className="flex items-center">
                  <input type="radio" id={`q${question}-d`} name={`q${question}`} className="mr-2" />
                  <label htmlFor={`q${question}-d`}>选项 D</label>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors">
            提交答案
          </button>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">成绩分析</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span>总分</span>
              <span>85/100</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>正确率</span>
              <span>85%</span>
            </div>
            <div className="flex justify-between">
              <span>薄弱环节</span>
              <span>数据可视化</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Practice;