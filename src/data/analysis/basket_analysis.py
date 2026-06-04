#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
购物篮分析 - Market Basket Analysis
使用Apriori算法挖掘商品关联规则
"""

import pandas as pd
import numpy as np
from collections import defaultdict

def basket_analysis():
    """购物篮分析"""
    try:
        # 读取数据
        df = pd.read_excel('/workspace/Online Retail.xlsx')
        
        # 数据清洗
        df_clean = df.dropna(subset=['InvoiceNo', 'Description', 'Quantity'])
        df_clean = df_clean[df_clean['Quantity'] > 0]
        df_clean['Description'] = df_clean['Description'].str.strip()
        df_clean = df_clean[df_clean['Description'] != '']
        
        report = []
        report.append("=" * 70)
        report.append("          购物篮分析报告 (Market Basket Analysis)")
        report.append("=" * 70)
        
        report.append(f"\n【数据概况】")
        report.append(f"• 订单数: {df_clean['InvoiceNo'].nunique():,}")
        report.append(f"• 商品种类: {df_clean['Description'].nunique():,}")
        report.append(f"• 交易记录数: {len(df_clean):,}")
        
        # 1. 最常一起购买的商品组合
        report.append("\n" + "=" * 70)
        report.append("【1】商品购买频次分析")
        report.append("=" * 70)
        
        # 商品购买频次
        item_counts = df_clean['Description'].value_counts().head(20)
        report.append(f"\n◆ Top 20最畅销商品:")
        for idx, (item, count) in enumerate(item_counts.items(), 1):
            report.append(f"  {idx:2d}. {item}: {count:,}次")
        
        # 2. 购物篮大小分析
        report.append("\n" + "=" * 70)
        report.append("【2】购物篮大小分析")
        report.append("=" * 70)
        
        basket_sizes = df_clean.groupby('InvoiceNo')['Description'].count()
        report.append(f"\n◆ 购物篮大小统计:")
        report.append(f"  - 平均每单商品数: {basket_sizes.mean():.1f}件")
        report.append(f"  - 中位数每单商品数: {basket_sizes.median():.1f}件")
        report.append(f"  - 最小购物篮: {basket_sizes.min()}件")
        report.append(f"  - 最大购物篮: {basket_sizes.max()}件")
        
        # 购物篮大小分布
        size_dist = basket_sizes.value_counts().sort_index().head(10)
        report.append(f"\n◆ 购物篮大小分布 (Top 10):")
        for size, count in size_dist.items():
            report.append(f"  - {size}件商品: {count:,}单")
        
        # 3. 频繁项集分析 (手动实现简单版Apriori)
        report.append("\n" + "=" * 70)
        report.append("【3】频繁项集分析")
        report.append("=" * 70)
        
        # 获取每个订单的商品列表
        baskets = df_clean.groupby('InvoiceNo')['Description'].apply(list).tolist()
        
        # 生成1-itemsets
        item_support = defaultdict(int)
        for basket in baskets:
            for item in set(basket):
                item_support[item] += 1
        
        total_baskets = len(baskets)
        min_support = 0.02  # 支持度阈值 2%
        
        # 频繁1-itemsets
        frequent_1items = {item: cnt/total_baskets for item, cnt in item_support.items() if cnt/total_baskets >= min_support}
        report.append(f"\n◆ 频繁1-项集 (支持度 >= {min_support*100:.0f}%):")
        report.append(f"  共发现 {len(frequent_1items)} 个频繁商品")
        
        sorted_1items = sorted(frequent_1items.items(), key=lambda x: x[1], reverse=True)[:15]
        for item, support in sorted_1items:
            report.append(f"  • {item}: {support*100:.2f}%")
        
        # 生成2-itemsets
        pair_counts = defaultdict(int)
        for basket in baskets:
            items = list(set(basket))
            for i in range(len(items)):
                for j in range(i+1, len(items)):
                    pair = tuple(sorted([items[i], items[j]]))
                    pair_counts[pair] += 1
        
        # 频繁2-itemsets
        frequent_2items = {pair: cnt/total_baskets for pair, cnt in pair_counts.items() if cnt/total_baskets >= min_support}
        report.append(f"\n◆ 频繁2-项集 (支持度 >= {min_support*100:.0f}%):")
        report.append(f"  共发现 {len(frequent_2items)} 个频繁商品组合")
        
        sorted_2items = sorted(frequent_2items.items(), key=lambda x: x[1], reverse=True)[:15]
        for pair, support in sorted_2items:
            report.append(f"  • {pair[0]} + {pair[1]}: {support*100:.2f}%")
        
        # 4. 关联规则分析
        report.append("\n" + "=" * 70)
        report.append("【4】关联规则分析")
        report.append("=" * 70)
        
        min_confidence = 0.3  # 置信度阈值 30%
        rules = []
        
        for (item_a, item_b), support_ab in frequent_2items.items():
            support_a = frequent_1items.get(item_a, 0)
            support_b = frequent_1items.get(item_b, 0)
            
            if support_a > 0:
                confidence_ab = support_ab / support_a
                if confidence_ab >= min_confidence:
                    rules.append({
                        'antecedent': item_a,
                        'consequent': item_b,
                        'support': support_ab,
                        'confidence': confidence_ab,
                        'lift': confidence_ab / support_b if support_b > 0 else 0
                    })
            
            if support_b > 0:
                confidence_ba = support_ab / support_b
                if confidence_ba >= min_confidence:
                    rules.append({
                        'antecedent': item_b,
                        'consequent': item_a,
                        'support': support_ab,
                        'confidence': confidence_ba,
                        'lift': confidence_ba / support_a if support_a > 0 else 0
                    })
        
        # 按lift排序
        rules.sort(key=lambda x: x['lift'], reverse=True)
        
        report.append(f"\n◆ 强关联规则 (置信度 >= {min_confidence*100:.0f}%, 按Lift排序):")
        report.append(f"  共发现 {len(rules)} 条强关联规则")
        
        report.append(f"\n  {'规则':<60} {'支持度':>8} {'置信度':>8} {'Lift':>6}")
        report.append(f"  {'-'*60} {'-'*8} {'-'*8} {'-'*6}")
        
        for rule in rules[:20]:
            rule_str = f"{rule['antecedent']} → {rule['consequent']}"
            report.append(f"  {rule_str:<60} {rule['support']*100:>7.2f}% {rule['confidence']*100:>7.2f}% {rule['lift']:>5.2f}")
        
        # 5. 高Lift规则分析
        report.append("\n" + "=" * 70)
        report.append("【5】高Lift规则深度分析")
        report.append("=" * 70)
        
        high_lift_rules = [r for r in rules if r['lift'] > 2]
        report.append(f"\n◆ Lift > 2 的规则 (表明强正相关):")
        report.append(f"  共发现 {len(high_lift_rules)} 条")
        
        for rule in high_lift_rules[:10]:
            report.append(f"\n  🎯 规则: 如果购买「{rule['antecedent']}」")
            report.append(f"     → 很可能也购买「{rule['consequent']}」")
            report.append(f"     • 支持度: {rule['support']*100:.2f}% (同时购买的比例)")
            report.append(f"     • 置信度: {rule['confidence']*100:.2f}% (购买A后购买B的概率)")
            report.append(f"     • Lift: {rule['lift']:.2f} (比随机购买B的概率高{rule['lift']:.1f}倍)")
        
        # 6. 商品类别分析
        report.append("\n" + "=" * 70)
        report.append("【6】商品捆绑销售建议")
        report.append("=" * 70)
        
        report.append("\n◆ 基于关联规则的捆绑销售建议:")
        
        # 获取有意义的规则
        actionable_rules = [r for r in rules if r['lift'] > 1.5 and r['support'] > 0.02]
        
        for rule in actionable_rules[:8]:
            report.append(f"\n  📦 组合建议:")
            report.append(f"     {rule['antecedent']} + {rule['consequent']}")
            report.append(f"     • 推荐理由: 购买前者的顾客有{rule['confidence']*100:.0f}%也购买后者")
            report.append(f"     • Lift值: {rule['lift']:.2f} (关联强度)")
        
        # 7. 交叉销售机会
        report.append("\n" + "=" * 70)
        report.append("【7】交叉销售机会")
        report.append("=" * 70)
        
        report.append(f"\n◆ 高潜力交叉销售组合 (Top 10):")
        cross_sell = []
        for rule in rules:
            if rule['confidence'] > 0.4 and rule['support'] > 0.01:
                cross_sell.append(rule)
        
        cross_sell.sort(key=lambda x: x['confidence'] * x['support'], reverse=True)
        
        for idx, rule in enumerate(cross_sell[:10], 1):
            report.append(f"  {idx}. {rule['antecedent']} → {rule['consequent']}")
            report.append(f"     置信度: {rule['confidence']*100:.1f}% | 支持度: {rule['support']*100:.1f}%")
        
        # 8. 滞销商品分析
        report.append("\n" + "=" * 70)
        report.append("【8】滞销商品分析")
        report.append("=" * 70)
        
        # 计算每个商品的购买频次
        item_freq = df_clean['Description'].value_counts()
        total_transactions = df_clean['InvoiceNo'].nunique()
        
        # 滞销商品（购买次数少于总订单的1%）
        slow_items = item_freq[item_freq < total_transactions * 0.01]
        report.append(f"\n◆ 滞销商品数量: {len(slow_items)}种 (购买频次 < 1%)")
        
        if len(slow_items) > 0:
            report.append(f"\n◆ 部分滞销商品:")
            for item, count in slow_items.head(10).items():
                report.append(f"  • {item}: {count}次")
        
        report.append("\n" + "=" * 70)
        report.append("                 购物篮分析报告结束")
        report.append("=" * 70)
        
        return "\n".join(report)
        
    except Exception as e:
        import traceback
        return f"分析过程中发生错误: {str(e)}\n{traceback.format_exc()}"

if __name__ == "__main__":
    print(basket_analysis())