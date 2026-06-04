#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Online Retail 数据分析报告
数据源: Online Retail.xlsx
"""

import pandas as pd
import numpy as np

def analyze_data():
    """分析在线零售数据"""
    try:
        # 读取Excel文件
        df = pd.read_excel('/workspace/Online Retail.xlsx')
        
        report = []
        report.append("=" * 60)
        report.append("          Online Retail 数据分析报告")
        report.append("=" * 60)
        
        # 1. 数据概览
        report.append("\n【1】数据概览")
        report.append("-" * 40)
        report.append(f"• 数据行数: {df.shape[0]}")
        report.append(f"• 数据列数: {df.shape[1]}")
        report.append(f"• 数据大小: {df.memory_usage().sum() / 1024 / 1024:.2f} MB")
        
        # 2. 列名和数据类型
        report.append("\n【2】列名与数据类型")
        report.append("-" * 40)
        for col, dtype in df.dtypes.items():
            report.append(f"• {col}: {dtype}")
        
        # 3. 缺失值分析
        report.append("\n【3】缺失值分析")
        report.append("-" * 40)
        missing = df.isnull().sum()
        missing_ratio = (missing / len(df)) * 100
        for col, count in missing.items():
            if count > 0:
                report.append(f"• {col}: {count}个缺失值 ({missing_ratio[col]:.2f}%)")
        
        # 4. 描述性统计
        report.append("\n【4】数值型字段描述统计")
        report.append("-" * 40)
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        if len(numeric_cols) > 0:
            stats = df[numeric_cols].describe()
            for col in numeric_cols:
                report.append(f"\n◆ {col}:")
                report.append(f"  - 平均值: {stats[col]['mean']:.2f}")
                report.append(f"  - 标准差: {stats[col]['std']:.2f}")
                report.append(f"  - 最小值: {stats[col]['min']:.2f}")
                report.append(f"  - 中位数: {stats[col]['50%']:.2f}")
                report.append(f"  - 最大值: {stats[col]['max']:.2f}")
        else:
            report.append("  无数值型字段")
        
        # 5. 分类字段分析
        report.append("\n【5】分类字段分析")
        report.append("-" * 40)
        categorical_cols = df.select_dtypes(include=['object']).columns
        for col in categorical_cols:
            unique_count = df[col].nunique()
            top_values = df[col].value_counts().head(5)
            report.append(f"\n◆ {col} (共{unique_count}个唯一值):")
            for value, count in top_values.items():
                report.append(f"  - {value}: {count}次")
        
        # 6. 时间范围分析（如果有日期字段）
        report.append("\n【6】时间范围分析")
        report.append("-" * 40)
        date_cols = df.select_dtypes(include=['datetime64']).columns
        if len(date_cols) > 0:
            for col in date_cols:
                min_date = df[col].min()
                max_date = df[col].max()
                date_range = max_date - min_date
                report.append(f"◆ {col}:")
                report.append(f"  - 最早日期: {min_date}")
                report.append(f"  - 最晚日期: {max_date}")
                report.append(f"  - 时间跨度: {date_range.days}天")
        else:
            report.append("  无日期字段")
        
        # 7. 异常值检测
        report.append("\n【7】异常值检测")
        report.append("-" * 40)
        for col in numeric_cols:
            q1 = df[col].quantile(0.25)
            q3 = df[col].quantile(0.75)
            iqr = q3 - q1
            lower_bound = q1 - 1.5 * iqr
            upper_bound = q3 + 1.5 * iqr
            outliers = df[(df[col] < lower_bound) | (df[col] > upper_bound)]
            outlier_ratio = (len(outliers) / len(df)) * 100
            report.append(f"◆ {col}:")
            report.append(f"  - 异常值数量: {len(outliers)} ({outlier_ratio:.2f}%)")
        
        # 8. 相关性分析
        report.append("\n【8】相关性分析")
        report.append("-" * 40)
        if len(numeric_cols) >= 2:
            corr = df[numeric_cols].corr()
            for i, col1 in enumerate(numeric_cols):
                for j, col2 in enumerate(numeric_cols):
                    if i < j:
                        report.append(f"• {col1} ↔ {col2}: {corr.iloc[i, j]:.3f}")
        else:
            report.append("  相关性分析需要至少2个数值型字段")
        
        report.append("\n" + "=" * 60)
        report.append("                 分析报告结束")
        report.append("=" * 60)
        
        return "\n".join(report)
        
    except Exception as e:
        return f"分析过程中发生错误: {str(e)}"

if __name__ == "__main__":
    print(analyze_data())