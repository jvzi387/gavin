import { initPyodideReal, runPythonCodeReal } from './pyodide-real';
import * as simple from './pyodide-simple';

// 改为 false 可切换回模拟模式（无需网络）
const USE_REAL = false;

export async function initPyodide() {
  return USE_REAL ? initPyodideReal() : simple.initPyodide();
}

export async function runPythonCode(code: string) {
  return USE_REAL ? runPythonCodeReal(code) : simple.runPythonCode(code);
}