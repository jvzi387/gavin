import React, { useState, useEffect } from 'react';
// 强制使用离线模拟版本
import { initPyodide, runPythonCode } from '../lib/pyodide-simple';

interface CodeEditorProps {
  starterCode: string;
  datasetGeneratorCode?: string;
  title?: string;
  height?: string;
}

export default function CodeEditor({ starterCode, datasetGeneratorCode, title, height }: CodeEditorProps) {
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState('💡 点击"运行代码"按钮执行');
  const [isRunning, setIsRunning] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 初始化
  useEffect(() => {
    const init = async () => {
      try {
        setOutput('⏳ 正在初始化代码环境...');
        await initPyodide();
        setIsReady(true);
        setOutput('✅ 环境就绪，可以运行代码了！');
      } catch (err: any) {
        setError(err.message);
        setOutput(`❌ 初始化失败: ${err.message}\n\n请刷新页面重试。`);
      }
    };
    init();
  }, []);

  // 运行代码
  const handleRun = async () => {
    if (!isReady) {
      setOutput('⏳ 环境尚未就绪，请稍后再试...');
      return;
    }

    if (!code.trim()) {
      setOutput('⚠️ 请在编辑器中输入代码');
      return;
    }

    setIsRunning(true);
    setOutput('🏃 正在执行代码...');

    try {
      const result = await runPythonCode(code);
      if (result.error) {
        setOutput(`❌ 错误:\n${result.error}`);
      } else {
        setOutput(result.output || '✅ 执行成功（无输出）');
      }
    } catch (err: any) {
      setOutput(`❌ 执行异常:\n${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  // 重置代码
  const handleReset = () => {
    setCode(starterCode);
    setOutput('💡 代码已重置');
  };

  return (
    <div className="code-editor-container" style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
      {/* 状态栏 */}
      <div style={{ padding: '8px 12px', background: '#f5f5f5', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          {isReady ? (
            <span style={{ color: 'green' }}>✅ 环境就绪</span>
          ) : error ? (
            <span style={{ color: 'red' }}>❌ 初始化失败</span>
          ) : (
            <span style={{ color: 'orange' }}>⏳ 初始化中...</span>
          )}
        </div>
        <div>
          <button onClick={handleReset} style={{ marginRight: '8px', padding: '4px 12px' }}>重置</button>
          <button onClick={handleRun} disabled={!isReady || isRunning} style={{ padding: '4px 12px', background: isReady ? '#007bff' : '#ccc', color: 'white', border: 'none', borderRadius: '4px' }}>
            {isRunning ? '执行中...' : '运行代码'}
          </button>
        </div>
      </div>

      {/* 代码编辑区 - 简化版使用 textarea */}
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{
          width: '100%',
          height: height || '300px',
          fontFamily: 'monospace',
          fontSize: '14px',
          padding: '12px',
          border: 'none',
          resize: 'vertical'
        }}
      />

      {/* 输出区 */}
      <div style={{ padding: '16px', background: '#1e1e1e', color: '#d4d4d4', fontFamily: 'monospace', fontSize: '13px', borderTop: '1px solid #ddd', minHeight: '200px' }}>
        <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#4ec9b0', marginRight: '8px' }}></span>
          <span style={{ color: '#888', fontSize: '14px', fontWeight: 'bold' }}>📋 输出结果</span>
        </div>
        <div style={{ padding: '12px', background: '#2d2d2d', borderRadius: '6px', minHeight: '120px' }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: '1.6' }}>{output}</pre>
        </div>
      </div>
    </div>
  );
}