import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw } from 'lucide-react';
import { initPyodide, runPythonCode, isPyodideReady } from '../lib/pyodide';

interface CodeEditorProps {
  starterCode: string;
  datasetGeneratorCode?: string;
  title?: string;
  height?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  starterCode,
  datasetGeneratorCode,
  title = '代码编辑器',
  height = '400px'
}) => {
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [pyodideStatus, setPyodideStatus] = useState('initializing');
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadPyodide = async () => {
      try {
        setPyodideStatus('loading');
        await initPyodide();
        setPyodideStatus('ready');
      } catch (error) {
        console.error('Pyodide加载失败:', error);
        setPyodideStatus('error');
      }
    };

    loadPyodide();
  }, []);

  const handleRunCode = async () => {
    if (!isPyodideReady()) {
      setOutput('Pyodide正在加载中，请稍候...');
      return;
    }

    setIsRunning(true);
    setOutput('运行中...\n');

    try {
      // 先运行数据生成代码
      if (datasetGeneratorCode) {
        await runPythonCode(datasetGeneratorCode);
      }
      
      // 然后运行用户代码
      const result = await runPythonCode(code);
      
      if (result.success) {
        setOutput(`运行成功！\n\n${result.result || '(无输出)'}`);
      } else {
        setOutput(`运行错误！\n\n${result.error}`);
      }
    } catch (error: any) {
      setOutput(`运行错误！\n\n${error.message}`);
    } finally {
      setIsRunning(false);
    }

    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  };

  const handleResetCode = () => {
    setCode(starterCode);
    setOutput('');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
        <span className="text-gray-300 text-sm">{title}</span>
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-2 ${pyodideStatus === 'ready' ? 'text-green-400' : pyodideStatus === 'loading' ? 'text-yellow-400' : 'text-red-400'}`}>
            <div className={`w-2 h-2 rounded-full ${pyodideStatus === 'ready' ? 'bg-green-500' : pyodideStatus === 'loading' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
            <span className="text-xs">
              {pyodideStatus === 'ready' ? 'Python就绪' : pyodideStatus === 'loading' ? '加载中...' : '加载失败'}
            </span>
          </div>
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
      <div style={{ height }}>
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
          className="h-32 bg-gray-900 text-green-400 p-4 overflow-y-auto font-mono text-sm"
        >
          {output || '点击"运行"按钮执行代码'}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;