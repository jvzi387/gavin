// src/lib/pyodide.ts
import { loadPyodide } from 'pyodide';

let pyodideInstance: any = null;
let loadingPromise: Promise<any> | null = null;

export async function initPyodide() {
  if (pyodideInstance) return pyodideInstance;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    console.log('⏳ 正在加载 Python 运行环境...');
    
    // 多个备用 CDN 地址
    const CDN_LIST = [
      'https://cdn.jsdelivr.net/pyodide/v0.29.0/full/',
      'https://unpkg.com/pyodide@0.29.0/full/',
    ];
    
    let lastError = null;
    
    for (const cdn of CDN_LIST) {
      try {
        console.log(`尝试从 ${cdn} 加载...`);
        const pyodide = await loadPyodide({ indexURL: cdn });
        await pyodide.loadPackage(['numpy', 'pandas']);
        console.log('✅ Python 环境加载成功！');
        pyodideInstance = pyodide;
        return pyodideInstance;
      } catch (e) {
        console.warn(`从 ${cdn} 加载失败:`, e);
        lastError = e;
      }
    }
    
    throw new Error('无法加载 Python 环境，请检查网络连接');
  })();

  return loadingPromise;
}

export async function runPythonCode(code: string): Promise<{ output: string; error?: string }> {
  try {
    const pyodide = await initPyodide();
    
    // 捕获输出
    pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
    `);
    
    const result = pyodide.runPython(code);
    
    const stdout = pyodide.runPython('sys.stdout.getvalue()');
    const stderr = pyodide.runPython('sys.stderr.getvalue()');
    
    let output = stdout || '';
    if (result !== undefined && result !== null && !stdout) {
      output = String(result);
    }
    if (stderr) output += '\n[stderr]\n' + stderr;
    
    return { output: output || '✅ 代码执行成功' };
  } catch (err: any) {
    return { output: '', error: err.message || String(err) };
  }
}

export async function loadDataset(name: string): Promise<string> {
  const datasets: Record<string, string> = {
    'sales.csv': `date,product,sales
2024-01-01,A,100
2024-01-02,B,150
2024-01-03,A,200`,
    'customers.csv': `id,name,age,city
1,张三,28,北京
2,李四,35,上海
3,王五,22,广州`,
  };
  
  const content = datasets[name] || datasets['sales.csv'];
  const pyodide = await initPyodide();
  pyodide.FS.writeFile(name, content);
  return content;
}
