import React from 'react';

const Achievements: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">成就系统</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">我的成就</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((badge) => (
            <div key={badge} className="bg-blue-100 rounded-lg p-4 flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                <span className="text-white font-bold">{badge}</span>
              </div>
              <p className="text-center font-medium">成就名称 {badge}</p>
              <p className="text-xs text-gray-500 text-center">获得于 2023-01-01</p>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4">排行榜</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">排名</th>
                <th className="py-2 px-4 text-left">用户</th>
                <th className="py-2 px-4 text-left">成就点数</th>
                <th className="py-2 px-4 text-left">徽章数量</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((rank) => (
                <tr key={rank} className="border-b">
                  <td className="py-2 px-4">{rank}</td>
                  <td className="py-2 px-4">用户 {rank}</td>
                  <td className="py-2 px-4">{1000 - rank * 100}</td>
                  <td className="py-2 px-4">{10 - rank}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Achievements;