import { loadPyodide, PyodideInterface } from 'pyodide';

let pyodide: PyodideInterface | null = null;

export async function initPyodideReal() {
  if (pyodide) return pyodide;
  
  pyodide = await loadPyodide({
    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
  });
  
  return pyodide;
}

export async function runPythonCodeReal(code: string) {
  try {
    const py = await initPyodideReal();
    
    // 捕获 print 输出
    await py.runPythonAsync(`
import sys, io
sys.stdout = io.StringIO()
    `);
    
    let error = null;
    try {
      await py.runPythonAsync(code);
    } catch (err: any) {
      error = err.message;
    }
    
    const output = py.runPython('sys.stdout.getvalue()') as string;
    
    return {
      output: output || (error ? '' : '✅ 执行成功'),
      error: error || undefined,
    };
  } catch (err: any) {
    return { output: '', error: err.message };
  }
}
