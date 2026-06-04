// src/lib/pyodide-simple.ts
// 模拟版本 - 不依赖网络，100%可用

export async function initPyodide() {
  console.log('✅ 模拟模式已启动');
  return {};
}

export async function runPythonCode(code: string) {
  await new Promise(r => setTimeout(r, 300));
  
  // 智能返回示例输出
  if (code.includes('pandas') || code.includes('pd.')) {
    return {
      output: `📊 示例输出（演示模式）：
      
   name  score
0  Alice     85
1    Bob     92
2 Charlie     78

平均分: 85.0

提示：真实环境需要网络支持，当前为演示模式。`
    };
  }
  
  return {
    output: `✅ 代码执行成功（演示模式）

您的代码：
${code.substring(0, 200)}${code.length > 200 ? '...' : ''}

💡 提示：完整功能需要网络环境支持 Pyodide`
  };
}

export async function loadDataset(name: string): Promise<string> {
  return '';
}
