import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { courses } from "../data/courses";
import CourseModal from "../components/CourseModal";

// 成就数据
const achievementData = [
  { id: "achievement-1", name: "✨ 初识数据", unlocked: false },
  { id: "achievement-2", name: "数据探索者", unlocked: false },
  { id: "achievement-3", name: "代码大师", unlocked: false },
];

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [achievements, setAchievements] = useState(achievementData);

  // 从localStorage加载成就状态
  useEffect(() => {
    const saved = localStorage.getItem("achievements");
    if (saved) {
      setAchievements(JSON.parse(saved));
    }
  }, []);

  // 保存成就状态到localStorage
  const saveAchievements = (newAchievements: typeof achievementData) => {
    setAchievements(newAchievements);
    localStorage.setItem("achievements", JSON.stringify(newAchievements));
  };

  // 解锁成就
  const unlockAchievement = (id: string) => {
    const updated = achievements.map(a => 
      a.id === id ? { ...a, unlocked: true } : a
    );
    saveAchievements(updated);
  };

  // 处理弹窗关闭
  const handleModalClose = () => {
    setIsModalOpen(false);
    // 解锁第一个成就
    unlockAchievement("achievement-1");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 英雄区 */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">数据分析在线教育平台</h1>
          <p className="text-xl mb-8">专为商务数据分析与应用专业学生设计的完整学习体系</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/courses" className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors">
              浏览课程
            </Link>
            <Link to="/achievements" className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white hover:text-blue-600 transition-colors">
              查看成就系统
            </Link>
          </div>
        </div>
      </section>

      {/* 平台优势 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">平台优势</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">完整课程体系</h3>
              <p className="text-gray-600">从基础到高级的数据分析课程，覆盖Python、商务分析、数据可视化等多个领域</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl">💻</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">互动式学习</h3>
              <p className="text-gray-600">视频学习、文档阅读、在线代码练习，提供全方位的学习体验</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">成就激励系统</h3>
              <p className="text-gray-600">通过徽章、排行榜等机制，激励学生持续学习和进步</p>
            </div>
          </div>
        </div>
      </section>

      {/* 数据分析基础 */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-800">数据分析基础</h2>
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:shadow-xl hover:-translate-y-1 duration-300">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-10 flex items-center justify-center text-white">
                <div className="text-center">
                  <span className="text-7xl mb-6 block">📊</span>
                  <h3 className="text-2xl font-bold mb-4">AI 时代 Python 数据分析</h3>
                  <p className="mb-8 opacity-90">掌握从基础到高级的数据分析技能，开启 AI 时代的数据驱动之旅</p>
                  <button 
                    onClick={() => setIsModalOpen(true)} 
                    className="bg-white text-blue-700 px-8 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors inline-block shadow-md hover:shadow-lg"
                  >
                    开始学习
                  </button>
                </div>
              </div>
              <div className="md:w-1/2 p-10">
                <h4 className="text-xl font-semibold mb-6 text-gray-800">为什么选择本课程？</h4>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-blue-600 font-semibold">1</span>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800">AI 协作能力</h5>
                      <p className="text-sm text-gray-600">掌握提示工程和 AI 编程工具，提升开发效率</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-blue-600 font-semibold">2</span>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800">核心技能</h5>
                      <p className="text-sm text-gray-600">深入学习 Pandas、数据处理和可视化技术</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-blue-600 font-semibold">3</span>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800">实战项目</h5>
                      <p className="text-sm text-gray-600">通过真实案例学习，提升业务分析能力</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 推荐课程 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">推荐课程</h2>
            <Link to="/courses" className="text-blue-600 hover:underline">查看全部</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {
              // 分别获取初级、中级和高级课程
              [
                courses.find(course => course.difficulty === '初级'),
                courses.find(course => course.difficulty === '中级'),
                courses.find(course => course.difficulty === '高级')
              ].filter(Boolean).map((course) => (
                <Link to={`/courses/${course.id}`} key={course.id} className="block">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className={`h-48 ${course.coverColor} flex items-center justify-center`}>
                      <span className="text-gray-600 font-medium">课程封面</span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                      <p className="text-gray-600 mb-4">{course.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">难度：{course.difficulty}</span>
                        <span className="text-sm text-blue-600">查看详情</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            }
          </div>
        </div>
      </section>

      {/* 成就展示 */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">成就展示</h2>
            <Link to="/achievements" className="text-blue-600 hover:underline">查看全部</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className={`bg-white rounded-lg p-6 flex flex-col items-center hover:shadow-md transition-all cursor-pointer ${achievement.unlocked ? 'hover:-translate-y-1' : 'opacity-60'}`}
              >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 text-4xl ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-br from-yellow-100 to-orange-100' 
                    : 'bg-gray-200'
                }`}>
                  {achievement.unlocked ? '🏆' : '🔒'}
                </div>
                <p className={`text-center font-semibold text-lg ${
                  achievement.unlocked ? 'text-gray-800' : 'text-gray-500'
                }`}>
                  {achievement.unlocked ? `${achievement.name} ✅` : achievement.name}
                </p>
                {achievement.unlocked && (
                  <p className="text-xs text-green-600 mt-2 font-medium">
                    已解锁
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 课程弹窗 */}
      <CourseModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
      />
    </div>
  );
}