import React from 'react';
import { useNavigate } from 'react-router-dom';
import { courses } from '../data/courses';

const Courses: React.FC = () => {
  const navigate = useNavigate();
  
  // 按类别分组课程
  const courseCategories = courses.reduce((acc, course) => {
    const category = course.category;
    if (!acc[category]) {
      acc[category] = {
        id: category.toLowerCase().replace(/\s+/g, '-'),
        title: category,
        description: '',
        courses: []
      };
    }
    acc[category].courses.push({
      id: course.id,
      title: course.title,
      description: course.description,
      difficulty: course.difficulty,
      coverColor: course.coverColor
    });
    return acc;
  }, {} as Record<string, any>);

  const categoryList = Object.values(courseCategories);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">课程中心</h1>
      
      {categoryList.map((category) => (
        <section key={category.id} className="mb-16">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-blue-600 font-semibold">{category.id.split('-')[0].toUpperCase()}</span>
            </div>
            <h2 className="text-2xl font-bold">{category.title}</h2>
          </div>
          <p className="text-gray-600 mb-8 pl-13">{category.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.courses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1 duration-300">
                <div className={`h-48 ${course.coverColor} flex items-center justify-center`}>
                  <span className="text-gray-600 font-medium">课程封面</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">难度：{course.difficulty}</span>
                    <button 
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                      onClick={() => navigate(`/courses/${course.id}`)}
                    >
                      查看详情
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Courses;