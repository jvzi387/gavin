#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
超市关联规则数据集 - 购物篮分析
数据源: 超市关联规则数据集.xls
"""

import pandas as pd
import numpy as np
from collections import defaultdict

def supermarket_basket_analysis():
    """超市购物篮分析"""
    try:
        # 读取Excel文件
        df = pd.read_excel('/workspace/超市关联规则数据集.xls')
        
        report = []
        report.append("=" * 70)
        report.append("        超市关联规则数据集 - 购物篮分析报告")
        report.append("=" * 70)
        
        # 数据概览
        report.append(f"\n【数据概览】")
        report.append(f"• 数据行数: {df.shape[0]:,}")
        report.append(f"• 数据列数: {df.shape[1]}")
        report.append(f"• 列名: {', '.join([str(col) for col in df.columns.tolist()])}")
        
        # 查看前几行数据了解结构
        report.append("\n【数据预览 (前5行)】")
        report.append(df.head().to_string())
        
        # 数据清洗
        # 判断数据格式 - 常见格式有两种:
        # 1. 每行一个订单，商品用逗号分隔在一列中
        # 2. 每行一条记录，包含订单ID和商品
        
        # 检查是否有订单相关字段
        order_cols = [col for col in df.columns if '订单' in str(col) or 'order' in str(col).lower()]
        item_cols = [col for col in df.columns if '商品' in str(col) or 'product' in str(col).lower() or 'item' in str(col).lower()]
        
        report.append(f"\n【字段识别】")
        report.append(f"• 疑似订单字段: {order_cols}")
        report.append(f"• 疑似商品字段: {item_cols}")
        
        # 确定数据格式并处理
        baskets = []
        
        if len(order_cols) > 0 and len(item_cols) > 0:
            # 格式2: 每行一条记录
            order_col = order_cols[0]
            item_col = item_cols[0]
            
            # 按订单分组
            df_clean = df.dropna(subset=[order_col, item_col])
            df_clean[item_col] = df_clean[item_col].astype(str).str.strip()
            df_clean = df_clean[df_clean[item_col] != '']
            
            baskets = df_clean.groupby(order_col)[item_col].apply(list).tolist()
            
            report.append(f"\n【数据清洗】")
            report.append(f"• 使用订单字段: {order_col}")
            report.append(f"• 使用商品字段: {item_col}")
            report.append(f"• 有效订单数: {len(baskets):,}")
            report.append(f"• 有效记录数: {len(df_clean):,}")
            
        else:
            # 格式1: 每行一个订单，商品在一列中用逗号分隔
            # 尝试找到包含多个商品的列
            for col in df.columns:
                sample = df[col].dropna().iloc[0]
                if isinstance(sample, str) and ',' in sample:
                    baskets = df[col].dropna().apply(lambda x: [item.strip() for item in str(x).split(',')]).tolist()
                    report.append(f"\n【数据格式识别】")
                    report.append(f"• 使用字段: {col}")
                    report.append(f"• 订单数: {len(baskets):,}")
                    break
        
        if len(baskets) == 0:
            # 尝试其他格式
            report.append("\n【尝试自动识别数据格式...】")
            # 检查是否第一行是标题，数据从第二行开始
            if df.shape[0] > 1:
                # 假设第一行是标题，尝试将第一行作为列名
                new_header = df.iloc[0]
                df = df[1:]
                df.columns = new_header
                
                order_cols = [col for col in df.columns if '订单' in str(col) or 'order' in str(col).lower()]
                item_cols = [col for col in df.columns if '商品' in str(col) or 'product' in str(col).lower()]
                
                if len(order_cols) > 0 and len(item_cols) > 0:
                    order_col = order_cols[0]
                    item_col = item_cols[0]
                    df_clean = df.dropna(subset=[order_col, item_col])
                    baskets = df_clean.groupby(order_col)[item_col].apply(list).tolist()
                    report.append(f"• 重新识别: 订单数={len(baskets):,}")
        
        if len(baskets) == 0:
            return "无法识别数据格式，请检查数据文件结构"
        
        # 统计商品信息
        all_items = [item for basket in baskets for item in basket]
        unique_items = set(all_items)
        
        report.append(f"\n【商品统计】")
        report.append(f"• 商品种类数: {len(unique_items):,}")
        report.append(f"• 总购买次数: {len(all_items):,}")
        
        # 1. 商品购买频次分析
        report.append("\n" + "=" * 70)
        report.append("【1】商品购买频次分析")
        report.append("=" * 70)
        
        item_counts = defaultdict(int)
        for item in all_items:
            item_counts[item] += 1
        
        sorted_items = sorted(item_counts.items(), key=lambda x: x[1], reverse=True)
        top_20 = sorted_items[:20]
        
        report.append(f"\n◆ Top 20最畅销商品:")
        for idx, (item, count) in enumerate(top_20, 1):
            report.append(f"  {idx:2d}. {item}: {count:,}次")
        
        # 2. 购物篮大小分析
        report.append("\n" + "=" * 70)
        report.append("【2】购物篮大小分析")
        report.append("=" * 70)
        
        basket_sizes = [len(basket) for basket in baskets]
        report.append(f"\n◆ 购物篮大小统计:")
        report.append(f"  - 平均每单商品数: {np.mean(basket_sizes):.1f}件")
        report.append(f"  - 中位数每单商品数: {np.median(basket_sizes):.1f}件")
        report.append(f"  - 最小购物篮: {min(basket_sizes)}件")
        report.append(f"  - 最大购物篮: {max(basket_sizes)}件")
        
        # 3. 频繁项集分析
        report.append("\n" + "=" * 70)
        report.append("【3】频繁项集分析")
        report.append("=" * 70)
        
        total_baskets = len(baskets)
        min_support = 0.02  # 支持度阈值 2%
        
        # 频繁1-itemsets
        frequent_1items = {item: cnt/total_baskets for item, cnt in item_counts.items() if cnt/total_baskets >= min_support}
        report.append(f"\n◆ 频繁1-项集 (支持度 >= {min_support*100:.0f}%):")
        report.append(f"  共发现 {len(frequent_1items)} 个频繁商品")
        
        sorted_1items = sorted(frequent_1items.items(), key=lambda x: x[1], reverse=True)[:10]
        for item, support in sorted_1items:
            report.append(f"  • {item}: {support*100:.2f}%")
        
        # 频繁2-itemsets
        pair_counts = defaultdict(int)
        for basket in baskets:
            items = list(set(basket))
            for i in range(len(items)):
                for j in range(i+1, len(items)):
                    pair = tuple(sorted([items[i], items[j]]))
                    pair_counts[pair] += 1
        
        frequent_2items = {pair: cnt/total_baskets for pair, cnt in pair_counts.items() if cnt/total_baskets >= min_support}
        report.append(f"\n◆ 频繁2-项集 (支持度 >= {min_support*100:.0f}%):")
        report.append(f"  共发现 {len(frequent_2items)} 个频繁商品组合")
        
        sorted_2items = sorted(frequent_2items.items(), key=lambda x: x[1], reverse=True)[:10]
        for pair, support in sorted_2items:
            report.append(f"  • {pair[0]} + {pair[1]}: {support*100:.2f}%")
        
        # 4. 关联规则分析
        report.append("\n" + "=" * 70)
        report.append("【4】关联规则分析")
        report.append("=" * 70)
        
        min_confidence = 0.2  # 置信度阈值 20%
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
        
        rules.sort(key=lambda x: x['lift'], reverse=True)
        
        report.append(f"\n◆ 强关联规则 (置信度 >= {min_confidence*100:.0f}%, 按Lift排序):")
        report.append(f"  共发现 {len(rules)} 条强关联规则")
        
        if len(rules) > 0:
            report.append(f"\n  {'规则':<50} {'支持度':>8} {'置信度':>8} {'Lift':>6}")
            report.append(f"  {'-'*50} {'-'*8} {'-'*8} {'-'*6}")
            
            for rule in rules[:15]:
                rule_str = f"{rule['antecedent']} → {rule['consequent']}"
                report.append(f"  {rule_str:<50} {rule['support']*100:>7.2f}% {rule['confidence']*100:>7.2f}% {rule['lift']:>5.2f}")
        else:
            report.append("  未发现满足条件的强关联规则")
        
        # 5. 高Lift规则深度分析
        report.append("\n" + "=" * 70)
        report.append("【5】高Lift规则深度分析")
        report.append("=" * 70)
        
        high_lift_rules = [r for r in rules if r['lift'] > 2]
        report.append(f"\n◆ Lift > 2 的规则 (表明强正相关):")
        report.append(f"  共发现 {len(high_lift_rules)} 条")
        
        for rule in high_lift_rules[:8]:
            report.append(f"\n  🎯 规则: 如果购买「{rule['antecedent']}」")
            report.append(f"     → 很可能也购买「{rule['consequent']}」")
            report.append(f"     • 支持度: {rule['support']*100:.2f}%")
            report.append(f"     • 置信度: {rule['confidence']*100:.2f}%")
            report.append(f"     • Lift: {rule['lift']:.2f}")
        
        # 6. 捆绑销售建议
        report.append("\n" + "=" * 70)
        report.append("【6】捆绑销售建议")
        report.append("=" * 70)
        
        actionable_rules = [r for r in rules if r['lift'] > 1.5 and r['support'] > 0.01]
        
        if len(actionable_rules) > 0:
            report.append("\n◆ 基于关联规则的捆绑销售建议:")
            
            for rule in actionable_rules[:6]:
                report.append(f"\n  📦 组合建议: {rule['antecedent']} + {rule['consequent']}")
                report.append(f"     • 置信度: {rule['confidence']*100:.0f}%")
                report.append(f"     • Lift值: {rule['lift']:.2f}")
        else:
            report.append("\n◆ 暂时没有高置信度的捆绑销售建议")
        
        # 7. 交叉销售机会
        report.append("\n" + "=" * 70)
        report.append("【7】交叉销售机会")
        report.append("=" * 70)
        
        cross_sell = [r for r in rules if r['confidence'] > 0.3 and r['support'] > 0.01]
        cross_sell.sort(key=lambda x: x['confidence'] * x['support'], reverse=True)
        
        report.append(f"\n◆ 高潜力交叉销售组合 (Top 8):")
        for idx, rule in enumerate(cross_sell[:8], 1):
            report.append(f"  {idx}. {rule['antecedent']} → {rule['consequent']}")
            report.append(f"     置信度: {rule['confidence']*100:.1f}% | 支持度: {rule['support']*100:.1f}%")
        
        # 8. 滞销商品分析
        report.append("\n" + "=" * 70)
        report.append("【8】滞销商品分析")
        report.append("=" * 70)
        
        slow_items = [(item, cnt) for item, cnt in item_counts.items() if cnt < total_baskets * 0.01]
        report.append(f"\n◆ 滞销商品数量: {len(slow_items)}种 (购买频次 < 1%)")
        
        if len(slow_items) > 0:
            slow_items.sort(key=lambda x: x[1])
            report.append(f"\n◆ 购买频次最低的商品:")
            for item, count in slow_items[:10]:
                report.append(f"  • {item}: {count}次")
        
        report.append("\n" + "=" * 70)
        report.append("                 购物篮分析报告结束")
        report.append("=" * 70)
        
        return "\n".join(report)
        
    except Exception as e:
        import traceback
        return f"分析过程中发生错误: {str(e)}\n{traceback.format_exc()}"

if __name__ == "__main__":
    print(supermarket_basket_analysis())