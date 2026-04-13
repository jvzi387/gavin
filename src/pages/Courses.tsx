import React from 'react';

const Courses: React.FC = () => {
  // 按照数据分析基础大纲安排的课程
  const courseCategories = [
    {
      id: 'ai-basics',
      title: 'AI 协作基础能力',
      description: '掌握与 AI 协作的核心技能，提升开发效率',
      courses: [
        {
          id: 1,
          title: '提示工程入门',
          description: '学习结构化提示词设计和链式提示分解复杂任务',
          difficulty: '初级',
          coverColor: 'bg-purple-100'
        },
        {
          id: 2,
          title: 'AI 编程工具实操',
          description: '掌握 AI IDE 和代码助手的使用技巧',
          difficulty: '初级',
          coverColor: 'bg-indigo-100'
        },
        {
          id: 3,
          title: '版本控制与复现意识',
          description: '使用 Git 管理 AI 生成脚本，确保分析可复现',
          difficulty: '中级',
          coverColor: 'bg-blue-100'
        }
      ]
    },
    {
      id: 'data-understanding',
      title: '数据理解与"人机校验"能力',
      description: '培养数据感知能力，识别数据质量问题',
      courses: [
        {
          id: 4,
          title: '探索性分析（EDA）思维',
          description: '掌握数据类型、缺失值、异常值、分布、相关性分析',
          difficulty: '初级',
          coverColor: 'bg-green-100'
        },
        {
          id: 5,
          title: '数据质量问题识别',
          description: '识别 AI 清洗代码中的错误和常见数据陷阱',
          difficulty: '中级',
          coverColor: 'bg-emerald-100'
        },
        {
          id: 6,
          title: '业务理解与问题拆解',
          description: '将模糊业务问题转化为可验证的数据问题',
          difficulty: '中级',
          coverColor: 'bg-teal-100'
        }
      ]
    },
    {
      id: 'python-core',
      title: 'Python 核心（轻语法，重逻辑）',
      description: '掌握 Python 数据分析的核心工具和概念',
      courses: [
        {
          id: 7,
          title: 'Pandas 核心操作',
          description: '学习筛选、分组、聚合、连接、窗口函数等核心操作',
          difficulty: '初级',
          coverColor: 'bg-yellow-100'
        },
        {
          id: 8,
          title: '数据处理核心概念',
          description: '掌握缺失值处理、数据类型转换和多表关系',
          difficulty: '中级',
          coverColor: 'bg-amber-100'
        },
        {
          id: 9,
          title: 'Numpy 基础',
          description: '了解广播、向量化运算等 Numpy 核心概念',
          difficulty: '初级',
          coverColor: 'bg-orange-100'
        }
      ]
    },
    {
      id: 'ai-analysis',
      title: '与 AI 协作的分析核心技能',
      description: '结合 AI 提升分析效率和质量',
      courses: [
        {
          id: 10,
          title: '特征工程与数据准备',
          description: '设计有效特征，验证 AI 生成特征的合理性',
          difficulty: '中级',
          coverColor: 'bg-red-100'
        },
        {
          id: 11,
          title: '可视化的"控制与修正"',
          description: '修改图表细节，判断图表是否误导',
          difficulty: '中级',
          coverColor: 'bg-pink-100'
        },
        {
          id: 12,
          title: '统计学与推断',
          description: '判断检验前提，解读 p 值，识别虚假相关',
          difficulty: '高级',
          coverColor: 'bg-rose-100'
        }
      ]
    },
    {
      id: 'advanced-analysis',
      title: 'AI 增强的高级分析',
      description: '深入学习高级分析技术，提升业务价值',
      courses: [
        {
          id: 13,
          title: '时间序列分析',
          description: '设定季节性周期、节假日、异常点，业务导向的评估',
          difficulty: '高级',
          coverColor: 'bg-cyan-100'
        },
        {
          id: 14,
          title: '因果推断基础',
          description: '理解 A/B 检验、双重差分、倾向性得分匹配',
          difficulty: '高级',
          coverColor: 'bg-sky-100'
        },
        {
          id: 15,
          title: '简单预测与优化',
          description: '掌握回归、分类、聚类等基本机器学习方法',
          difficulty: '中级',
          coverColor: 'bg-blue-100'
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">课程中心</h1>
      
      {courseCategories.map((category) => (
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
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
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