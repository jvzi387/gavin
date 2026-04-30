import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { projects, getProjectById } from '../data/projects';
import { getProjectProgress, saveProjectProgress, getCodeDraft, saveCodeDraft, getChatHistory, saveChatHistory } from '../lib/storage';
import { getPyodide, runCode, isReady } from '../lib/pyodide';
import { Play, RotateCcw, Brain, HelpCircle, MessageSquare, ChevronLeft, CheckCircle2 } from 'lucide-react';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const project = getProjectById(id || '');
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pyodideStatus, setPyodideStatus] = useState('initializing');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [showAiPanel, setShowAiPanel] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadPyodide = async () => {
      try {
        setPyodideStatus('loading');
        await getPyodide();
        setPyodideStatus('ready');
      } catch (error) {
        console.error('Pyodide加载失败:', error);
        setPyodideStatus('error');
      } finally {
        setIsLoading(false);
      }
    };

    loadPyodide();
  }, []);

  useEffect(() => {
    if (project) {
      const progress = getProjectProgress(project.id);
      const draft = getCodeDraft(project.id);
      const chat = getChatHistory(project.id);
      
      if (draft) {
        setCode(draft);
      } else if (project.tasks[currentTaskIndex].starterCode) {
        setCode(project.tasks[currentTaskIndex].starterCode);
      }
      
      setChatMessages(chat);
    }
  }, [project, currentTaskIndex]);

  const handleRunCode = async () => {
    if (!isReady()) {
      setOutput('Pyodide正在加载中，请稍候...');
      return;
    }

    setIsRunning(true);
    setOutput('运行中...\n');

    try {
      // 替换中文注释以避免编码问题
      const processedCode = code
        .replace(/读取数据/g, 'Read data')
        .replace(/数据形状/g, 'Data shape')
        .replace(/数据类型/g, 'Data types')
        .replace(/统计描述/g, 'Stat description')
        .replace(/前5行/g, 'First 5 rows');
      
      const result = await runCode(processedCode);
      
      if (result.success) {
        setOutput(`运行成功！\n\n${result.output || '(无输出)'}`);
      } else {
        setOutput(`运行错误！\n\n${result.error}`);
      }
    } catch (error: any) {
      setOutput(`运行错误！\n\n${error.message}`);
    } finally {
      setIsRunning(false);
    }

    if (project) {
      saveCodeDraft(project.id, code);
    }

    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  };

  const handleResetCode = () => {
    if (project && project.tasks[currentTaskIndex].starterCode) {
      setCode(project.tasks[currentTaskIndex].starterCode);
      setOutput('');
    }
  };

  const handleSendAiMessage = () => {
    if (!aiInput.trim() || !project) return;

    const newMessage = {
      role: 'user',
      content: aiInput,
      timestamp: Date.now()
    };

    const updatedMessages = [...chatMessages, newMessage];
    setChatMessages(updatedMessages);
    saveChatHistory(project.id, updatedMessages);
    setAiInput('');

    setTimeout(() => {
      const aiResponse = {
        role: 'assistant',
        content: '我是你的AI数据分析教练。让我帮你分析一下这个问题...\n\n1. 首先，检查一下你的代码逻辑\n2. 注意数据类型转换\n3. 确保使用了正确的pandas方法\n\n有什么具体问题需要我帮助的吗？',
        timestamp: Date.now()
      };
      
      const finalMessages = [...updatedMessages, aiResponse];
      setChatMessages(finalMessages);
      saveChatHistory(project.id, finalMessages);
    }, 1000);
  };

  const handleNextTask = () => {
    if (project && currentTaskIndex < project.tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
      setOutput('');
      
      if (project.tasks[currentTaskIndex + 1].starterCode) {
        setCode(project.tasks[currentTaskIndex + 1].starterCode);
      }
    }
  };

  const handlePrevTask = () => {
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex(currentTaskIndex - 1);
      setOutput('');
      
      if (project?.tasks[currentTaskIndex - 1].starterCode) {
        setCode(project.tasks[currentTaskIndex - 1].starterCode);
      }
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">项目未找到</h1>
          <Link to="/platform/projects" className="text-blue-600 hover:underline">
            返回项目列表
          </Link>
        </div>
      </div>
    );
  }

  const currentTask = project.tasks[currentTaskIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/platform/projects" className="text-gray-600 hover:text-gray-900">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold">{project.title}</h1>
                <p className="text-sm text-gray-600">
                  任务 {currentTaskIndex + 1}/{project.tasks.length}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${pyodideStatus === 'ready' ? 'bg-green-500' : pyodideStatus === 'loading' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                <span className="text-sm">
                  {pyodideStatus === 'ready' ? 'Python已就绪' : pyodideStatus === 'loading' ? '正在加载...' : '加载失败'}
                </span>
              </div>
              <button
                onClick={() => setShowAiPanel(!showAiPanel)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
              >
                <Brain className="w-5 h-5" />
                <span>AI陪练</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className={`grid gap-6 ${showAiPanel ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
          <div className={`${showAiPanel ? 'lg:col-span-1' : 'lg:col-span-1'}`}>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">当前任务</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={handlePrevTask}
                    disabled={currentTaskIndex === 0}
                    className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
                  >
                    上一个
                  </button>
                  <button
                    onClick={handleNextTask}
                    disabled={currentTaskIndex === project.tasks.length - 1}
                    className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
                  >
                    下一个
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{currentTask.title}</h3>
              <p className="text-gray-600 mb-4">{currentTask.description}</p>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <HelpCircle className="w-4 h-4 mr-1" />
                  任务说明
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>阅读任务描述</li>
                  <li>使用下方的代码编辑器编写代码</li>
                  <li>点击"运行"按钮执行代码</li>
                  <li>查看输出结果</li>
                  <li>需要帮助时使用AI陪练</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4">项目任务进度</h2>
              <div className="space-y-2">
                {project.tasks.map((task, index) => (
                  <div
                    key={task.id}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                      index === currentTaskIndex
                        ? 'bg-blue-100 text-blue-800'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setCurrentTaskIndex(index);
                      if (task.starterCode) {
                        setCode(task.starterCode);
                      }
                      setOutput('');
                    }}
                  >
                    <CheckCircle2 className={`w-5 h-5 mr-3 ${
                      index === currentTaskIndex ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <span className="font-medium">
                      {index + 1}. {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`${showAiPanel ? 'lg:col-span-1' : 'lg:col-span-1'}`}>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                <span className="text-gray-300 text-sm">main.py</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleResetCode}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    title="重置代码"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleRunCode}
                    disabled={isRunning || pyodideStatus !== 'ready'}
                    className="flex items-center space-x-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    <span>{isRunning ? '运行中...' : '运行'}</span>
                  </button>
                </div>
              </div>
              <div className="h-96">
                <Editor
                  height="100%"
                  defaultLanguage="python"
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    automaticLayout: true
                  }}
                  theme="vs-dark"
                />
              </div>
              <div className="border-t">
                <div className="bg-gray-100 px-4 py-2">
                  <span className="text-sm font-medium text-gray-700">输出</span>
                </div>
                <div
                  ref={outputRef}
                  className="h-48 bg-gray-900 text-green-400 p-4 overflow-y-auto font-mono text-sm"
                >
                  {output || '点击"运行"按钮执行代码'}
                </div>
              </div>
            </div>
          </div>

          {showAiPanel && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg h-full flex flex-col">
                <div className="bg-purple-600 px-4 py-3">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <Brain className="w-5 h-5 mr-2" />
                    AI 陪练
                  </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>你好！我是你的AI数据分析教练。</p>
                      <p className="text-sm mt-2">有什么问题需要帮助吗？</p>
                    </div>
                  ) : (
                    chatMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg p-3 ${
                            message.role === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendAiMessage()}
                      placeholder="输入你的问题..."
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      onClick={handleSendAiMessage}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      发送
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      onClick={() => setAiInput('代码报错了，帮我看看哪里错了？')}
                      className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      代码报错了
                    </button>
                    <button
                      onClick={() => setAiInput('我卡住了，给我一个思路提示')}
                      className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      思路提示
                    </button>
                    <button
                      onClick={() => setAiInput('这道题的最佳实践是什么？')}
                      className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      最佳实践
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
