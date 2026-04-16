import React from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { getAllProgress } from '../lib/storage';
import { CheckCircle2, Clock, TrendingUp } from 'lucide-react';

const ProjectList: React.FC = () => {
  const progress = getAllProgress();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '过渡项目':
        return <TrendingUp className="w-5 h-5" />;
      case '电商':
        return <CheckCircle2 className="w-5 h-5" />;
      case '金融':
        return <Clock className="w-5 h-5" />;
      case '运营':
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <TrendingUp className="w-5 h-5" />;
    }
  };

  const categories = ['过渡项目', '电商', '金融', '运营'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">10个梯度项目</h1>
          <p className="text-xl text-gray-600">
            从入门到精通，循序渐进的学习路径
          </p>
        </div>

        {categories.map((category) => {
          const categoryProjects = projects.filter(p => p.category === category);
          if (categoryProjects.length === 0) return null;

          return (
            <section key={category} className="mb-16">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                {getCategoryIcon(category)}
                <span className="ml-2">{category}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryProjects.map((project) => {
                  const projectProgress = progress[project.id];
                  const isCompleted = projectProgress?.completed;

                  return (
                    <Link
                      key={project.id}
                      to={`/platform/project/${project.id}`}
                      className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-2 ${isCompleted ? 'border-2 border-green-500' : ''}`}
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(project.difficulty)}`}>
                            {project.difficulty === 'beginner' ? '初级' : project.difficulty === 'intermediate' ? '中级' : '高级'}
                          </span>
                          {isCompleted && (
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                          )}
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                        <p className="text-gray-600 mb-4">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 rounded text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {project.tasks.length} 个任务
                          </span>
                          <span className="text-blue-600 font-medium">
                            开始学习 →
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectList;
