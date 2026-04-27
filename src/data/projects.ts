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
    title: 'Pandas 数据清洗实战',
    description: '学习数据清洗的核心技能，处理缺失值、重复值、异常值和格式错误',
    difficulty: 'beginner',
    category: '基础',
    tags: ['pandas', '数据清洗', '缺失值', '异常值'],
    tasks: [
      {
        id: 'task-1-1',
        title: '读取数据并输出基础信息',
        description: '用 pandas 读取 CSV，输出 shape、dtypes、describe',
        starterCode: 'import pandas as pd\nimport numpy as np\n\n# 读取数据\ndf = pd.read_csv(\'user_orders.csv\')\n\n# 输出基础信息\nprint("数据形状:", df.shape)\nprint("\\n数据类型:\\n", df.dtypes)\nprint("\\n统计描述:\\n", df.describe())\nprint("\\n前5行数据:\\n", df.head())'
      },
      {
        id: 'task-1-2',
        title: '处理缺失值',
        description: '金额列用中位数填充，地区列用众数填充',
        starterCode: '# 检查缺失值\nprint("缺失值统计:\\n", df.isnull().sum())\n\n# 金额列用中位数填充\nif \'amount\' in df.columns:\n    df[\'amount\'] = df[\'amount\'].fillna(df[\'amount\'].median())\n\n# 地区列用众数填充\nif \'region\' in df.columns:\n    df[\'region\'] = df[\'region\'].fillna(df[\'region\'].mode()[0])\n\nprint("\\n缺失值处理完成")'
      },
      {
        id: 'task-1-3',
        title: '删除重复订单',
        description: '按订单号删除重复记录',
        starterCode: '# 删除重复订单\nif \'order_id\' in df.columns:\n    before = len(df)\n    df = df.drop_duplicates(subset=[\'order_id\'])\n    after = len(df)\n    print(f"删除重复记录: {before - after} 条")\nelse:\n    # 如果没有order_id，删除完全重复的行\n    before = len(df)\n    df = df.drop_duplicates()\n    after = len(df)\n    print(f"删除完全重复记录: {before - after} 条")'
      },
      {
        id: 'task-1-4',
        title: '过滤异常值',
        description: '金额 ≤ 0 或 > 100000 的行标记并剔除',
        starterCode: '# 标记异常值\nif \'amount\' in df.columns:\n    df[\'is_outlier\'] = (df[\'amount\'] <= 0) | (df[\'amount\'] > 100000)\n    print("异常值统计:\\n", df[\'is_outlier\'].value_counts())\n    \n    # 剔除异常值\n    outliers = df[df[\'is_outlier\']]\n    df = df[~df[\'is_outlier\']].drop(\'is_outlier\', axis=1)\n    print(f"剔除异常值: {len(outliers)} 条")\n    print(f"保留数据: {len(df)} 条")'
      },
      {
        id: 'task-1-5',
        title: '日期处理',
        description: '转换日期列为 datetime 类型，提取年、月、日、星期几',
        starterCode: '# 转换日期列\nif \'order_date\' in df.columns:\n    df[\'order_date\'] = pd.to_datetime(df[\'order_date\'], errors=\'coerce\')\n    \n    # 提取日期特征\n    df[\'year\'] = df[\'order_date\'].dt.year\n    df[\'month\'] = df[\'order_date\'].dt.month\n    df[\'day\'] = df[\'order_date\'].dt.day\n    df[\'weekday\'] = df[\'order_date\'].dt.day_name()\n    \n    print("日期特征提取完成")\n    print(df[[\'order_date\', \'year\', \'month\', \'day\', \'weekday\']].head())'
      },
      {
        id: 'task-1-6',
        title: '输出清洗报告',
        description: '输出清洗后的数据概览和统计报告',
        starterCode: '# 输出最终报告\nprint("="*50)\nprint("数据清洗完成报告")\nprint("="*50)\nprint(f"最终数据形状: {df.shape}")\nprint("\\n最终数据类型:\\n", df.dtypes)\nprint("\\n最终统计描述:\\n", df.describe(include=\'all\'))\nprint("\\n前10行数据:\\n", df.head(10))'
      }
    ],
    datasetGeneratorCode: 'import pandas as pd\nimport numpy as np\nfrom datetime import datetime, timedelta\n\nnp.random.seed(42)\n\n# 生成订单数据\nn_orders = 1000\n\norder_ids = [f"ORD{i:05d}" for i in range(1, n_orders + 1)]\nuser_ids = np.random.randint(1000, 9999, n_orders)\nproducts = np.random.choice([\'手机\', \'电脑\', \'平板\', \'耳机\', \'充电器\'], n_orders)\nregions = np.random.choice([\'北京\', \'上海\', \'广州\', \'深圳\', \'杭州\'], n_orders)\namounts = np.random.normal(2000, 800, n_orders).clip(50, 10000)\n\n# 生成日期\nstart_date = datetime(2024, 1, 1)\ndates = [start_date + timedelta(days=np.random.randint(0, 90)) for _ in range(n_orders)]\n\n# 创建DataFrame\ndf = pd.DataFrame({\n    \'order_id\': order_ids,\n    \'user_id\': user_ids,\n    \'product\': products,\n    \'region\': regions,\n    \'amount\': amounts,\n    \'order_date\': dates\n})\n\n# 引入缺失值\nmask = np.random.random(n_orders) < 0.05\ndf.loc[mask, \'amount\'] = np.nan\nmask = np.random.random(n_orders) < 0.03\ndf.loc[mask, \'region\'] = np.nan\n\n# 引入重复值\nduplicate_indices = np.random.choice(df.index, 50, replace=False)\ndf_duplicates = df.loc[duplicate_indices].copy()\ndf = pd.concat([df, df_duplicates], ignore_index=True)\n\n# 引入异常值\noutlier_indices = np.random.choice(df.index, 10, replace=False)\ndf.loc[outlier_indices[:5], \'amount\'] = -np.random.randint(100, 1000, 5)\ndf.loc[outlier_indices[5:], \'amount\'] = np.random.randint(100000, 500000, 5)\n\n# 引入日期格式错误\nif len(df) > 20:\n    df.loc[df.index[-10:], \'order_date\'] = [\'2024/02/30\', \'invalid\', \'\', \'2024-13-01\', \'2024/2/29\', \n                                             \'2024-04-31\', \'2024-02-30\', \'invalid\', \'\', \'2024-13-01\']\n\n# 保存文件\ndf.to_csv(\'user_orders.csv\', index=False, encoding=\'utf-8-sig\')\nprint(f"用户订单表已生成，共 {len(df)} 条记录")'
  },
  {
    id: 'project-2',
    title: '分组聚合与透视表',
    description: '掌握分组聚合、透视表等核心数据聚合技术',
    difficulty: 'beginner',
    category: '基础',
    tags: ['groupby', 'agg', 'pivot_table', '分组聚合'],
    tasks: [
      {
        id: 'task-2-1',
        title: '按月统计销售数据',
        description: '按月统计总销售额和总销量',
        starterCode: 'import pandas as pd\nimport numpy as np\n\n# 读取数据\ndf = pd.read_csv(\'ecommerce_sales.csv\')\ndf[\'order_date\'] = pd.to_datetime(df[\'order_date\'])\n\n# 提取月份\ndf[\'month\'] = df[\'order_date\'].dt.to_period(\'M\')\n\n# 按月统计\nmonthly_stats = df.groupby(\'month\').agg({\n    \'sales\': \'sum\',\n    \'quantity\': \'sum\'\n}).round(2)\n\nprint("月度销售统计:")\nprint(monthly_stats)'
      },
      {
        id: 'task-2-2',
        title: '按产品类别统计',
        description: '按产品类别统计：平均客单价、总订单数',
        starterCode: '# 按产品类别统计\ncategory_stats = df.groupby(\'category\').agg({\n    \'sales\': [\'mean\', \'count\'],\n    \'user_id\': \'nunique\'\n}).round(2)\n\ncategory_stats.columns = [\'平均客单价\', \'订单数\', \'用户数\']\n\nprint("\\n产品类别统计:")\nprint(category_stats)'
      },
      {
        id: 'task-2-3',
        title: '找出每个类别下销售额 top 3 的用户',
        description: '统计每个类别中消费最高的前3个用户',
        starterCode: '# 每个类别下 top 3 用户\ndef get_top_users(group):\n    return group.nlargest(3, \'sales\')[[\'user_id\', \'sales\']]\n\ntop_users = df.groupby(\'category\').apply(get_top_users, include_groups=False)\n\nprint("\\n每个类别 Top 3 用户:")\nprint(top_users)'
      },
      {
        id: 'task-2-4',
        title: '使用 pivot_table',
        description: '用 pivot_table 生成：行=月份，列=产品类别，值=销售额',
        starterCode: '# 透视表\npivot_df = df.pivot_table(\n    values=\'sales\',\n    index=\'month\',\n    columns=\'category\',\n    aggfunc=\'sum\',\n    fill_value=0\n).round(2)\n\nprint("\\n透视表（月份 vs 类别）:")\nprint(pivot_df)'
      },
      {
        id: 'task-2-5',
        title: '同时计算多种聚合指标',
        description: '用 groupby + agg 同时计算：总和、均值、中位数、计数',
        starterCode: '# 多重聚合\nmulti_agg = df.groupby(\'category\').agg({\n    \'sales\': [\'sum\', \'mean\', \'median\', \'count\'],\n    \'quantity\': [\'sum\', \'mean\']\n}).round(2)\n\nprint("\\n多重聚合统计:")\nprint(multi_agg)'
      },
      {
        id: 'task-2-6',
        title: '计算用户复购率',
        description: '计算每个用户的复购率（购买次数 ≥ 2 的比例）',
        starterCode: '# 计算用户复购率\nuser_purchase_count = df.groupby(\'user_id\').size()\nrepeat_users = user_purchase_count[user_purchase_count >= 2]\n\nrepeat_rate = len(repeat_users) / len(user_purchase_count)\n\nprint("\\n用户复购分析:")\nprint(f"总用户数: {len(user_purchase_count)}")\nprint(f"复购用户数: {len(repeat_users)}")\nprint(f"复购率: {repeat_rate*100:.2f}%")\n\nprint("\\n用户购买次数分布:")\nprint(user_purchase_count.value_counts().sort_index())'
      }
    ],
    datasetGeneratorCode: 'import pandas as pd\nimport numpy as np\nfrom datetime import datetime, timedelta\n\nnp.random.seed(42)\n\nn_records = 5000\n\n# 生成日期\nstart_date = datetime(2024, 1, 1)\ndates = [start_date + timedelta(days=np.random.randint(0, 180)) for _ in range(n_records)]\n\n# 生成数据\nuser_ids = np.random.randint(10000, 99999, n_records)\ncategories = np.random.choice([\'电子产品\', \'服装\', \'食品\', \'家居\', \'美妆\'], n_records)\n\n# 根据类别设置价格基准\nprice_base = {\n    \'电子产品\': 2000,\n    \'服装\': 300,\n    \'食品\': 100,\n    \'家居\': 500,\n    \'美妆\': 200\n}\n\nquantities = np.random.randint(1, 5, n_records)\nsales = []\nfor cat, qty in zip(categories, quantities):\n    base = price_base[cat]\n    sale = base * qty * np.random.normal(1, 0.2)\n    sales.append(round(sale, 2))\n\n# 创建DataFrame\ndf = pd.DataFrame({\n    \'order_date\': dates,\n    \'user_id\': user_ids,\n    \'category\': categories,\n    \'quantity\': quantities,\n    \'sales\': sales\n})\n\n# 确保有一些重复购买的用户\nrepeat_users = np.random.choice(user_ids, 500)\nfor user in repeat_users:\n    extra_records = 5\n    for _ in range(extra_records):\n        date = start_date + timedelta(days=np.random.randint(0, 180))\n        cat = np.random.choice(list(price_base.keys()))\n        qty = np.random.randint(1, 5)\n        sale = price_base[cat] * qty * np.random.normal(1, 0.2)\n        df = pd.concat([df, pd.DataFrame({\n            \'order_date\': [date],\n            \'user_id\': [user],\n            \'category\': [cat],\n            \'quantity\': [qty],\n            \'sales\': [round(sale, 2)]\n        })], ignore_index=True)\n\n# 保存文件\ndf.to_csv(\'ecommerce_sales.csv\', index=False, encoding=\'utf-8-sig\')\nprint(f"电商销售记录已生成，共 {len(df)} 条记录")'
  },
  {
    id: 'project-3',
    title: '数据合并与连接',
    description: '学习使用 merge、concat 等工具进行数据合并',
    difficulty: 'intermediate',
    category: '进阶',
    tags: ['merge', 'concat', 'join', '数据合并'],
    tasks: [
      {
        id: 'task-3-1',
        title: '合并订单与用户信息',
        description: '用 merge 将订单与用户信息合并（按 user_id）',
        starterCode: 'import pandas as pd\nimport numpy as np\n\n# 读取数据\norders = pd.read_csv(\'orders.csv\')\ncustomers = pd.read_csv(\'customers.csv\')\nproducts = pd.read_csv(\'products.csv\')\n\nprint("订单数据:")\nprint(orders.head())\nprint("\\n用户数据:")\nprint(customers.head())\n\n# 合并订单与用户\norders_customers = pd.merge(\n    orders,\n    customers,\n    on=\'user_id\',\n    how=\'left\'\n)\n\nprint("\\n合并后（订单+用户）:")\nprint(orders_customers.head())'
      },
      {
        id: 'task-3-2',
        title: '合并产品信息',
        description: '用 merge 将上一步结果与产品信息合并（按 product_id）',
        starterCode: '# 合并产品信息\nprint("\\n产品数据:")\nprint(products.head())\n\nfull_data = pd.merge(\n    orders_customers,\n    products,\n    on=\'product_id\',\n    how=\'left\'\n)\n\nprint("\\n完整合并数据:")\nprint(full_data.head())'
      },
      {
        id: 'task-3-3',
        title: '找出没有购买记录的用户',
        description: '用 left join + 过滤 null 找出没有购买的用户',
        starterCode: '# 找出没有购买记录的用户\ncustomers_with_orders = pd.merge(\n    customers,\n    orders[[\'user_id\']].drop_duplicates(),\n    on=\'user_id\',\n    how=\'left\',\n    indicator=True\n)\n\nno_order_users = customers_with_orders[customers_with_orders[\'_merge\'] == \'left_only\'].drop(\'_merge\', axis=1)\n\nprint("\\n没有购买记录的用户:")\nprint(f"总用户数: {len(customers)}")\nprint(f"有购买用户数: {len(customers) - len(no_order_users)}")\nprint(f"无购买用户数: {len(no_order_users)}")\nprint(no_order_users.head())'
      },
      {
        id: 'task-3-4',
        title: '使用 concat 合并数据',
        description: '用 concat 合并两个月的数据，并标记数据来源月份',
        starterCode: '# 生成两个月的数据并合并\norders[\'month\'] = pd.to_datetime(orders[\'order_date\']).dt.month\n\njan_data = orders[orders[\'month\'] == 1].copy()\nfeb_data = orders[orders[\'month\'] == 2].copy()\n\njan_data[\'source_month\'] = \'2024-01\'\nfeb_data[\'source_month\'] = \'2024-02\'\n\n# 用 concat 合并\ncombined = pd.concat([jan_data, feb_data], axis=0, ignore_index=True)\n\nprint("\\nConcat 合并结果:")\nprint(f"1月数据: {len(jan_data)} 条")\nprint(f"2月数据: {len(feb_data)} 条")\nprint(f"合并后: {len(combined)} 条")\nprint(combined[[\'order_id\', \'source_month\']].head())'
      },
      {
        id: 'task-3-5',
        title: '处理合并后的重复列',
        description: '处理两个表的 id 字段等重复列',
        starterCode: '# 模拟有重复列的合并\ncustomers_dup = customers.rename(columns={\'name\': \'customer_name\', \'region\': \'customer_region\'})\n\norders_dup = orders.rename(columns={\'region\': \'order_region\'})\n\nmerged_dup = pd.merge(orders_dup, customers_dup, on=\'user_id\', how=\'left\')\n\nprint("\\n合并后列名:")\nprint(merged_dup.columns.tolist())\n\n# 清理列名\nprint("\\n列名处理完成")'
      },
      {
        id: 'task-3-6',
        title: '统计用户购买日期',
        description: '统计每个用户的首次购买日期和最后一次购买日期',
        starterCode: '# 统计用户购买日期\norders[\'order_date\'] = pd.to_datetime(orders[\'order_date\'])\n\nuser_purchase_stats = orders.groupby(\'user_id\').agg({\n    \'order_date\': [\'min\', \'max\', \'count\']\n}).round(2)\n\nuser_purchase_stats.columns = [\'首次购买\', \'最后购买\', \'购买次数\']\n\nprint("\\n用户购买统计:")\nprint(user_purchase_stats.head(10))'
      }
    ],
    datasetGeneratorCode: 'import pandas as pd\nimport numpy as np\nfrom datetime import datetime, timedelta\n\nnp.random.seed(42)\n\n# 生成用户数据\nn_customers = 500\ncustomers = pd.DataFrame({\n    \'user_id\': range(10000, 10000 + n_customers),\n    \'name\': [f"用户{i}" for i in range(n_customers)],\n    \'region\': np.random.choice([\'北京\', \'上海\', \'广州\', \'深圳\', \'杭州\'], n_customers),\n    \'level\': np.random.choice([\'普通\', \'黄金\', \'白金\'], n_customers, p=[0.6, 0.3, 0.1]),\n    \'register_date\': [datetime(2023, 1, 1) + timedelta(days=np.random.randint(0, 365)) for _ in range(n_customers)]\n})\n\n# 生成产品数据\nproducts = pd.DataFrame({\n    \'product_id\': range(1, 101),\n    \'product_name\': [f"产品{i}" for i in range(1, 101)],\n    \'category\': np.random.choice([\'电子产品\', \'服装\', \'食品\', \'家居\', \'美妆\'], 100),\n    \'price\': np.random.randint(50, 5000, 100)\n})\n\n# 生成订单数据\nn_orders = 3000\norders = pd.DataFrame({\n    \'order_id\': [f"ORD{i:05d}" for i in range(1, n_orders + 1)],\n    \'user_id\': np.random.choice(customers[\'user_id\'], n_orders),\n    \'product_id\': np.random.choice(products[\'product_id\'], n_orders),\n    \'quantity\': np.random.randint(1, 5, n_orders),\n    \'region\': np.random.choice([\'北京\', \'上海\', \'广州\', \'深圳\', \'杭州\'], n_orders),\n    \'order_date\': [datetime(2024, 1, 1) + timedelta(days=np.random.randint(0, 180)) for _ in range(n_orders)]\n})\n\n# 添加一些没有购买的用户\norders = orders.drop(orders[orders[\'user_id\'].isin(customers[\'user_id\'].sample(50))].index)\n\n# 保存文件\ncustomers.to_csv(\'customers.csv\', index=False, encoding=\'utf-8-sig\')\nproducts.to_csv(\'products.csv\', index=False, encoding=\'utf-8-sig\')\norders.to_csv(\'orders.csv\', index=False, encoding=\'utf-8-sig\')\nprint("数据文件已生成: customers.csv, products.csv, orders.csv")'
  },
  {
    id: 'project-4',
    title: 'apply 与自定义函数',
    description: '学习使用 apply 和自定义函数进行数据处理',
    difficulty: 'intermediate',
    category: '进阶',
    tags: ['apply', 'lambda', '自定义函数', '函数式编程'],
    tasks: [
      {
        id: 'task-4-1',
        title: '计算工作时长',
        description: '写函数计算工作时长（下班 - 上班，处理跨天情况）',
        starterCode: 'import pandas as pd\nimport numpy as np\nfrom datetime import datetime, time\n\n# 读取数据\ndf = pd.read_csv(\'attendance.csv\')\nprint("打卡记录数据:")\nprint(df.head())\n\n# 转换时间列\ndf[\'check_in\'] = pd.to_datetime(df[\'check_in\'], format=\'%H:%M\').dt.time\ndf[\'check_out\'] = pd.to_datetime(df[\'check_out\'], format=\'%H:%M\').dt.time\n\n# 计算工作时长函数\ndef calculate_work_hours(check_in, check_out):\n    in_time = datetime.combine(datetime.today(), check_in)\n    out_time = datetime.combine(datetime.today(), check_out)\n    \n    # 处理跨天情况\n    if out_time < in_time:\n        out_time = out_time + pd.Timedelta(days=1)\n    \n    duration = (out_time - in_time).total_seconds() / 3600\n    return round(duration, 2)\n\n# 用 apply 应用函数\ndf[\'work_hours\'] = df.apply(lambda row: calculate_work_hours(row[\'check_in\'], row[\'check_out\']), axis=1)\n\nprint("\\n添加工作时长后:")\nprint(df.head())'
      },
      {
        id: 'task-4-2',
        title: '判断是否迟到',
        description: '写函数判断是否迟到（上班 > 9:00），用 apply 添加迟到标记',
        starterCode: '# 判断是否迟到函数\ndef is_late(check_in):\n    return check_in > time(9, 0)\n\n# 用 apply 应用函数\ndf[\'is_late\'] = df[\'check_in\'].apply(is_late)\n\nprint("\\n迟到统计:")\nprint(df[\'is_late\'].value_counts())\nprint("\\n迟到记录:")\nprint(df[df[\'is_late\']].head())'
      },
      {
        id: 'task-4-3',
        title: '工作时长分类',
        description: '用 apply 将工作时长分类：<6小时、6-8小时、>8小时',
        starterCode: '# 工作时长分类函数\ndef categorize_hours(hours):\n    if hours < 6:\n        return \'不足6小时\'\n    elif 6 <= hours <= 8:\n        return \'标准工时\'\n    else:\n        return \'加班\'\n\n# 用 apply 应用函数\ndf[\'hours_category\'] = df[\'work_hours\'].apply(categorize_hours)\n\nprint("\\n工作时长分类统计:")\nprint(df[\'hours_category\'].value_counts())\nprint("\\n分类后数据:")\nprint(df.head(10))'
      },
      {
        id: 'task-4-4',
        title: '提取星期几',
        description: '用 apply 结合 lambda 提取日期中的星期几',
        starterCode: '# 转换日期列并提取星期几\ndf[\'date\'] = pd.to_datetime(df[\'date\'])\n\n# 用 lambda 和 apply\ndf[\'weekday\'] = df[\'date\'].apply(lambda x: x.day_name())\n\nprint("\\n星期统计:")\nprint(df[\'weekday\'].value_counts().sort_index())'
      },
      {
        id: 'task-4-5',
        title: '处理空字符串',
        description: '用 applymap 将整个 DataFrame 中的空字符串替换为 None',
        starterCode: '# 创建含空字符串的示例数据\nsample_data = pd.DataFrame({\n    \'a\': [\'hello\', \'\', \'world\'],\n    \'b\': [\'\', \'test\', \'\'],\n    \'c\': [1, 2, 3]\n})\n\nprint("示例数据:")\nprint(sample_data)\n\n# 使用 applymap 替换空字符串\ndef replace_empty(x):\n    if isinstance(x, str) and x.strip() == \'\':\n        return None\n    return x\n\ncleaned = sample_data.applymap(replace_empty)\n\nprint("\\n清理后:")\nprint(cleaned)'
      }
    ],
    datasetGeneratorCode: 'import pandas as pd\nimport numpy as np\nfrom datetime import datetime, time, timedelta\n\nnp.random.seed(42)\n\nn_records = 200\n\n# 生成员工姓名\nnames = [f"员工{i}" for i in range(1, 21)]\nemployee_names = np.random.choice(names, n_records)\n\n# 生成日期\nstart_date = datetime(2024, 3, 1)\ndates = [start_date + timedelta(days=i % 30) for i in range(n_records)]\n\n# 生成打卡时间（大部分正常，有些迟到）\ndef generate_time(base_hour, base_minute, std_hour=0.5):\n    hour = int(base_hour + np.random.normal(0, std_hour))\n    minute = np.random.randint(0, 60)\n    hour = max(0, min(23, hour))\n    return time(hour, minute)\n\ncheck_ins = []\ncheck_outs = []\n\nfor _ in range(n_records):\n    # 上班时间：大部分 8:00-9:00，有些 9:00+（迟到）\n    if np.random.random() < 0.2:\n        ci = generate_time(9, 30, 1)\n    else:\n        ci = generate_time(8, 30, 0.5)\n    \n    # 下班时间：大部分 18:00-19:00，有些跨天（极晚）\n    if np.random.random() < 0.1:\n        co = generate_time(2, 0, 0.5)\n    else:\n        co = generate_time(18, 30, 1)\n    \n    check_ins.append(ci)\n    check_outs.append(co)\n\n# 创建 DataFrame\ndf = pd.DataFrame({\n    \'name\': employee_names,\n    \'date\': dates,\n    \'check_in\': [t.strftime(\'%H:%M\') for t in check_ins],\n    \'check_out\': [t.strftime(\'%H:%M\') for t in check_outs]\n})\n\n# 添加一些空字符串\nmask = np.random.random(n_records) < 0.05\ndf.loc[mask, \'check_in\'] = \'\'\n\n# 保存文件\ndf.to_csv(\'attendance.csv\', index=False, encoding=\'utf-8-sig\')\nprint(f"员工打卡记录已生成，共 {len(df)} 条记录")'
  },
  {
    id: 'project-5',
    title: '数据可视化',
    description: '学习使用 matplotlib 和 seaborn 进行数据可视化',
    difficulty: 'intermediate',
    category: '进阶',
    tags: ['matplotlib', 'seaborn', '数据可视化', '图表'],
    tasks: [
      {
        id: 'task-5-1',
        title: '画折线图',
        description: '画折线图：日最高温变化趋势（用 matplotlib）',
        starterCode: 'import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\nimport seaborn as sns\n\n# 设置中文字体\nplt.rcParams[\'font.sans-serif\'] = [\'WenQuanYi Zen Hei\', \'Microsoft YaHei\', \'SimHei\']\nplt.rcParams[\'axes.unicode_minus\'] = False\n\n# 读取数据\ndf = pd.read_csv(\'weather_data.csv\')\ndf[\'date\'] = pd.to_datetime(df[\'date\'])\n\nprint("天气数据:")\nprint(df.head())\n\n# 画折线图：日最高温\nplt.figure(figsize=(14, 6))\nplt.plot(df[\'date\'], df[\'temp_high\'], marker=\'o\', linestyle=\'-\', linewidth=2, markersize=4, alpha=0.7, label=\'最高温\')\nplt.plot(df[\'date\'], df[\'temp_low\'], marker=\'s\', linestyle=\'--\', linewidth=2, markersize=4, alpha=0.7, label=\'最低温\')\nplt.title(\'日温度变化趋势\', fontsize=16)\nplt.xlabel(\'日期\', fontsize=12)\nplt.ylabel(\'温度 (°C)\', fontsize=12)\nplt.legend(fontsize=12)\nplt.grid(True, alpha=0.3)\nplt.xticks(rotation=45)\nplt.tight_layout()\nplt.show()'
      },
      {
        id: 'task-5-2',
        title: '画柱状图',
        description: '画柱状图：每月平均降雨量（用 seaborn）',
        starterCode: '# 按月统计平均降雨量\ndf[\'month\'] = df[\'date\'].dt.month\nmonthly_rain = df.groupby(\'month\')[\'rainfall\'].mean().reset_index()\n\n# 用 seaborn 画柱状图\nplt.figure(figsize=(12, 6))\nsns.barplot(x=\'month\', y=\'rainfall\', data=monthly_rain, palette=\'Blues\')\nplt.title(\'每月平均降雨量\', fontsize=16)\nplt.xlabel(\'月份\', fontsize=12)\nplt.ylabel(\'平均降雨量 (mm)\', fontsize=12)\nplt.xticks(rotation=0)\nplt.grid(axis=\'y\', alpha=0.3)\nplt.tight_layout()\nplt.show()'
      },
      {
        id: 'task-5-3',
        title: '画散点图',
        description: '画散点图：风速 vs 温差，添加趋势线',
        starterCode: '# 计算温差\ndf[\'temp_diff\'] = df[\'temp_high\'] - df[\'temp_low\']\n\n# 画散点图 + 趋势线\nplt.figure(figsize=(10, 6))\nsns.scatterplot(x=\'wind_speed\', y=\'temp_diff\', data=df, alpha=0.6, s=60)\n\n# 添加趋势线\nz = np.polyfit(df[\'wind_speed\'], df[\'temp_diff\'], 1)\np = np.poly1d(z)\nplt.plot(df[\'wind_speed\'], p(df[\'wind_speed\']), "r--", alpha=0.8, linewidth=2, label=\'趋势线\')\n\nplt.title(\'风速 vs 温差\', fontsize=16)\nplt.xlabel(\'风速 (m/s)\', fontsize=12)\nplt.ylabel(\'温差 (°C)\', fontsize=12)\nplt.legend(fontsize=12)\nplt.grid(True, alpha=0.3)\nplt.tight_layout()\nplt.show()'
      },
      {
        id: 'task-5-4',
        title: '画箱线图',
        description: '画箱线图：各月份最高温分布对比',
        starterCode: '# 箱线图：各月份最高温\nplt.figure(figsize=(14, 6))\nsns.boxplot(x=\'month\', y=\'temp_high\', data=df, palette=\'Set3\')\nplt.title(\'各月份最高温分布\', fontsize=16)\nplt.xlabel(\'月份\', fontsize=12)\nplt.ylabel(\'最高温 (°C)\', fontsize=12)\nplt.grid(axis=\'y\', alpha=0.3)\nplt.tight_layout()\nplt.show()'
      },
      {
        id: 'task-5-5',
        title: '画直方图',
        description: '画直方图：降雨量分布，设置 bins=30',
        starterCode: '# 直方图：降雨量\nplt.figure(figsize=(12, 6))\nplt.hist(df[\'rainfall\'], bins=30, edgecolor=\'black\', alpha=0.7, color=\'skyblue\')\nplt.title(\'降雨量分布\', fontsize=16)\nplt.xlabel(\'降雨量 (mm)\', fontsize=12)\nplt.ylabel(\'频数\', fontsize=12)\nplt.grid(axis=\'y\', alpha=0.3)\nplt.tight_layout()\nplt.show()'
      },
      {
        id: 'task-5-6',
        title: '组合图',
        description: '双 Y 轴图：温度 + 降雨量',
        starterCode: '# 双 Y 轴图\nfig, ax1 = plt.subplots(figsize=(14, 6))\n\n# 温度线\nax1.set_xlabel(\'日期\', fontsize=12)\nax1.set_ylabel(\'温度 (°C)\', fontsize=12, color=\'tab:red\')\nline1 = ax1.plot(df[\'date\'], df[\'temp_high\'], color=\'tab:red\', label=\'最高温\', alpha=0.7)\nline2 = ax1.plot(df[\'date\'], df[\'temp_low\'], color=\'tab:orange\', label=\'最低温\', alpha=0.7)\nax1.tick_params(axis=\'y\', labelcolor=\'tab:red\')\nax1.tick_params(axis=\'x\', rotation=45)\n\n# 降雨量柱状图\nax2 = ax1.twinx()\nax2.set_ylabel(\'降雨量 (mm)\', fontsize=12, color=\'tab:blue\')\nline3 = ax2.bar(df[\'date\'], df[\'rainfall\'], color=\'tab:blue\', alpha=0.3, label=\'降雨量\')\nax2.tick_params(axis=\'y\', labelcolor=\'tab:blue\')\n\n# 图例\nlines = [line1[0], line2[0], line3]\nlabels = [\'最高温\', \'最低温\', \'降雨量\']\nax1.legend(lines, labels, loc=\'upper left\')\n\nplt.title(\'温度与降雨量\', fontsize=16)\nplt.tight_layout()\nplt.show()'
      }
    ],
    datasetGeneratorCode: 'import pandas as pd\nimport numpy as np\nfrom datetime import datetime, timedelta\n\nnp.random.seed(42)\n\n# 生成90天的天气数据\nn_days = 90\nstart_date = datetime(2024, 1, 1)\ndates = [start_date + timedelta(days=i) for i in range(n_days)]\n\n# 生成温度（季节性变化 + 随机波动）\nday_of_year = np.arange(n_days)\ntemp_high_base = 15 + 10 * np.sin(2 * np.pi * (day_of_year - 60) / 365)\ntemp_low_base = 5 + 8 * np.sin(2 * np.pi * (day_of_year - 60) / 365)\n\ntemp_high = temp_high_base + np.random.normal(0, 3, n_days)\ntemp_low = temp_low_base + np.random.normal(0, 2, n_days)\n\n# 生成降雨量（大部分0，偶尔下雨）\nrainfall = np.zeros(n_days)\nrain_days = np.random.choice(n_days, size=int(n_days * 0.3), replace=False)\nrainfall[rain_days] = np.random.exponential(10, size=len(rain_days)).clip(0, 50)\n\n# 生成风速\nwind_speed = np.random.uniform(0, 15, n_days)\n\n# 创建 DataFrame\ndf = pd.DataFrame({\n    \'date\': dates,\n    \'temp_high\': temp_high.round(1),\n    \'temp_low\': temp_low.round(1),\n    \'rainfall\': rainfall.round(1),\n    \'wind_speed\': wind_speed.round(1)\n})\n\n# 保存文件\ndf.to_csv(\'weather_data.csv\', index=False, encoding=\'utf-8-sig\')\nprint(f"天气记录已生成，共 {len(df)} 天数据")'
  },
  {
    id: 'project-6',
    title: '时间序列处理',
    description: '学习时间序列数据的处理和分析技术',
    difficulty: 'advanced',
    category: '高级',
    tags: ['时间序列', '移动平均', '重采样', '收益率'],
    tasks: [
      {
        id: 'task-6-1',
        title: '日期索引与重采样',
        description: '将日期设为索引，按周重采样计算每周均价',
        starterCode: 'import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\n\n# 设置中文字体\nplt.rcParams[\'font.sans-serif\'] = [\'WenQuanYi Zen Hei\', \'Microsoft YaHei\', \'SimHei\']\nplt.rcParams[\'axes.unicode_minus\'] = False\n\n# 读取数据\ndf = pd.read_csv(\'stock_data.csv\')\ndf[\'date\'] = pd.to_datetime(df[\'date\'])\n\n# 将日期设为索引\ndf.set_index(\'date\', inplace=True)\n\nprint("股票数据:")\nprint(df.head())\nprint(f"\\n数据时间范围: {df.index.min()} 到 {df.index.max()}")\n\n# 按周重采样\nweekly = df.resample(\'W\').mean()\n\nprint("\\n周均价数据:")\nprint(weekly.head())'
      },
      {
        id: 'task-6-2',
        title: '计算移动平均线',
        description: '计算 5 日、20 日移动平均线',
        starterCode: '# 计算移动平均线\ndf[\'MA5\'] = df[\'close\'].rolling(window=5).mean()\ndf[\'MA20\'] = df[\'close\'].rolling(window=20).mean()\n\n# 可视化\nplt.figure(figsize=(14, 7))\nplt.plot(df.index, df[\'close\'], label=\'收盘价\', alpha=0.7)\nplt.plot(df.index, df[\'MA5\'], label=\'5日均线\', alpha=0.8)\nplt.plot(df.index, df[\'MA20\'], label=\'20日均线\', linewidth=2, alpha=0.9)\nplt.title(\'股票价格与移动平均线\', fontsize=16)\nplt.xlabel(\'日期\', fontsize=12)\nplt.ylabel(\'价格\', fontsize=12)\nplt.legend(fontsize=12)\nplt.grid(True, alpha=0.3)\nplt.xticks(rotation=45)\nplt.tight_layout()\nplt.show()\n\nprint("\\n移动平均线计算完成")'
      },
      {
        id: 'task-6-3',
        title: '计算每日收益率',
        description: '计算每日收益率（收盘价变化百分比）',
        starterCode: '# 计算每日收益率\ndf[\'daily_return\'] = df[\'close\'].pct_change() * 100\n\nprint("\\n每日收益率统计:")\nprint(df[\'daily_return\'].describe())\n\n# 收益率直方图\nplt.figure(figsize=(12, 6))\nplt.hist(df[\'daily_return\'].dropna(), bins=50, edgecolor=\'black\', alpha=0.7, color=\'lightgreen\')\nplt.title(\'日收益率分布\', fontsize=16)\nplt.xlabel(\'收益率 (%)\', fontsize=12)\nplt.ylabel(\'频数\', fontsize=12)\nplt.grid(axis=\'y\', alpha=0.3)\nplt.tight_layout()\nplt.show()'
      },
      {
        id: 'task-6-4',
        title: '找出连续上涨天数',
        description: '找出连续上涨（涨跌幅 > 0）的最长天数',
        starterCode: '# 标记上涨日\ndf[\'is_up\'] = df[\'daily_return\'] > 0\n\n# 计算连续上涨的块\nstreaks = df[\'is_up\'].astype(int).groupby((df[\'is_up\'] != df[\'is_up\'].shift()).cumsum()).cumsum()\n\nmax_streak = streaks.max()\nmax_streak_date = streaks[streaks == max_streak].index[-1] if max_streak > 0 else None\n\nprint(f"\\n最长连续上涨天数: {max_streak} 天")\nif max_streak_date:\n    print(f"结束日期: {max_streak_date.date()}")\n\n# 查看最长连涨段\nif max_streak > 0:\n    streak_group = (df[\'is_up\'] != df[\'is_up\'].shift()).cumsum()\n    target_group = streak_group[streaks == max_streak].iloc[0]\n    streak_data = df[streak_group == target_group].copy()\n    print("\\n连涨期间数据:")\n    print(streak_data[[\'close\', \'daily_return\']])'
      },
      {
        id: 'task-6-5',
        title: '按月统计',
        description: '按月分组统计：月收益率、月均成交量',
        starterCode: '# 按月统计\nmonthly_stats = df.resample(\'M\').agg({\n    \'close\': lambda x: (x.iloc[-1] / x.iloc[0] - 1) * 100,  # 月收益率\n    \'volume\': \'mean\'\n})\nmonthly_stats.columns = [\'月收益率(%)\', \'月均成交量\']\n\nprint("\\n月度统计:")\nprint(monthly_stats.round(2))'
      },
      {
        id: 'task-6-6',
        title: '计算价格差值',
        description: '用 shift 计算当日与昨日收盘价差值',
        starterCode: '# 使用 shift 计算差值\ndf[\'prev_close\'] = df[\'close\'].shift(1)\ndf[\'price_diff\'] = df[\'close\'] - df[\'prev_close\']\n\nprint("\\n价格差值（前10行）:")\nprint(df[[\'close\', \'prev_close\', \'price_diff\']].head(10))'
      }
    ],
    datasetGeneratorCode: 'import pandas as pd\nimport numpy as np\nfrom datetime import datetime, timedelta\n\nnp.random.seed(42)\n\n# 生成250个交易日的数据\nn_days = 250\nstart_date = datetime(2024, 1, 1)\n\n# 生成日期（跳过周末）\ndates = []\ncurrent_date = start_date\nwhile len(dates) < n_days:\n    if current_date.weekday() < 5:  # 0-4 是周一到周五\n        dates.append(current_date)\n    current_date += timedelta(days=1)\n\n# 生成价格（带趋势的随机游走）\nbase_price = 100\nprices = [base_price]\n\nfor _ in range(1, n_days):\n    # 带轻微上升趋势的随机变动\n    change = np.random.normal(0.001, 0.02)\n    new_price = prices[-1] * (1 + change)\n    prices.append(new_price)\n\nprices = np.array(prices)\n\n# 生成 OHLC 数据\nopen_prices = prices * (1 + np.random.normal(0, 0.005, n_days))\nhigh_prices = np.maximum(prices, open_prices) * (1 + np.random.uniform(0, 0.01, n_days))\nlow_prices = np.minimum(prices, open_prices) * (1 - np.random.uniform(0, 0.01, n_days))\nclose_prices = prices\nvolumes = np.random.randint(100000, 1000000, n_days)\n\n# 创建 DataFrame\ndf = pd.DataFrame({\n    \'date\': dates,\n    \'open\': open_prices.round(2),\n    \'high\': high_prices.round(2),\n    \'low\': low_prices.round(2),\n    \'close\': close_prices.round(2),\n    \'volume\': volumes\n})\n\n# 保存文件\ndf.to_csv(\'stock_data.csv\', index=False, encoding=\'utf-8-sig\')\nprint(f"股票日线数据已生成，共 {len(df)} 个交易日")'
  },
  {
    id: 'project-7',
    title: '字符串与文本处理',
    description: '学习使用 pandas 的 str 方法进行字符串处理',
    difficulty: 'intermediate',
    category: '进阶',
    tags: ['字符串', '正则表达式', '文本处理', 'str方法'],
    tasks: [
      {
        id: 'task-7-1',
        title: '提取中文字符',
        description: '用 str 方法提取昵称中的中文字符',
        starterCode: 'import pandas as pd\nimport numpy as np\nimport re\n\n# 读取数据\ndf = pd.read_csv(\'user_reviews.csv\')\n\nprint("用户评论数据:")\nprint(df.head())\n\n# 提取昵称中的中文字符\ndef extract_chinese(text):\n    if pd.isna(text):\n        return \'\'\n    chinese_chars = re.findall(r\'[\\u4e00-\\u9fff]+\', str(text))\n    return \'\'.join(chinese_chars)\n\ndf[\'nickname_chinese\'] = df[\'nickname\'].apply(extract_chinese)\n\nprint("\\n提取中文字符后:")\nprint(df[[\'nickname\', \'nickname_chinese\']].head(10))'
      },
      {
        id: 'task-7-2',
        title: '统计评论文本长度',
        description: '统计评论文本长度分布',
        starterCode: '# 计算评论长度\ndf[\'review_length\'] = df[\'review_text\'].str.len()\n\nprint("\\n评论长度统计:")\nprint(df[\'review_length\'].describe())\n\n# 长度分布\nprint("\\n评论长度分布（分位数）:")\nprint(df[\'review_length\'].quantile([0.1, 0.25, 0.5, 0.75, 0.9]).round(1))'
      },
      {
        id: 'task-7-3',
        title: '找出包含特定词的评论',
        description: '找出包含特定词（如"好""差""退"）的评论',
        starterCode: '# 查找包含特定词的评论\nkeywords = [\'好\', \'差\', \'退\']\n\nfor keyword in keywords:\n    mask = df[\'review_text\'].str.contains(keyword, na=False)\n    count = mask.sum()\n    print(f"\\n包含\'{keyword}\'的评论: {count} 条")\n    if count > 0:\n        print(df[mask][[\'review_id\', \'review_text\', \'rating\']].head(3))\n\n# 同时包含多个关键词的条件\nmask_good = df[\'review_text\'].str.contains(\'好\', na=False)\nmask_bad = df[\'review_text\'].str.contains(\'差\', na=False)\nprint(f"\\n同时包含\'好\'和\'差\'的评论: {((mask_good) & (mask_bad)).sum()} 条")'
      },
      {
        id: 'task-7-4',
        title: '正则提取信息',
        description: '用正则提取评论中的手机号、金额数字',
        starterCode: '# 提取手机号\nphone_pattern = r\'1[3-9]\\d{9}\'\ndf[\'phone_found\'] = df[\'review_text\'].str.findall(phone_pattern)\n\n# 提取金额数字\nmoney_pattern = r\'(\\d+(?:\\.\\d+)?)[元块]\'\ndf[\'money_found\'] = df[\'review_text\'].str.findall(money_pattern)\n\nprint("\\n提取结果示例:")\nsample_with_info = df[(df[\'phone_found\'].str.len() > 0) | (df[\'money_found\'].str.len() > 0)]\nif len(sample_with_info) > 0:\n    print(sample_with_info[[\'review_text\', \'phone_found\', \'money_found\']].head(5))'
      },
      {
        id: 'task-7-5',
        title: '评分标签化',
        description: '将评分 1-2 星标记为"差评"，4-5 星为"好评"',
        starterCode: '# 评分标签化\ndef rating_label(rating):\n    if rating <= 2:\n        return \'差评\'\n    elif rating >= 4:\n        return \'好评\'\n    else:\n        return \'中评\'\n\ndf[\'rating_label\'] = df[\'rating\'].apply(rating_label)\n\nprint("\\n评分标签统计:")\nprint(df[\'rating_label\'].value_counts())\n\nprint("\\n各标签平均评分:")\nprint(df.groupby(\'rating_label\')[\'rating\'].mean().round(2))'
      },
      {
        id: 'task-7-6',
        title: '统计用户评论情况',
        description: '统计每个用户的平均评论长度和评论数',
        starterCode: '# 统计用户评论情况\nif \'user_id\' in df.columns:\n    user_stats = df.groupby(\'user_id\').agg({\n        \'review_id\': \'count\',\n        \'review_length\': \'mean\',\n        \'rating\': \'mean\'\n    }).round(2)\n    user_stats.columns = [\'评论数\', \'平均长度\', \'平均评分\']\n    \n    print("\\n用户评论统计（前10名活跃用户）:")\n    print(user_stats.sort_values(\'评论数\', ascending=False).head(10))'
      }
    ],
    datasetGeneratorCode: 'import pandas as pd\nimport numpy as np\n\nnp.random.seed(42)\n\nn_reviews = 500\n\n# 生成评论ID\nreview_ids = [f"REV{i:05d}" for i in range(1, n_reviews + 1)]\nuser_ids = np.random.randint(1000, 9999, n_reviews)\n\n# 生成昵称（混合中英文）\nnickname_prefixes = [\'开心\', \'快乐\', \'小明\', \'小红\', \'购物达人\', \'超级买家\', \'user\', \'customer\', \'vip\', \'member\']\nnickname_suffixes = [\'123\', \'_abc\', \'-xyz\', \'888\', \'666\', \'\', \'王\', \'李\', \'张\']\nnicknames = []\nfor _ in range(n_reviews):\n    prefix = np.random.choice(nickname_prefixes)\n    suffix = np.random.choice(nickname_suffixes)\n    nicknames.append(f"{prefix}{suffix}")\n\n# 生成评论文本（包含一些关键词）\nbase_reviews = [\n    "商品质量很好，非常满意！",\n    "物流速度快，包装完好。",\n    "差强人意，有些小问题。",\n    "退货很方便，客服态度好。",\n    "价格实惠，值得购买。",\n    "一般般，没有想象的好。",\n    "推荐购买，物超所值！",\n    "太差了，不会再买。",\n    "已经推荐给朋友了。",\n    "联系电话13812345678咨询。",\n    "花了299元买的，感觉不值。",\n    "用了50块优惠券，很划算。"\n]\n\nreviews = []\nfor _ in range(n_reviews):\n    base = np.random.choice(base_reviews)\n    # 随机添加一些修饰\n    extra = np.random.choice([\'真的\', \'非常\', \'特别\', \'\'], p=[0.1, 0.1, 0.1, 0.7])\n    reviews.append(f"{extra}{base}")\n\n# 生成评分\nratings = np.random.choice([1, 2, 3, 4, 5], n_reviews, p=[0.1, 0.1, 0.2, 0.3, 0.3])\n\n# 创建 DataFrame\ndf = pd.DataFrame({\n    \'review_id\': review_ids,\n    \'user_id\': user_ids,\n    \'nickname\': nicknames,\n    \'review_text\': reviews,\n    \'rating\': ratings\n})\n\n# 确保一些重复用户以统计评论数\nrepeat_users = np.random.choice(user_ids, 50)\nfor user in repeat_users:\n    for _ in range(3):\n        df = pd.concat([df, pd.DataFrame({\n            \'review_id\': [f"REV{len(df)+1:05d}"],\n            \'user_id\': [user],\n            \'nickname\': [np.random.choice(nicknames)],\n            \'review_text\': [np.random.choice(base_reviews)],\n            \'rating\': [np.random.randint(1, 6)]\n        })], ignore_index=True)\n\n# 保存文件\ndf.to_csv(\'user_reviews.csv\', index=False, encoding=\'utf-8-sig\')\nprint(f"用户评论表已生成，共 {len(df)} 条记录")'
  },
  {
    id: 'project-8',
    title: 'NumPy 向量化运算',
    description: '学习 NumPy 的向量化运算和高效计算',
    difficulty: 'advanced',
    category: '高级',
    tags: ['numpy', '向量化', '矩阵运算', '广播'],
    tasks: [
      {
        id: 'task-8-1',
        title: '生成随机数组',
        description: '用 numpy 生成随机数组：正态分布、均匀分布各一个',
        starterCode: 'import numpy as np\nimport pandas as pd\nimport time\n\n# 设置随机种子\nnp.random.seed(42)\n\n# 生成正态分布数组\nnormal_array = np.random.normal(loc=0, scale=1, size=10000)\nprint("正态分布数组:")\nprint(f"形状: {normal_array.shape}")\nprint(f"均值: {normal_array.mean():.4f}")\nprint(f"标准差: {normal_array.std():.4f}")\nprint(f"前5个值: {normal_array[:5]}")\n\n# 生成均匀分布数组\nuniform_array = np.random.uniform(low=0, high=10, size=10000)\nprint("\\n均匀分布数组:")\nprint(f"形状: {uniform_array.shape}")\nprint(f"最小值: {uniform_array.min():.4f}")\nprint(f"最大值: {uniform_array.max():.4f}")\nprint(f"均值: {uniform_array.mean():.4f}")\nprint(f"前5个值: {uniform_array[:5]}")'
      },
      {
        id: 'task-8-2',
        title: '计算统计指标',
        description: '计算数组的均值、标准差、中位数（不用 pandas）',
        starterCode: '# 生成一个较大的数组\nlarge_array = np.random.normal(50, 10, size=100000)\n\n# 计算统计指标\nmean_val = np.mean(large_array)\nstd_val = np.std(large_array)\nmedian_val = np.median(large_array)\nmin_val = np.min(large_array)\nmax_val = np.max(large_array)\npercentile_25 = np.percentile(large_array, 25)\npercentile_75 = np.percentile(large_array, 75)\n\nprint("\\n统计指标计算:")\nprint(f"数组大小: {len(large_array)}")\nprint(f"均值: {mean_val:.4f}")\nprint(f"标准差: {std_val:.4f}")\nprint(f"中位数: {median_val:.4f}")\nprint(f"最小值: {min_val:.4f}")\nprint(f"最大值: {max_val:.4f}")\nprint(f"25分位数: {percentile_25:.4f}")\nprint(f"75分位数: {percentile_75:.4f}")'
      },
      {
        id: 'task-8-3',
        title: '向量化替换',
        description: '向量化实现：将数组中的负数替换为 0',
        starterCode: '# 生成包含负数的数组\narray_with_neg = np.random.randn(10000)\nprint("\\n负数替换前:")\nprint(f"负数个数: {np.sum(array_with_neg < 0)}")\nprint(f"前10个值: {array_with_neg[:10]}")\n\n# 方法1：使用 np.where\narray_clean1 = np.where(array_with_neg < 0, 0, array_with_neg)\n\n# 方法2：使用布尔索引（原地修改）\narray_clean2 = array_with_neg.copy()\narray_clean2[array_clean2 < 0] = 0\n\nprint("\\n负数替换后:")\nprint(f"方法1结果前10个: {array_clean1[:10]}")\nprint(f"方法2结果前10个: {array_clean2[:10]}")\nprint(f"验证一致性: {np.allclose(array_clean1, array_clean2)}")'
      },
      {
        id: 'task-8-4',
        title: '矩阵乘法',
        description: '矩阵乘法：生成两个 100x100 随机矩阵并相乘',
        starterCode: '# 生成两个随机矩阵\nA = np.random.rand(100, 100)\nB = np.random.rand(100, 100)\n\nprint("\\n矩阵乘法:")\nprint(f"矩阵A形状: {A.shape}")\nprint(f"矩阵B形状: {B.shape}")\n\n# 使用 @ 运算符进行矩阵乘法\nstart = time.time()\nC = A @ B\nend = time.time()\n\nprint(f"矩阵乘法结果形状: {C.shape}")\nprint(f"矩阵乘法耗时: {end - start:.6f} 秒")\nprint(f"结果矩阵前3行3列:\\n{C[:3, :3]}")'
      },
      {
        id: 'task-8-5',
        title: '广播运算',
        description: '广播运算：对每一列减去该列的均值',
        starterCode: '# 生成 10000x5 的数据矩阵\ndata_matrix = np.random.randn(10000, 5) * 10 + 50\nprint("\\n广播运算 - 列标准化:")\nprint(f"原始数据前3行:\\n{data_matrix[:3]}")\n\n# 计算每列的均值\ncol_means = np.mean(data_matrix, axis=0)\nprint(f"\\n各列均值: {col_means}")\n\n# 广播：每列减去均值\ncentered_matrix = data_matrix - col_means\nprint(f"\\n中心化后前3行:\\n{centered_matrix[:3]}")\nprint(f"\\n验证：中心化后各列均值（应该接近0）: {np.mean(centered_matrix, axis=0)}")'
      },
      {
        id: 'task-8-6',
        title: '条件赋值',
        description: '用 where 实现条件赋值：大于阈值设为 1，否则 0',
        starterCode: '# 生成数据\nscores = np.random.uniform(0, 100, size=1000)\nthreshold = 60\n\n# 使用 np.where 进行条件赋值\npassed = np.where(scores >= threshold, 1, 0)\n\nprint("\\n条件赋值:")\nprint(f"阈值: {threshold}")\nprint(f"通过人数: {np.sum(passed)}")\nprint(f"通过率: {np.mean(passed)*100:.2f}%")\nprint(f"\\n前10个分数和结果:")\nprint(np.column_stack((scores[:10], passed[:10])))\n'
      }
    ],
    datasetGeneratorCode: 'import numpy as np\nimport pandas as pd\n\nnp.random.seed(42)\n\n# 生成模拟数据并保存示例文件\n# 生成正态分布数据\nnormal_data = np.random.normal(loc=0, scale=1, size=(10000, 5))\ndf_normal = pd.DataFrame(normal_data, columns=[\'f1\', \'f2\', \'f3\', \'f4\', \'f5\'])\n\n# 生成均匀分布数据\nuniform_data = np.random.uniform(low=0, high=100, size=(10000, 3))\ndf_uniform = pd.DataFrame(uniform_data, columns=[\'a\', \'b\', \'c\'])\n\n# 保存文件\ndf_normal.to_csv(\'numpy_data_normal.csv\', index=False)\ndf_uniform.to_csv(\'numpy_data_uniform.csv\', index=False)\nprint("NumPy 模拟数据已生成")\nprint(f"正态分布数据形状: {df_normal.shape}")\nprint(f"均匀分布数据形状: {df_uniform.shape}")'
  },
  {
    id: 'project-9',
    title: '性能优化与向量化',
    description: '学习性能优化技巧，对比不同方法的效率',
    difficulty: 'advanced',
    category: '高级',
    tags: ['性能优化', '向量化', 'eval', 'query', '分块读取'],
    tasks: [
      {
        id: 'task-9-1',
        title: '方法性能对比',
        description: '用 time 模块对比：for 循环 vs apply vs 向量化（计算折扣后价格）',
        starterCode: 'import pandas as pd\nimport numpy as np\nimport time\n\nnp.random.seed(42)\n\n# 生成大数据\nn = 100000\ndf = pd.DataFrame({\n    \'price\': np.random.uniform(10, 1000, n),\n    \'discount\': np.random.uniform(0, 0.3, n)\n})\n\nprint(f"数据大小: {n} 条")\n\n# 方法1：for 循环\nstart = time.time()\nresult1 = []\nfor i in range(len(df)):\n    result1.append(df.loc[i, \'price\'] * (1 - df.loc[i, \'discount\']))\nend = time.time()\ntime1 = end - start\nprint(f"\\n方法1 - for 循环: {time1:.4f} 秒")\n\n# 方法2：apply\nstart = time.time()\nresult2 = df.apply(lambda row: row[\'price\'] * (1 - row[\'discount\']), axis=1)\nend = time.time()\ntime2 = end - start\nprint(f"方法2 - apply: {time2:.4f} 秒 (加速 {time1/time2:.1f}x)")\n\n# 方法3：向量化\nstart = time.time()\nresult3 = df[\'price\'] * (1 - df[\'discount\'])\nend = time.time()\ntime3 = end - start\nprint(f"方法3 - 向量化: {time3:.4f} 秒 (加速 {time1/time3:.1f}x)")\n\n# 验证结果一致\nprint(f"\\n结果一致性验证:")\nprint(f"方法1和2一致: {np.allclose(result1, result2)}")\nprint(f"方法1和3一致: {np.allclose(result1, result3)}")\n'
      },
      {
        id: 'task-9-2',
        title: '使用 eval 和 query',
        description: '用 pandas 的 eval 或 query 加速复杂条件筛选',
        starterCode: '# 使用 query 和 eval\nnp.random.seed(42)\nn = 100000\ndf = pd.DataFrame({\n    \'a\': np.random.randn(n),\n    \'b\': np.random.randn(n),\n    \'c\': np.random.randn(n),\n    \'d\': np.random.randn(n)\n})\n\nprint("\\nQuery 和 Eval 性能测试:")\n\n# 普通方法\nstart = time.time()\nresult_normal = df[(df.a > 0) & (df.b < 0) & (df.c + df.d > 1)]\nend = time.time()\ntime_normal = end - start\nprint(f"普通方法: {time_normal:.4f} 秒")\n\n# query 方法\nstart = time.time()\nresult_query = df.query(\'(a > 0) & (b < 0) & (c + d > 1)\')\nend = time.time()\ntime_query = end - start\nprint(f"query 方法: {time_query:.4f} 秒 (加速 {time_normal/time_query:.1f}x)")\n\n# eval 计算表达式\nstart = time.time()\nresult_eval_normal = df.a + df.b * df.c - df.d / 2\nend = time.time()\ntime_eval_normal = end - start\n\nstart = time.time()\nresult_eval = df.eval(\'a + b * c - d / 2\')\nend = time.time()\ntime_eval = end - start\nprint(f"\\nEval 计算:")\nprint(f"普通方法: {time_eval_normal:.4f} 秒")\nprint(f"eval 方法: {time_eval:.4f} 秒 (加速 {time_eval_normal/time_eval:.1f}x)")\n'
      },
      {
        id: 'task-9-3',
        title: 'category 类型优化',
        description: '将 object 类型的分类列转为 category 类型，对比内存占用',
        starterCode: '# category 类型优化\nnp.random.seed(42)\nn = 100000\ncategories = [\'A\', \'B\', \'C\', \'D\', \'E\']\n\n# 生成数据\ndf = pd.DataFrame({\n    \'category_obj\': np.random.choice(categories, n),\n    \'value\': np.random.randn(n)\n})\n\n# 查看内存使用\nprint("\\n内存使用对比:")\nmem_obj = df[\'category_obj\'].memory_usage(deep=True)\nprint(f"object 类型: {mem_obj / 1024 / 1024:.2f} MB")\n\n# 转为 category 类型\ndf[\'category_cat\'] = df[\'category_obj\'].astype(\'category\')\nmem_cat = df[\'category_cat\'].memory_usage(deep=True)\nprint(f"category 类型: {mem_cat / 1024 / 1024:.6f} MB")\nprint(f"内存节省: {(1 - mem_cat/mem_obj)*100:.2f}%")\n\n# 验证值相同\nprint(f"\\n值一致性验证: {df[\'category_obj\'].equals(df[\'category_cat\'])}")\n'
      },
      {
        id: 'task-9-4',
        title: '分块读取大文件',
        description: '用分块读取处理超过内存的大文件（chunksize）',
        starterCode: '# 分块读取示例\nprint("\\n分块读取示例:")\n\n# 先生成一个较大的示例文件\nnp.random.seed(42)\nn = 100000\ndf_large = pd.DataFrame({\n    \'id\': range(n),\n    \'value1\': np.random.randn(n),\n    \'value2\': np.random.randn(n),\n    \'category\': np.random.choice([\'X\', \'Y\', \'Z\'], n)\n})\ndf_large.to_csv(\'large_file.csv\', index=False)\nprint(f"生成测试文件: {n} 行")\n\n# 分块读取并统计\nchunk_size = 10000\ntotal_count = 0\nsum_value1 = 0\n\nprint("\\n开始分块处理...")\nfor i, chunk in enumerate(pd.read_csv(\'large_file.csv\', chunksize=chunk_size)):\n    chunk_count = len(chunk)\n    chunk_sum = chunk[\'value1\'].sum()\n    \n    total_count += chunk_count\n    sum_value1 += chunk_sum\n    \n    print(f"Chunk {i+1}: 处理 {chunk_count} 行")\n\nprint(f"\\n分块处理完成:")\nprint(f"总行数: {total_count}")\nprint(f"value1 总和: {sum_value1:.4f}")\n'
      },
      {
        id: 'task-9-5',
        title: 'np.where 替代 if-else',
        description: '用 numpy 的 where 替代多重 if-else',
        starterCode: '# np.where 替代多重 if-else\nnp.random.seed(42)\nn = 100000\nscores = np.random.uniform(0, 100, n)\n\nprint("\\nnp.where 替代多重 if-else:")\n\n# 方法1：使用 apply 加自定义函数\ndef get_grade(score):\n    if score >= 90:\n        return \'A\'\n    elif score >= 80:\n        return \'B\'\n    elif score >= 70:\n        return \'C\'\n    elif score >= 60:\n        return \'D\'\n    else:\n        return \'F\'\n\nstart = time.time()\ndf = pd.DataFrame({\'score\': scores})\ngrades1 = df[\'score\'].apply(get_grade)\nend = time.time()\ntime1 = end - start\nprint(f"apply 方法: {time1:.4f} 秒")\n\n# 方法2：使用 np.where\nstart = time.time()\ngrades2 = np.where(scores >= 90, \'A\',\n                   np.where(scores >= 80, \'B\',\n                           np.where(scores >= 70, \'C\',\n                                   np.where(scores >= 60, \'D\', \'F\'))))\nend = time.time()\ntime2 = end - start\nprint(f"np.where 方法: {time2:.4f} 秒 (加速 {time1/time2:.1f}x)")\n\n# 验证结果\nprint(f"\\n结果一致性: {np.all(grades1 == grades2)}")\n'
      }
    ],
    datasetGeneratorCode: 'import pandas as pd\nimport numpy as np\n\nnp.random.seed(42)\n\n# 生成性能测试数据\nn = 100000\ndf_perf = pd.DataFrame({\n    \'price\': np.random.uniform(10, 1000, n),\n    \'quantity\': np.random.randint(1, 100, n),\n    \'discount\': np.random.uniform(0, 0.3, n),\n    \'category\': np.random.choice([\'Electronics\', \'Clothing\', \'Food\', \'Books\'], n)\n})\n\n# 生成更大的文件用于分块测试\nn_large = 500000\ndf_large = pd.DataFrame({\n    \'id\': range(n_large),\n    \'value1\': np.random.randn(n_large),\n    \'value2\': np.random.randn(n_large),\n    \'value3\': np.random.randn(n_large),\n    \'category\': np.random.choice([\'A\', \'B\', \'C\', \'D\', \'E\', \'F\', \'G\', \'H\'], n_large)\n})\n\n# 保存文件\ndf_perf.to_csv(\'performance_data.csv\', index=False)\ndf_large.to_csv(\'large_file_example.csv\', index=False)\n\nprint("性能测试数据已生成")\nprint(f"performance_data.csv: {len(df_perf)} 行")\nprint(f"large_file_example.csv: {len(df_large)} 行")\n'
  },
  {
    id: 'project-10',
    title: '完整数据分析流水线',
    description: '综合应用所有技巧，完成完整的数据分析项目',
    difficulty: 'advanced',
    category: '高级',
    tags: ['完整项目', 'EDA', '特征工程', '流水线', '报告'],
    tasks: [
      {
        id: 'task-10-1',
        title: '完整 EDA',
        description: '完成完整 EDA：缺失值、异常值、分布、相关性',
        starterCode: 'import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\nimport seaborn as sns\n\n# 设置中文字体\nplt.rcParams[\'font.sans-serif\'] = [\'WenQuanYi Zen Hei\', \'Microsoft YaHei\', \'SimHei\']\nplt.rcParams[\'axes.unicode_minus\'] = False\n\n# 读取数据\ndf = pd.read_csv(\'churn_data.csv\')\n\nprint("="*60)\nprint("完整探索性数据分析 (EDA)")\nprint("="*60)\n\nprint("\\n1. 数据概览:")\nprint(f"数据形状: {df.shape}")\nprint("\\n数据类型:")\nprint(df.dtypes)\nprint("\\n前5行:")\nprint(df.head())\nprint("\\n统计描述:")\nprint(df.describe(include=\'all\'))\n\nprint("\\n2. 缺失值分析:")\nmissing = df.isnull().sum()\nmissing_pct = (missing / len(df)) * 100\nmissing_df = pd.DataFrame({\'缺失数\': missing, \'缺失率(%)\': missing_pct.round(2)})\nprint(missing_df[missing_df[\'缺失数\'] > 0] if missing.sum() > 0 else "无缺失值")\n\nprint("\\n3. 目标变量分析:")\nif \'churn\' in df.columns:\n    churn_dist = df[\'churn\'].value_counts(normalize=True) * 100\n    print(churn_dist)\n    \n    plt.figure(figsize=(8, 5))\n    churn_dist.plot(kind=\'bar\')\n    plt.title(\'用户流失分布\')\n    plt.ylabel(\'百分比 (%)\')\n    plt.tight_layout()\n    plt.show()\n\nprint("\\n4. 数值变量分布:")\nnumeric_cols = df.select_dtypes(include=[np.number]).columns\nprint(f"数值列: {list(numeric_cols)}")\n\nif len(numeric_cols) > 0:\n    fig, axes = plt.subplots(2, min(3, len(numeric_cols)//2 + 1), figsize=(15, 10))\n    axes = axes.ravel()\n    for i, col in enumerate(numeric_cols[:min(6, len(numeric_cols))]):\n        axes[i].hist(df[col].dropna(), bins=30, edgecolor=\'black\', alpha=0.7)\n        axes[i].set_title(f\'{col} 分布\')\n    plt.tight_layout()\n    plt.show()\n\nprint("\\n5. 相关性分析:")\nif len(numeric_cols) > 1:\n    corr_matrix = df[numeric_cols].corr()\n    print("相关系数矩阵:")\n    print(corr_matrix.round(2))\n    \n    plt.figure(figsize=(10, 8))\n    sns.heatmap(corr_matrix, annot=True, cmap=\'coolwarm\', center=0, fmt=\'.2f\')\n    plt.title(\'特征相关性热力图\')\n    plt.tight_layout()\n    plt.show()\n'
      },
      {
        id: 'task-10-2',
        title: '特征工程',
        description: '年龄分段、收入分层、使用时长分组',
        starterCode: '# 特征工程\nprint("="*60)\nprint("特征工程")\nprint("="*60)\n\ndf_feat = df.copy()\n\n# 年龄分段\nif \'age\' in df_feat.columns:\n    df_feat[\'age_group\'] = pd.cut(df_feat[\'age\'], \n                                  bins=[0, 25, 35, 45, 55, 100],\n                                  labels=[\'18-25\', \'26-35\', \'36-45\', \'46-55\', \'55+\'])\n    print("\\n年龄分段分布:")\n    print(df_feat[\'age_group\'].value_counts().sort_index())\n\n# 收入分层\nif \'income\' in df_feat.columns:\n    income_q = df_feat[\'income\'].quantile([0.33, 0.66])\n    df_feat[\'income_level\'] = pd.cut(df_feat[\'income\'],\n                                     bins=[-np.inf, income_q[0.33], income_q[0.66], np.inf],\n                                     labels=[\'低收入\', \'中等收入\', \'高收入\'])\n    print("\\n收入分层分布:")\n    print(df_feat[\'income_level\'].value_counts())\n\n# 使用时长分组（假设有 tenure 字段）\nif \'tenure\' in df_feat.columns:\n    df_feat[\'tenure_group\'] = pd.cut(df_feat[\'tenure\'],\n                                     bins=[0, 3, 6, 12, 24, np.inf],\n                                     labels=[\'0-3月\', \'3-6月\', \'6-12月\', \'1-2年\', \'2年以上\'])\n    print("\\n使用时长分组:")\n    print(df_feat[\'tenure_group\'].value_counts().sort_index())\n\nprint("\\n特征工程完成，新列:")\nnew_cols = [col for col in df_feat.columns if col not in df.columns]\nprint(new_cols)\n'
      },
      {
        id: 'task-10-3',
        title: '分组分析',
        description: '用 groupby 分析不同群体流失率的差异',
        starterCode: '# 分组分析\nprint("="*60)\nprint("分组分析 - 不同群体流失率")\nprint("="*60)\n\nif \'churn\' in df_feat.columns:\n    # 年龄分组流失率\n    if \'age_group\' in df_feat.columns:\n        age_churn = df_feat.groupby(\'age_group\')[\'churn\'].agg([\'mean\', \'count\'])\n        age_churn[\'mean\'] = (age_churn[\'mean\'] * 100).round(2)\n        age_churn.columns = [\'流失率(%)\', \'人数\']\n        print("\\n年龄分组流失率:")\n        print(age_churn)\n    \n    # 收入分层流失率\n    if \'income_level\' in df_feat.columns:\n        income_churn = df_feat.groupby(\'income_level\')[\'churn\'].agg([\'mean\', \'count\'])\n        income_churn[\'mean\'] = (income_churn[\'mean\'] * 100).round(2)\n        income_churn.columns = [\'流失率(%)\', \'人数\']\n        print("\\n收入分层流失率:")\n        print(income_churn)\n    \n    # 使用时长分组流失率\n    if \'tenure_group\' in df_feat.columns:\n        tenure_churn = df_feat.groupby(\'tenure_group\')[\'churn\'].agg([\'mean\', \'count\'])\n        tenure_churn[\'mean\'] = (tenure_churn[\'mean\'] * 100).round(2)\n        tenure_churn.columns = [\'流失率(%)\', \'人数\']\n        print("\\n使用时长分组流失率:")\n        print(tenure_churn)\n'
      },
      {
        id: 'task-10-4',
        title: '创建风险评分',
        description: '创建流失风险评分规则（自定义权重计算）',
        starterCode: '# 创建流失风险评分\nprint("="*60)\nprint("流失风险评分系统")\nprint("="*60)\n\nif all(col in df_feat.columns for col in [\'tenure\', \'income\', \'age\']):\n    df_score = df_feat.copy()\n    \n    # 简单的评分规则\n    # 使用时长越短风险越高\n    df_score[\'tenure_score\'] = np.where(df_score[\'tenure\'] < 3, 30,\n                                        np.where(df_score[\'tenure\'] < 6, 20,\n                                                np.where(df_score[\'tenure\'] < 12, 10, 0)))\n    \n    # 收入越低风险越高\n    income_med = df_score[\'income\'].median()\n    df_score[\'income_score\'] = np.where(df_score[\'income\'] < income_med * 0.7, 25,\n                                        np.where(df_score[\'income\'] < income_med, 15, 5))\n    \n    # 年轻用户风险较高\n    df_score[\'age_score\'] = np.where(df_score[\'age\'] < 25, 20,\n                                      np.where(df_score[\'age\'] < 35, 10, 5))\n    \n    # 总风险评分\n    df_score[\'risk_score\'] = df_score[\'tenure_score\'] + df_score[\'income_score\'] + df_score[\'age_score\']\n    \n    # 风险等级\n    df_score[\'risk_level\'] = pd.cut(df_score[\'risk_score\'],\n                                     bins=[-1, 20, 40, 60, 100],\n                                     labels=[\'低风险\', \'中风险\', \'高风险\', \'极高风险\'])\n    \n    print("\\n风险评分统计:")\n    print(df_score[\'risk_score\'].describe())\n    \n    print("\\n风险等级分布:")\n    print(df_score[\'risk_level\'].value_counts().sort_index())\n    \n    if \'churn\' in df_score.columns:\n        risk_churn = df_score.groupby(\'risk_level\')[\'churn\'].mean() * 100\n        print("\\n各风险等级实际流失率:")\n        print(risk_churn.round(2))\n'
      },
      {
        id: 'task-10-5',
        title: '输出分析报告',
        description: '输出一份分析报告（含代码、图表、结论）',
        starterCode: '# 生成分析报告\nprint("="*60)\nprint("综合分析报告")\nprint("="*60)\n\nprint("\\n1. 业务洞察:")\nif \'churn\' in df_score.columns and \'risk_level\' in df_score.columns:\n    overall_churn = df_score[\'churn\'].mean() * 100\n    high_risk_count = (df_score[\'risk_level\'] == \'高风险\').sum()\n    extreme_risk_count = (df_score[\'risk_level\'] == \'极高风险\').sum()\n    \n    print(f"- 整体流失率: {overall_churn:.2f}%")\n    print(f"- 高风险用户数: {high_risk_count}")\n    print(f"- 极高风险用户数: {extreme_risk_count}")\n    print(f"- 需要关注的高风险用户占比: {(high_risk_count + extreme_risk_count)/len(df_score)*100:.2f}%")\n\nprint("\\n2. 关键发现:")\nprint("- 使用时长是最重要的风险因素")\nprint("- 新用户需要特别关注和引导")\nprint("- 低收入用户流失风险较高")\n\nprint("\\n3. 建议措施:")\nprint("- 对新用户提供新手引导和专属优惠")\nprint("- 针对高风险用户进行主动触达")\nprint("- 设计用户分层运营策略")\n\nprint("\\n4. 后续优化方向:")\nprint("- 收集更多用户行为数据")\nprint("- 使用机器学习模型提升预测精度")\nprint("- A/B 测试不同的干预措施")\n\nprint("\\n" + "="*60)\nprint("分析完成！")\nprint("="*60)\n'
      },
      {
        id: 'task-10-6',
        title: '封装流水线',
        description: '将整个流程封装成函数，输入文件路径输出报告',
        starterCode: '# 封装成完整的分析流水线函数\n\ndef churn_analysis_pipeline(file_path, target_col=\'churn\'):\n    """\n    流失分析完整流水线\n    """\n    import pandas as pd\n    import numpy as np\n    \n    # 1. 读取数据\n    df = pd.read_csv(file_path)\n    print(f"数据加载成功: {df.shape}")\n    \n    # 2. 基础清洗\n    df_clean = df.copy()\n    \n    # 简单缺失值处理\n    numeric_cols = df_clean.select_dtypes(include=[np.number]).columns\n    for col in numeric_cols:\n        if df_clean[col].isnull().sum() > 0:\n            df_clean[col] = df_clean[col].fillna(df_clean[col].median())\n    \n    # 3. 特征工程\n    if \'age\' in df_clean.columns:\n        df_clean[\'age_group\'] = pd.cut(df_clean[\'age\'], \n                                      bins=[0, 25, 35, 45, 55, 100],\n                                      labels=[\'18-25\', \'26-35\', \'36-45\', \'46-55\', \'55+\'])\n    \n    if \'income\' in df_clean.columns:\n        income_q = df_clean[\'income\'].quantile([0.33, 0.66])\n        df_clean[\'income_level\'] = pd.cut(df_clean[\'income\'],\n                                         bins=[-np.inf, income_q[0.33], income_q[0.66], np.inf],\n                                         labels=[\'低收入\', \'中等收入\', \'高收入\'])\n    \n    if \'tenure\' in df_clean.columns:\n        df_clean[\'tenure_group\'] = pd.cut(df_clean[\'tenure\'],\n                                         bins=[0, 3, 6, 12, 24, np.inf],\n                                         labels=[\'0-3月\', \'3-6月\', \'6-12月\', \'1-2年\', \'2年以上\'])\n    \n    # 4. 简单评分\n    df_result = df_clean.copy()\n    \n    if all(col in df_clean.columns for col in [\'tenure\', \'income\']):\n        df_result[\'risk_score\'] = (\n            np.where(df_clean[\'tenure\'] < 3, 30,\n                    np.where(df_clean[\'tenure\'] < 6, 20,\n                            np.where(df_clean[\'tenure\'] < 12, 10, 0))) +\n            np.where(df_clean[\'income\'] < df_clean[\'income\'].median() * 0.7, 25,\n                    np.where(df_clean[\'income\'] < df_clean[\'income\'].median(), 15, 5))\n        )\n    \n    print(f"分析完成，处理了 {len(df_result)} 条记录")\n    return df_result\n\n# 使用示例\nprint("="*60)\nprint("流水线函数已定义")\nprint("使用方法:")\nprint("result_df = churn_analysis_pipeline(\'your_data.csv\')")\nprint("="*60)\n'
      }
    ],
    datasetGeneratorCode: 'import pandas as pd\nimport numpy as np\n\nnp.random.seed(42)\n\n# 生成银行客户流失数据\nn_customers = 10000\n\n# 生成特征\ncustomer_ids = [f"CUST{i:06d}" for i in range(1, n_customers + 1)]\nage = np.random.randint(18, 70, n_customers)\ntenure = np.random.randint(0, 60, n_customers)  # 月数\nincome = np.random.normal(5000, 1500, n_customers).clip(2000, 15000)\ncredit_score = np.random.randint(300, 850, n_customers)\nproducts_count = np.random.randint(1, 5, n_customers)\nis_active = np.random.choice([0, 1], n_customers, p=[0.3, 0.7])\nbalance = np.random.normal(10000, 5000, n_customers).clip(0, 50000)\n\n# 生成流失标签（基于特征的规则）\nrisk_score = (\n    (tenure < 6).astype(int) * 3 +\n    (income < 4000).astype(int) * 2 +\n    (credit_score < 600).astype(int) * 2 +\n    (is_active == 0).astype(int) * 2\n)\n\nchurn_prob = 1 / (1 + np.exp(-(risk_score - 5)))\nchurn = (np.random.random(n_customers) < churn_prob).astype(int)\n\n# 创建 DataFrame\ndf = pd.DataFrame({\n    \'customer_id\': customer_ids,\n    \'age\': age,\n    \'tenure\': tenure,\n    \'income\': income.round(2),\n    \'credit_score\': credit_score,\n    \'products_count\': products_count,\n    \'is_active\': is_active,\n    \'balance\': balance.round(2),\n    \'churn\': churn\n})\n\n# 引入一些缺失值\nfor col in [\'income\', \'credit_score\', \'balance\']:\n    mask = np.random.random(n_customers) < 0.02\n    df.loc[mask, col] = np.nan\n\n# 保存文件\ndf.to_csv(\'churn_data.csv\', index=False, encoding=\'utf-8-sig\')\nprint(f"银行客户流失数据已生成，共 {len(df)} 条记录")\nprint(f"流失率: {df[\'churn\'].mean()*100:.2f}%")\n'
  }
];

export const getProjectById = (id: string) => projects.find(p => p.id === id);