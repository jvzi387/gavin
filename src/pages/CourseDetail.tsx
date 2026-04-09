import React from 'react';
import { useParams } from 'react-router-dom';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">课程详情</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <div className="h-64 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-blue-500 font-medium">课程封面</span>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700">难度</h3>
                <p>初级</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">分类</h3>
                <p>基础技能</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">评分</h3>
                <p>4.8/5.0</p>
              </div>
              <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
                开始学习
              </button>
            </div>
          </div>
          <div className="md:w-2/3">
            <h2 className="text-2xl font-bold mb-4">Python基础与数据分析</h2>
            <p className="text-gray-600 mb-6">
              本课程介绍Python编程语言基础和数据分析入门知识，包括Python语法、数据结构、函数、文件操作以及使用Pandas进行数据分析的基本方法。
            </p>
            <h3 className="text-xl font-semibold mb-4">课程章节</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((chapter) => (
                <div key={chapter} className="border-b pb-4">
                  <h4 className="font-medium">第{chapter}章：章节标题</h4>
                  <p className="text-gray-600 text-sm">包含视频、文档和练习</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;