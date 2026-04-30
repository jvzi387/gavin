let pyodide: any = null;
let initError: Error | null = null;

declare global {
  interface Window {
    loadPyodide: any;
    pyodide: any;
  }
}

export async function getPyodide(): Promise<any> {
  if (pyodide) return pyodide;
  
  if (initError) {
    throw initError;
  }
  
  try {
    console.log('正在加载Pyodide...');
    
    if (!window.loadPyodide) {
      throw new Error('Pyodide未加载，请检查CDN脚本');
    }
    
    pyodide = await window.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/npm/pyodide@0.25.1/',
      fullStdLib: false,
    });
    
    console.log('Pyodide加载成功');
    
    await pyodide.loadPackage(['numpy', 'pandas']);
    console.log('numpy和pandas加载成功');
    
    window.pyodide = pyodide;
    
    return pyodide;
    
  } catch (error: any) {
    console.error('Pyodide加载失败:', error);
    initError = error;
    throw error;
  }
}

export async function runCode(code: string): Promise<{ success: boolean; output: string; error?: string }> {
  try {
    const py = await getPyodide();
    
    let output = '';
    
    const oldStdout = py.stdout;
    const oldStderr = py.stderr;
    
    py.stdout = (text: string) => {
      output += text;
      console.log('[Python stdout]', text);
    };
    
    py.stderr = (text: string) => {
      output += text;
      console.warn('[Python stderr]', text);
    };
    
    try {
      await py.runPythonAsync(code);
      return { success: true, output: output.trim() || '代码执行成功' };
    } finally {
      py.stdout = oldStdout;
      py.stderr = oldStderr;
    }
    
  } catch (err: any) {
    return { success: false, output: '', error: err.message };
  }
}

export function isReady(): boolean {
  return pyodide !== null;
}

export function reset(): void {
  pyodide = null;
  initError = null;
  console.log('Pyodide已重置');
}
