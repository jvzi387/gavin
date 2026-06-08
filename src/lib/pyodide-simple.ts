// 离线模拟版本 - 无需网络
export async function initPyodide() {
  return {};
}

export async function runPythonCode(code: string): Promise<{ output: string; error?: string }> {
  await new Promise(r => setTimeout(r, 300));
  
  // print("内容")
  if (code.includes('print(')) {
    const stringMatch = code.match(/print\(['"]([^'"]+)['"]\)/);
    if (stringMatch) return { output: stringMatch[1] };
    
    const exprMatch = code.match(/print\(([^)]+)\)/);
    if (exprMatch) {
      const expr = exprMatch[1].trim();
      try {
        return { output: String(new Function(`return ${expr}`)()) };
      } catch {
        return { output: expr };
      }
    }
    return { output: '' };
  }
  
  // Pandas
  if (code.includes('pandas') || code.includes('pd.')) {
    return {
      output: `   name  score  age
0  Alice     85   28
1    Bob     92   35
2  Carol     78   42`
    };
  }
  
  // NumPy
  if (code.includes('numpy') || code.includes('np.')) {
    return { output: 'array([1, 2, 3, 4, 5])' };
  }
  
  // 数学运算
  if (code.match(/\d+.*[+\-*/].*\d+/)) {
    try {
      const result = new Function(`return ${code.replace(/\s+/g, '')}`)();
      return { output: String(result) };
    } catch {}
  }
  
  return { output: code };
}