import React from 'react';

const Profile: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">个人中心</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-500 font-bold text-2xl">用户</span>
              </div>
              <h2 className="text-xl font-bold">用户名</h2>
              <p className="text-gray-500">user@example.com</p>
            </div>
          </div>
          <div className="md:w-2/3">
            <h3 className="text-xl font-semibold mb-4">学习记录</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center p-2 border-b">
                <span>Python基础与数据分析</span>
                <span className="text-blue-500">80% 完成</span>
              </div>
              <div className="flex justify-between items-center p-2 border-b">
                <span>商务数据分析实战</span>
                <span className="text-blue-500">45% 完成</span>
              </div>
              <div className="flex justify-between items-center p-2 border-b">
                <span>数据可视化与仪表盘</span>
                <span className="text-blue-500">20% 完成</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4">个人信息</h3>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">姓名</label>
                <input type="text" value="用户名" className="border rounded-md p-2" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">邮箱</label>
                <input type="email" value="user@example.com" className="border rounded-md p-2" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">密码</label>
                <input type="password" value="********" className="border rounded-md p-2" />
              </div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                更新信息
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;