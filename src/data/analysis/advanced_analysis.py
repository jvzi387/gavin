#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Online Retail 高级数据分析报告
包含：RFM分析、客户细分、销售趋势、商品分析等
"""

import pandas as pd
import numpy as np
from datetime import datetime

def advanced_analysis():
    """高级数据分析"""
    try:
        # 读取数据
        df = pd.read_excel('/workspace/Online Retail.xlsx')
        
        report = []
        report.append("=" * 70)
        report.append("          Online Retail 高级数据分析报告")
        report.append("=" * 70)
        
        # 数据清洗
        df_clean = df.dropna(subset=['CustomerID'])
        df_clean = df_clean[df_clean['Quantity'] > 0]
        df_clean = df_clean[df_clean['UnitPrice'] > 0]
        df_clean['TotalAmount'] = df_clean['Quantity'] * df_clean['UnitPrice']
        
        report.append(f"\n【数据清洗后】")
        report.append(f"• 有效记录数: {len(df_clean):,} (清洗前: {len(df):,})")
        report.append(f"• 有效客户数: {df_clean['CustomerID'].nunique():,}")
        report.append(f"• 总销售额: £{df_clean['TotalAmount'].sum():,.2f}")
        
        # 1. RFM客户分析
        report.append("\n" + "=" * 70)
        report.append("【1】RFM客户价值分析")
        report.append("=" * 70)
        
        # 计算RFM
        analysis_date = df_clean['InvoiceDate'].max() + pd.Timedelta(days=1)
        rfm = df_clean.groupby('CustomerID').agg({
            'InvoiceDate': lambda x: (analysis_date - x.max()).days,  # Recency
            'InvoiceNo': 'nunique',  # Frequency
            'TotalAmount': 'sum'  # Monetary
        }).reset_index()
        rfm.columns = ['CustomerID', 'Recency', 'Frequency', 'Monetary']
        
        # RFM评分
        rfm['R_Score'] = pd.qcut(rfm['Recency'], 5, labels=[5,4,3,2,1])
        rfm['F_Score'] = pd.qcut(rfm['Frequency'].rank(method='first'), 5, labels=[1,2,3,4,5])
        rfm['M_Score'] = pd.qcut(rfm['Monetary'], 5, labels=[1,2,3,4,5])
        
        # 客户分层
        rfm['RFM_Score'] = rfm['R_Score'].astype(str) + rfm['F_Score'].astype(str) + rfm['M_Score'].astype(str)
        
        def segment_customers(row):
            if row['RFM_Score'] in ['555', '554', '544', '545', '454', '455', '445']:
                return '重要价值客户'
            elif row['RFM_Score'] in ['543', '444', '435', '355', '354', '345', '344', '335']:
                return '重要保持客户'
            elif row['RFM_Score'] in ['512', '511', '422', '421', '412', '411', '311']:
                return '新客户'
            elif row['RFM_Score'] in ['155', '154', '144', '214', '215', '115', '114']:
                return '重要挽留客户'
            elif row['RFM_Score'] in ['155', '254', '245']:
                return '流失客户'
            else:
                return '一般客户'
        
        rfm['Segment'] = rfm.apply(segment_customers, axis=1)
        
        report.append(f"\n◆ RFM统计指标:")
        report.append(f"  - 平均最近购买天数: {rfm['Recency'].mean():.1f}天")
        report.append(f"  - 平均购买频次: {rfm['Frequency'].mean():.1f}次")
        report.append(f"  - 平均消费金额: £{rfm['Monetary'].mean():.2f}")
        report.append(f"  - 最高消费金额: £{rfm['Monetary'].max():.2f}")
        
        # 客户分层统计
        segment_stats = rfm['Segment'].value_counts()
        report.append(f"\n◆ 客户分层分布:")
        for segment, count in segment_stats.items():
            percentage = (count / len(rfm)) * 100
            report.append(f"  - {segment}: {count}人 ({percentage:.1f}%)")
        
        # 2. 月度销售趋势
        report.append("\n" + "=" * 70)
        report.append("【2】月度销售趋势分析")
        report.append("=" * 70)
        
        df_clean['YearMonth'] = df_clean['InvoiceDate'].dt.to_period('M')
        monthly_sales = df_clean.groupby('YearMonth').agg({
            'TotalAmount': 'sum',
            'InvoiceNo': 'nunique',
            'CustomerID': 'nunique'
        }).reset_index()
        
        report.append(f"\n◆ 月度销售统计:")
        for idx, row in monthly_sales.iterrows():
            report.append(f"  {row['YearMonth']}: 销售额£{row['TotalAmount']:,.0f}, "
                         f"订单{row['InvoiceNo']:,}笔, 客户{row['CustomerID']:,}人")
        
        # 3. 商品分析
        report.append("\n" + "=" * 70)
        report.append("【3】商品销售分析")
        report.append("=" * 70)
        
        # 最畅销商品
        top_products = df_clean.groupby('Description').agg({
            'Quantity': 'sum',
            'TotalAmount': 'sum',
            'InvoiceNo': 'nunique'
        }).sort_values('Quantity', ascending=False).head(10)
        
        report.append(f"\n◆ 销量Top 10商品:")
        for idx, (product, row) in enumerate(top_products.iterrows(), 1):
            report.append(f"  {idx}. {product}")
            report.append(f"     销量: {row['Quantity']:,}件, 销售额: £{row['TotalAmount']:,.2f}")
        
        # 最高销售额商品
        top_revenue = df_clean.groupby('Description')['TotalAmount'].sum().sort_values(ascending=False).head(10)
        report.append(f"\n◆ 销售额Top 10商品:")
        for idx, (product, revenue) in enumerate(top_revenue.items(), 1):
            report.append(f"  {idx}. {product}: £{revenue:,.2f}")
        
        # 4. 客户行为分析
        report.append("\n" + "=" * 70)
        report.append("【4】客户行为分析")
        report.append("=" * 70)
        
        # 客户生命周期
        customer_lifecycle = df_clean.groupby('CustomerID').agg({
            'InvoiceDate': ['min', 'max', 'count'],
            'TotalAmount': ['sum', 'mean']
        })
        customer_lifecycle.columns = ['FirstPurchase', 'LastPurchase', 'OrderCount', 'TotalSpent', 'AvgOrderValue']
        customer_lifecycle['LifecycleDays'] = (customer_lifecycle['LastPurchase'] - customer_lifecycle['FirstPurchase']).dt.days
        
        report.append(f"\n◆ 客户生命周期统计:")
        report.append(f"  - 平均客户生命周期: {customer_lifecycle['LifecycleDays'].mean():.1f}天")
        report.append(f"  - 平均订单数: {customer_lifecycle['OrderCount'].mean():.1f}笔")
        report.append(f"  - 平均客单价: £{customer_lifecycle['AvgOrderValue'].mean():.2f}")
        report.append(f"  - 平均总消费: £{customer_lifecycle['TotalSpent'].mean():.2f}")
        
        # 复购率分析
        repeat_customers = customer_lifecycle[customer_lifecycle['OrderCount'] > 1]
        repeat_rate = len(repeat_customers) / len(customer_lifecycle) * 100
        report.append(f"\n◆ 复购分析:")
        report.append(f"  - 复购客户数: {len(repeat_customers):,}人")
        report.append(f"  - 复购率: {repeat_rate:.1f}%")
        
        # 5. 时段分析
        report.append("\n" + "=" * 70)
        report.append("【5】购买时段分析")
        report.append("=" * 70)
        
        df_clean['Hour'] = df_clean['InvoiceDate'].dt.hour
        df_clean['DayOfWeek'] = df_clean['InvoiceDate'].dt.day_name()
        df_clean['Month'] = df_clean['InvoiceDate'].dt.month
        
        # 按小时统计
        hourly_sales = df_clean.groupby('Hour')['TotalAmount'].sum().sort_values(ascending=False)
        report.append(f"\n◆ 销售高峰时段Top 5:")
        for hour, amount in hourly_sales.head(5).items():
            report.append(f"  - {hour:02d}:00: £{amount:,.2f}")
        
        # 按星期统计
        daily_sales = df_clean.groupby('DayOfWeek')['TotalAmount'].sum()
        day_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        daily_sales = daily_sales.reindex(day_order)
        report.append(f"\n◆ 星期销售分布:")
        for day, amount in daily_sales.items():
            report.append(f"  - {day}: £{amount:,.2f}")
        
        # 6. 国家/地区深度分析
        report.append("\n" + "=" * 70)
        report.append("【6】国家/地区深度分析")
        report.append("=" * 70)
        
        country_analysis = df_clean.groupby('Country').agg({
            'TotalAmount': ['sum', 'mean', 'count'],
            'CustomerID': 'nunique',
            'Quantity': 'sum'
        }).reset_index()
        country_analysis.columns = ['Country', 'TotalSales', 'AvgOrderValue', 'OrderCount', 'Customers', 'TotalQuantity']
        country_analysis = country_analysis.sort_values('TotalSales', ascending=False).head(10)
        
        report.append(f"\n◆ Top 10国家/地区销售详情:")
        for idx, row in country_analysis.iterrows():
            report.append(f"\n  {row['Country']}:")
            report.append(f"    - 总销售额: £{row['TotalSales']:,.2f}")
            report.append(f"    - 客户数: {row['Customers']:,}人")
            report.append(f"    - 订单数: {row['OrderCount']:,}笔")
            report.append(f"    - 平均客单价: £{row['AvgOrderValue']:.2f}")
            report.append(f"    - 人均消费: £{row['TotalSales']/row['Customers']:.2f}")
        
        # 7. 异常交易分析
        report.append("\n" + "=" * 70)
        report.append("【7】异常交易分析")
        report.append("=" * 70)
        
        # 大额交易
        large_orders = df_clean[df_clean['TotalAmount'] > df_clean['TotalAmount'].quantile(0.99)]
        report.append(f"\n◆ 大额交易分析 (Top 1%):")
        report.append(f"  - 大额交易数: {len(large_orders):,}笔")
        report.append(f"  - 大额交易金额: £{large_orders['TotalAmount'].sum():,.2f}")
        report.append(f"  - 占总销售额比例: {(large_orders['TotalAmount'].sum() / df_clean['TotalAmount'].sum()) * 100:.1f}%")
        
        # 退货分析
        returns = df[df['Quantity'] < 0]
        if len(returns) > 0:
            report.append(f"\n◆ 退货分析:")
            report.append(f"  - 退货订单数: {len(returns):,}笔")
            report.append(f"  - 退货金额: £{abs(returns['Quantity'] * returns['UnitPrice']).sum():,.2f}")
            report.append(f"  - 退货率: {(len(returns) / len(df)) * 100:.2f}%")
        
        # 8. 关键业务指标
        report.append("\n" + "=" * 70)
        report.append("【8】关键业务指标 (KPIs)")
        report.append("=" * 70)
        
        total_customers = df_clean['CustomerID'].nunique()
        total_orders = df_clean['InvoiceNo'].nunique()
        total_revenue = df_clean['TotalAmount'].sum()
        total_items = df_clean['Quantity'].sum()
        
        report.append(f"\n◆ 核心指标:")
        report.append(f"  - 总客户数: {total_customers:,}人")
        report.append(f"  - 总订单数: {total_orders:,}笔")
        report.append(f"  - 总销售额: £{total_revenue:,.2f}")
        report.append(f"  - 总销量: {total_items:,}件")
        report.append(f"  - 客单价: £{total_revenue/total_orders:.2f}")
        report.append(f"  - 人均消费: £{total_revenue/total_customers:.2f}")
        report.append(f"  - 平均订单商品数: {total_items/total_orders:.1f}件")
        report.append(f"  - 客户平均订单数: {total_orders/total_customers:.1f}笔")
        
        report.append("\n" + "=" * 70)
        report.append("                 高级分析报告结束")
        report.append("=" * 70)
        
        return "\n".join(report)
        
    except Exception as e:
        import traceback
        return f"分析过程中发生错误: {str(e)}\n{traceback.format_exc()}"

if __name__ == "__main__":
    print(advanced_analysis())