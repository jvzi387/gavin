import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import Courses from "@/pages/Courses";
import CourseDetail from "@/pages/CourseDetail";
import Learn from "@/pages/Learn";
import Practice from "@/pages/Practice";
import Achievements from "@/pages/Achievements";
import Profile from "@/pages/Profile";
import DataAnalysisFundamentals from "@/pages/DataAnalysisFundamentals";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* 导航栏 */}
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-xl font-bold text-blue-600">数据分析教育平台</Link>
              <div className="hidden md:flex space-x-6">
                <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">首页</Link>
                <Link to="/courses" className="text-gray-700 hover:text-blue-600 transition-colors">课程中心</Link>
                <Link to="/achievements" className="text-gray-700 hover:text-blue-600 transition-colors">成就系统</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition-colors">个人中心</Link>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">登录</button>
            </div>
          </div>
        </nav>

        {/* 主要内容 */}
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/learn/:courseId/:chapterId" element={<Learn />} />
            <Route path="/practice/:courseId" element={<Practice />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/fundamentals" element={<DataAnalysisFundamentals />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {/* 页脚 */}
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold mb-2">数据分析教育平台</h3>
                <p className="text-gray-400">专为商务数据分析与应用专业学生设计</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <h4 className="font-semibold mb-2">快速链接</h4>
                  <ul className="space-y-1">
                    <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">首页</Link></li>
                    <li><Link to="/courses" className="text-gray-400 hover:text-white transition-colors">课程中心</Link></li>
                    <li><Link to="/achievements" className="text-gray-400 hover:text-white transition-colors">成就系统</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">资源</h4>
                  <ul className="space-y-1">
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">学习指南</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">常见问题</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">联系我们</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">法律</h4>
                  <ul className="space-y-1">
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">隐私政策</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">服务条款</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} 数据分析教育平台. 保留所有权利.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
