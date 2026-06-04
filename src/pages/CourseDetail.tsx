import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourseById } from '../data/courses';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const course = getCourseById(id || '');
  const [showVideo, setShowVideo] = useState(false);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/courses" className="text-blue-600 hover:underline mr-4">
          ← 返回课程列表
        </Link>
        <h1 className="text-3xl font-bold">课程详情</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* 课程封面和基本信息 */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
          <div className="flex flex-col md:flex-row gap-8">
            <div className={`w-full md:w-1/3 h-48 ${course.coverColor} rounded-lg flex items-center justify-center bg-white/20`}>
              <span className="text-4xl">📊</span>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">{course.title}</h2>
              <p className="text-blue-100 mb-4">{course.description}</p>
              <div className="flex flex-wrap gap-4">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  难度: {course.difficulty}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  分类: {course.category}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {course.chapters.length} 章节
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {course.chapters.reduce((total, chapter) => total + chapter.exercises.length, 0)} 练习
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 课程内容 */}
        <div className="p-8">
          {/* 视频学习 */}
          {course.videoUrl && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold">🎬 课程视频</h3>
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
                    href={course.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center text-white"
                  >
                    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-4 hover:bg-blue-500 transition-colors">
                      <span className="text-4xl">▶</span>
                    </div>
                    <p className="text-lg">点击观看课程视频</p>
                    <p className="text-sm text-gray-400">{course.videoUrl}</p>
                  </a>
                </div>
              )}
            </div>
          )}

          {/* 学习资源 */}
          {course.resources && course.resources.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">📖 学习资源</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {course.resources.map((resource) => (
                  <a
                    key={resource.id}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      resource.type === 'video' ? 'bg-red-100 text-red-600' :
                      resource.type === 'document' ? 'bg-blue-100 text-blue-600' :
                      resource.type === 'notebook' ? 'bg-green-100 text-green-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {resource.type === 'video' && '🎬'}
                      {resource.type === 'document' && '📄'}
                      {resource.type === 'notebook' && '📓'}
                      {resource.type === 'dataset' && '📊'}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{resource.title}</div>
                      <div className="text-sm text-gray-500">{resource.description}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* 课程章节 */}
          <div>
            <h3 className="text-xl font-semibold mb-4">📚 课程章节</h3>
            <div className="space-y-4">
              {course.chapters.map((chapter, index) => (
                <div 
                  key={chapter.id} 
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                >
                  <button
                    onClick={() => {
                      navigate(`/learn/${course.id}/${chapter.id}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <div>
                      <div className="font-medium text-lg">
                        第{index + 1}章：{chapter.title}
                      </div>
                      <div className="text-gray-600 text-sm mt-1">{chapter.description}</div>
                      <div className="text-gray-500 text-xs mt-1">
                        {chapter.exercises.length > 0 && `${chapter.exercises.length} 个练习`}
                        {chapter.videoUrl && ' · 🎬 有视频'}
                      </div>
                    </div>
                    <span className="text-blue-500">→</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 开始学习按钮 */}
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                navigate(`/learn/${course.id}/${course.chapters[0].id}`);
              }}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-lg"
            >
              🚀 开始学习
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;