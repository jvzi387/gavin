import React, { useState, useEffect } from 'react';
import { auth, achievements, User, AchievementKey } from '../data/users';
import { courses, Course } from '../data/courses';

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(auth.getCurrentUser());
  }, []);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">请先登录</p>
      </div>
    );
  }

  const getExpProgress = () => {
    const expNeeded = user.level * 1000;
    return (user.exp / expNeeded) * 100;
  };

  const getTotalPoints = () => {
    return user.achievements.reduce((total, id) => {
      const achievement = achievements[id as AchievementKey];
      return total + (achievement?.points || 0);
    }, 0);
  };

  const getCompletedCourseDetails = (): Course[] => {
    return user.completedCourses
      .map(id => courses.find(c => c.id === id))
      .filter((c): c is Course => c !== undefined);
  };

  const completedCourses = getCompletedCourseDetails();
  const progressPercent = (completedCourses.length / courses.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* 用户信息卡片 */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-5xl">
              {user.avatar}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{user.nickname}</h1>
              <p className="text-blue-100">@{user.username}</p>
              <p className="text-blue-100 mt-1">{user.email}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">Lv.{user.level}</div>
              <div className="text-blue-100">等级</div>
            </div>
          </div>

          {/* 经验值进度条 */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>经验值</span>
              <span>{user.exp} / {user.level * 1000}</span>
            </div>
            <div className="bg-white/20 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-white rounded-full h-full transition-all duration-500"
                style={{ width: `${getExpProgress()}%` }}
              />
            </div>
          </div>
        </div>

        {/* 统计数据 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="text-3xl font-bold text-blue-600">{completedCourses.length}</div>
            <div className="text-gray-500 text-sm">已完成课程</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="text-3xl font-bold text-green-600">{user.completedExercises.length}</div>
            <div className="text-gray-500 text-sm">已完成练习</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="text-3xl font-bold text-purple-600">{user.achievements.length}</div>
            <div className="text-gray-500 text-sm">获得成就</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="text-3xl font-bold text-orange-600">{getTotalPoints()}</div>
            <div className="text-gray-500 text-sm">成就点数</div>
          </div>
        </div>

        {/* 学习进度 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">📚 学习进度</h2>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>总体进度</span>
              <span>{completedCourses.length} / {courses.length} 门课程</span>
            </div>
            <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            {courses.map((course) => {
              const completed = user.completedCourses.includes(course.id);
              return (
                <div 
                  key={course.id}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                    completed ? 'bg-green-50' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      completed ? 'bg-green-100' : 'bg-gray-200'
                    }`}>
                      {completed ? '✓' : '📖'}
                    </div>
                    <div>
                      <div className={`font-medium ${completed ? 'text-green-800' : 'text-gray-700'}`}>
                        {course.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {course.chapters.length} 章 · {course.difficulty}
                      </div>
                    </div>
                  </div>
                  {completed && (
                    <span className="text-green-500 text-sm">已完成 ✓</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 获得的成就 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">🏆 我的成就</h2>
          
          {user.achievements.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {user.achievements.map((id) => {
                const achievement = achievements[id as AchievementKey];
                if (!achievement) return null;
                return (
                  <div
                    key={id}
                    className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg p-4 text-center"
                  >
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-2">
                      {achievement.icon}
                    </div>
                    <div className="font-medium text-gray-800">{achievement.name}</div>
                    <div className="text-xs text-gray-500">{achievement.description}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">还没有获得任何成就，开始学习吧！</p>
          )}
        </div>

        {/* 学习统计 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">📊 学习统计</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">课程分类完成情况</h3>
              <div className="space-y-2">
                {['初级', '中级', '高级'].map((level) => {
                  const levelCourses = courses.filter(c => c.difficulty === level);
                  const completedLevel = completedCourses.filter(c => c.difficulty === level).length;
                  const percent = (completedLevel / levelCourses.length) * 100;
                  return (
                    <div key={level}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{level}课程</span>
                        <span>{completedLevel} / {levelCourses.length}</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-full rounded-full ${
                            level === '初级' ? 'bg-green-500' :
                            level === '中级' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">学习时间线</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs flex-shrink-0">
                    🎯
                  </div>
                  <div>
                    <div className="font-medium">账号创建</div>
                    <div className="text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs flex-shrink-0">
                    📚
                  </div>
                  <div>
                    <div className="font-medium">首次课程完成</div>
                    <div className="text-sm text-gray-500">
                      {completedCourses.length > 0 
                        ? '已完成 ' + completedCourses[0].title
                        : '尚未完成任何课程'}
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs flex-shrink-0">
                    🏆
                  </div>
                  <div>
                    <div className="font-medium">首个成就</div>
                    <div className="text-sm text-gray-500">
                      {user.achievements.length > 0 
                        ? achievements[user.achievements[0] as AchievementKey]?.name || '未知成就'
                        : '尚未获得任何成就'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;