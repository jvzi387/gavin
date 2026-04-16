export interface Task {
  id: string;
  title: string;
  description: string;
  starterCode?: string;
  verificationCode?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  tasks: Task[];
  datasetGeneratorCode?: string;
}

export const projects: Project[] = [
  {
    id: 'project-1',
    title: '销售数据分析入门',
    description: '学习如何加载和分析销售数据，掌握基础的数据操作技能',
    difficulty: 'beginner',
    category: '过渡项目',
    tags: ['pandas', '数据加载', '基础统计'],
    tasks: [
      {
        id: 'task-1-1',
        title: '加载销售数据',
        description: '使用pandas读取销售数据CSV文件，查看数据的基本信息',
        starterCode: 'import pandas as pd\n\n# 加载数据\ndf = pd.read_csv(\'sales_data.csv\')\n\n# 显示前5行数据\nprint(df.head())\n\n# 查看数据基本信息\nprint(df.info())',
      },
      {
        id: 'task-1-2',
        title: '计算基础统计指标',
        description: '计算销售额的均值、中位数、最大值和最小值',
        starterCode: '# 计算销售额的统计指标\nmean_sales = df[\'sales\'].mean()\nmedian_sales = df[\'sales\'].median()\nmax_sales = df[\'sales\'].max()\nmin_sales = df[\'sales\'].min()\n\nprint(f"平均销售额: {mean_sales:.2f}")\nprint(f"中位数销售额: {median_sales:.2f}")\nprint(f"最高销售额: {max_sales:.2f}")\nprint(f"最低销售额: {min_sales:.2f}")',
      },
    ],
    datasetGeneratorCode: 'import pandas as pd\nimport numpy as np\n\nnp.random.seed(42)\n\ndates = pd.date_range(start=\'2024-01-01\', end=\'2024-06-30\', freq=\'D\')\nproducts = [\'A\', \'B\', \'C\', \'D\', \'E\']\nregions = [\'华北\', \'华东\', \'华南\', \'华西\']\n\ndata = []\nfor date in dates:\n    for product in products:\n        for region in regions:\n            sales = np.random.randint(100, 5000)\n            quantity = np.random.randint(1, 50)\n            data.append({\n                \'date\': date,\n                \'product\': product,\n                \'region\': region,\n                \'sales\': sales,\n                \'quantity\': quantity\n            })\n\ndf = pd.DataFrame(data)\ndf.to_csv(\'sales_data.csv\', index=False)\nprint("销售数据已生成")',
  },
  {
    id: 'project-2',
    title: '客户数据清洗',
    description: '学习如何处理数据质量问题，包括缺失值和异常值',
    difficulty: 'beginner',
    category: '过渡项目',
    tags: ['数据清洗', '缺失值', '异常值'],
    tasks: [
      {
        id: 'task-2-1',
        title: '识别缺失值',
        description: '检查客户数据中有多少缺失值，分析缺失模式',
        starterCode: 'import pandas as pd\nimport numpy as np\n\n# 加载数据\ndf = pd.read_csv(\'customer_data.csv\')\n\n# 检查缺失值\nprint(df.isnull().sum())\n\n# 可视化缺失值分布\nimport matplotlib.pyplot as plt\nplt.figure(figsize=(12, 6))\ndf.isnull().sum().plot(kind=\'bar\')\nplt.title(\'各列缺失值数量\')\nplt.show()',
      },
      {
        id: 'task-2-2',
        title: '处理缺失值',
        description: '使用合适的方法填充缺失值，确保数据质量',
        starterCode: '# 数值列用中位数填充\nnumeric_cols = df.select_dtypes(include=[np.number]).columns\nfor col in numeric_cols:\n    df[col] = df[col].fillna(df[col].median())\n\n# 分类列用众数填充\ncategorical_cols = df.select_dtypes(include=[\'object\']).columns\nfor col in categorical_cols:\n    df[col] = df[col].fillna(df[col].mode()[0])\n\nprint("缺失值处理完成")\nprint(df.isnull().sum())',
      },
    ],
    datasetGeneratorCode: 'import pandas as pd\nimport numpy as np\n\nnp.random.seed(42)\n\nn_samples = 1000\n\ndata = {\n    \'customer_id\': range(1, n_samples + 1),\n    \'age\': np.random.randint(18, 70, n_samples),\n    \'income\': np.random.normal(8000, 2000, n_samples),\n    \'spending_score\': np.random.randint(1, 100, n_samples),\n    \'gender\': np.random.choice([\'男\', \'女\'], n_samples),\n    \'city\': np.random.choice([\'北京\', \'上海\', \'广州\', \'深圳\'], n_samples),\n    \'membership_level\': np.random.choice([\'普通\', \'黄金\', \'白金\'], n_samples)\n}\n\ndf = pd.DataFrame(data)\n\n# 引入缺失值\nfor col in [\'age\', \'income\', \'gender\', \'city\']:\n    mask = np.random.random(n_samples) < 0.1\n    df.loc[mask, col] = np.nan\n\ndf.to_csv(\'customer_data.csv\', index=False)\nprint("客户数据已生成，包含10%缺失值")',
  },
  {
    id: 'project-3',
    title: '数据可视化实践',
    description: '学习使用matplotlib和seaborn创建各种数据可视化图表',
    difficulty: 'beginner',
    category: '过渡项目',
    tags: ['matplotlib', 'seaborn', '数据可视化'],
    tasks: [
      {
        id: 'task-3-1',
        title: '创建基础图表',
        description: '创建折线图、柱状图和散点图，展示销售趋势',
        starterCode: 'import pandas as pd\nimport matplotlib.pyplot as plt\nimport seaborn as sns\n\n# 设置中文字体\nplt.rcParams[\'font.sans-serif\'] = [\'WenQuanYi Zen Hei\']\nplt.rcParams[\'axes.unicode_minus\'] = False\n\n# 加载数据\ndf = pd.read_csv(\'sales_data.csv\')\n\n# 按日期聚合销售额\ndaily_sales = df.groupby(\'date\')[\'sales\'].sum()\n\n# 创建折线图\nplt.figure(figsize=(12, 6))\ndaily_sales.plot(kind=\'line\', title=\'每日销售趋势\')\nplt.xlabel(\'日期\')\nplt.ylabel(\'销售额\')\nplt.grid(True)\nplt.show()',
      },
      {
        id: 'task-3-2',
        title: '创建复杂可视化',
        description: '创建热力图和箱线图，深入分析数据',
        starterCode: '# 按产品和地区聚合\npivot_sales = df.pivot_table(values=\'sales\', index=\'product\', columns=\'region\', aggfunc=\'sum\')\n\n# 热力图\nplt.figure(figsize=(10, 8))\nsns.heatmap(pivot_sales, annot=True, fmt=\'.0f\', cmap=\'YlOrRd\')\nplt.title(\'各产品在各地区的销售热力图\')\nplt.show()\n\n# 箱线图\nplt.figure(figsize=(12, 6))\nsns.boxplot(x=\'product\', y=\'sales\', data=df)\nplt.title(\'各产品销售额分布\')\nplt.show()',
      },
    ],
    datasetGeneratorCode: 'import pandas as pd\nimport numpy as np\n\nnp.random.seed(42)\n\ndates = pd.date_range(start=\'2024-01-01\', end=\'2024-06-30\', freq=\'D\')\nproducts = [\'A\', \'B\', \'C\', \'D\', \'E\']\nregions = [\'华北\', \'华东\', \'华南\', \'华西\']\n\ndata = []\nfor date in dates:\n    for product in products:\n        for region in regions:\n            sales = np.random.randint(100, 5000)\n            quantity = np.random.randint(1, 50)\n            data.append({\n                \'date\': date,\n                \'product\': product,\n                \'region\': region,\n                \'sales\': sales,\n                \'quantity\': quantity\n            })\n\ndf = pd.DataFrame(data)\ndf.to_csv(\'sales_data.csv\', index=False)\nprint("销售数据已生成")',
  },
  {
    id: 'project-4',
    title: '电商用户行为分析',
    description: '分析电商平台的用户浏览、加购、购买行为，挖掘用户偏好',
    difficulty: 'intermediate',
    category: '电商',
    tags: ['电商', '用户行为', '转化率'],
    tasks: [
      {
        id: 'task-4-1',
        title: '加载和探索数据',
        description: '加载用户行为数据，查看数据结构和基本统计',
        starterCode: 'import pandas as pd\nimport numpy as np\n\n# 加载数据\n# 数据格式：user_id, item_id, behavior_type, category_id, timestamp\ndf = pd.read_csv(\'ecommerce_data.csv\')\n\n# 查看数据基本信息\nprint(df.info())\nprint("\\n行为类型分布:")\nprint(df[\'behavior_type\'].value_counts())\n\n# 行为类型说明：1-浏览，2-加购，3-收藏，4-购买',
      },
      {
        id: 'task-4-2',
        title: '计算用户转化率',
        description: '计算从浏览到加购到购买的转化率，分析用户行为漏斗',
        starterCode: '# 计算各行为的用户数\nuser_behaviors = df.groupby(\'user_id\')[\'behavior_type\'].value_counts().unstack(fill_value=0)\n\n# 定义各阶段\nbrowse_users = user_behaviors[user_behaviors[1] > 0].shape[0]\ncart_users = user_behaviors[user_behaviors[2] > 0].shape[0]\npurchase_users = user_behaviors[user_behaviors[4] > 0].shape[0]\n\nprint(f"浏览用户数: {browse_users}")\nprint(f"加购用户数: {cart_users}")\nprint(f"购买用户数: {purchase_users}")\nprint(f"浏览到加购转化率: {cart_users/browse_users*100:.2f}%")\nprint(f"加购到购买转化率: {purchase_users/cart_users*100:.2f}%")\nprint(f"整体转化率: {purchase_users/browse_users*100:.2f}%")',
      },
    ],
    datasetGeneratorCode: 'import pandas as pd\nimport numpy as np\n\nnp.random.seed(42)\n\nn_users = 10000\nn_items = 1000\nn_categories = 100\nn_records = 100000\n\nuser_ids = np.random.randint(1, n_users + 1, n_records)\nitem_ids = np.random.randint(1, n_items + 1, n_records)\ncategory_ids = np.random.randint(1, n_categories + 1, n_records)\n\n# 行为类型：1-浏览，2-加购，3-收藏，4-购买\n# 浏览占比80%，加购10%，收藏5%，购买5%\nbehavior_types = np.random.choice([1, 2, 3, 4], n_records, p=[0.8, 0.1, 0.05, 0.05])\n\n# 生成时间戳\nstart_date = pd.Timestamp(\'2024-01-01\')\ntimestamps = start_date + pd.to_timedelta(np.random.randint(0, 30*24*3600, n_records), unit=\'s\')\n\ndata = {\n    \'user_id\': user_ids,\n    \'item_id\': item_ids,\n    \'behavior_type\': behavior_types,\n    \'category_id\': category_ids,\n    \'timestamp\': timestamps\n}\n\ndf = pd.DataFrame(data)\ndf.sort_values(\'timestamp\', inplace=True)\ndf.to_csv(\'ecommerce_data.csv\', index=False)\nprint("电商数据已生成")',
  },
  {
    id: 'project-5',
    title: '金融风控分析',
    description: '分析贷款申请人数据，识别高风险客户，降低违约率',
    difficulty: 'intermediate',
    category: '金融',
    tags: ['金融', '风控', '特征工程'],
    tasks: [
      {
        id: 'task-5-1',
        title: '探索风控数据',
        description: '加载贷款数据，分析各特征与违约的关系',
        starterCode: 'import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\nimport seaborn as sns\n\nplt.rcParams[\'font.sans-serif\'] = [\'WenQuanYi Zen Hei\']\n\n# 加载数据\ndf = pd.read_csv(\'credit_data.csv\')\n\n# 查看数据\nprint(df.head())\nprint("\\n违约率:")\nprint(df[\'default\'].value_counts(normalize=True))\n\n# 分析收入与违约的关系\nplt.figure(figsize=(10, 6))\nsns.boxplot(x=\'default\', y=\'income\', data=df)\nplt.title(\'收入与违约的关系\')\nplt.show()',
      },
      {
        id: 'task-5-2',
        title: '特征工程',
        description: '创建有意义的特征，为后续建模做准备',
        starterCode: '# 计算债务收入比\ndf[\'debt_income_ratio\'] = df[\'debt\'] / df[\'income\']\n\n# 创建年龄分组\ndf[\'age_group\'] = pd.cut(df[\'age\'], bins=[0, 30, 40, 50, 100], labels=[\'<30\', \'30-40\', \'40-50\', \'>50\'])\n\n# 创建信用历史长度特征\ndf[\'credit_history_years\'] = df[\'credit_history_months\'] / 12\n\nprint("特征工程完成")\nprint(df[[\'debt_income_ratio\', \'age_group\', \'credit_history_years\']].head())',
      },
    ],
    datasetGeneratorCode: 'import pandas as pd\nimport numpy as np\n\nnp.random.seed(42)\n\nn_samples = 10000\n\ndata = {\n    \'age\': np.random.randint(18, 70, n_samples),\n    \'income\': np.random.normal(8000, 2000, n_samples).clip(2000, 30000),\n    \'debt\': np.random.normal(3000, 1000, n_samples).clip(0, 20000),\n    \'credit_history_months\': np.random.randint(0, 240, n_samples),\n    \'credit_score\': np.random.randint(300, 850, n_samples),\n    \'employment_years\': np.random.randint(0, 40, n_samples)\n}\n\ndf = pd.DataFrame(data)\n\n# 生成违约标签（基于风险因素）\nrisk_score = (\n    (df[\'credit_score\'] < 600).astype(int) * 3 +\n    (df[\'debt\'] / df[\'income\'] > 0.5).astype(int) * 2 +\n    (df[\'credit_history_months\'] < 12).astype(int) * 2 +\n    (df[\'employment_years\'] < 1).astype(int)\n)\n\ndefault_prob = 1 / (1 + np.exp(-(risk_score - 4)))\ndf[\'default\'] = (np.random.random(n_samples) < default_prob).astype(int)\n\ndf.to_csv(\'credit_data.csv\', index=False)\nprint("信贷数据已生成")',
  },
  {
    id: 'project-6',
    title: '运营活动效果分析',
    description: '分析促销活动的效果，评估ROI，为未来活动提供建议',
    difficulty: 'intermediate',
    category: '运营',
    tags: ['运营', 'A/B测试', '效果评估'],
    tasks: [
      {
        id: 'task-6-1',
        title: '加载活动数据',
        description: '加载活动期间的销售数据，对比活动前后的变化',
        starterCode: 'import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\n\nplt.rcParams[\'font.sans-serif\'] = [\'WenQuanYi Zen Hei\']\n\n# 加载数据\ndf = pd.read_csv(\'campaign_data.csv\')\ndf[\'date\'] = pd.to_datetime(df[\'date\'])\n\n# 查看数据\nprint(df.head())\nprint("\\n活动期间:")\nprint(f"活动开始: {df[df[\'campaign\'] == 1][\'date\'].min()}")\nprint(f"活动结束: {df[df[\'campaign\'] == 1][\'date\'].max()}")',
      },
      {
        id: 'task-6-2',
        title: '计算活动效果指标',
        description: '计算活动带来的增量销售额、ROI等关键指标',
        starterCode: '# 对比活动期间和非活动期间\nsales_campaign = df[df[\'campaign\'] == 1][\'sales\'].sum()\nsales_normal = df[df[\'campaign\'] == 0][\'sales\'].mean() * df[df[\'campaign\'] == 1].shape[0]\n\nincremental_sales = sales_campaign - sales_normal\ncampaign_cost = df[df[\'campaign\'] == 1][\'campaign_cost\'].sum()\nroi = (incremental_sales - campaign_cost) / campaign_cost\n\nprint(f"活动期间销售额: {sales_campaign:.2f}")\nprint(f"预估正常销售额: {sales_normal:.2f}")\nprint(f"增量销售额: {incremental_sales:.2f}")\nprint(f"活动成本: {campaign_cost:.2f}")\nprint(f"ROI: {roi*100:.2f}%")',
      },
    ],
    datasetGeneratorCode: 'import pandas as pd\nimport numpy as np\n\nnp.random.seed(42)\n\n# 创建日期范围\ndates = pd.date_range(start=\'2024-01-01\', end=\'2024-03-31\', freq=\'D\')\n\n# 定义活动期间\ncampaign_start = pd.Timestamp(\'2024-02-15\')\ncampaign_end = pd.Timestamp(\'2024-02-29\')\n\ndata = []\nfor date in dates:\n    is_campaign = 1 if campaign_start <= date <= campaign_end else 0\n    \n    # 基础销售额\n    base_sales = 5000 + np.sin(date.dayofweek * np.pi / 3) * 1000\n    \n    # 活动期间提升\n    campaign_lift = 1.5 if is_campaign else 1.0\n    \n    # 随机波动\n    random_noise = np.random.normal(1, 0.1)\n    \n    sales = base_sales * campaign_lift * random_noise\n    campaign_cost = 500 if is_campaign else 0\n    \n    data.append({\n        \'date\': date,\n        \'sales\': sales,\n        \'campaign\': is_campaign,\n        \'campaign_cost\': campaign_cost,\n        \'visitors\': int(100 + np.random.normal(0, 20)) * campaign_lift,\n        \'orders\': int(10 + np.random.normal(0, 3)) * campaign_lift\n    })\n\ndf = pd.DataFrame(data)\ndf.to_csv(\'campaign_data.csv\', index=False)\nprint("运营数据已生成")',
  },
  {
    id: 'project-7',
    title: '用户流失预测',
    description: '预测哪些用户可能会流失，提前采取挽留措施',
    difficulty: 'advanced',
    category: '电商',
    tags: ['流失预测', '分类', '机器学习'],
    tasks: [
      {
        id: 'task-7-1',
        title: '构建流失标签',
        description: '根据用户行为定义流失，构建训练数据',
        starterCode: 'import pandas as pd\nimport numpy as np\n\n# 加载数据\ndf = pd.read_csv(\'churn_data.csv\')\n\n# 查看数据\nprint(df.head())\nprint("\\n用户流失率:")\nprint(df[\'churn\'].value_counts(normalize=True))\n\n# 分析各特征与流失的关系\nchurn_by_features = df.groupby(\'churn\').mean()\nprint("\\n各特征在流失和非流失用户中的均值:")\nprint(churn_by_features)',
      },
      {
        id: 'task-7-2',
        title: '训练流失预测模型',
        description: '使用机器学习算法训练流失预测模型',
        starterCode: 'from sklearn.model_selection import train_test_split\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.metrics import classification_report, roc_auc_score\n\n# 准备特征和标签\nX = df.drop([\'user_id\', \'churn\'], axis=1)\ny = df[\'churn\']\n\n# 划分训练测试集\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)\n\n# 训练随机森林\nmodel = RandomForestClassifier(n_estimators=100, random_state=42)\nmodel.fit(X_train, y_train)\n\n# 预测\ny_pred = model.predict(X_test)\ny_pred_proba = model.predict_proba(X_test)[:, 1]\n\n# 评估\nprint("分类报告:")\nprint(classification_report(y_test, y_pred))\nprint(f"AUC: {roc_auc_score(y_test, y_pred_proba):.4f}")',
      },
    ],
    datasetGeneratorCode: 'import pandas as pd\nimport numpy as np\n\nnp.random.seed(42)\n\nn_users = 10000\n\ndata = {\n    \'user_id\': range(1, n_users + 1),\n    \'recency\': np.random.randint(0, 365, n_users),\n    \'frequency\': np.random.randint(1, 50, n_users),\n    \'monetary\': np.random.normal(1000, 500, n_users).clip(100, 10000),\n    \'tenure\': np.random.randint(1, 36, n_users),\n    \'avg_session_duration\': np.random.normal(10, 3, n_users).clip(1, 30),\n    \'number_of_products\': np.random.randint(1, 20, n_users),\n    \'support_tickets\': np.random.randint(0, 10, n_users),\n    \'discount_usage\': np.random.randint(0, 5, n_users)\n}\n\ndf = pd.DataFrame(data)\n\n# 计算流失概率\nchurn_score = (\n    (df[\'recency\'] > 30).astype(int) * 3 +\n    (df[\'frequency\'] < 5).astype(int) * 2 +\n    (df[\'tenure\'] < 3).astype(int) * 2 +\n    (df[\'support_tickets\'] > 3).astype(int)\n)\n\nchurn_prob = 1 / (1 + np.exp(-(churn_score - 3)))\ndf[\'churn\'] = (np.random.random(n_users) < churn_prob).astype(int)\n\ndf.to_csv(\'churn_data.csv\', index=False)\nprint("流失数据已生成")',
  },
  {
    id: 'project-8',
    title: '信用评分卡建模',
    description: '构建信用评分卡，为每个贷款申请人打分',
    difficulty: 'advanced',
    category: '金融',
    tags: ['评分卡', 'WOE', 'IV'],
    tasks: [
      {
        id: 'task-8-1',
        title: '特征分箱',
        description: '对连续特征进行分箱，计算WOE和IV',
        starterCode: 'import pandas as pd\nimport numpy as np\n\ndf = pd.read_csv(\'credit_data.csv\')\n\n# 对年龄进行分箱\ndf[\'age_bin\'] = pd.cut(df[\'age\'], bins=[0, 30, 40, 50, 60, 100])\n\n# 计算WOE和IV\ndef calculate_woe_iv(df, feature, target):\n    grouped = df.groupby(feature)[target].agg([\'count\', \'sum\'])\n    grouped.columns = [\'total\', \'bad\']\n    grouped[\'good\'] = grouped[\'total\'] - grouped[\'bad\']\n    \n    total_good = grouped[\'good\'].sum()\n    total_bad = grouped[\'bad\'].sum()\n    \n    grouped[\'good_dist\'] = grouped[\'good\'] / total_good\n    grouped[\'bad_dist\'] = grouped[\'bad\'] / total_bad\n    grouped[\'woe\'] = np.log(grouped[\'good_dist\'] / grouped[\'bad_dist\'])\n    grouped[\'iv\'] = (grouped[\'good_dist\'] - grouped[\'bad_dist\']) * grouped[\'woe\']\n    \n    return grouped, grouped[\'iv\'].sum()\n\nage_woe, age_iv = calculate_woe_iv(df, \'age_bin\', \'default\')\nprint("年龄分箱WOE和IV:")\nprint(age_woe)\nprint(f"\\n年龄特征IV值: {age_iv:.4f}")',
      },
    ],
    datasetGeneratorCode: 'import pandas as pd\nimport numpy as np\n\nnp.random.seed(42)\n\nn_samples = 10000\n\ndata = {\n    \'age\': np.random.randint(18, 70, n_samples),\n    \'income\': np.random.normal(8000, 2000, n_samples).clip(2000, 30000),\n    \'debt\': np.random.normal(3000, 1000, n_samples).clip(0, 20000),\n    \'credit_history_months\': np.random.randint(0, 240, n_samples),\n    \'credit_score\': np.random.randint(300, 850, n_samples),\n    \'employment_years\': np.random.randint(0, 40, n_samples)\n}\n\ndf = pd.DataFrame(data)\n\n# 生成违约标签\nrisk_score = (\n    (df[\'credit_score\'] < 600).astype(int) * 3 +\n    (df[\'debt\'] / df[\'income\'] > 0.5).astype(int) * 2 +\n    (df[\'credit_history_months\'] < 12).astype(int) * 2 +\n    (df[\'employment_years\'] < 1).astype(int)\n)\n\ndefault_prob = 1 / (1 + np.exp(-(risk_score - 4)))\ndf[\'default\'] = (np.random.random(n_samples) < default_prob).astype(int)\n\ndf.to_csv(\'credit_data.csv\', index=False)\nprint("信贷数据已生成")',
  },
  {
    id: 'project-9',
    title: '推荐系统基础',
    description: '基于用户行为数据构建简单的推荐系统',
    difficulty: 'advanced',
    category: '电商',
    tags: ['推荐系统', '协同过滤', '相似度'],
    tasks: [
      {
        id: 'task-9-1',
        title: '构建用户-物品矩阵',
        description: '将用户行为数据转换为用户-物品评分矩阵',
        starterCode: 'import pandas as pd\nimport numpy as np\n\n# 加载数据\ndf = pd.read_csv(\'recommendation_data.csv\')\n\n# 构建用户-物品交互矩阵\nuser_item_matrix = df.pivot_table(index=\'user_id\', columns=\'item_id\', values=\'rating\', fill_value=0)\n\nprint("用户-物品矩阵形状:", user_item_matrix.shape)\nprint("\\n矩阵前5行前5列:")\nprint(user_item_matrix.iloc[:5, :5])',
      },
      {
        id: 'task-9-2',
        title: '实现协同过滤',
        description: '基于用户相似度实现简单的协同过滤推荐',
        starterCode: 'from sklearn.metrics.pairwise import cosine_similarity\n\n# 计算用户相似度\nuser_similarity = cosine_similarity(user_item_matrix)\nuser_similarity_df = pd.DataFrame(user_similarity, index=user_item_matrix.index, columns=user_item_matrix.index)\n\nprint("用户相似度矩阵形状:", user_similarity_df.shape)\n\n# 为用户1推荐商品\ndef recommend_items(user_id, user_item_matrix, user_similarity_df, n_recommendations=5):\n    similar_users = user_similarity_df[user_id].sort_values(ascending=False)[1:11]\n    \n    weighted_ratings = pd.Series(dtype=\'float64\')\n    for sim_user, similarity in similar_users.items():\n        user_ratings = user_item_matrix.loc[sim_user]\n        weighted_ratings = weighted_ratings.add(user_ratings * similarity, fill_value=0)\n    \n    user_rated = user_item_matrix.loc[user_id][user_item_matrix.loc[user_id] > 0].index\n    recommendations = weighted_ratings.drop(user_rated).sort_values(ascending=False)[:n_recommendations]\n    \n    return recommendations\n\nrecommendations = recommend_items(1, user_item_matrix, user_similarity_df)\nprint("\\n为用户1推荐的商品:")\nprint(recommendations)',
      },
    ],
    datasetGeneratorCode: 'import pandas as pd\nimport numpy as np\n\nnp.random.seed(42)\n\nn_users = 1000\nn_items = 500\nn_interactions = 20000\n\nuser_ids = np.random.randint(1, n_users + 1, n_interactions)\nitem_ids = np.random.randint(1, n_items + 1, n_interactions)\nratings = np.random.randint(1, 6, n_interactions)\n\n# 确保数据中存在一定规律\nfor i in range(n_interactions):\n    if np.random.random() < 0.3:\n        user_id = user_ids[i]\n        item_id = item_ids[i]\n        if (user_id % 2 == 0 and item_id % 2 == 0) or (user_id % 2 == 1 and item_id % 2 == 1):\n            ratings[i] = np.random.randint(4, 6)\n        else:\n            ratings[i] = np.random.randint(1, 4)\n\ndata = {\n    \'user_id\': user_ids,\n    \'item_id\': item_ids,\n    \'rating\': ratings\n}\n\ndf = pd.DataFrame(data)\ndf.drop_duplicates(subset=[\'user_id\', \'item_id\'], keep=\'last\', inplace=True)\ndf.to_csv(\'recommendation_data.csv\', index=False)\nprint("推荐数据已生成")',
  },
  {
    id: 'project-10',
    title: 'A/B测试深度分析',
    description: '设计和分析A/B测试，确保实验结果的统计显著性',
    difficulty: 'advanced',
    category: '运营',
    tags: ['A/B测试', '假设检验', '统计显著性'],
    tasks: [
      {
        id: 'task-10-1',
        title: '加载A/B测试数据',
        description: '加载实验数据，计算实验组和对照组的基本指标',
        starterCode: 'import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\nfrom scipy import stats\n\nplt.rcParams[\'font.sans-serif\'] = [\'WenQuanYi Zen Hei\']\n\n# 加载数据\ndf = pd.read_csv(\'ab_test_data.csv\')\n\n# 查看数据\nprint(df.head())\nprint("\\n实验组和对照组样本量:")\nprint(df[\'group\'].value_counts())\n\n# 计算关键指标\ncontrol = df[df[\'group\'] == \'control\']\ntreatment = df[df[\'group\'] == \'treatment\']\n\nprint("\\n关键指标:")\nprint(f"对照组转化率: {control[\'converted\'].mean():.4f}")\nprint(f"实验组转化率: {treatment[\'converted\'].mean():.4f}")\nprint(f"提升: {(treatment[\'converted\'].mean() - control[\'converted\'].mean())/control[\'converted\'].mean()*100:.2f}%")',
      },
      {
        id: 'task-10-2',
        title: '统计显著性检验',
        description: '使用假设检验判断实验结果是否具有统计显著性',
        starterCode: '# 卡方检验\ncontingency_table = pd.crosstab(df[\'group\'], df[\'converted\'])\nchi2, p_value, dof, expected = stats.chi2_contingency(contingency_table)\n\nprint("卡方检验结果:")\nprint(f"卡方值: {chi2:.4f}")\nprint(f"p值: {p_value:.4f}")\nprint(f"自由度: {dof}")\n\n# 计算置信区间\ncontrol_conv = control[\'converted\'].mean()\ntreatment_conv = treatment[\'converted\'].mean()\n\ncontrol_se = np.sqrt(control_conv * (1 - control_conv) / len(control))\ntreatment_se = np.sqrt(treatment_conv * (1 - treatment_conv) / len(treatment))\n\nz_score = 1.96  # 95%置信水平\ncontrol_ci = (control_conv - z_score * control_se, control_conv + z_score * control_se)\ntreatment_ci = (treatment_conv - z_score * treatment_se, treatment_conv + z_score * treatment_se)\n\nprint("\\n95%置信区间:")\nprint(f"对照组: [{control_ci[0]:.4f}, {control_ci[1]:.4f}]")\nprint(f"实验组: [{treatment_ci[0]:.4f}, {treatment_ci[1]:.4f}]")\n\n# 结论\nprint("\\n结论:")\nif p_value < 0.05:\n    print("✓ 实验结果具有统计显著性 (p < 0.05)")\nelse:\n    print("✗ 实验结果不具有统计显著性 (p >= 0.05)")',
      },
    ],
    datasetGeneratorCode: 'import pandas as pd\nimport numpy as np\n\nnp.random.seed(42)\n\nn_control = 10000\nn_treatment = 10000\n\n# 对照组：基础转化率5%\ncontrol_converted = np.random.binomial(1, 0.05, n_control)\n\n# 实验组：提升10%，达到5.5%\ntreatment_converted = np.random.binomial(1, 0.055, n_treatment)\n\n# 生成其他辅助数据\ncontrol_data = {\n    \'user_id\': range(1, n_control + 1),\n    \'group\': \'control\',\n    \'converted\': control_converted,\n    \'session_duration\': np.random.normal(10, 3, n_control),\n    \'pages_visited\': np.random.poisson(5, n_control)\n}\n\ntreatment_data = {\n    \'user_id\': range(n_control + 1, n_control + n_treatment + 1),\n    \'group\': \'treatment\',\n    \'converted\': treatment_converted,\n    \'session_duration\': np.random.normal(10.5, 3, n_treatment),\n    \'pages_visited\': np.random.poisson(5.5, n_treatment)\n}\n\n# 合并数据\ndf = pd.concat([pd.DataFrame(control_data), pd.DataFrame(treatment_data)], ignore_index=True)\ndf.to_csv(\'ab_test_data.csv\', index=False)\nprint("A/B测试数据已生成")',
  },
];

export const getProjectById = (id: string) => projects.find(p => p.id === id);
