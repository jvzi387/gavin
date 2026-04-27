export interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: '初级' | '中级' | '高级';
  category: string;
  coverColor: string;
  chapters: Chapter[];
  projectId?: string; // 关联的项目ID
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  content: string;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  datasetGeneratorCode: string;
  expectedOutput?: string;
  hints: string[];
}

export const courses: Course[] = [
  {
    id: 'course-1',
    title: 'Pandas 数据清洗实战',
    description: '掌握数据清洗的核心技能，处理缺失值、重复值、异常值和格式错误',
    difficulty: '初级',
    category: '基础技能',
    coverColor: 'bg-blue-100',
    projectId: 'project-1',
    chapters: [
      {
        id: 'ch-1-1',
        title: '数据读取与基础信息',
        description: '学习如何读取数据并获取基础信息',
        content: `
# 数据读取与基础信息

在数据分析的第一步，我们需要读取数据并了解其基本结构。这是数据分析的基础，也是确保后续分析准确性的关键步骤。

## 核心概念

1. **数据形状 (shape)**：了解数据的行数和列数
2. **数据类型 (dtypes)**：识别不同列的数据类型
3. **统计描述 (describe)**：获取数据的基本统计信息
4. **数据预览 (head/tail)**：查看数据的前几行和后几行

## 重要性

- **数据质量评估**：通过基础信息了解数据的完整性和可靠性
- **分析方向确定**：根据数据结构制定合适的分析策略
- **问题识别**：提前发现可能的数据质量问题

## 实践技巧

- 始终在分析前查看数据的基本信息
- 注意数据类型是否正确，特别是日期和数值类型
- 关注缺失值的分布情况
- 检查数据的统计范围，识别可能的异常值


        `,
        exercises: [
          {
            id: 'ex-1-1-1',
            title: '读取数据并输出基础信息',
            description: '用 pandas 读取 CSV，输出 shape、dtypes、describe',
            starterCode: 'import pandas as pd\nimport numpy as np\n\n# 读取数据\ndf = pd.read_csv(\'user_orders.csv\')\n\n# 输出基础信息\nprint("数据形状:", df.shape)\nprint("\\n数据类型:\\n", df.dtypes)\nprint("\\n统计描述:\\n", df.describe())\nprint("\\n前5行数据:\\n", df.head())',
            datasetGeneratorCode: 'import pandas as pd\nimport numpy as np\nfrom datetime import datetime, timedelta\n\nnp.random.seed(42)\n\n# 生成订单数据\nn_orders = 1000\n\norder_ids = [f"ORD{i:05d}" for i in range(1, n_orders + 1)]\nuser_ids = np.random.randint(1000, 9999, n_orders)\nproducts = np.random.choice([\'手机\', \'电脑\', \'平板\', \'耳机\', \'充电器\'], n_orders)\nregions = np.random.choice([\'北京\', \'上海\', \'广州\', \'深圳\', \'杭州\'], n_orders)\namounts = np.random.normal(2000, 800, n_orders).clip(50, 10000)\n\n# 生成日期\nstart_date = datetime(2024, 1, 1)\ndates = [start_date + timedelta(days=np.random.randint(0, 90)) for _ in range(n_orders)]\n\n# 创建DataFrame\ndf = pd.DataFrame({\n    \'order_id\': order_ids,\n    \'user_id\': user_ids,\n    \'product\': products,\n    \'region\': regions,\n    \'amount\': amounts,\n    \'order_date\': dates\n})\n\n# 引入缺失值\nmask = np.random.random(n_orders) < 0.05\ndf.loc[mask, \'amount\'] = np.nan\nmask = np.random.random(n_orders) < 0.03\ndf.loc[mask, \'region\'] = np.nan\n\n# 引入重复值\nduplicate_indices = np.random.choice(df.index, 50, replace=False)\ndf_duplicates = df.loc[duplicate_indices].copy()\ndf = pd.concat([df, df_duplicates], ignore_index=True)\n\n# 引入异常值\noutlier_indices = np.random.choice(df.index, 10, replace=False)\ndf.loc[outlier_indices[:5], \'amount\'] = -np.random.randint(100, 1000, 5)\ndf.loc[outlier_indices[5:], \'amount\'] = np.random.randint(100000, 500000, 5)\n\n# 引入日期格式错误\nif len(df) > 20:\n    df.loc[df.index[-10:], \'order_date\'] = [\'2024/02/30\', \'invalid\', \'\', \'2024-13-01\', \'2024/2/29\', \'2024-04-31\', \'2024-02-30\', \'invalid\', \'\', \'2024-13-01\']\n\n# 保存文件\ndf.to_csv(\'user_orders.csv\', index=False, encoding=\'utf-8-sig\')\nprint(f"用户订单表已生成，共 {len(df)} 条记录")',
            hints: [
              '使用 pd.read_csv() 读取数据文件',
              '使用 df.shape 查看数据形状',
              '使用 df.dtypes 查看数据类型',
              '使用 df.describe() 查看统计描述',
              '使用 df.head() 查看前几行数据'
            ]
          }
        ]
      },
      {
        id: 'ch-1-2',
        title: '缺失值处理',
        description: '学习如何识别和处理数据中的缺失值',
        content: `
# 缺失值处理

缺失值是数据分析中常见的问题，如何正确处理缺失值直接影响分析结果的准确性。

## 核心概念

1. **缺失值识别**：使用 isnull() 和 sum() 统计缺失值
2. **缺失值填充**：根据数据类型选择合适的填充方法
3. **缺失值删除**：在适当情况下删除包含缺失值的行或列

## 填充策略

- **数值型数据**：常用中位数、均值或众数填充
- **分类数据**：常用众数填充
- **时间序列**：常用前向填充或后向填充

## 最佳实践

- 了解缺失值的原因，而不是盲目填充
- 对于重要字段，考虑保留缺失值并在分析中单独处理
- 记录缺失值处理的方法，确保分析的可重复性


        `,
        exercises: [
          {
            id: 'ex-1-2-1',
            title: '处理缺失值',
            description: '金额列用中位数填充，地区列用众数填充',
            starterCode: '# 检查缺失值\nprint("缺失值统计:\\n", df.isnull().sum())\n\n# 金额列用中位数填充\nif \'amount\' in df.columns:\n    df[\'amount\'] = df[\'amount\'].fillna(df[\'amount\'].median())\n\n# 地区列用众数填充\nif \'region\' in df.columns:\n    df[\'region\'] = df[\'region\'].fillna(df[\'region\'].mode()[0])\n\nprint("\\n缺失值处理完成")',
            datasetGeneratorCode: 'import pandas as pd\nimport numpy as np\nfrom datetime import datetime, timedelta\n\nnp.random.seed(42)\n\n# 生成包含缺失值的数据\nn_orders = 500\n\norder_ids = [f"ORD{i:05d}" for i in range(1, n_orders + 1)]\namounts = np.random.normal(2000, 800, n_orders).clip(50, 10000)\nregions = np.random.choice([\'北京\', \'上海\', \'广州\', \'深圳\', \'杭州\'], n_orders)\n\n# 创建DataFrame\ndf = pd.DataFrame({\n    \'order_id\': order_ids,\n    \'amount\': amounts,\n    \'region\': regions\n})\n\n# 引入缺失值\nmask = np.random.random(n_orders) < 0.15\ndf.loc[mask, \'amount\'] = np.nan\nmask = np.random.random(n_orders) < 0.1\ndf.loc[mask, \'region\'] = np.nan\n\n# 保存文件\ndf.to_csv(\'user_orders.csv\', index=False, encoding=\'utf-8-sig\')\nprint(f"包含缺失值的订单表已生成，共 {len(df)} 条记录")',
            hints: [
              '使用 df.isnull().sum() 检查缺失值',
              '使用 df[\'amount\'].median() 计算中位数',
              '使用 df[\'region\'].mode()[0] 获取众数',
              '使用 fillna() 方法填充缺失值'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-2',
    title: '分组聚合与透视表',
    description: '掌握groupby、agg、pivot_table等数据聚合技术',
    difficulty: '初级',
    category: '基础技能',
    coverColor: 'bg-green-100',
    projectId: 'project-2',
    chapters: [
      {
        id: 'ch-2-1',
        title: '分组聚合基础',
        description: '学习使用groupby进行数据分组和聚合',
        content: `
# 分组聚合基础

分组聚合是数据分析中最常用的技术之一，它允许我们按特定维度对数据进行汇总分析。

## 核心概念

1. **分组 (groupby)**：根据一个或多个列对数据进行分组
2. **聚合 (agg)**：对每个分组应用聚合函数（如sum、mean、count等）
3. **变换 (transform)**：对每个分组应用变换函数，返回与原数据长度相同的结果
4. **过滤 (filter)**：根据分组结果过滤数据

## 常用聚合函数

- **数值型**：sum, mean, median, min, max, std, var
- **类别型**：count, size, nunique
- **自定义函数**：使用agg(func)应用自定义聚合函数

## 实践技巧

- 对于多列聚合，使用字典指定每列的聚合函数
- 对于复杂聚合，考虑使用agg()方法的多函数列表
- 注意分组后的索引结构，必要时使用reset_index()重置索引


        `,
        exercises: [
          {
            id: 'ex-2-1-1',
            title: '按月统计销售数据',
            description: '按月统计总销售额和总销量',
            starterCode: 'import pandas as pd\nimport numpy as np\n\n# 读取数据\ndf = pd.read_csv(\'ecommerce_sales.csv\')\ndf[\'order_date\'] = pd.to_datetime(df[\'order_date\'])\n\n# 提取月份\ndf[\'month\'] = df[\'order_date\'].dt.to_period(\'M\')\n\n# 按月统计\nmonthly_stats = df.groupby(\'month\').agg({\n    \'sales\': \'sum\',\n    \'quantity\': \'sum\'\n}).round(2)\n\nprint("月度销售统计:")\nprint(monthly_stats)',
            datasetGeneratorCode: 'import pandas as pd\nimport numpy as np\nfrom datetime import datetime, timedelta\n\nnp.random.seed(42)\n\nn_records = 1000\n\n# 生成日期\nstart_date = datetime(2024, 1, 1)\ndates = [start_date + timedelta(days=np.random.randint(0, 90)) for _ in range(n_records)]\n\n# 生成数据\nuser_ids = np.random.randint(10000, 99999, n_records)\ncategories = np.random.choice([\'电子产品\', \'服装\', \'食品\', \'家居\', \'美妆\'], n_records)\n\n# 根据类别设置价格基准\nprice_base = {\n    \'电子产品\': 2000,\n    \'服装\': 300,\n    \'食品\': 100,\n    \'家居\': 500,\n    \'美妆\': 200\n}\n\nquantities = np.random.randint(1, 5, n_records)\nsales = []\nfor cat, qty in zip(categories, quantities):\n    base = price_base[cat]\n    sale = base * qty * np.random.normal(1, 0.2)\n    sales.append(round(sale, 2))\n\n# 创建DataFrame\ndf = pd.DataFrame({\n    \'order_date\': dates,\n    \'user_id\': user_ids,\n    \'category\': categories,\n    \'quantity\': quantities,\n    \'sales\': sales\n})\n\n# 保存文件\ndf.to_csv(\'ecommerce_sales.csv\', index=False, encoding=\'utf-8-sig\')\nprint(f"电商销售记录已生成，共 {len(df)} 条记录")',
            hints: [
              '使用 pd.to_datetime() 转换日期列',
              '使用 dt.to_period(\'M\') 提取月份',
              '使用 groupby(\'month\') 按月分组',
              '使用 agg() 函数进行聚合计算'
            ]
          }
        ]
      },
      {
        id: 'ch-2-2',
        title: '透视表应用',
        description: '学习使用pivot_table进行数据透视分析',
        content: `
# 透视表应用

透视表是一种强大的数据汇总工具，它可以将数据按照行和列进行多维度汇总分析。

## 核心概念

1. **行 (index)**：透视表的行索引
2. **列 (columns)**：透视表的列索引
3. **值 (values)**：需要汇总的数据列
4. **聚合函数 (aggfunc)**：对值进行聚合的函数

## 透视表优势

- **多维度分析**：可以同时按多个维度查看数据
- **灵活性**：支持自定义行、列、值和聚合函数
- **可读性**：结果格式清晰，易于理解

## 实践技巧

- 对于复杂透视表，考虑先进行数据预处理
- 使用 margins=True 添加总计行和列
- 适当使用 fill_value 参数处理缺失值
- 对于大型数据集，注意内存使用


        `,
        exercises: [
          {
            id: 'ex-2-2-1',
            title: '使用 pivot_table',
            description: '用 pivot_table 生成：行=月份，列=产品类别，值=销售额',
            starterCode: '# 透视表\npivot_df = df.pivot_table(\n    values=\'sales\',\n    index=\'month\',\n    columns=\'category\',\n    aggfunc=\'sum\',\n    fill_value=0\n).round(2)\n\nprint("\\n透视表（月份 vs 类别）:")\nprint(pivot_df)',
            datasetGeneratorCode: 'import pandas as pd\nimport numpy as np\nfrom datetime import datetime, timedelta\n\nnp.random.seed(42)\n\nn_records = 1000\n\n# 生成日期\nstart_date = datetime(2024, 1, 1)\ndates = [start_date + timedelta(days=np.random.randint(0, 90)) for _ in range(n_records)]\n\n# 生成数据\ncategories = np.random.choice([\'电子产品\', \'服装\', \'食品\', \'家居\', \'美妆\'], n_records)\nquantities = np.random.randint(1, 5, n_records)\n\n# 根据类别设置价格基准\nprice_base = {\n    \'电子产品\': 2000,\n    \'服装\': 300,\n    \'食品\': 100,\n    \'家居\': 500,\n    \'美妆\': 200\n}\n\nsales = []\nfor cat, qty in zip(categories, quantities):\n    base = price_base[cat]\n    sale = base * qty * np.random.normal(1, 0.2)\n    sales.append(round(sale, 2))\n\n# 创建DataFrame\ndf = pd.DataFrame({\n    \'order_date\': dates,\n    \'category\': categories,\n    \'quantity\': quantities,\n    \'sales\': sales\n})\n\ndf[\'order_date\'] = pd.to_datetime(df[\'order_date\'])\ndf[\'month\'] = df[\'order_date\'].dt.to_period(\'M\')\n\n# 保存文件\ndf.to_csv(\'ecommerce_sales.csv\', index=False, encoding=\'utf-8-sig\')\nprint(f"电商销售记录已生成，共 {len(df)} 条记录")',
            hints: [
              '使用 pivot_table() 函数创建透视表',
              '设置 values 参数为需要汇总的列',
              '设置 index 参数为行索引',
              '设置 columns 参数为列索引',
              '使用 fill_value=0 填充缺失值'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-3',
    title: '数据合并与连接',
    description: '学习使用merge、concat等工具进行数据合并',
    difficulty: '中级',
    category: '进阶技能',
    coverColor: 'bg-purple-100',
    projectId: 'project-3',
    chapters: [
      {
        id: 'ch-3-1',
        title: '数据合并基础',
        description: '学习使用merge进行数据合并',
        content: `
# 数据合并基础

数据合并是数据分析中的重要操作，它允许我们将来自不同来源的数据整合在一起进行分析。

## 核心概念

1. **连接键 (on)**：用于匹配两个数据集的列
2. **连接类型 (how)**：
   - inner: 内连接，只保留两边都有的记录
   - left: 左连接，保留左表所有记录
   - right: 右连接，保留右表所有记录
   - outer: 外连接，保留两边所有记录

3. **重复列处理**：当两个表有相同列名时的处理方法

## 实践技巧

- 确保连接键的数据类型一致
- 对于大型数据集，考虑使用索引进行连接以提高性能
- 注意连接后的重复列，使用suffixes参数处理
- 对于多对多连接，要注意结果的行数膨胀
        `,
        exercises: [
          {
            id: 'ex-3-1-1',
            title: '合并订单与用户信息',
            description: '用 merge 将订单与用户信息合并（按 user_id）',
            starterCode: 'import pandas as pd\nimport numpy as np\n\n# 读取数据\norders = pd.read_csv(\'orders.csv\')\ncustomers = pd.read_csv(\'customers.csv\')\n\nprint("订单数据:")\nprint(orders.head())\nprint("\\n用户数据:")\nprint(customers.head())\n\n# 合并订单与用户\norders_customers = pd.merge(\n    orders,\n    customers,\n    on=\'user_id\',\n    how=\'left\'\n)\n\nprint("\\n合并后（订单+用户）:")\nprint(orders_customers.head())',
            datasetGeneratorCode: 'import pandas as pd\nimport numpy as np\nfrom datetime import datetime, timedelta\n\nnp.random.seed(42)\n\n# 生成用户数据\nn_customers = 200\ncustomers = pd.DataFrame({\n    \'user_id\': range(10000, 10000 + n_customers),\n    \'name\': [f"用户{i}" for i in range(n_customers)],\n    \'region\': np.random.choice([\'北京\', \'上海\', \'广州\', \'深圳\', \'杭州\'], n_customers),\n    \'level\': np.random.choice([\'普通\', \'黄金\', \'白金\'], n_customers, p=[0.6, 0.3, 0.1])\n})\n\n# 生成订单数据\nn_orders = 1000\norders = pd.DataFrame({\n    \'order_id\': [f"ORD{i:05d}" for i in range(1, n_orders + 1)],\n    \'user_id\': np.random.choice(customers[\'user_id\'], n_orders),\n    \'amount\': np.random.normal(2000, 800, n_orders).clip(100, 10000),\n    \'order_date\': [datetime(2024, 1, 1) + timedelta(days=np.random.randint(0, 90)) for _ in range(n_orders)]\n})\n\n# 保存文件\ncustomers.to_csv(\'customers.csv\', index=False, encoding=\'utf-8-sig\')\norders.to_csv(\'orders.csv\', index=False, encoding=\'utf-8-sig\')\nprint("数据文件已生成: customers.csv, orders.csv")',
            hints: [
              '使用 pd.read_csv() 读取两个数据文件',
              '使用 pd.merge() 进行数据合并',
              '设置 on=\'user_id\' 作为连接键',
              '使用 how=\'left\' 保留所有订单记录'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-4',
    title: 'apply与自定义函数',
    description: '使用apply和自定义函数处理数据',
    difficulty: '中级',
    category: '进阶技能',
    coverColor: 'bg-yellow-100',
    projectId: 'project-4',
    chapters: [
      {
        id: 'ch-4-1',
        title: 'apply函数基础',
        description: '学习使用apply函数处理数据',
        content: `
# apply函数基础

apply函数是pandas中非常强大的工具，它允许我们对DataFrame的行或列应用自定义函数。

## 核心概念

1. **轴的概念**：
   - axis=0 或 axis='index'：对每列应用函数
   - axis=1 或 axis='columns'：对每行应用函数

2. **lambda函数**：简洁的匿名函数，适合简单操作
3. **自定义函数**：复杂逻辑的封装

## 应用场景

- **数据转换**：将现有列转换为新值
- **特征工程**：基于现有数据创建新特征
- **复杂条件判断**：处理复杂的业务逻辑
- **数据清洗**：处理特殊格式的数据

## 性能考虑

- apply函数比向量化操作慢，对于大型数据集要谨慎使用
- 对于简单操作，优先使用向量化方法
- 对于复杂逻辑，apply函数提供了灵活性
        `,
        exercises: [
          {
            id: 'ex-4-1-1',
            title: '计算工作时长',
            description: '写函数计算工作时长（下班 - 上班，处理跨天情况）',
            starterCode: 'import pandas as pd\nimport numpy as np\nfrom datetime import datetime, time\n\n# 读取数据\ndf = pd.read_csv(\'attendance.csv\')\nprint("打卡记录数据:")\nprint(df.head())\n\n# 转换时间列\ndf[\'check_in\'] = pd.to_datetime(df[\'check_in\'], format=\'%H:%M\').dt.time\ndf[\'check_out\'] = pd.to_datetime(df[\'check_out\'], format=\'%H:%M\').dt.time\n\n# 计算工作时长函数\ndef calculate_work_hours(check_in, check_out):\n    in_time = datetime.combine(datetime.today(), check_in)\n    out_time = datetime.combine(datetime.today(), check_out)\n    \n    # 处理跨天情况\n    if out_time < in_time:\n        out_time = out_time + pd.Timedelta(days=1)\n    \n    duration = (out_time - in_time).total_seconds() / 3600\n    return round(duration, 2)\n\n# 用 apply 应用函数\ndf[\'work_hours\'] = df.apply(lambda row: calculate_work_hours(row[\'check_in\'], row[\'check_out\']), axis=1)\n\nprint("\\n添加工作时长后:")\nprint(df.head())',
            datasetGeneratorCode: 'import pandas as pd\nimport numpy as np\nfrom datetime import datetime, time, timedelta\n\nnp.random.seed(42)\n\nn_records = 100\n\n# 生成员工姓名\nnames = [f"员工{i}" for i in range(1, 21)]\nemployee_names = np.random.choice(names, n_records)\n\n# 生成日期\nstart_date = datetime(2024, 3, 1)\ndates = [start_date + timedelta(days=i % 30) for i in range(n_records)]\n\n# 生成打卡时间\ndef generate_time(base_hour, base_minute, std_hour=0.5):\n    hour = int(base_hour + np.random.normal(0, std_hour))\n    minute = np.random.randint(0, 60)\n    hour = max(0, min(23, hour))\n    return time(hour, minute)\n\ncheck_ins = []\ncheck_outs = []\n\nfor _ in range(n_records):\n    # 上班时间\n    if np.random.random() < 0.2:\n        ci = generate_time(9, 30, 1)  # 迟到\n    else:\n        ci = generate_time(8, 30, 0.5)  # 正常\n    \n    # 下班时间\n    if np.random.random() < 0.1:\n        co = generate_time(2, 0, 0.5)  # 跨天\n    else:\n        co = generate_time(18, 30, 1)  # 正常\n    \n    check_ins.append(ci)\n    check_outs.append(co)\n\n# 创建 DataFrame\ndf = pd.DataFrame({\n    \'name\': employee_names,\n    \'date\': dates,\n    \'check_in\': [t.strftime(\'%H:%M\') for t in check_ins],\n    \'check_out\': [t.strftime(\'%H:%M\') for t in check_outs]\n})\n\n# 保存文件\ndf.to_csv(\'attendance.csv\', index=False, encoding=\'utf-8-sig\')\nprint(f"员工打卡记录已生成，共 {len(df)} 条记录")',
            hints: [
              '使用 pd.to_datetime() 转换时间列',
              '创建 calculate_work_hours 函数计算工作时长',
              '处理跨天情况',
              '使用 apply() 函数应用自定义函数'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-5',
    title: '数据可视化',
    description: '使用matplotlib和seaborn创建各种图表',
    difficulty: '中级',
    category: '进阶技能',
    coverColor: 'bg-red-100',
    projectId: 'project-5',
    chapters: [
      {
        id: 'ch-5-1',
        title: 'Matplotlib基础',
        description: '学习使用Matplotlib创建基础图表',
        content: `
# Matplotlib基础

Matplotlib是Python中最常用的数据可视化库，它提供了丰富的图表类型和高度的自定义能力。

## 核心概念

1. **Figure**：整个图表窗口
2. **Axes**：图表中的绘图区域
3. **Plot**：具体的图形元素

## 常用图表类型

- **折线图**：展示数据随时间的变化趋势
- **柱状图**：比较不同类别的数据大小
- **散点图**：展示两个变量之间的关系
- **直方图**：展示数据的分布情况
- **箱线图**：展示数据的统计分布特征

## 实践技巧

- 设置中文字体以支持中文显示
- 调整图表大小、标题、坐标轴标签等元素
- 使用grid()添加网格线提高可读性
- 合理使用颜色和样式区分不同数据系列
- 为图表添加图例
        `,
        exercises: [
          {
            id: 'ex-5-1-1',
            title: '画折线图',
            description: '画折线图：日最高温变化趋势（用 matplotlib）',
            starterCode: 'import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\nimport seaborn as sns\n\n# 设置中文字体\nplt.rcParams[\'font.sans-serif\'] = [\'WenQuanYi Zen Hei\', \'Microsoft YaHei\', \'SimHei\']\nplt.rcParams[\'axes.unicode_minus\'] = False\n\n# 读取数据\ndf = pd.read_csv(\'weather_data.csv\')\ndf[\'date\'] = pd.to_datetime(df[\'date\'])\n\nprint("天气数据:")\nprint(df.head())\n\n# 画折线图：日最高温\nplt.figure(figsize=(14, 6))\nplt.plot(df[\'date\'], df[\'temp_high\'], marker=\'o\', linestyle=\'-, linewidth=2, markersize=4, alpha=0.7, label=\'最高温\')\nplt.plot(df[\'date\'], df[\'temp_low\'], marker=\'s\', linestyle=\'--\', linewidth=2, markersize=4, alpha=0.7, label=\'最低温\')\nplt.title(\'日温度变化趋势\', fontsize=16)\nplt.xlabel(\'日期\', fontsize=12)\nplt.ylabel(\'温度 (°C)\', fontsize=12)\nplt.legend(fontsize=12)\nplt.grid(True, alpha=0.3)\nplt.xticks(rotation=45)\nplt.tight_layout()\nplt.show()',
            datasetGeneratorCode: 'import pandas as pd\nimport numpy as np\nfrom datetime import datetime, timedelta\n\nnp.random.seed(42)\n\n# 生成90天的天气数据\nn_days = 90\nstart_date = datetime(2024, 1, 1)\ndates = [start_date + timedelta(days=i) for i in range(n_days)]\n\n# 生成温度（季节性变化 + 随机波动）\nday_of_year = np.arange(n_days)\ntemp_high_base = 15 + 10 * np.sin(2 * np.pi * (day_of_year - 60) / 365)\ntemp_low_base = 5 + 8 * np.sin(2 * np.pi * (day_of_year - 60) / 365)\n\ntemp_high = temp_high_base + np.random.normal(0, 3, n_days)\ntemp_low = temp_low_base + np.random.normal(0, 2, n_days)\n\n# 生成降雨量（大部分0，偶尔下雨）\nrainfall = np.zeros(n_days)\nrain_days = np.random.choice(n_days, size=int(n_days * 0.3), replace=False)\nrainfall[rain_days] = np.random.exponential(10, size=len(rain_days)).clip(0, 50)\n\n# 生成风速\nwind_speed = np.random.uniform(0, 15, n_days)\n\n# 创建 DataFrame\ndf = pd.DataFrame({\n    \'date\': dates,\n    \'temp_high\': temp_high.round(1),\n    \'temp_low\': temp_low.round(1),\n    \'rainfall\': rainfall.round(1),\n    \'wind_speed\': wind_speed.round(1)\n})\n\n# 保存文件\ndf.to_csv(\'weather_data.csv\', index=False, encoding=\'utf-8-sig\')\nprint(f"天气记录已生成，共 {len(df)} 天数据")',
            hints: [
              '设置中文字体以支持中文显示',
              '使用 plt.figure() 设置图表大小',
              '使用 plt.plot() 绘制折线图',
              '添加标题、坐标轴标签和图例',
              '使用 plt.show() 显示图表'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-6',
    title: '时间序列处理',
    description: '处理和分析时间序列数据',
    difficulty: '高级',
    category: '高级技能',
    coverColor: 'bg-indigo-100',
    projectId: 'project-6',
    chapters: [
      {
        id: 'ch-6-1',
        title: '时间序列基础',
        description: '学习时间序列数据的基本处理方法',
        content: `
# 时间序列基础

时间序列是按时间顺序排列的数据，在金融、气象、销售等领域有广泛应用。

## 核心概念

1. **日期索引**：将日期作为DataFrame的索引
2. **重采样 (resample)**：将时间序列数据转换为不同的时间频率
3. **移动平均**：平滑时间序列数据，识别趋势
4. **滞后值**：获取前一期或前几期的值
5. **差分**：计算相邻时间点的差值

## 常用操作

- **时间范围查询**：根据日期范围筛选数据
- **频率转换**：如日数据转月数据、周数据
- **滚动窗口**：计算移动统计量
- **时间特征提取**：提取年、月、日、星期等特征

## 实践技巧

- 确保日期列的类型正确（datetime64）
- 使用日期索引提高查询和处理效率
- 注意时间序列的频率一致性
- 处理时间序列中的缺失值和异常值
        `,
        exercises: [
          {
            id: 'ex-6-1-1',
            title: '日期索引与重采样',
            description: '将日期设为索引，按周重采样计算每周均价',
            starterCode: 'import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\n\n# 设置中文字体\nplt.rcParams[\'font.sans-serif\'] = [\'WenQuanYi Zen Hei\', \'Microsoft YaHei\', \'SimHei\']\nplt.rcParams[\'axes.unicode_minus\'] = False\n\n# 读取数据\ndf = pd.read_csv(\'stock_data.csv\')\ndf[\'date\'] = pd.to_datetime(df[\'date\'])\n\n# 将日期设为索引\ndf.set_index(\'date\', inplace=True)\n\nprint("股票数据:")\nprint(df.head())\nprint(f"\\n数据时间范围: {df.index.min()} 到 {df.index.max()}")\n\n# 按周重采样\nweekly = df.resample(\'W\').mean()\n\nprint("\\n周均价数据:")\nprint(weekly.head())',
            datasetGeneratorCode: 'import pandas as pd\nimport numpy as np\nfrom datetime import datetime, timedelta\n\nnp.random.seed(42)\n\n# 生成60个交易日的数据\nn_days = 60\nstart_date = datetime(2024, 1, 1)\n\n# 生成日期（跳过周末）\ndates = []\ncurrent_date = start_date\nwhile len(dates) < n_days:\n    if current_date.weekday() < 5:  # 0-4 是周一到周五\n        dates.append(current_date)\n    current_date += timedelta(days=1)\n\n# 生成价格（带趋势的随机游走）\nbase_price = 100\nprices = [base_price]\n\nfor _ in range(1, n_days):\n    # 带轻微上升趋势的随机变动\n    change = np.random.normal(0.001, 0.02)\n    new_price = prices[-1] * (1 + change)\n    prices.append(new_price)\n\nprices = np.array(prices)\n\n# 生成 OHLC 数据\nopen_prices = prices * (1 + np.random.normal(0, 0.005, n_days))\nhigh_prices = np.maximum(prices, open_prices) * (1 + np.random.uniform(0, 0.01, n_days))\nlow_prices = np.minimum(prices, open_prices) * (1 - np.random.uniform(0, 0.01, n_days))\nclose_prices = prices\nvolumes = np.random.randint(100000, 1000000, n_days)\n\n# 创建 DataFrame\ndf = pd.DataFrame({\n    \'date\': dates,\n    \'open\': open_prices.round(2),\n    \'high\': high_prices.round(2),\n    \'low\': low_prices.round(2),\n    \'close\': close_prices.round(2),\n    \'volume\': volumes\n})\n\n# 保存文件\ndf.to_csv(\'stock_data.csv\', index=False, encoding=\'utf-8-sig\')\nprint(f"股票日线数据已生成，共 {len(df)} 个交易日")',
            hints: [
              '使用 pd.to_datetime() 转换日期列',
              '使用 set_index() 将日期设为索引',
              '使用 resample(\'W\') 按周重采样',
              '使用 mean() 计算每周平均值'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-7',
    title: '字符串与文本处理',
    description: '使用str方法和正则表达式处理文本数据',
    difficulty: '中级',
    category: '进阶技能',
    coverColor: 'bg-pink-100',
    projectId: 'project-7',
    chapters: [
      {
        id: 'ch-7-1',
        title: '字符串方法基础',
        description: '学习使用pandas的str方法处理文本数据',
        content: `
# 字符串方法基础

pandas提供了丰富的字符串处理方法，通过.str访问器可以对文本数据进行各种操作。

## 核心方法

1. **基本操作**：
   - str.lower() / str.upper()：大小写转换
   - str.strip()：去除首尾空白
   - str.split()：分割字符串
   - str.replace()：替换字符串

2. **模式匹配**：
   - str.contains()：检查是否包含子串
   - str.startswith() / str.endswith()：检查开头/结尾
   - str.match()：使用正则表达式匹配

3. **提取操作**：
   - str.extract()：提取匹配的内容
   - str.findall()：查找所有匹配项

## 应用场景

- **数据清洗**：处理不规则的文本数据
- **特征提取**：从文本中提取有价值的信息
- **模式识别**：识别特定格式的数据（如手机号、邮箱等）
- **文本分类**：基于文本内容进行分类

## 实践技巧

- 注意处理缺失值，使用na参数
- 对于复杂模式，使用正则表达式
- 结合apply函数处理更复杂的文本逻辑
- 注意性能问题，避免在大型数据集上使用过于复杂的字符串操作
        `,
        exercises: [
          {
            id: 'ex-7-1-1',
            title: '提取中文字符',
            description: '用 str 方法提取昵称中的中文字符',
            starterCode: 'import pandas as pd\nimport numpy as np\nimport re\n\n# 读取数据\ndf = pd.read_csv(\'user_reviews.csv\')\n\nprint("用户评论数据:")\nprint(df.head())\n\n# 提取昵称中的中文字符\ndef extract_chinese(text):\n    if pd.isna(text):\n        return \'\'\n    chinese_chars = re.findall(r\'[\\u4e00-\\u9fff]+\', str(text))\n    return \'\'.join(chinese_chars)\n\ndf[\'nickname_chinese\'] = df[\'nickname\'].apply(extract_chinese)\n\nprint("\\n提取中文字符后:")\nprint(df[[\'nickname\', \'nickname_chinese\']].head(10))',
            datasetGeneratorCode: 'import pandas as pd\nimport numpy as np\n\nnp.random.seed(42)\n\nn_reviews = 200\n\n# 生成评论ID\nreview_ids = [f"REV{i:05d}" for i in range(1, n_reviews + 1)]\nuser_ids = np.random.randint(1000, 9999, n_reviews)\n\n# 生成昵称（混合中英文）\nnickname_prefixes = [\'开心\', \'快乐\', \'小明\', \'小红\', \'购物达人\', \'超级买家\', \'user\', \'customer\', \'vip\', \'member\']\nnickname_suffixes = [\'123\', \'_abc\', \'-xyz\', \'888\', \'666\', \'\', \'王\', \'李\', \'张\']\nnicknames = []\nfor _ in range(n_reviews):\n    prefix = np.random.choice(nickname_prefixes)\n    suffix = np.random.choice(nickname_suffixes)\n    nicknames.append(f"{prefix}{suffix}")\n\n# 生成评论文本\nbase_reviews = [\n    "商品质量很好，非常满意！",\n    "物流速度快，包装完好。",\n    "差强人意，有些小问题。",\n    "退货很方便，客服态度好。",\n    "价格实惠，值得购买。",\n    "一般般，没有想象的好。",\n    "推荐购买，物超所值！",\n    "太差了，不会再买。",\n    "已经推荐给朋友了。"\n]\n\nreviews = []\nfor _ in range(n_reviews):\n    base = np.random.choice(base_reviews)\n    # 随机添加一些修饰\n    extra = np.random.choice([\'真的\', \'非常\', \'特别\', \'\'], p=[0.1, 0.1, 0.1, 0.7])\n    reviews.append(f"{extra}{base}")\n\n# 生成评分\nratings = np.random.choice([1, 2, 3, 4, 5], n_reviews, p=[0.1, 0.1, 0.2, 0.3, 0.3])\n\n# 创建 DataFrame\ndf = pd.DataFrame({\n    \'review_id\': review_ids,\n    \'user_id\': user_ids,\n    \'nickname\': nicknames,\n    \'review_text\': reviews,\n    \'rating\': ratings\n})\n\n# 保存文件\ndf.to_csv(\'user_reviews.csv\', index=False, encoding=\'utf-8-sig\')\nprint(f"用户评论表已生成，共 {len(df)} 条记录")',
            hints: [
              '使用 re.findall() 配合正则表达式提取中文字符',
              '使用 apply() 函数应用自定义函数',
              '处理可能的缺失值',
              '使用 join() 连接提取的中文字符'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-8',
    title: 'NumPy向量化运算',
    description: '掌握NumPy向量化计算技巧',
    difficulty: '高级',
    category: '高级技能',
    coverColor: 'bg-green-100',
    projectId: 'project-8',
    chapters: [
      {
        id: 'ch-8-1',
        title: 'NumPy基础',
        description: '学习NumPy数组的基本操作',
        content: `
# NumPy基础

NumPy是Python中用于科学计算的核心库，它提供了高效的多维数组操作和数学函数。

## 核心概念

1. **ndarray**：NumPy的核心数据结构，多维数组
2. **向量化**：对整个数组进行操作，而不是逐个元素
3. **广播**：不同形状数组之间的算术运算
4. **索引与切片**：灵活的数组访问方式

## 优势

- **性能**：C语言实现，比Python列表快10-100倍
- **内存**：更高效的内存使用
- **功能**：丰富的数学函数和线性代数操作
- **集成**：与pandas等库无缝集成

## 常用操作

- **数组创建**：np.array(), np.zeros(), np.ones(), np.random.*
- **数组操作**：reshape(), concatenate(), split()
- **数学函数**：np.sin(), np.cos(), np.exp(), np.log()
- **统计函数**：np.mean(), np.std(), np.median(), np.sum()
- **逻辑操作**：np.where(), np.logical_and(), np.logical_or()

## 实践技巧

- 尽量使用向量化操作代替循环
- 注意数组形状和数据类型
- 使用视图（view）避免不必要的数据复制
- 利用广播简化代码
        `,
        exercises: [
          {
            id: 'ex-8-1-1',
            title: '生成随机数组',
            description: '用 numpy 生成随机数组：正态分布、均匀分布各一个',
            starterCode: 'import numpy as np\nimport pandas as pd\nimport time\n\n# 设置随机种子\nnp.random.seed(42)\n\n# 生成正态分布数组\nnormal_array = np.random.normal(loc=0, scale=1, size=10000)\nprint("正态分布数组:")\nprint(f"形状: {normal_array.shape}")\nprint(f"均值: {normal_array.mean():.4f}")\nprint(f"标准差: {normal_array.std():.4f}")\nprint(f"前5个值: {normal_array[:5]}")\n\n# 生成均匀分布数组\nuniform_array = np.random.uniform(low=0, high=10, size=10000)\nprint("\\n均匀分布数组:")\nprint(f"形状: {uniform_array.shape}")\nprint(f"最小值: {uniform_array.min():.4f}")\nprint(f"最大值: {uniform_array.max():.4f}")\nprint(f"均值: {uniform_array.mean():.4f}")\nprint(f"前5个值: {uniform_array[:5]}")',
            datasetGeneratorCode: 'import numpy as np\nimport pandas as pd\n\nnp.random.seed(42)\n\n# 生成正态分布数据\nnormal_data = np.random.normal(loc=0, scale=1, size=(1000, 5))\ndf_normal = pd.DataFrame(normal_data, columns=[\'f1\', \'f2\', \'f3\', \'f4\', \'f5\'])\n\n# 生成均匀分布数据\nuniform_data = np.random.uniform(low=0, high=100, size=(1000, 3))\ndf_uniform = pd.DataFrame(uniform_data, columns=[\'a\', \'b\', \'c\'])\n\n# 保存文件\ndf_normal.to_csv(\'numpy_data_normal.csv\', index=False)\ndf_uniform.to_csv(\'numpy_data_uniform.csv\', index=False)\nprint("NumPy 模拟数据已生成")',
            hints: [
              '使用 np.random.seed() 设置随机种子确保可重复性',
              '使用 np.random.normal() 生成正态分布数组',
              '使用 np.random.uniform() 生成均匀分布数组',
              '使用 mean()、std()、min()、max() 等方法计算统计量'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-9',
    title: '性能优化与向量化',
    description: '学习性能优化技巧，对比不同方法效率',
    difficulty: '高级',
    category: '高级技能',
    coverColor: 'bg-orange-100',
    projectId: 'project-9',
    chapters: [
      {
        id: 'ch-9-1',
        title: '性能对比',
        description: '对比不同方法的性能差异',
        content: `
# 性能对比

在数据分析中，性能是一个重要考虑因素，特别是处理大型数据集时。不同的实现方法可能会有巨大的性能差异。

## 常用方法对比

1. **for 循环**：最直观但最慢
2. **apply 函数**：比for循环快，但仍不如向量化
3. **向量化操作**：最快，利用底层C实现
4. **eval/query**：处理复杂条件时的高效选择

## 性能优化技巧

1. **使用向量化操作**：优先使用pandas和NumPy的向量化函数
2. **避免链式操作中的中间对象**：使用方法链或赋值减少临时对象
3. **合理使用数据类型**：如category类型减少内存使用
4. **分块处理**：对于超大文件，使用chunksize分块读取
5. **缓存计算结果**：避免重复计算

## 实践建议

- 对于小数据集，代码可读性可能比性能更重要
- 对于大数据集，性能优化是必要的
- 使用time模块或专业的性能分析工具评估不同方法
- 了解pandas和NumPy的内部实现原理，避免性能陷阱
        `,
        exercises: [
          {
            id: 'ex-9-1-1',
            title: '方法性能对比',
            description: '用 time 模块对比：for 循环 vs apply vs 向量化（计算折扣后价格）',
            starterCode: 'import pandas as pd\nimport numpy as np\nimport time\n\nnp.random.seed(42)\n\n# 生成大数据\nn = 100000\ndf = pd.DataFrame({\n    \'price\': np.random.uniform(10, 1000, n),\n    \'discount\': np.random.uniform(0, 0.3, n)\n})\n\nprint(f"数据大小: {n} 条")\n\n# 方法1：for 循环\nstart = time.time()\nresult1 = []\nfor i in range(len(df)):\n    result1.append(df.loc[i, \'price\'] * (1 - df.loc[i, \'discount\']))\nend = time.time()\ntime1 = end - start\nprint(f"\\n方法1 - for 循环: {time1:.4f} 秒")\n\n# 方法2：apply\nstart = time.time()\nresult2 = df.apply(lambda row: row[\'price\'] * (1 - row[\'discount\']), axis=1)\nend = time.time()\ntime2 = end - start\nprint(f"方法2 - apply: {time2:.4f} 秒 (加速 {time1/time2:.1f}x)")\n\n# 方法3：向量化\nstart = time.time()\nresult3 = df[\'price\'] * (1 - df[\'discount\'])\nend = time.time()\ntime3 = end - start\nprint(f"方法3 - 向量化: {time3:.4f} 秒 (加速 {time1/time3:.1f}x)")\n\n# 验证结果一致\nprint(f"\\n结果一致性验证:")\nprint(f"方法1和2一致: {np.allclose(result1, result2)}")\nprint(f"方法1和3一致: {np.allclose(result1, result3)}")',
            datasetGeneratorCode: 'import pandas as pd\nimport numpy as np\n\nnp.random.seed(42)\n\n# 生成性能测试数据\nn = 100000\ndf_perf = pd.DataFrame({\n    \'price\': np.random.uniform(10, 1000, n),\n    \'quantity\': np.random.randint(1, 100, n),\n    \'discount\': np.random.uniform(0, 0.3, n)\n})\n\n# 保存文件\ndf_perf.to_csv(\'performance_data.csv\', index=False)\nprint(f"性能测试数据已生成，共 {len(df_perf)} 条记录")',
            hints: [
              '使用 time.time() 记录开始和结束时间',
              '实现三种不同的方法：for循环、apply、向量化',
              '使用 np.allclose() 验证结果一致性',
              '计算加速比以对比性能差异'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-10',
    title: '完整数据分析流水线',
    description: '综合应用所有技巧，完成完整的数据分析项目',
    difficulty: '高级',
    category: '高级技能',
    coverColor: 'bg-blue-100',
    projectId: 'project-10',
    chapters: [
      {
        id: 'ch-10-1',
        title: '探索性数据分析',
        description: '学习如何进行完整的探索性数据分析',
        content: `
# 探索性数据分析 (EDA)

探索性数据分析是数据分析的第一步，它帮助我们了解数据的基本特征、发现模式和异常，为后续的分析和建模做准备。

## EDA的主要步骤

1. **数据概览**：了解数据的基本信息，如形状、数据类型、缺失值等
2. **单变量分析**：分析每个变量的分布、统计特征
3. **多变量分析**：分析变量之间的关系和相关性
4. **异常值检测**：识别数据中的异常值
5. **数据质量评估**：评估数据的完整性和可靠性

## 常用技术

- **描述性统计**：使用describe()获取基本统计信息
- **数据可视化**：使用各种图表展示数据特征
- **相关性分析**：使用相关系数矩阵和热力图
- **分组分析**：按不同维度分组分析数据

## EDA的重要性

- **数据理解**：深入了解数据的结构和特征
- **问题发现**：提前发现数据质量问题
- **假设生成**：基于数据提出合理的假设
- **分析指导**：为后续的分析和建模提供指导
- **结果验证**：验证分析结果的合理性

## 实践建议

- 系统性地进行EDA，不要跳过任何步骤
- 结合统计方法和可视化技术
- 记录分析过程和发现
- 基于EDA结果调整分析策略
        `,
        exercises: [
          {
            id: 'ex-10-1-1',
            title: '完整 EDA',
            description: '完成完整 EDA：缺失值、异常值、分布、相关性',
            starterCode: 'import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\nimport seaborn as sns\n\n# 设置中文字体\nplt.rcParams[\'font.sans-serif\'] = [\'WenQuanYi Zen Hei\', \'Microsoft YaHei\', \'SimHei\']\nplt.rcParams[\'axes.unicode_minus\'] = False\n\n# 读取数据\ndf = pd.read_csv(\'churn_data.csv\')\n\nprint("="*60)\nprint("完整探索性数据分析 (EDA)")\nprint("="*60)\n\nprint("\\n1. 数据概览:")\nprint(f"数据形状: {df.shape}")\nprint("\\n数据类型:")\nprint(df.dtypes)\nprint("\\n前5行:")\nprint(df.head())\nprint("\\n统计描述:")\nprint(df.describe(include=\'all\'))\n\nprint("\\n2. 缺失值分析:")\nmissing = df.isnull().sum()\nmissing_pct = (missing / len(df)) * 100\nmissing_df = pd.DataFrame({\'缺失数\': missing, \'缺失率(%)\': missing_pct.round(2)})\nprint(missing_df[missing_df[\'缺失数\'] > 0] if missing.sum() > 0 else "无缺失值")\n\nprint("\\n3. 目标变量分析:")\nif \'churn\' in df.columns:\n    churn_dist = df[\'churn\'].value_counts(normalize=True) * 100\n    print(churn_dist)\n    \n    plt.figure(figsize=(8, 5))\n    churn_dist.plot(kind=\'bar\')\n    plt.title(\'用户流失分布\')\n    plt.ylabel(\'百分比 (%)\')\n    plt.tight_layout()\n    plt.show()\n\nprint("\\n4. 数值变量分布:")\nnumeric_cols = df.select_dtypes(include=[np.number]).columns\nprint(f"数值列: {list(numeric_cols)}")\n\nif len(numeric_cols) > 0:\n    fig, axes = plt.subplots(2, min(3, len(numeric_cols)//2 + 1), figsize=(15, 10))\n    axes = axes.ravel()\n    for i, col in enumerate(numeric_cols[:min(6, len(numeric_cols))]):\n        axes[i].hist(df[col].dropna(), bins=30, edgecolor=\'black\', alpha=0.7)\n        axes[i].set_title(f\'{col} 分布\')\n    plt.tight_layout()\n    plt.show()\n\nprint("\\n5. 相关性分析:")\nif len(numeric_cols) > 1:\n    corr_matrix = df[numeric_cols].corr()\n    print("相关系数矩阵:")\n    print(corr_matrix.round(2))\n    \n    plt.figure(figsize=(10, 8))\n    sns.heatmap(corr_matrix, annot=True, cmap=\'coolwarm\', center=0, fmt=\'.2f\')\n    plt.title(\'特征相关性热力图\')\n    plt.tight_layout()\n    plt.show()',
            datasetGeneratorCode: 'import pandas as pd\nimport numpy as np\n\nnp.random.seed(42)\n\n# 生成银行客户流失数据\nn_customers = 1000\n\n# 生成特征\ncustomer_ids = [f"CUST{i:06d}" for i in range(1, n_customers + 1)]\nage = np.random.randint(18, 70, n_customers)\ntenure = np.random.randint(0, 60, n_customers)  # 月数\nincome = np.random.normal(5000, 1500, n_customers).clip(2000, 15000)\ncredit_score = np.random.randint(300, 850, n_customers)\nproducts_count = np.random.randint(1, 5, n_customers)\nis_active = np.random.choice([0, 1], n_customers, p=[0.3, 0.7])\nbalance = np.random.normal(10000, 5000, n_customers).clip(0, 50000)\n\n# 生成流失标签（基于特征的规则）\nrisk_score = (\n    (tenure < 6).astype(int) * 3 +\n    (income < 4000).astype(int) * 2 +\n    (credit_score < 600).astype(int) * 2 +\n    (is_active == 0).astype(int) * 2\n)\n\nchurn_prob = 1 / (1 + np.exp(-(risk_score - 5)))\nchurn = (np.random.random(n_customers) < churn_prob).astype(int)\n\n# 创建 DataFrame\ndf = pd.DataFrame({\n    \'customer_id\': customer_ids,\n    \'age\': age,\n    \'tenure\': tenure,\n    \'income\': income.round(2),\n    \'credit_score\': credit_score,\n    \'products_count\': products_count,\n    \'is_active\': is_active,\n    \'balance\': balance.round(2),\n    \'churn\': churn\n})\n\n# 引入一些缺失值\nfor col in [\'income\', \'credit_score\', \'balance\']:\n    mask = np.random.random(n_customers) < 0.05\n    df.loc[mask, col] = np.nan\n\n# 保存文件\ndf.to_csv(\'churn_data.csv\', index=False, encoding=\'utf-8-sig\')\nprint(f"银行客户流失数据已生成，共 {len(df)} 条记录")\nprint(f"流失率: {df[\'churn\'].mean()*100:.2f}%")',
            hints: [
              '使用 df.shape, df.dtypes, df.head() 查看数据基本信息',
              '使用 df.isnull().sum() 检查缺失值',
              '使用 value_counts() 分析目标变量分布',
              '使用 hist() 绘制数值变量分布',
              '使用 corr() 和 heatmap() 分析变量相关性'
            ]
          }
        ]
      }
    ]
  }
]

export const getCourseById = (id: string): Course | undefined => {
  return courses.find(course => course.id === id);
};
export const getCoursesByCategory = (category: string): Course[] => {
  return courses.filter(course => course.category === category);
};
