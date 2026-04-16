import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Code, Brain, Zap, TrendingUp, ShieldCheck } from 'lucide-react';

const PlatformHome: React.FC = () => {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8 text-blue-600" />,
      title: '10个梯度项目',
      description: '从入门到精通，循序渐进的学习路径'
    },
    {
      icon: <Code className="w-8 h-8 text-green-600" />,
      title: '在线代码运行',
      description: 'Pyodide浏览器端Python，无需后端'
    },
    {
      icon: <Brain className="w-8 h-8 text-purple-600" />,
      title: 'AI陪练指导',
      description: 'AI错题倒逼，思路点拨不写代码'
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: 'Cloudflare免费',
      description: '零成本部署，无传统后端'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 英雄区 */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Python数据分析AI训练平台
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            3步认知 + 10个梯度项目 + AI错题倒逼，零成本、零运维
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/platform/projects"
              className="bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all hover:scale-105 shadow-lg"
            >
              开始学习
            </Link>
            <Link
              to="/fundamentals"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-700 transition-all"
            >
              知识框架
            </Link>
          </div>
        </div>
      </section>

      {/* 平台特色 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">平台特色</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-xl transition-all hover:-translate-y-2"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3步认知 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">3步认知体系</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: '底层认知',
                description: '思维模型、行业争议、辨析题',
                color: 'bg-blue-500'
              },
              {
                step: '2',
                title: '过渡项目',
                description: '3个入门级项目，打牢基础',
                color: 'bg-green-500'
              },
              {
                step: '3',
                title: '实战项目',
                description: '电商、金融、运营各2-3个项目',
                color: 'bg-purple-500'
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
              >
                <div className={`${item.color} text-white py-4 text-center`}>
                  <span className="text-4xl font-bold">{item.step}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA区 */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            准备好开始你的数据分析学习之旅了吗？
          </h2>
          <p className="text-xl mb-8 opacity-90">
            零成本、零运维，打开浏览器就能开始学习
          </p>
          <Link
            to="/platform/projects"
            className="bg-white text-indigo-700 px-10 py-4 rounded-lg font-bold text-lg hover:bg-indigo-50 transition-all hover:scale-105 shadow-xl inline-block"
          >
            立即开始
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PlatformHome;
