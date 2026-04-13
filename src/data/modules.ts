import type { Module } from '../types';

export const modules: Module[] = [
  {
    id: 'python-basics',
    title: 'Python 基础入门',
    description: '从零开始学习 Python 编程语言，掌握数据分析必备的编程基础',
    icon: '🐍',
    color: '#3776AB',
    order: 1,
    lessons: [
      {
        id: 'pb-1',
        title: '认识 Python 与开发环境',
        description: '了解 Python 语言特点，搭建数据分析开发环境',
        duration: 30,
        content: `# 认识 Python 与开发环境

## Python 简介
Python 是一种简洁、易读且功能强大的编程语言，广泛应用于数据分析、人工智能、Web 开发等领域。

### 为什么选择 Python 进行数据分析？
- **语法简洁**：接近自然语言，学习曲线平缓
- **生态丰富**：拥有 Pandas、NumPy、Matplotlib 等强大的数据分析库
- **社区活跃**：海量学习资源和第三方库支持
- **跨平台**：可在 Windows、macOS、Linux 上运行

## Python 基本语法

### 变量与数据类型
\`\`\`python
# 数字类型
age = 20          # 整数 int
price = 99.9      # 浮点数 float
is_student = True # 布尔值 bool

# 字符串类型
name = "张三"
university = '商务数据分析学院'

# 类型查看
print(type(age))      # <class 'int'>
print(type(price))    # <class 'float'>
print(type(name))     # <class 'str'>
\`\`\`

### 基本运算
\`\`\`python
# 算术运算
print(10 + 3)    # 13  加法
print(10 - 3)    # 7   减法
print(10 * 3)    # 30  乘法
print(10 / 3)    # 3.333... 除法
print(10 // 3)   # 3   整除
print(10 % 3)    # 1   取余
print(10 ** 3)   # 1000 幂运算

# 比较运算
print(10 > 3)    # True
print(10 == 3)   # False
print(10 != 3)   # True
\`\`\`

### 字符串操作
\`\`\`python
name = "数据分析"
print(name[0])          # 数
print(name[1:4])        # 据分析
print(len(name))        # 4
print(name + "入门")    # 数据分析入门
print(f"欢迎学习{name}") # 欢迎学习数据分析
\`\`\``,
        codeExample: `# 试试 Python 的基本操作
name = "商务数据分析"
print(f"欢迎来到{name}学习平台！")
print(f"平台名称长度: {len(name)}")

# 计算平均分
scores = [85, 92, 78, 95, 88]
average = sum(scores) / len(scores)
print(f"平均分: {average:.1f}")
print(f"最高分: {max(scores)}")
print(f"最低分: {min(scores)}")`,
        keyPoints: [
          'Python 是数据分析领域最流行的编程语言',
          'Python 有四种基本数据类型：int、float、str、bool',
          '使用 type() 函数可以查看变量类型',
          'f-string 是 Python 3.6+ 推荐的字符串格式化方式'
        ]
      },
      {
        id: 'pb-2',
        title: '条件判断与循环',
        description: '掌握程序流程控制：if 条件判断和 for/while 循环',
        duration: 40,
        content: `# 条件判断与循环

## 条件判断 (if/elif/else)

\`\`\`python
score = 85

if score >= 90:
    grade = "优秀"
elif score >= 80:
    grade = "良好"
elif score >= 60:
    grade = "及格"
else:
    grade = "不及格"

print(f"成绩等级: {grade}")  # 良好
\`\`\`

### 多条件组合
\`\`\`python
# and - 两个条件都满足
# or  - 满足其中一个
# not - 条件取反

sales = 15000
is_new_customer = True

if sales > 10000 and is_new_customer:
    discount = 0.15
    print("新客户大额订单，享受85折")
elif sales > 5000:
    discount = 0.1
    print("大额订单，享受9折")
else:
    discount = 0
    print("无折扣")
\`\`\`

## for 循环

\`\`\`python
# 遍历列表
products = ["笔记本电脑", "手机", "平板"]
for product in products:
    print(f"商品: {product}")

# 使用 range()
for i in range(5):
    print(f"第 {i+1} 次循环")

# 带索引遍历
for i, product in enumerate(products):
    print(f"{i+1}. {product}")
\`\`\`

## while 循环

\`\`\`python
# 累加直到超过100
total = 0
n = 1
while total <= 100:
    total += n
    n += 1
print(f"1+2+...+{n-1} = {total}")
\`\`\`

## 列表推导式（Python 特色）
\`\`\`python
# 传统方式
squares = []
for i in range(10):
    squares.append(i ** 2)

# 列表推导式（推荐）
squares = [i ** 2 for i in range(10)]
print(squares)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# 带条件的列表推导式
even_squares = [i ** 2 for i in range(10) if i % 2 == 0]
print(even_squares)  # [0, 4, 16, 36, 64]
\`\`\``,
        codeExample: `# 商务场景：销售数据分析
sales_data = [
    {"product": "笔记本", "sales": 15000, "region": "华东"},
    {"product": "手机", "sales": 28000, "region": "华南"},
    {"product": "平板", "sales": 8500, "region": "华北"},
    {"product": "耳机", "sales": 32000, "region": "华东"},
    {"product": "键盘", "sales": 4200, "region": "华南"},
]

# 1. 找出销售额超过10000的产品
high_sales = [d["product"] for d in sales_data if d["sales"] > 10000]
print(f"高销售额产品: {high_sales}")

# 2. 计算总销售额
total = sum(d["sales"] for d in sales_data)
print(f"总销售额: ¥{total:,}")

# 3. 按区域统计
regions = {}
for d in sales_data:
    region = d["region"]
    regions[region] = regions.get(region, 0) + d["sales"]

for region, amount in regions.items():
    print(f"{region}: ¥{amount:,}")`,
        keyPoints: [
          'if/elif/else 实现多分支条件判断',
          'and、or、not 用于组合多个条件',
          'for 循环用于遍历序列，while 循环用于条件控制',
          '列表推导式是 Python 的特色语法，简洁高效'
        ]
      },
      {
        id: 'pb-3',
        title: '函数与模块',
        description: '学习函数定义、参数传递和模块导入',
        duration: 35,
        content: `# 函数与模块

## 定义函数

\`\`\`python
def calculate_tax(price, tax_rate=0.13):
    """计算含税价格"""
    tax_amount = price * tax_rate
    total = price + tax_amount
    return round(total, 2)

# 调用函数
print(calculate_tax(100))         # 113.0
print(calculate_tax(100, 0.06))   # 106.0
\`\`\`

### 多返回值
\`\`\`python
def analyze_sales(data):
    total = sum(data)
    average = total / len(data)
    maximum = max(data)
    minimum = min(data)
    return total, average, maximum, minimum

sales = [1200, 3500, 2800, 4100, 1900]
total, avg, max_val, min_val = analyze_sales(sales)
print(f"总计: {total}, 均值: {avg:.0f}")
print(f"最高: {max_val}, 最低: {min_val}")
\`\`\`

## Lambda 匿名函数
\`\`\`python
# 普通函数
def double(x):
    return x * 2

# Lambda 等价写法
double = lambda x: x * 2

# 常与内置函数配合使用
data = [15, 8, 23, 42, 3, 16]
sorted_data = sorted(data, key=lambda x: -x)
print(sorted_data)  # [42, 23, 16, 15, 8, 3]
\`\`\`

## 常用内置函数
\`\`\`python
# 数学相关
print(abs(-5))        # 5 绝对值
print(round(3.1416, 2))  # 3.14 四舍五入
print(sum([1,2,3]))    # 6 求和
print(max([1,2,3]))    # 3 最大值
print(min([1,2,3]))    # 1 最小值

# 序列相关
print(len("hello"))    # 5 长度
print(sorted([3,1,2])) # [1,2,3] 排序
print(list(range(5)))  # [0,1,2,3,4] 范围
\`\`\``,
        codeExample: `# 商务场景：利润分析工具

def calculate_profit(revenue, cost):
    """计算利润及相关指标"""
    profit = revenue - cost
    profit_rate = (profit / revenue) * 100 if revenue > 0 else 0
    return {
        "revenue": revenue,
        "cost": cost,
        "profit": profit,
        "profit_rate": round(profit_rate, 2)
    }

# 分析多个季度的数据
quarters = [
    ("Q1", 500000, 380000),
    ("Q2", 620000, 410000),
    ("Q3", 580000, 395000),
    ("Q4", 750000, 480000),
]

print("季度利润分析报告")
print("-" * 50)
for quarter, revenue, cost in quarters:
    result = calculate_profit(revenue, cost)
    status = "盈利" if result["profit"] > 0 else "亏损"
    print(f"{quarter}: 收入¥{revenue:,} 成本¥{cost:,}")
    print(f"  利润: ¥{result['profit']:,} 利润率: {result['profit_rate']}% [{status}]")

# 使用 lambda 找出利润率最高的季度
results = [calculate_profit(r, c) for _, r, c in quarters]
best = max(results, key=lambda x: x["profit_rate"])
print(f"\n最佳季度利润率: {best['profit_rate']}%")`,
        keyPoints: [
          '使用 def 关键字定义函数，用 return 返回结果',
          '函数可以设置默认参数，提高复用性',
          'Lambda 匿名函数适合简单的单行操作',
          'Python 内置函数（sum、max、min、sorted）非常实用'
        ]
      },
      {
        id: 'pb-4',
        title: '数据结构详解',
        description: '深入理解列表、字典、元组和集合的使用',
        duration: 45,
        content: `# 数据结构详解

## 列表 (List)
\`\`\`python
# 创建与访问
fruits = ["苹果", "香蕉", "橙子", "葡萄"]
print(fruits[0])      # 苹果
print(fruits[-1])     # 葡萄（倒数第一个）
print(fruits[1:3])    # ["香蕉", "橙子"]（切片）

# 常用操作
fruits.append("芒果")       # 末尾添加
fruits.insert(1, "草莓")    # 指定位置插入
fruits.remove("橙子")       # 删除指定值
popped = fruits.pop()       # 弹出末尾元素
\`\`\`

## 字典 (Dict)
\`\`\`python
# 创建字典
student = {
    "name": "李明",
    "age": 20,
    "major": "商务数据分析",
    "gpa": 3.8
}

# 访问与修改
print(student["name"])           # 李明
student["gpa"] = 3.9             # 修改
student["email"] = "li@mail.com" # 新增

# 遍历
for key, value in student.items():
    print(f"{key}: {value}")
\`\`\`

## 元组 (Tuple) - 不可变序列
\`\`\`python
point = (120.5, 30.2)  # 经纬度
rgb = (255, 128, 0)     # 颜色值
\`\`\`

## 集合 (Set) - 去重与集合运算
\`\`\`python
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(a & b)  # {3, 4} 交集
print(a | b)  # {1,2,3,4,5,6} 并集
print(a - b)  # {1, 2} 差集
\`\`\`

## 字典列表 - 数据分析常用结构
\`\`\`python
employees = [
    {"name": "张三", "department": "销售", "salary": 8000},
    {"name": "李四", "department": "技术", "salary": 12000},
    {"name": "王五", "department": "销售", "salary": 9000},
]

# 按部门分组
from collections import defaultdict
dept_groups = defaultdict(list)
for emp in employees:
    dept_groups[emp["department"]].append(emp["salary"])

for dept, salaries in dept_groups.items():
    avg = sum(salaries) / len(salaries)
    print(f"{dept}部门平均薪资: ¥{avg:,.0f}")
\`\`\``,
        codeExample: `# 商务场景：电商订单数据处理

orders = [
    {"order_id": "A001", "product": "笔记本", "quantity": 2, "price": 5999, "status": "已完成"},
    {"order_id": "A002", "product": "鼠标", "quantity": 5, "price": 129, "status": "已完成"},
    {"order_id": "A003", "product": "键盘", "quantity": 3, "price": 299, "status": "待发货"},
    {"order_id": "A004", "product": "显示器", "quantity": 1, "price": 2499, "status": "已完成"},
    {"order_id": "A005", "product": "笔记本", "quantity": 1, "price": 5999, "status": "已取消"},
]

# 1. 计算每笔订单金额
for order in orders:
    order["amount"] = order["quantity"] * order["price"]

# 2. 统计已完成订单总额
completed = [o for o in orders if o["status"] == "已完成"]
total_revenue = sum(o["amount"] for o in completed)
print(f"已完成订单总额: ¥{total_revenue:,}")

# 3. 找出金额最大的订单
top_order = max(orders, key=lambda o: o["amount"])
print(f"最大订单: {top_order['product']} ¥{top_order['amount']:,}")

# 4. 按商品统计销量
product_sales = {}
for o in orders:
    if o["status"] != "已取消":
        product_sales[o["product"]] = product_sales.get(o["product"], 0) + o["quantity"]

print("\\n商品销量统计:")
for product, qty in product_sales.items():
    print(f"  {product}: {qty}件")`,
        keyPoints: [
          '列表用 [] 创建，支持索引、切片和增删改查',
          '字典用 {} 创建，以键值对形式存储数据',
          '字典列表是数据分析中最常用的数据结构之一',
          '集合自动去重，支持交集、并集、差集运算'
        ]
      }
    ],
    exercises: [
      {
        id: 'pb-ex-1',
        type: 'choice',
        question: '以下哪个是 Python 中正确的变量命名？',
        options: ['2sales', 'sales-data', 'sales_data', 'class'],
        answer: 'sales_data',
        score: 10
      },
      {
        id: 'pb-ex-2',
        type: 'choice',
        question: 'Python 中 type(3.14) 的返回值是什么？',
        options: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'number'>"],
        answer: "<class 'float'>",
        score: 10
      },
      {
        id: 'pb-ex-3',
        type: 'choice',
        question: '以下代码的输出结果是什么？\n\n```python\nx = [1, 2, 3, 4, 5]\nprint(x[1:4])\n```',
        options: ['[1, 2, 3]', '[2, 3, 4]', '[2, 3, 4, 5]', '[1, 2, 3, 4]'],
        answer: '[2, 3, 4]',
        score: 10
      },
      {
        id: 'pb-ex-4',
        type: 'choice',
        question: '列表推导式 [x**2 for x in range(5)] 的结果是？',
        options: ['[1, 4, 9, 16, 25]', '[0, 1, 4, 9, 16]', '[0, 2, 4, 6, 8]', '[1, 2, 3, 4, 5]'],
        answer: '[0, 1, 4, 9, 16]',
        score: 10
      },
      {
        id: 'pb-ex-5',
        type: 'code',
        question: '编写一个函数 calculate_discount(price, level)，根据会员等级计算折扣价格：\n- 普通会员(level="normal")：95折\n- 银牌会员(level="silver")：9折\n- 金牌会员(level="gold")：85折\n\n返回折扣后的价格（保留2位小数）。',
        codeTemplate: `def calculate_discount(price, level):
    # 在这里编写你的代码
    pass\n\n# 测试\nprint(calculate_discount(100, "normal"))  # 应输出 95.0\nprint(calculate_discount(100, "gold"))    # 应输出 85.0`,
        answer: '95.0',
        hint: '使用 if/elif/else 判断不同的会员等级，然后计算 price * 折扣率',
        score: 20
      }
    ],
    quiz: {
      id: 'pb-quiz',
      title: 'Python 基础入门 - 阶段测评',
      description: '检验你对 Python 基础知识的掌握程度',
      timeLimit: 30,
      passingScore: 60,
      questions: [
        {
          id: 'pb-q1',
          type: 'choice',
          question: 'Python 中以下哪种数据类型是不可变的？',
          options: ['列表 (list)', '字典 (dict)', '元组 (tuple)', '集合 (set)'],
          answer: '元组 (tuple)',
          score: 10
        },
        {
          id: 'pb-q2',
          type: 'choice',
          question: '以下哪个运算符用于整除？',
          options: ['/', '//', '%', '**'],
          answer: '//',
          score: 10
        },
        {
          id: 'pb-q3',
          type: 'choice',
          question: '如何正确遍历字典的所有键值对？',
          options: [
            'for key in dict:',
            'for key, value in dict.items():',
            'for key, value in dict:',
            'for key, value in dict.values():'
          ],
          answer: 'for key, value in dict.items():',
          score: 10
        },
        {
          id: 'pb-q4',
          type: 'choice',
          question: '以下代码的输出是什么？\n```python\nx = [i for i in range(10) if i % 3 == 0]\nprint(x)\n```',
          options: ['[0, 3, 6, 9]', '[3, 6, 9]', '[0, 1, 2, 3]', '[1, 4, 7]'],
          answer: '[0, 3, 6, 9]',
          score: 10
        },
        {
          id: 'pb-q5',
          type: 'choice',
          question: 'Python 函数中，*args 和 **kwargs 的作用分别是什么？',
          options: [
            '接收任意数量的位置参数和关键字参数',
            '定义全局变量和局部变量',
            '导入模块和导出模块',
            '定义类属性和实例属性'
          ],
          answer: '接收任意数量的位置参数和关键字参数',
          score: 10
        },
        {
          id: 'pb-q6',
          type: 'choice',
          question: '以下哪个不是 Python 的内置数据结构？',
          options: ['list', 'array', 'dict', 'set'],
          answer: 'array',
          score: 10
        },
        {
          id: 'pb-q7',
          type: 'code',
          question: '编写一个函数 stats(numbers)，接收一个数字列表，返回包含以下内容的字典：\n- "mean": 平均值\n- "max": 最大值\n- "min": 最小值\n- "count": 元素个数\n\n所有数值保留2位小数。',
          codeTemplate: `def stats(numbers):\n    # 在这里编写你的代码\n    pass\n\n# 测试\ndata = [23, 45, 67, 12, 89, 34]\nresult = stats(data)\nprint(result)\n# 预期输出: {"mean": 45.0, "max": 89, "min": 12, "count": 6}`,
          answer: '45.0',
          hint: '使用 sum()、len()、max()、min() 等内置函数',
          score: 20
        }
      ]
    }
  },
  {
    id: 'pandas-data',
    title: 'Pandas 数据处理',
    description: '掌握 Pandas 库进行数据清洗、转换和分析的核心技能',
    icon: '🐼',
    color: '#150458',
    order: 2,
    lessons: [
      {
        id: 'pd-1',
        title: 'Pandas 入门与数据加载',
        description: '认识 Pandas 的核心数据结构，学习数据加载与查看',
        duration: 40,
        content: `# Pandas 入门与数据加载

## 什么是 Pandas？
Pandas 是 Python 最流行的数据分析库，提供了高效的数据结构和数据分析工具。

## 核心数据结构

### Series - 一维数据
\`\`\`python
import pandas as pd

# 创建 Series
sales = pd.Series([150, 230, 180, 310, 275])
print(sales)

# 带索引的 Series
monthly_sales = pd.Series(
    [150, 230, 180, 310, 275],
    index=["1月", "2月", "3月", "4月", "5月"]
)
print(monthly_sales["3月"])  # 180
\`\`\`

### DataFrame - 二维表格
\`\`\`python
# 从字典创建 DataFrame
data = {
    "产品": ["笔记本", "手机", "平板", "耳机"],
    "价格": [5999, 3999, 2999, 899],
    "销量": [120, 350, 200, 500],
    "评分": [4.8, 4.6, 4.5, 4.7]
}
df = pd.DataFrame(data)
print(df)
\`\`\`

## 数据查看方法
\`\`\`python
# 查看前几行
df.head(3)

# 查看后几行
df.tail(2)

# 数据基本信息
df.info()

# 统计摘要
df.describe()

# 查看形状
df.shape  # (行数, 列数)

# 查看列名
df.columns

# 查看数据类型
df.dtypes
\`\`\`

## 数据加载
\`\`\`python
# 读取 CSV 文件
df = pd.read_csv("sales_data.csv")

# 读取 Excel 文件
df = pd.read_excel("report.xlsx")

# 从字典创建（模拟数据加载）
df = pd.DataFrame({
    "日期": pd.date_range("2024-01-01", periods=5),
    "销售额": [12000, 15000, 9800, 18500, 22000],
    "订单数": [45, 62, 38, 75, 88]
})
\`\`\``,
        codeExample: `import pandas as pd

# 创建销售数据
data = {
    "日期": ["2024-01-01", "2024-01-02", "2024-01-03", "2024-01-04", "2024-01-05"],
    "商品": ["笔记本", "手机", "平板", "笔记本", "手机"],
    "单价": [5999, 3999, 2999, 5999, 3999],
    "数量": [2, 5, 3, 1, 8],
    "客户": ["张三", "李四", "王五", "赵六", "张三"]
}

df = pd.DataFrame(data)
print("=== 销售数据表 ===")
print(df)
print()

# 计算每行金额
df["金额"] = df["单价"] * df["数量"]
print("=== 添加金额列 ===")
print(df)
print()

# 基本统计
print(f"总销售额: ¥{df['金额'].sum():,}")
print(f"平均订单金额: ¥{df['金额'].mean():,.0f}")
print(f"最大订单金额: ¥{df['金额'].max():,}")
print(f"数据形状: {df.shape}")`,
        keyPoints: [
          'Series 是一维数据结构，DataFrame 是二维表格数据结构',
          '使用 pd.DataFrame() 从字典创建数据表',
          'head()、tail()、info()、describe() 是最常用的数据查看方法',
          'Pandas 支持读取 CSV、Excel 等多种格式文件'
        ]
      },
      {
        id: 'pd-2',
        title: '数据选择与过滤',
        description: '学习 DataFrame 的行列选择、条件过滤和数据切片',
        duration: 40,
        content: `# 数据选择与过滤

## 列选择
\`\`\`python
# 选择单列
prices = df["价格"]

# 选择多列
subset = df[["产品", "价格", "销量"]]
\`\`\`

## 行选择
\`\`\`python
# 使用 loc（基于标签）
df.loc[0]          # 第一行
df.loc[0:2]        # 前三行
df.loc[0, "产品"]  # 第一行的"产品"列

# 使用 iloc（基于位置）
df.iloc[0]         # 第一行
df.iloc[:, 0]      # 第一列
df.iloc[0:3, 1:3]  # 前三行的第2-3列
\`\`\`

## 条件过滤
\`\`\`python
# 单条件
high_price = df[df["价格"] > 3000]

# 多条件（使用 & | ~）
result = df[(df["价格"] > 2000) & (df["销量"] > 100)]

# 使用 isin()
popular = df[df["产品"].isin(["笔记本", "手机"])]

# 使用 between()
mid_range = df[df["价格"].between(1000, 5000)]
\`\`\`

## 字符串方法
\`\`\`python
# 包含
df[df["产品"].str.contains("电")]

# 开头/结尾
df[df["产品"].str.startswith("笔")]

# 转大写
df["产品"].str.upper()
\`\`\`

## query() 方法
\`\`\`python
# 更直观的查询方式
result = df.query("价格 > 3000 and 销量 > 100")
\`\`\``,
        codeExample: `import pandas as pd

# 创建员工数据
data = {
    "姓名": ["张三", "李四", "王五", "赵六", "钱七", "孙八"],
    "部门": ["销售", "技术", "销售", "市场", "技术", "市场"],
    "薪资": [8000, 15000, 9500, 11000, 18000, 10500],
    "绩效": [85, 92, 78, 88, 95, 72],
    "入职年份": [2020, 2018, 2021, 2019, 2017, 2022]
}

df = pd.DataFrame(data)
print("=== 全部员工 ===")
print(df)
print()

# 1. 筛选薪资超过10000的员工
high_salary = df[df["薪资"] > 10000]
print("=== 薪资超过1万的员工 ===")
print(high_salary[["姓名", "部门", "薪资"]])
print()

# 2. 筛选技术部门且绩效>90的员工
tech_stars = df[(df["部门"] == "技术") & (df["绩效"] > 90)]
print("=== 技术部门高绩效员工 ===")
print(tech_stars[["姓名", "绩效"]])
print()

# 3. 按部门统计平均薪资
dept_avg = df.groupby("部门")["薪资"].mean()
print("=== 部门平均薪资 ===")
print(dept_avg)`,
        keyPoints: [
          'loc 基于标签选择，iloc 基于位置选择',
          '条件过滤使用布尔索引：df[条件]',
          '多条件组合使用 &（与）、|（或）、~（非）',
          'query() 方法提供更直观的查询语法'
        ]
      },
      {
        id: 'pd-3',
        title: '数据清洗与处理',
        description: '处理缺失值、重复值、数据类型转换等常见数据清洗任务',
        duration: 45,
        content: `# 数据清洗与处理

## 缺失值处理
\`\`\`python
import pandas as pd
import numpy as np

# 创建含缺失值的数据
df = pd.DataFrame({
    "产品": ["A", "B", None, "D", "E"],
    "价格": [100, None, 300, 400, None],
    "销量": [50, 60, None, 80, 90]
})

# 检测缺失值
df.isnull()        # 返回布尔表
df.isnull().sum()  # 每列缺失值数量

# 处理缺失值
df.dropna()              # 删除含缺失值的行
df.dropna(subset=["价格"])  # 只检查指定列
df.fillna(0)             # 用0填充
df["价格"].fillna(df["价格"].mean())  # 用均值填充
\`\`\`

## 重复值处理
\`\`\`python
# 检测重复
df.duplicated()          # 返回布尔序列
df.duplicated().sum()    # 重复行数量

# 删除重复
df.drop_duplicates()              # 删除完全重复的行
df.drop_duplicates(subset=["产品"])  # 基于指定列去重
\`\`\`

## 数据类型转换
\`\`\`python
# 查看类型
df.dtypes

# 类型转换
df["价格"] = df["价格"].astype(float)
df["销量"] = df["销量"].astype(int)

# 转日期
df["日期"] = pd.to_datetime(df["日期"])

# 转字符串
df["编号"] = df["编号"].astype(str)
\`\`\`

## 数据替换
\`\`\`python
# 值替换
df["等级"] = df["等级"].replace({"A": "优秀", "B": "良好"})

# 字符串替换
df["电话"] = df["电话"].str.replace("-", "")
\`\`\`

## 重命名列
\`\`\`python
df.rename(columns={"旧名": "新名"}, inplace=True)
\`\`\``,
        codeExample: `import pandas as pd
import numpy as np

# 模拟真实脏数据
data = {
    "订单号": ["ORD001", "ORD002", "ORD003", "ORD002", "ORD004", "ORD005"],
    "客户名": ["张三", "李四", "王五", "李四", "赵六", None],
    "金额": [1500, 2800, None, 2800, 950, 3200],
    "日期": ["2024-01-15", "2024-01-16", "2024-01-17", "2024-01-16", "2024-01-18", "2024-01-19"],
    "状态": ["已完成", "已完成", "待处理", "已完成", "已取消", None]
}

df = pd.DataFrame(data)
print("=== 原始数据 ===")
print(df)
print(f"\\n缺失值统计:\\n{df.isnull().sum()}")
print(f"重复行数: {df.duplicated().sum()}")

# 数据清洗流程
# 1. 删除重复行
df_clean = df.drop_duplicates()
print(f"\\n去重后行数: {len(df_clean)}")

# 2. 填充缺失值
df_clean["金额"] = df_clean["金额"].fillna(df_clean["金额"].mean())
df_clean["客户名"] = df_clean["客户名"].fillna("未知客户")
df_clean["状态"] = df_clean["状态"].fillna("待确认")

# 3. 转换日期类型
df_clean["日期"] = pd.to_datetime(df_clean["日期"])

print("\\n=== 清洗后数据 ===")
print(df_clean)
print(f"\\n清洗后缺失值: {df_clean.isnull().sum().sum()}")`,
        keyPoints: [
          'isnull() 检测缺失值，fillna() 填充，dropna() 删除',
          'duplicated() 检测重复，drop_duplicates() 去重',
          'astype() 用于数据类型转换',
          '数据清洗是数据分析中最耗时但最重要的步骤'
        ]
      },
      {
        id: 'pd-4',
        title: '数据聚合与分组分析',
        description: '使用 groupby 进行分组统计和数据聚合分析',
        duration: 45,
        content: `# 数据聚合与分组分析

## GroupBy 基础
\`\`\`python
import pandas as pd

# 按单列分组
df.groupby("部门")["薪资"].mean()

# 按多列分组
df.groupby(["部门", "性别"])["薪资"].mean()

# 多种聚合
df.groupby("部门")["薪资"].agg(["mean", "max", "min", "count"])
\`\`\`

## 常用聚合函数
\`\`\`python
df.groupby("类别").agg({
    "销售额": ["sum", "mean", "count"],
    "利润": "sum",
    "数量": "mean"
})
\`\`\`

## 数据排序
\`\`\`python
# 按单列排序
df.sort_values("销售额", ascending=False)

# 按多列排序
df.sort_values(["部门", "薪资"], ascending=[True, False])
\`\`\`

## 数据透视表
\`\`\`python
# 类似 Excel 透视表
pivot = df.pivot_table(
    values="销售额",
    index="地区",
    columns="产品",
    aggfunc="sum",
    fill_value=0
)
\`\`\`

## apply 自定义函数
\`\`\`python
# 对每行/每列应用自定义函数
def categorize_price(price):
    if price > 5000:
        return "高端"
    elif price > 2000:
        return "中端"
    else:
        return "入门"

df["价格等级"] = df["价格"].apply(categorize_price)
\`\`\``,
        codeExample: `import pandas as pd

# 创建销售数据
data = {
    "月份": ["1月","1月","1月","2月","2月","2月","3月","3月","3月"],
    "地区": ["华东","华南","华北","华东","华南","华北","华东","华南","华北"],
    "产品": ["笔记本","手机","平板","手机","笔记本","手机","平板","手机","笔记本"],
    "销售额": [50000,35000,22000,42000,55000,38000,28000,40000,60000],
    "成本": [35000,21000,15000,28000,38000,25000,19000,26000,42000]
}

df = pd.DataFrame(data)
df["利润"] = df["销售额"] - df["成本"]
df["利润率"] = (df["利润"] / df["销售额"] * 100).round(2)

print("=== 完整数据 ===")
print(df)
print()

# 1. 按地区统计总销售额和利润
region_stats = df.groupby("地区").agg({
    "销售额": "sum",
    "利润": "sum",
    "利润率": "mean"
}).round(2)
print("=== 地区统计 ===")
print(region_stats)
print()

# 2. 按月份和地区交叉分析
pivot = df.pivot_table(
    values="销售额", index="地区", columns="月份",
    aggfunc="sum", fill_value=0
)
print("=== 销售额透视表 ===")
print(pivot)
print()

# 3. 找出各地区利润率最高的记录
best = df.loc[df.groupby("地区")["利润率"].idxmax()]
print("=== 各地区最佳利润记录 ===")
print(best[["地区", "月份", "产品", "利润率"]])`,
        keyPoints: [
          'groupby() 按列分组，配合聚合函数进行统计分析',
          'agg() 可以同时应用多种聚合函数',
          'pivot_table() 创建数据透视表，类似 Excel',
          'apply() 可以对数据应用自定义函数'
        ]
      }
    ],
    exercises: [
      {
        id: 'pd-ex-1',
        type: 'choice',
        question: 'Pandas 中，以下哪种方式可以正确选择 DataFrame 的"价格"列？',
        options: ['df("价格")', 'df.价格', 'df["价格"]', 'df->价格'],
        answer: 'df["价格"]',
        score: 10
      },
      {
        id: 'pd-ex-2',
        type: 'choice',
        question: '如何查看 DataFrame 的前5行数据？',
        options: ['df.first(5)', 'df.top(5)', 'df.head(5)', 'df.show(5)'],
        answer: 'df.head(5)',
        score: 10
      },
      {
        id: 'pd-ex-3',
        type: 'choice',
        question: '以下哪个方法用于检测 DataFrame 中的缺失值？',
        options: ['df.null()', 'df.isnull()', 'df.empty()', 'df.missing()'],
        answer: 'df.isnull()',
        score: 10
      },
      {
        id: 'pd-ex-4',
        type: 'choice',
        question: 'df.groupby("部门")["薪资"].mean() 的作用是什么？',
        options: [
          '计算所有薪资的均值',
          '按部门分组计算平均薪资',
          '按薪资分组计算部门数量',
          '筛选薪资高于均值的部门'
        ],
        answer: '按部门分组计算平均薪资',
        score: 10
      },
      {
        id: 'pd-ex-5',
        type: 'code',
        question: '给定一个包含"销售额"和"成本"列的 DataFrame，请添加一个"利润率"列（利润率 = (销售额-成本)/销售额*100），并筛选出利润率大于20%的行。',
        codeTemplate: `import pandas as pd\n\ndf = pd.DataFrame({\n    "产品": ["A", "B", "C", "D", "E"],\n    "销售额": [1000, 2000, 1500, 800, 3000],\n    "成本": [700, 1500, 1300, 500, 1800]\n})\n\n# 在这里编写你的代码\n\nprint("高利润率产品:")\nprint(result)`,
        answer: '20',
        hint: '先计算利润率列，然后用布尔索引筛选利润率 > 20 的行',
        score: 20
      }
    ],
    quiz: {
      id: 'pd-quiz',
      title: 'Pandas 数据处理 - 阶段测评',
      description: '检验你对 Pandas 数据处理能力的掌握程度',
      timeLimit: 40,
      passingScore: 60,
      questions: [
        {
          id: 'pd-q1',
          type: 'choice',
          question: 'DataFrame 和 Series 的区别是什么？',
          options: [
            'Series 是二维的，DataFrame 是一维的',
            'Series 是一维的，DataFrame 是二维的',
            '它们完全相同',
            'Series 只能存数字，DataFrame 可以存任意类型'
          ],
          answer: 'Series 是一维的，DataFrame 是二维的',
          score: 10
        },
        {
          id: 'pd-q2',
          type: 'choice',
          question: 'loc 和 iloc 的主要区别是什么？',
          options: [
            'loc 用于列选择，iloc 用于行选择',
            'loc 基于标签索引，iloc 基于位置索引',
            'loc 更快，iloc 更慢',
            '没有区别，可以互换使用'
          ],
          answer: 'loc 基于标签索引，iloc 基于位置索引',
          score: 10
        },
        {
          id: 'pd-q3',
          type: 'choice',
          question: '以下哪种方法可以删除 DataFrame 中的重复行？',
          options: ['df.remove_duplicates()', 'df.drop_duplicates()', 'df.unique()', 'df.distinct()'],
          answer: 'df.drop_duplicates()',
          score: 10
        },
        {
          id: 'pd-q4',
          type: 'choice',
          question: '如何将 DataFrame 的"日期"列转换为 datetime 类型？',
          options: [
            'df["日期"] = df["日期"].to_datetime()',
            'df["日期"] = pd.to_datetime(df["日期"])',
            'df["日期"] = datetime(df["日期"])',
            'df["日期"] = df["日期"].convert("datetime")'
          ],
          answer: 'df["日期"] = pd.to_datetime(df["日期"])',
          score: 10
        },
        {
          id: 'pd-q5',
          type: 'choice',
          question: 'pivot_table 和 groupby 的主要区别是什么？',
          options: [
            'pivot_table 只能做求和，groupby 可以做多种聚合',
            'pivot_table 可以生成交叉表格式，groupby 生成扁平结果',
            'groupby 更快，pivot_table 更慢',
            '它们完全相同'
          ],
          answer: 'pivot_table 可以生成交叉表格式，groupby 生成扁平结果',
          score: 10
        },
        {
          id: 'pd-q6',
          type: 'code',
          question: '给定销售数据，请完成以下分析：\n1. 计算每个地区的总销售额\n2. 找出销售额最高的地区\n3. 计算全国平均销售额',
          codeTemplate: `import pandas as pd\n\ndf = pd.DataFrame({\n    "地区": ["华东", "华南", "华北", "华东", "华南", "华北"],\n    "销售额": [50000, 35000, 42000, 48000, 38000, 45000]\n})\n\n# 1. 各地区总销售额\n# 2. 最高销售额地区\n# 3. 全国平均销售额\n\nprint("各地区总销售额:")\nprint(result)\nprint(f"\\n最高地区: {best_region}")\nprint(f"全国平均: {avg_sales:,.0f}")`,
          answer: '华东',
          hint: '使用 groupby + sum 进行分组求和，idxmax() 找最大值索引',
          score: 20
        }
      ]
    }
  },
  {
    id: 'data-viz',
    title: '数据可视化',
    description: '使用 Matplotlib 和 Seaborn 创建专业的商务数据可视化图表',
    icon: '📊',
    color: '#11557C',
    order: 3,
    lessons: [
      {
        id: 'dv-1',
        title: 'Matplotlib 基础图表',
        description: '学习使用 Matplotlib 绘制折线图、柱状图、饼图等基础图表',
        duration: 45,
        content: `# Matplotlib 基础图表

## Matplotlib 简介
Matplotlib 是 Python 最基础的数据可视化库，可以创建各种静态、动态和交互式图表。

## 基本使用流程
\`\`\`python
import matplotlib.pyplot as plt

# 1. 准备数据
x = [1, 2, 3, 4, 5]
y = [10, 25, 18, 30, 22]

# 2. 创建图表
plt.figure(figsize=(10, 6))

# 3. 绘制图形
plt.plot(x, y, marker='o', linewidth=2)

# 4. 添加标签
plt.title("月度销售趋势", fontsize=16)
plt.xlabel("月份", fontsize=12)
plt.ylabel("销售额（万元）", fontsize=12)

# 5. 显示
plt.show()
\`\`\`

## 折线图 - 趋势分析
\`\`\`python
months = ["1月", "2月", "3月", "4月", "5月", "6月"]
sales_a = [150, 180, 165, 200, 230, 210]
sales_b = [120, 140, 160, 155, 180, 195]

plt.plot(months, sales_a, 'o-', label="产品A", color="#2196F3")
plt.plot(months, sales_b, 's-', label="产品B", color="#FF5722")
plt.title("产品销售趋势对比")
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()
\`\`\`

## 柱状图 - 对比分析
\`\`\`python
categories = ["华东", "华南", "华北", "西南"]
values = [45000, 38000, 32000, 28000]
colors = ["#2196F3", "#4CAF50", "#FF9800", "#9C27B0"]

plt.bar(categories, values, color=colors)
plt.title("各区域销售额对比")
plt.ylabel("销售额（元）")
plt.show()
\`\`\`

## 饼图 - 占比分析
\`\`\`python
sizes = [35, 25, 20, 12, 8]
labels = ["电子产品", "服装", "食品", "家居", "其他"]
explode = (0.05, 0, 0, 0, 0)

plt.pie(sizes, labels=labels, autopct="%1.1f%%",
        explode=explode, startangle=90)
plt.title("产品类别销售占比")
plt.show()
\`\`\``,
        codeExample: `import matplotlib
matplotlib.use('Agg')  # 非交互式后端
import matplotlib.pyplot as plt

# 设置中文字体
plt.rcParams['font.sans-serif'] = ['SimHei', 'Arial Unicode MS', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False

# 创建示例数据
months = ["1月", "2月", "3月", "4月", "5月", "6月"]
sales = [150, 180, 165, 200, 230, 210]
costs = [100, 120, 110, 130, 145, 135]
profits = [s - c for s, c in zip(sales, costs)]

# 创建子图
fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# 折线图 - 销售趋势
axes[0, 0].plot(months, sales, 'o-', color='#2196F3', linewidth=2, label='销售额')
axes[0, 0].plot(months, costs, 's-', color='#FF5722', linewidth=2, label='成本')
axes[0, 0].set_title('Sales Trend')
axes[0, 0].legend()
axes[0, 0].grid(True, alpha=0.3)

# 柱状图 - 利润对比
axes[0, 1].bar(months, profits, color=['#4CAF50' if p > 60 else '#FF9800' for p in profits])
axes[0, 1].set_title('Monthly Profit')
axes[0, 1].axhline(y=60, color='red', linestyle='--', alpha=0.5)

# 饼图 - 季度占比
q_data = [sum(sales[:2]), sum(sales[2:4]), sum(sales[4:])]
axes[1, 0].pie(q_data, labels=['Q1', 'Q2', 'Q3'], autopct='%1.1f%%', colors=['#2196F3', '#4CAF50', '#FF9800'])
axes[1, 0].set_title('Quarterly Distribution')

# 水平柱状图
categories = ['Electronics', 'Clothing', 'Food', 'Home']
values = [45000, 38000, 32000, 28000]
axes[1, 1].barh(categories, values, color=['#9C27B0', '#E91E63', '#00BCD4', '#8BC34A'])
axes[1, 1].set_title('Category Sales')

plt.tight_layout()
plt.savefig('chart.png', dpi=100)
print("图表已保存为 chart.png")`,
        keyPoints: [
          'Matplotlib 的基本流程：准备数据 → 创建图表 → 绘制 → 标注 → 显示',
          '折线图适合展示趋势，柱状图适合对比，饼图适合展示占比',
          '使用 subplots() 可以创建多个子图',
          'plt.savefig() 可以保存图表为图片文件'
        ]
      },
      {
        id: 'dv-2',
        title: '高级图表与美化',
        description: '学习散点图、热力图、组合图表等高级可视化技巧',
        duration: 45,
        content: `# 高级图表与美化

## 散点图 - 相关性分析
\`\`\`python
import matplotlib.pyplot as plt
import numpy as np

# 生成模拟数据
np.random.seed(42)
ad_budget = np.random.uniform(10, 100, 50)
sales = ad_budget * 2.5 + np.random.normal(0, 20, 50)

plt.scatter(ad_budget, sales, alpha=0.6, c=ad_budget, cmap='viridis')
plt.colorbar(label='广告预算（万元）')
plt.xlabel('广告预算')
plt.ylabel('销售额')
plt.title('广告投入与销售额关系')
plt.show()
\`\`\`

## 组合图表
\`\`\`python
fig, ax1 = plt.subplots(figsize=(10, 6))

# 柱状图 - 销售额
ax1.bar(months, sales, alpha=0.7, color='steelblue', label='销售额')
ax1.set_ylabel('销售额（万元）')

# 折线图 - 增长率
ax2 = ax1.twinx()
growth = [0] + [(sales[i]-sales[i-1])/sales[i-1]*100 for i in range(1, len(sales))]
ax2.plot(months, growth, 'ro-', linewidth=2, label='增长率')
ax2.set_ylabel('增长率（%）')

plt.title('销售额与增长率')
fig.legend(loc='upper left')
plt.show()
\`\`\`

## 图表美化技巧
\`\`\`python
# 使用样式
plt.style.use('seaborn-v0_8-whitegrid')

# 自定义颜色方案
colors = {
    'primary': '#2196F3',
    'secondary': '#FF5722',
    'success': '#4CAF50',
    'warning': '#FF9800'
}

# 添加注释
plt.annotate('最高点', xy=(4, 230), xytext=(3, 250),
            arrowprops=dict(arrowstyle='->', color='red'))
\`\`\`

## 子图布局
\`\`\`python
fig = plt.figure(figsize=(14, 8))

# 自定义布局
ax1 = fig.add_subplot(2, 2, 1)  # 2行2列第1个
ax2 = fig.add_subplot(2, 2, 2)
ax3 = fig.add_subplot(2, 1, 2)  # 2行1列第2个（占整行）
\`\`\``,
        codeExample: `import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

plt.rcParams['font.sans-serif'] = ['SimHei', 'Arial Unicode MS', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False

# 模拟商务数据
np.random.seed(42)
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
revenue = np.cumsum(np.random.uniform(80, 150, 12))
expenses = revenue * np.random.uniform(0.5, 0.7, 12)
profit = revenue - expenses

# 创建仪表盘
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.suptitle('Business Analytics Dashboard', fontsize=18, fontweight='bold')

# 1. 收入 vs 支出趋势
axes[0, 0].fill_between(range(12), revenue, alpha=0.3, color='green')
axes[0, 0].fill_between(range(12), expenses, alpha=0.3, color='red')
axes[0, 0].plot(revenue, 'g-o', label='Revenue')
axes[0, 0].plot(expenses, 'r-s', label='Expenses')
axes[0, 0].set_xticks(range(12))
axes[0, 0].set_xticklabels(months, rotation=45)
axes[0, 0].legend()
axes[0, 0].set_title('Revenue vs Expenses')
axes[0, 0].grid(True, alpha=0.3)

# 2. 月度利润柱状图
bar_colors = ['#4CAF50' if p > 0 else '#F44336' for p in profit]
axes[0, 1].bar(range(12), profit, color=bar_colors)
axes[0, 1].axhline(y=0, color='black', linewidth=0.5)
axes[0, 1].set_xticks(range(12))
axes[0, 1].set_xticklabels(months, rotation=45)
axes[0, 1].set_title('Monthly Profit')

# 3. 收入构成饼图
categories = ['Product A', 'Product B', 'Product C', 'Services']
values = [35, 25, 20, 20]
axes[1, 0].pie(values, labels=categories, autopct='%1.0f%%',
               colors=['#2196F3', '#4CAF50', '#FF9800', '#9C27B0'],
               startangle=90)
axes[1, 0].set_title('Revenue Composition')

# 4. 散点图 - 广告 vs 收入
ad_spend = np.random.uniform(5, 50, 30)
sales_from_ad = ad_spend * 3 + np.random.normal(0, 15, 30)
axes[1, 1].scatter(ad_spend, sales_from_ad, c=ad_spend, cmap='plasma', alpha=0.7, s=80)
axes[1, 1].set_xlabel('Ad Spend')
axes[1, 1].set_ylabel('Sales')
axes[1, 1].set_title('Ad Spend vs Sales')

plt.tight_layout()
plt.savefig('dashboard.png', dpi=100, bbox_inches='tight')
print("Dashboard saved as dashboard.png")`,
        keyPoints: [
          '散点图用于分析两个变量之间的相关性',
          '组合图表（双Y轴）适合展示不同量纲的数据',
          'fill_between() 可以创建面积图效果',
          '合理的颜色方案和布局让图表更专业'
        ]
      },
      {
        id: 'dv-3',
        title: 'Pandas 内置可视化',
        description: '利用 Pandas 的内置 plot 方法快速创建图表',
        duration: 30,
        content: `# Pandas 内置可视化

Pandas 的 plot 方法基于 Matplotlib，提供了更简洁的语法。

## 基础用法
\`\`\`python
import pandas as pd
import matplotlib.pyplot as plt

df = pd.DataFrame({
    "月份": ["1月", "2月", "3月", "4月", "5月"],
    "销售额": [150, 180, 165, 200, 230],
    "成本": [100, 120, 110, 130, 145]
})

# 折线图
df.plot(x="月份", y="销售额", kind="line")

# 柱状图
df.plot(x="月份", y=["销售额", "成本"], kind="bar")

# 直接调用
df["销售额"].plot(kind="hist")
\`\`\`

## 常用图表类型
\`\`\`python
# 直方图 - 数据分布
df["销售额"].plot(kind="hist", bins=10)

# 箱线图 - 数据分布
df.plot(kind="box")

# 面积图
df.plot(kind="area", alpha=0.5)

# 散点图
df.plot(kind="scatter", x="成本", y="销售额")
\`\`\`

## 分组可视化
\`\`\`python
# 分组柱状图
df.groupby("地区")["销售额"].sum().plot(kind="bar")

# 分组折线图
df.groupby("月份")["销售额"].mean().plot(kind="line")
\`\`\``,
        codeExample: `import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

# 创建销售数据
df = pd.DataFrame({
    "Month": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    "Revenue": [150, 180, 165, 200, 230, 210],
    "Cost": [100, 120, 110, 130, 145, 135],
    "Profit": [50, 60, 55, 70, 85, 75]
})

fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# 1. Pandas 折线图
df.plot(x="Month", y=["Revenue", "Cost", "Profit"], ax=axes[0, 0])
axes[0, 0].set_title("Trend (Pandas plot)")

# 2. Pandas 柱状图
df.plot(x="Month", y=["Revenue", "Cost"], kind="bar", ax=axes[0, 1])
axes[0, 1].set_title("Revenue vs Cost (Pandas bar)")

# 3. Pandas 面积图
df.plot(x="Month", y="Revenue", kind="area", ax=axes[1, 0], alpha=0.5)
axes[1, 0].set_title("Revenue Area (Pandas area)")

# 4. Pandas 箱线图
df[["Revenue", "Cost", "Profit"]].plot(kind="box", ax=axes[1, 1])
axes[1, 1].set_title("Distribution (Pandas box)")

plt.tight_layout()
plt.savefig('pandas_charts.png', dpi=100)
print("Pandas charts saved!")`,
        keyPoints: [
          'df.plot() 是最快速的绘图方式',
          '通过 kind 参数指定图表类型：line、bar、hist、box、scatter、area',
          'ax 参数可以将 Pandas 图表绘制到指定子图上',
          'Pandas 内置绘图适合快速探索，复杂图表建议用 Matplotlib'
        ]
      }
    ],
    exercises: [
      {
        id: 'dv-ex-1',
        type: 'choice',
        question: '以下哪种图表最适合展示数据的占比关系？',
        options: ['折线图', '柱状图', '饼图', '散点图'],
        answer: '饼图',
        score: 10
      },
      {
        id: 'dv-ex-2',
        type: 'choice',
        question: 'plt.subplots(2, 3) 会创建几个子图？',
        options: ['2个', '3个', '5个', '6个'],
        answer: '6个',
        score: 10
      },
      {
        id: 'dv-ex-3',
        type: 'choice',
        question: '散点图最适合分析什么？',
        options: ['数据占比', '变化趋势', '两个变量的相关性', '数据分布'],
        answer: '两个变量的相关性',
        score: 10
      },
      {
        id: 'dv-ex-4',
        type: 'code',
        question: '使用 Pandas 内置 plot 方法，创建一个包含"销售额"和"成本"两列的 DataFrame，并绘制分组柱状图比较各月份的销售额和成本。',
        codeTemplate: `import pandas as pd\nimport matplotlib\nmatplotlib.use('Agg')\nimport matplotlib.pyplot as plt\n\n# 创建数据\ndf = pd.DataFrame({\n    "Month": ["Jan", "Feb", "Mar", "Apr"],\n    "Revenue": [100, 150, 130, 180],\n    "Cost": [70, 95, 85, 110]\n})\n\n# 绘制分组柱状图\n\nplt.savefig('comparison.png')\nprint("Chart saved!")`,
        answer: 'comparison.png',
        hint: '使用 df.plot(x="Month", y=["Revenue", "Cost"], kind="bar")',
        score: 20
      }
    ],
    quiz: {
      id: 'dv-quiz',
      title: '数据可视化 - 阶段测评',
      description: '检验你的数据可视化技能掌握程度',
      timeLimit: 30,
      passingScore: 60,
      questions: [
        {
          id: 'dv-q1',
          type: 'choice',
          question: '折线图最适合展示什么类型的数据？',
          options: ['分类数据占比', '时间序列趋势', '离散数据分布', '多变量相关性'],
          answer: '时间序列趋势',
          score: 10
        },
        {
          id: 'dv-q2',
          type: 'choice',
          question: '如何在一个图表中创建双Y轴？',
          options: [
            'plt.yaxis(2)',
            'plt.twinx()',
            'plt.dual_y()',
            'plt.add_yaxis()'
          ],
          answer: 'plt.twinx()',
          score: 10
        },
        {
          id: 'dv-q3',
          type: 'choice',
          question: 'plt.tight_layout() 的作用是什么？',
          options: [
            '设置图表标题',
            '自动调整子图间距防止重叠',
            '设置图表大小',
            '添加网格线'
          ],
          answer: '自动调整子图间距防止重叠',
          score: 10
        },
        {
          id: 'dv-q4',
          type: 'choice',
          question: '箱线图(Box Plot)主要用于展示什么？',
          options: ['数据趋势', '数据分布和异常值', '数据占比', '数据相关性'],
          answer: '数据分布和异常值',
          score: 10
        },
        {
          id: 'dv-q5',
          type: 'code',
          question: '创建一个包含12个月销售数据的 DataFrame，使用 Matplotlib 绘制一个2x2的仪表盘：\n1. 折线图展示销售趋势\n2. 柱状图展示各月销售额\n3. 饼图展示季度占比\n4. 直方图展示销售额分布',
          codeTemplate: `import pandas as pd\nimport matplotlib\nmatplotlib.use('Agg')\nimport matplotlib.pyplot as plt\nimport numpy as np\n\nnp.random.seed(42)\ndf = pd.DataFrame({\n    "Month": pd.date_range("2024-01-01", periods=12, freq="M"),\n    "Sales": np.random.randint(100, 300, 12)\n})\n\n# 创建2x2仪表盘\n\nplt.tight_layout()\nplt.savefig('dashboard.png')\nprint("Dashboard created!")`,
          answer: 'dashboard.png',
          hint: '使用 plt.subplots(2, 2) 创建4个子图，分别用不同图表类型',
          score: 20
        }
      ]
    }
  },
  {
    id: 'business-analysis',
    title: '商务数据分析实战',
    description: '综合运用所学技能进行真实商务数据分析项目实战',
    icon: '💼',
    color: '#1B5E20',
    order: 4,
    lessons: [
      {
        id: 'ba-1',
        title: '销售数据分析',
        description: '综合运用 Python 和 Pandas 进行销售数据深度分析',
        duration: 50,
        content: `# 销售数据分析实战

## 分析框架
商务数据分析通常遵循以下框架：
1. **明确目标**：要回答什么业务问题？
2. **数据收集**：获取相关数据
3. **数据清洗**：处理缺失值、异常值
4. **数据分析**：统计、分组、聚合
5. **数据可视化**：图表展示
6. **得出结论**：提出业务建议

## 实战案例：电商销售分析
\`\`\`python
import pandas as pd
import numpy as np

# 生成模拟销售数据
np.random.seed(42)
dates = pd.date_range("2024-01-01", "2024-06-30", freq="D")
products = ["笔记本", "手机", "平板", "耳机", "键盘"]
regions = ["华东", "华南", "华北", "西南"]

data = []
for date in dates:
    for product in products:
        for region in regions:
            data.append({
                "日期": date,
                "产品": product,
                "地区": region,
                "销量": np.random.randint(5, 100),
                "单价": np.random.randint(100, 6000),
            })

df = pd.DataFrame(data)
df["销售额"] = df["销量"] * df["单价"]
\`\`\`

## 关键分析指标
\`\`\`python
# 总销售额
total_sales = df["销售额"].sum()

# 月度销售趋势
monthly = df.groupby(df["日期"].dt.month)["销售额"].sum()

# 产品销售排名
product_rank = df.groupby("产品")["销售额"].sum().sort_values(ascending=False)

# 地区销售对比
region_sales = df.groupby("地区")["销售额"].sum()

# 同比增长率
monthly_growth = monthly.pct_change() * 100
\`\`\`

## RFM 分析模型
\`\`\`python
# R - Recency（最近购买时间）
# F - Frequency（购买频率）
# M - Monetary（消费金额）

rfm = df.groupby("产品").agg({
    "日期": lambda x: (dates[-1] - x.max()).days,
    "销量": "count",
    "销售额": "sum"
}).rename(columns={
    "日期": "Recency",
    "销量": "Frequency",
    "销售额": "Monetary"
})

# RFM 评分
rfm["R_Score"] = pd.qcut(rfm["Recency"], 4, labels=[4,3,2,1])
rfm["F_Score"] = pd.qcut(rfm["Frequency"], 4, labels=[1,2,3,4])
rfm["M_Score"] = pd.qcut(rfm["Monetary"], 4, labels=[1,2,3,4])
\`\`\``,
        codeExample: `import pandas as pd
import numpy as np

np.random.seed(42)

# 生成6个月的销售数据
dates = pd.date_range("2024-01-01", "2024-06-30", freq="D")
products = ["Laptop", "Phone", "Tablet", "Headset", "Keyboard"]
regions = ["East", "South", "North", "West"]

records = []
for date in dates:
    for product in products:
        for region in regions:
            qty = np.random.randint(5, 80)
            price = np.random.randint(200, 5000)
            records.append({
                "Date": date, "Product": product,
                "Region": region, "Qty": qty, "Price": price
            })

df = pd.DataFrame(records)
df["Revenue"] = df["Qty"] * df["Price"]
df["Month"] = df["Date"].dt.month

print("=" * 60)
print("SALES DATA ANALYSIS REPORT")
print("=" * 60)

# 1. 总体概览
print(f"\\nTotal Revenue: ¥{df['Revenue'].sum():,.0f}")
print(f"Total Orders: {len(df):,}")
print(f"Average Order Value: ¥{df['Revenue'].mean():,.0f}")

# 2. 月度趋势
print("\\n--- Monthly Revenue ---")
monthly = df.groupby("Month")["Revenue"].sum()
for month, rev in monthly.items():
    bar = "█" * int(rev / monthly.max() * 30)
    print(f"  Month {month:2d}: ¥{rev:>12,.0f} {bar}")

# 3. 产品排名
print("\\n--- Product Ranking ---")
product_rev = df.groupby("Product")["Revenue"].sum().sort_values(ascending=False)
for i, (product, rev) in enumerate(product_rev.items(), 1):
    pct = rev / product_rev.sum() * 100
    print(f"  {i}. {product:10s}: ¥{rev:>12,.0f} ({pct:.1f}%)")

# 4. 地区分析
print("\\n--- Regional Analysis ---")
region_stats = df.groupby("Region").agg(
    Revenue=("Revenue", "sum"),
    Avg_Order=("Revenue", "mean"),
    Orders=("Revenue", "count")
).round(0)
print(region_stats)

# 5. Top 10 销售日
print("\\n--- Top 5 Sales Days ---")
daily = df.groupby("Date")["Revenue"].sum().sort_values(ascending=False)
for date, rev in daily.head(5).items():
    print(f"  {date.strftime('%Y-%m-%d')}: ¥{rev:,.0f}")`,
        keyPoints: [
          '商务数据分析遵循：明确目标→数据收集→清洗→分析→可视化→结论',
          'RFM 模型是客户分析的经典方法',
          '多维度分析（时间、产品、地区）能全面了解业务',
          '数据驱动的决策需要结合业务背景理解数据'
        ]
      },
      {
        id: 'ba-2',
        title: '综合项目：数据分析报告',
        description: '完成一个完整的商务数据分析项目，生成分析报告',
        duration: 60,
        content: `# 综合项目：数据分析报告

## 项目背景
假设你是一家电商公司的数据分析师，需要分析过去一年的运营数据，为管理层提供决策支持。

## 项目要求
1. 数据加载与清洗
2. 描述性统计分析
3. 多维度交叉分析
4. 可视化展示
5. 结论与建议

## 完整项目代码
\`\`\`python
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

# 1. 数据准备
np.random.seed(42)
n = 1000

df = pd.DataFrame({
    "order_date": pd.date_range("2024-01-01", periods=n, freq="6H"),
    "category": np.random.choice(["Electronics", "Clothing", "Food", "Home", "Sports"], n),
    "channel": np.random.choice(["Online", "Offline", "Mobile"], n),
    "amount": np.random.lognormal(7, 1, n).round(2),
    "quantity": np.random.randint(1, 10, n),
    "customer_age": np.random.randint(18, 65, n),
    "satisfaction": np.random.randint(1, 6, n)
})

# 2. 数据清洗
df["amount"] = df["amount"].clip(lower=0)  # 去除负值
df["month"] = df["order_date"].dt.month
df["day_of_week"] = df["order_date"].dt.dayofweek

# 3. 分析
print("=== ANALYSIS REPORT ===")
print(f"Total Revenue: ¥{df['amount'].sum():,.2f}")
print(f"Average Order: ¥{df['amount'].mean():,.2f}")
print(f"Total Orders: {len(df)}")

# 按类别
cat_stats = df.groupby("category").agg(
    revenue=("amount", "sum"),
    orders=("amount", "count"),
    avg_satisfaction=("satisfaction", "mean")
).sort_values("revenue", ascending=False)
print("\\nCategory Performance:")
print(cat_stats.round(2))
\`\`\`

## 分析报告模板
一份好的分析报告应包含：
1. **摘要**：核心发现（3-5条）
2. **数据概览**：数据来源、时间范围、字段说明
3. **详细分析**：图表+文字说明
4. **结论建议**：可执行的业务建议
5. **附录**：代码、数据字典`,
        codeExample: `import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

np.random.seed(42)
n = 500

# 生成综合数据
df = pd.DataFrame({
    "date": pd.date_range("2024-01-01", periods=n, freq="12H"),
    "category": np.random.choice(["Electronics", "Clothing", "Food", "Home"], n),
    "channel": np.random.choice(["Online", "Store", "App"], n),
    "revenue": np.random.lognormal(6.5, 0.8, n).round(2),
    "cost": np.random.lognormal(6, 0.7, n).round(2),
    "rating": np.random.choice([1,2,3,4,5], n, p=[0.05, 0.1, 0.2, 0.35, 0.3])
})

df["profit"] = df["revenue"] - df["cost"]
df["month"] = df["date"].dt.month

# ===== ANALYSIS =====
print("=" * 60)
print("   BUSINESS INTELLIGENCE REPORT 2024")
print("=" * 60)

# KPI Summary
print(f"\\n{'KPI SUMMARY':^60}")
print("-" * 60)
print(f"  Total Revenue:    ¥{df['revenue'].sum():>15,.2f}")
print(f"  Total Cost:       ¥{df['cost'].sum():>15,.2f}")
print(f"  Total Profit:     ¥{df['profit'].sum():>15,.2f}")
print(f"  Profit Margin:    {df['profit'].sum()/df['revenue'].sum()*100:>14.1f}%")
print(f"  Avg Rating:       {df['rating'].mean():>14.1f}/5.0")
print(f"  Total Orders:     {len(df):>15,}")

# Category Analysis
print(f"\\n{'CATEGORY PERFORMANCE':^60}")
print("-" * 60)
cat = df.groupby("category").agg(
    rev=("revenue", "sum"),
    profit=("profit", "sum"),
    orders=("revenue", "count"),
    rating=("rating", "mean")
).sort_values("rev", ascending=False)

for name, row in cat.iterrows():
    margin = row["profit"] / row["rev"] * 100
    print(f"  {name:12s} | Rev: ¥{row['rev']:>10,.0f} | "
          f"Profit: ¥{row['profit']:>8,.0f} | "
          f"Margin: {margin:.1f}% | Rating: {row['rating']:.1f}")

# Channel Analysis
print(f"\\n{'CHANNEL ANALYSIS':^60}")
print("-" * 60)
ch = df.groupby("channel")["revenue"].sum().sort_values(ascending=False)
for channel, rev in ch.items():
    pct = rev / ch.sum() * 100
    bar = "█" * int(pct / 2)
    print(f"  {channel:8s}: ¥{rev:>12,.0f} ({pct:.1f}%) {bar}")

# Monthly Trend
print(f"\\n{'MONTHLY TREND':^60}")
print("-" * 60)
monthly = df.groupby("month")["revenue"].sum()
for m, rev in monthly.items():
    bar = "▓" * int(rev / monthly.max() * 25)
    print(f"  Month {m:2d}: ¥{rev:>12,.0f} {bar}")

print("\\n" + "=" * 60)
print("  REPORT GENERATED SUCCESSFULLY")
print("=" * 60)`,
        keyPoints: [
          '数据分析项目需要完整的方法论支撑',
          'KPI 指标、分类分析、趋势分析是报告的核心内容',
          '好的分析报告要回答"是什么、为什么、怎么办"',
          '数据可视化让分析结论更有说服力'
        ]
      }
    ],
    exercises: [
      {
        id: 'ba-ex-1',
        type: 'choice',
        question: 'RFM 分析模型中，F 代表什么？',
        options: ['财务(Finance)', '频率(Frequency)', '未来(Future)', '功能(Function)'],
        answer: '频率(Frequency)',
        score: 10
      },
      {
        id: 'ba-ex-2',
        type: 'choice',
        question: '以下哪个指标最能反映企业的盈利能力？',
        options: ['总销售额', '利润率', '订单数量', '客户数量'],
        answer: '利润率',
        score: 10
      },
      {
        id: 'ba-ex-3',
        type: 'choice',
        question: '数据分析报告的结论部分应该包含什么？',
        options: [
          '所有原始数据',
          '可执行的业务建议',
          'Python 代码',
          '数据收集方法'
        ],
        answer: '可执行的业务建议',
        score: 10
      },
      {
        id: 'ba-ex-4',
        type: 'code',
        question: '给定一个销售 DataFrame，请完成以下分析：\n1. 计算总利润和利润率\n2. 找出利润最高的产品\n3. 计算各渠道的销售占比\n4. 输出格式化的分析报告',
        codeTemplate: `import pandas as pd\nimport numpy as np\n\nnp.random.seed(42)\ndf = pd.DataFrame({\n    "product": np.random.choice(["A", "B", "C"], 100),\n    "channel": np.random.choice(["Online", "Store", "App"], 100),\n    "revenue": np.random.randint(100, 1000, 100),\n    "cost": np.random.randint(50, 800, 100)\n})\ndf["profit"] = df["revenue"] - df["cost"]\n\n# 完成分析\n\nprint("=== Analysis Report ===")`,
        answer: 'Analysis Report',
        hint: '使用 groupby 和 agg 进行分组统计，计算利润率 = profit / revenue',
        score: 20
      }
    ],
    quiz: {
      id: 'ba-quiz',
      title: '商务数据分析实战 - 综合测评',
      description: '检验你的综合数据分析能力',
      timeLimit: 45,
      passingScore: 60,
      questions: [
        {
          id: 'ba-q1',
          type: 'choice',
          question: '商务数据分析的标准流程是什么？',
          options: [
            '收集→分析→展示→存储',
            '明确目标→数据收集→清洗→分析→可视化→结论',
            '建模→训练→预测→部署',
            '设计→开发→测试→上线'
          ],
          answer: '明确目标→数据收集→清洗→分析→可视化→结论',
          score: 10
        },
        {
          id: 'ba-q2',
          type: 'choice',
          question: '同比分析和环比分析的区别是什么？',
          options: [
            '同比是与上期比，环比是与去年同期比',
            '同比是与去年同期比，环比是与上期比',
            '它们完全相同',
            '同比只用于销售额，环比只用于利润'
          ],
          answer: '同比是与去年同期比，环比是与上期比',
          score: 10
        },
        {
          id: 'ba-q3',
          type: 'choice',
          question: '以下哪种图表最适合展示销售数据的季节性规律？',
          options: ['饼图', '散点图', '折线图', '柱状图'],
          answer: '折线图',
          score: 10
        },
        {
          id: 'ba-q4',
          type: 'choice',
          question: '帕累托分析(80/20法则)在商务分析中用于？',
          options: [
            '预测未来趋势',
            '识别贡献最大的关键因素',
            '计算相关系数',
            '进行假设检验'
          ],
          answer: '识别贡献最大的关键因素',
          score: 10
        },
        {
          id: 'ba-q5',
          type: 'code',
          question: '综合实战：分析以下数据并生成完整报告\n1. 计算各产品类别的收入、利润、利润率\n2. 找出利润率最高的类别\n3. 分析月度趋势（收入和利润）\n4. 给出至少2条业务建议',
          codeTemplate: `import pandas as pd\nimport numpy as np\n\nnp.random.seed(42)\nmonths = pd.date_range("2024-01-01", "2024-12-31", freq="MS")\nrecords = []\nfor m in months:\n    for cat in ["Electronics", "Clothing", "Food"]:\n        rev = np.random.randint(50000, 200000)\n        cost = int(rev * np.random.uniform(0.5, 0.8))\n        records.append({"month": m, "category": cat, "revenue": rev, "cost": cost})\n\ndf = pd.DataFrame(records)\ndf["profit"] = df["revenue"] - df["cost"]\n\n# 在这里完成你的分析报告\nprint("=" * 50)\nprint("  ANNUAL BUSINESS REPORT")\nprint("=" * 50)`,
        answer: 'ANNUAL BUSINESS REPORT',
        hint: '使用 groupby 分别按类别和月份聚合，计算利润率，用 print 输出格式化报告',
        score: 20
        }
      ]
    }
  }
];
