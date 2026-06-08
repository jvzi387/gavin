import React, { useState, useEffect } from 'react';
import { initPyodide, runPythonCode } from '../lib/pyodide';

interface CodeEditorProps {
  starterCode: string;
  title?: string;
  height?: string;
}

export default function CodeEditor({ starterCode, title, height = '400px' }: CodeEditorProps) {
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState('💡 点击"运行代码"按钮执行');
  const [isRunning, setIsRunning] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initPyodide()
      .then(() => {
        setIsReady(true);
        setOutput('✅ Python 环境就绪');
      })
      .catch(err => setOutput(`❌ 初始化失败: ${err.message}`));
  }, []);

  const handleRun = async () => {
    if (!isReady) {
      setOutput('⏳ 环境尚未就绪');
      return;
    }
    if (!code.trim()) {
      setOutput('⚠️ 请输入代码');
      return;
    }

    setIsRunning(true);
    setOutput('🏃 执行中...');

    try {
      const result = await runPythonCode(code);
      setOutput(result.error ? `❌ ${result.error}` : result.output);
    } catch (err: any) {
      setOutput(`❌ ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
      {/* 工具栏 */}
      <div style={{
        padding: '8px 12px',
        background: '#2d2d2d',
        borderBottom: '1px solid #3e3e42',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          {isReady ? 
            <span style={{ color: '#4ec9b0' }}>● 已就绪</span> : 
            <span style={{ color: '#dcdcaa' }}>⏳ 加载中...</span>
          }
          {title && <span style={{ color: '#888', marginLeft: '12px' }}>{title}</span>}
        </div>
        <div>
          <button
            onClick={() => setCode(starterCode)}
            style={{ marginRight: '8px', padding: '4px 12px', background: '#3e3e42', color: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            重置
          </button>
          <button
            onClick={handleRun}
            disabled={!isReady || isRunning}
            style={{
              padding: '4px 16px',
              background: !isReady || isRunning ? '#555' : '#0e639c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: !isReady || isRunning ? 'not-allowed' : 'pointer'
            }}
          >
            {isRunning ? '执行中...' : '运行代码'}
          </button>
        </div>
      </div>

      {/* 代码编辑区 */}
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{
          width: '100%',
          height,
          fontFamily: 'Consolas, monospace',
          fontSize: '14px',
          padding: '12px',
          background: '#1e1e1e',
          color: '#d4d4d4',
          border: 'none',
          resize: 'vertical',
          outline: 'none'
        }}
        onKeyDown={(e) => {
          if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.currentTarget.selectionStart;
            const end = e.currentTarget.selectionEnd;
            setCode(code.substring(0, start) + '  ' + code.substring(end));
            setTimeout(() => {
              e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2;
            }, 0);
          }
        }}
      />

      {/* 输出区 */}
      <div style={{
        padding: '12px',
        background: '#1e1e1e',
        borderTop: '1px solid #3e3e42',
        minHeight: '150px'
      }}>
        <div style={{ color: '#888', marginBottom: '8px', fontSize: '12px' }}>📋 输出</div>
        <pre style={{
          margin: 0,
          padding: '8px',
          background: '#2d2d2d',
          borderRadius: '4px',
          color: output.includes('❌') ? '#f48771' : '#d4d4d4',
          fontFamily: 'Consolas, monospace',
          fontSize: '13px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}>
          {output}
        </pre>
      </div>
    </div>
  );
}