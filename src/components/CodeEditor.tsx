import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, Eye, RefreshCw } from 'lucide-react';
import { getPyodide, runCode, isReady, reset } from '../lib/pyodide';

const dataFiles: Record<string, string> = {
  'user_orders.csv': `order_id,user_id,product,region,amount,order_date
ORD00001,1234,手机,北京,2500,2024-01-01
ORD00002,5678,电脑,上海,8999,2024-01-02
ORD00003,1234,耳机,北京,299,2024-01-03
ORD00004,9012,平板,广州,3499,2024-01-04
ORD00005,5678,充电器,上海,129,2024-01-05`,
  'ecommerce_sales.csv': `order_date,user_id,category,quantity,sales
2024-01-01,10001,电子产品,2,4200.50
2024-01-01,10002,服装,3,950.75
2024-01-02,10003,食品,1,120.00
2024-01-02,10004,家居,2,1200.00`,
  'customers.csv': `user_id,name,region,level
10000,用户1,北京,普通
10001,用户2,上海,黄金
10002,用户3,广州,普通
10003,用户4,深圳,白金`,
  'orders.csv': `order_id,user_id,amount,order_date
ORD00001,10000,2500.00,2024-01-01
ORD00002,10001,8999.50,2024-01-02
ORD00003,10002,299.00,2024-01-03`,
  'attendance.csv': `name,date,check_in,check_out
员工1,2024-03-01,08:30,18:30
员工2,2024-03-01,09:15,18:45
员工3,2024-03-01,08:45,19:15`,
  'weather_data.csv': `date,temp_high,temp_low,rainfall,wind_speed
2024-01-01,10.5,2.3,0.0,5.2
2024-01-02,12.3,3.1,0.0,4.5
2024-01-03,8.7,0.5,12.5,6.8`,
  'stock_data.csv': `date,open,high,low,close,volume
2024-01-02,100.00,102.50,99.80,101.20,1250000
2024-01-03,101.50,103.80,100.50,103.20,1380000`,
  'user_reviews.csv': `review_id,user_id,nickname,review_text,rating
REV00001,1234,开心123,商品质量很好，非常满意！,5
REV00002,5678,快乐_abc,物流速度快，包装完好。,4`,
  'numpy_data_normal.csv': `f1,f2,f3,f4,f5
-0.138,0.524,0.494,-0.264,0.647
1.523,1.579,0.767,-0.469,0.542`,
  'numpy_data_uniform.csv': `a,b,c
12.34,56.78,90.12
34.56,78.90,12.34`,
  'performance_data.csv': `price,quantity,discount
123.45,5,0.1
67.89,10,0.05`,
  'churn_data.csv': `customer_id,age,tenure,income,credit_score,products_count,is_active,balance,churn
CUST000001,35,12,5000.00,650,2,1,10000.00,0
CUST000002,42,24,6500.00,720,3,1,15000.00,0`
};

interface CodeEditorProps {
  starterCode: string;
  datasetGeneratorCode?: string;
  title?: string;
  height?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  starterCode,
  datasetGeneratorCode,
  title = '练习代码',
  height = '300px'
}) => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [showAnswer, setShowAnswer] = useState(false);
  const [userCode, setUserCode] = useState('');

  useEffect(() => {
    loadPyodide();
  }, []);

  const loadPyodide = async () => {
    try {
      setStatus('loading');
      const py = await getPyodide();
      
      for (const [filename, content] of Object.entries(dataFiles)) {
        try {
          py.FS.writeFile(filename, content);
        } catch (e) {
          console.log(`文件 ${filename} 已存在`);
        }
      }
      
      setStatus('ready');
    } catch (error) {
      console.error('Pyodide加载失败:', error);
      setStatus('error');
    }
  };

  const handleRun = async () => {
    if (!isReady()) {
      setOutput('请等待Python环境加载完成...');
      return;
    }

    if (!code.trim()) {
      setOutput('请先输入代码或点击"显示参考答案"查看示例代码');
      return;
    }

    setIsRunning(true);
    setOutput('正在运行...\n');

    try {
      if (datasetGeneratorCode) {
        await runCode(datasetGeneratorCode);
      }

      const processedCode = code
        .replace(/读取数据/g, 'Read data')
        .replace(/数据形状/g, 'Data shape')
        .replace(/数据类型/g, 'Data types')
        .replace(/统计描述/g, 'Stat description')
        .replace(/前5行/g, 'First 5 rows')
        .replace(/练习1:/g, 'Exercise 1:')
        .replace(/练习2:/g, 'Exercise 2:')
        .replace(/每个用户的总订单金额:/g, 'Total per user:')
        .replace(/每个地区的订单数量:/g, 'Count per region:')
        .replace(/检查缺失值/g, 'Check missing values')
        .replace(/金额列用中位数填充/g, 'Fill amount with median')
        .replace(/地区列用众数填充/g, 'Fill region with mode')
        .replace(/缺失值处理完成/g, 'Missing values filled')
        .replace(/按月统计销售数据/g, 'Monthly sales stats')
        .replace(/透视表/g, 'Pivot table')
        .replace(/合并订单与用户信息/g, 'Merge orders and users')
        .replace(/计算工作时长/g, 'Calculate work hours')
        .replace(/画折线图/g, 'Draw line chart')
        .replace(/天气数据:/g, 'Weather data:')
        .replace(/设置中文字体/g, 'Set Chinese font')
        .replace(/生成随机数组/g, 'Generate random array')
        .replace(/方法性能对比/g, 'Method performance')
        .replace(/完整探索性数据分析/g, 'Full EDA')
        .replace(/数据概览:/g, 'Data overview:')
        .replace(/缺失值分析:/g, 'Missing values:')
        .replace(/相关性分析:/g, 'Correlation analysis:');

      const result = await runCode(processedCode);

      if (result.success) {
        setOutput(`✅ 运行成功！\n\n${result.output}`);
      } else {
        setOutput(`❌ 运行失败！\n\n${result.error}`);
      }
    } catch (error: any) {
      setOutput(`❌ 错误：${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode('');
    setOutput('');
    setShowAnswer(false);
  };

  const handleShowAnswer = () => {
    if (!showAnswer) {
      // 显示参考答案前，保存用户已输入的代码
      setUserCode(code);
      // 显示参考答案
      setCode(starterCode);
      setShowAnswer(true);
    } else {
      // 关闭参考答案，恢复用户之前的代码（如果有）
      setCode(userCode);
      setShowAnswer(false);
    }
  };

  const handleReload = async () => {
    reset();
    setStatus('loading');
    setOutput('');
    await loadPyodide();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
      <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRun}
            disabled={isRunning || status !== 'ready'}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Play className="w-4 h-4" />
            <span>{isRunning ? '运行中...' : '运行代码'}</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>重置代码</span>
          </button>
          <button
            onClick={handleShowAnswer}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>{showAnswer ? '关闭参考答案' : '显示参考答案'}</span>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-2 ${
            status === 'ready' ? 'text-green-500' : 
            status === 'loading' ? 'text-yellow-500' : 
            'text-red-500'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              status === 'ready' ? 'bg-green-500' : 
              status === 'loading' ? 'bg-yellow-500 animate-pulse' : 
              'bg-red-500'
            }`}></div>
            <span className="text-xs">
              {status === 'ready' ? 'Python就绪' : 
               status === 'loading' ? '加载中...' : 
               '加载失败'}
            </span>
            {status === 'error' && (
              <button
                onClick={handleReload}
                className="p-1 text-red-500 hover:text-red-400 transition-colors"
                title="重新加载Python环境"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="bg-gray-900 px-4 py-2 flex items-center">
        <span className="text-gray-400 text-sm">{title}</span>
      </div>
      <div style={{ height }}>
        <Editor
          height="100%"
          defaultLanguage="python"
          value={code}
          onChange={(value) => setCode(value || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            placeholder: '在此处编写Python代码...'
          }}
          theme="vs-dark"
        />
      </div>
      <div className="border-t">
        <div className="bg-gray-50 px-4 py-2">
          <span className="text-sm font-medium text-gray-700">输出</span>
        </div>
        <div className="h-32 bg-gray-900 text-green-400 p-4 overflow-y-auto font-mono text-sm">
          {output || '点击"运行代码"按钮执行代码'}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
