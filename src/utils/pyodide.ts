// ---------------------------------------------------------------------------
// PyodideManager -- singleton that loads Pyodide once and runs Python code
// ---------------------------------------------------------------------------

interface PyodideRunResult {
  output: string;
  error: string | null;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

class PyodideManager {
  private pyodide: any = null;
  private loadingPromise: Promise<void> | null = null;

  /** Load Pyodide from CDN (only once). */
  private async load(): Promise<void> {
    if (this.pyodide) return;
    if (this.loadingPromise) {
      await this.loadingPromise;
      return;
    }

    this.loadingPromise = (async () => {
      // Dynamically inject the Pyodide script if it doesn't exist yet
      await new Promise<void>((resolve, reject) => {
        if (
          typeof window !== 'undefined' &&
          (window as any).loadPyodide
        ) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src =
          'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error('Pyodide 脚本加载失败，请检查网络连接'));
        document.head.appendChild(script);
      });

      // Initialise Pyodide
      (self as any).loadPyodide = (window as any).loadPyodide;
      this.pyodide = await (self as any).loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
      });
    })();

    await this.loadingPromise;
  }

  /** Execute Python code and capture stdout. */
  async runCode(code: string): Promise<PyodideRunResult> {
    try {
      await this.load();
    } catch (err: any) {
      return { output: '', error: err?.message ?? 'Pyodide 加载失败' };
    }

    try {
      // Redirect stdout
      this.pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
`);

      await this.pyodide.runPythonAsync(code);

      const stdout = this.pyodide.runPython('sys.stdout.getvalue()') as string;
      const stderr = this.pyodide.runPython('sys.stderr.getvalue()') as string;

      // Reset stdout
      this.pyodide.runPython(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
`);

      return {
        output: stdout + stderr,
        error: null,
      };
    } catch (err: any) {
      // Try to reset stdout even on error
      try {
        this.pyodide.runPython(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
`);
      } catch {
        // ignore
      }
      const errMsg = err?.message ?? String(err);
      // Clean up Pyodide stack trace to show only the useful part
      const lines = errMsg.split('\n');
      const pythonLines = lines.filter(
        (l: string) =>
          !l.includes('pyodide') &&
          !l.includes('_pyodide') &&
          !l.includes('JsProxy')
      );
      return {
        output: '',
        error: pythonLines.length > 0 ? pythonLines.join('\n').trim() : errMsg,
      };
    }
  }

  /** Whether Pyodide is currently loaded. */
  isReady(): boolean {
    return this.pyodide !== null;
  }
}

// Singleton instance
export const pyodideManager = new PyodideManager();
