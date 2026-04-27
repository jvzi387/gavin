import { loadPyodide } from 'pyodide';

let pyodideInstance: any = null;
let initializationPromise: Promise<any> | null = null;

export async function initPyodide() {
  if (pyodideInstance) return pyodideInstance;
  
  if (initializationPromise) return initializationPromise;
  
  initializationPromise = (async () => {
    try {
      console.log('开始加载Pyodide...');
      pyodideInstance = await loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.29.3/full/'
      });
      
      console.log('Pyodide加载成功，开始加载包...');
      
      // 分批次加载包，减少一次性加载的压力
      await pyodideInstance.loadPackage(['numpy']);
      console.log('numpy加载成功');
      
      await pyodideInstance.loadPackage(['pandas']);
      console.log('pandas加载成功');
      
      await pyodideInstance.loadPackage(['matplotlib']);
      console.log('matplotlib加载成功');
      
      try {
        await pyodideInstance.loadPackage(['seaborn', 'scikit-learn']);
        console.log('seaborn和scikit-learn加载成功');
      } catch (error) {
        console.warn('部分包加载失败，继续执行:', error);
      }
      
      pyodideInstance.runPython(`
        import matplotlib.pyplot as plt
        plt.rcParams['font.sans-serif'] = ['WenQuanYi Zen Hei', 'Microsoft YaHei', 'SimHei']
        plt.rcParams['axes.unicode_minus'] = False
        plt.ioff()
      `);
      
      console.log('Pyodide初始化完成');
      return pyodideInstance;
    } catch (error) {
      console.error('Pyodide初始化失败:', error);
      throw error;
    } finally {
      initializationPromise = null;
    }
  })();
  
  return initializationPromise;
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
