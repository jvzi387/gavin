import React from 'react';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CourseModal: React.FC<CourseModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const codeSamples = [
    `import pandas as pd\nimport numpy as np\n\n# 读取CSV文件\ndf = pd.read_csv('user_orders.csv')\n\n# 查看数据形状\nprint("数据形状:", df.shape)\n\n# 查看数据类型\nprint("\\n数据类型:")\nprint(df.dtypes)\n\n# 查看统计描述\nprint("\\n统计描述:")\nprint(df.describe())`,
    `# 处理缺失值\nprint("缺失值统计:")\nprint(df.isnull().sum())\n\n# 金额列用中位数填充\nif 'amount' in df.columns:\n    df['amount'] = df['amount'].fillna(df['amount'].median())\n\n# 地区列用众数填充\nif 'region' in df.columns:\n    df['region'] = df['region'].fillna(df['region'].mode()[0])`,
    `# 删除重复订单（按订单号）\ndf = df.drop_duplicates(subset=['order_id'])\n\n# 过滤异常值\ndf = df[(df['amount'] > 0) & (df['amount'] <= 100000)]\n\n# 转换日期列\nif 'order_date' in df.columns:\n    df['order_date'] = pd.to_datetime(df['order_date'], errors='coerce')\n    df['year'] = df['order_date'].dt.year\n    df['month'] = df['order_date'].dt.month\n    df['day'] = df['order_date'].dt.day\n    df['weekday'] = df['order_date'].dt.weekday\n\nprint("\\n清洗后的数据:")\nprint(df.head())`
  ];

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">📊 Pandas 数据清洗实战</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-3xl font-light"
          >
            ×
          </button>
        </div>
        
        {/* 内容 */}
        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
            <p className="text-blue-800 font-medium">课程简介</p>
            <p className="text-blue-700 text-sm mt-1">学习数据清洗的核心技能，处理缺失值、重复值、异常值和格式错误</p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">📝 代码示例</h3>
            {codeSamples.map((code, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium mr-2">
                    示例 {index + 1}
                  </span>
                </div>
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <pre className="p-4 text-green-400 text-sm overflow-x-auto font-mono">
                    <code>{code}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 底部 */}
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            开始学习
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseModal;
