import { Link } from "react-router-dom";

export default function Home() {
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

      {/* 课程分类 */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">课程分类</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {
              [
                { name: "基础技能", icon: "📝", color: "bg-blue-100" },
                { name: "商务分析", icon: "💼", color: "bg-green-100" },
                { name: "数据可视化", icon: "📊", color: "bg-yellow-100" },
                { name: "机器学习", icon: "🤖", color: "bg-purple-100" }
              ].map((category, index) => (
                <Link to="/courses" key={index} className="block">
                  <div className={`${category.color} rounded-lg p-6 text-center hover:shadow-md transition-shadow`}>
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <h3 className="font-semibold">{category.name}</h3>
                  </div>
                </Link>
              ))
            }
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
              [1, 2, 3].map((course) => (
                <Link to={`/courses/${course}`} key={course} className="block">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-500 font-medium">课程封面 {course}</span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">课程标题 {course}</h3>
                      <p className="text-gray-600 mb-4">课程描述，包含课程内容和学习目标</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">难度：初级</span>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {
              [1, 2, 3, 4].map((badge) => (
                <div key={badge} className="bg-white rounded-lg p-4 flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-blue-500 font-bold">{badge}</span>
                  </div>
                  <p className="text-center font-medium">成就名称 {badge}</p>
                </div>
              ))
            }
          </div>
        </div>
      </section>
    </div>
  );
}