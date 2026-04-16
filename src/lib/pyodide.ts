import { loadPyodide } from 'pyodide';

let pyodideInstance: any = null;

export async function initPyodide() {
  if (pyodideInstance) return pyodideInstance;
  
  try {
    pyodideInstance = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/'
    });
    
    await pyodideInstance.loadPackage([
      'pandas', 'numpy', 'matplotlib', 'seaborn', 'scikit-learn', 'mlxtend'
    ]);
    
    pyodideInstance.runPython(`
      import matplotlib.pyplot as plt
      plt.rcParams['font.sans-serif'] = ['WenQuanYi Zen Hei']
      plt.ioff()
    `);
    
    return pyodideInstance;
  } catch (error) {
    console.error('Pyodide初始化失败:', error);
    throw error;
  }
}

export async function runPythonCode(code: string) {
  const py = await initPyodide();
  try {
    const result = await py.runPythonAsync(code);
    return { success: true, result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export function isPyodideReady() {
  return pyodideInstance !== null;
}
