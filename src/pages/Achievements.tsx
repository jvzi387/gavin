import React, { useState, useEffect } from 'react';
import { auth, achievements, User } from '../data/users';

const Achievements: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [leaderboard, setLeaderboard] = useState<User[]>([]);

  useEffect(() => {
    setUser(auth.getCurrentUser());
    setLeaderboard(auth.getLeaderboard());
  }, []);

  const allAchievements = Object.values(achievements);
  const userAchievements = user?.achievements || [];

  const getAchievementStatus = (achievementId: string) => {
    return userAchievements.includes(achievementId);
  };

  const getUserScore = (user: User) => {
    return user.level * 1000 + user.exp;
  };

  const getTotalPoints = () => {
    if (!user) return 0;
    return user.achievements.reduce((total, id) => {
      const achievement = achievements[id as keyof typeof achievements];
      return total + (achievement?.points || 0);
    }, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">🏆 成就系统</h1>
      
      {/* 用户成就统计 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">我的成就</h2>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{userAchievements.length}</p>
              <p className="text-sm text-gray-500">已解锁</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{getTotalPoints()}</p>
              <p className="text-sm text-gray-500">成就点数</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{allAchievements.length}</p>
              <p className="text-sm text-gray-500">总成就</p>
            </div>
          </div>
        </div>

        {/* 成就网格 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {allAchievements.map((achievement) => {
            const unlocked = getAchievementStatus(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`relative rounded-lg p-4 text-center transition-all duration-300 ${
                  unlocked
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 shadow-md hover:shadow-lg hover:-translate-y-1'
                    : 'bg-gray-100 border-2 border-gray-200 opacity-60'
                }`}
              >
                <div className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center text-3xl ${
                  unlocked ? 'bg-yellow-400' : 'bg-gray-300'
                }`}>
                  {unlocked ? achievement.icon : '🔒'}
                </div>
                <h3 className={`font-medium mb-1 ${
                  unlocked ? 'text-gray-800' : 'text-gray-400'
                }`}>
                  {achievement.name}
                </h3>
                <p className={`text-xs mb-2 ${
                  unlocked ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {unlocked ? achievement.description : '未解锁'}
                </p>
                <div className={`text-xs font-medium ${
                  unlocked ? 'text-yellow-600' : 'text-gray-400'
                }`}>
                  +{achievement.points} 点
                </div>
                
                {/* 解锁动画效果 */}
                {unlocked && (
                  <div className="absolute top-2 right-2">
                    <span className="text-yellow-500">✨</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 成就获取条件说明 */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-3">🎯 成就获取条件说明</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-700">
            <div className="flex items-center">
              <span className="mr-2">👋</span>
              <span><strong>初来乍到</strong>：完成首次登录</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">🎓</span>
              <span><strong>初学者</strong>：完成第一门课程</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">🔍</span>
              <span><strong>数据探索者</strong>：完成5个练习</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">💻</span>
              <span><strong>代码大师</strong>：完成10个练习</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">⚡</span>
              <span><strong>速学者</strong>：一周内完成3门课程</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">📊</span>
              <span><strong>数据分析师</strong>：完成所有初级课程</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">📈</span>
              <span><strong>高级分析师</strong>：完成所有中级课程</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">🏆</span>
              <span><strong>数据科学家</strong>：完成所有课程</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">✨</span>
              <span><strong>完美主义者</strong>：完成所有练习</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">🔥</span>
              <span><strong>连续7天学习</strong>：连续7天每天完成至少一个练习</span>
            </div>
          </div>
        </div>
      </div>

      {/* 排行榜 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">🏅 学习排行榜</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                <th className="py-3 px-4 text-left">排名</th>
                <th className="py-3 px-4 text-left">用户</th>
                <th className="py-3 px-4 text-left">等级</th>
                <th className="py-3 px-4 text-left">经验值</th>
                <th className="py-3 px-4 text-left">总分数</th>
                <th className="py-3 px-4 text-left">成就徽章</th>
                <th className="py-3 px-4 text-left">完成课程</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.slice(0, 10).map((user, index) => (
                <tr 
                  key={user.id} 
                  className={`border-b hover:bg-gray-50 transition-colors ${
                    index === 0 ? 'bg-yellow-50' : 
                    index === 1 ? 'bg-gray-50' : 
                    index === 2 ? 'bg-orange-50' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    {index === 0 && <span className="text-2xl">🥇</span>}
                    {index === 1 && <span className="text-2xl">🥈</span>}
                    {index === 2 && <span className="text-2xl">🥉</span>}
                    {index > 2 && <span className="font-medium">{index + 1}</span>}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{user.avatar}</span>
                      <span className="font-medium">{user.nickname}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm">
                      Lv.{user.level}
                    </span>
                  </td>
                  <td className="py-3 px-4">{user.exp.toLocaleString()}</td>
                  <td className="py-3 px-4 font-bold text-indigo-600">
                    {getUserScore(user).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-sm">
                      {user.achievements.length} 个
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-sm">
                      {user.completedCourses.length} 门
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 当前用户排名 */}
        {user && (
          <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
            <p className="text-indigo-800">
              📍 你的排名：第 <strong>{leaderboard.findIndex(u => u.id === user.id) + 1}</strong> 名
              （共 {leaderboard.length} 位学习者）
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;