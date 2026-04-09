import React from 'react';

const Courses: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">课程中心</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4].map((course) => (
          <div key={course} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-blue-100 flex items-center justify-center">
              <span className="text-blue-500 font-medium">课程封面 {course}</span>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">课程标题 {course}</h2>
              <p className="text-gray-600 mb-4">课程描述，包含课程内容和学习目标</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">难度：初级</span>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                  查看详情
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;