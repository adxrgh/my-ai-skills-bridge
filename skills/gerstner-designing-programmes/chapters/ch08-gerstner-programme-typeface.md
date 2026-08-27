# Chapter 8: The Gerstner Programme Typeface

## Core Idea

字体家族应由统一构形原则推导，而不是把若干独立设计的宽度与字重集合在一起。Gerstner programme 以经时间验证的 Berthold sans serif 为基础，建立宽度、粗细和斜体之间的系统关系。

## Frameworks Introduced

- **Improve the Proven Original**：与其不断发明新字体，不如选择经长期使用验证的原型，识别缺陷并系统完善。
  - **When to use**：成熟基础已存在，但家族不完整或关系不一致。
  - **How**：比较候选原型；明确选择标准；保留关键 character；修正缺陷；用统一原则扩展。

- **Coherent Family Matrix**：宽度和粗细是两个系统轴，交叉产生家族。
  - **How**：选择核心字形与正常版本；确定轴线和度量；按共同因子扩大或缩小；再做光学校正。
  - **Why it works**：每个成员不只是风格相近，而在数学和视觉上有可追溯关系。

- **Optical Law over Pure Geometry**：几何构造是工具，文字节奏和可读性仍需视觉修正。
  - **When to use**：插值技术能自动产生字形，但极端宽度或字重显得机械。

## Key Concepts

- **Basic type**：家族的基础版本。
- **Width axis**：字形横向比例变化。
- **Weight axis**：笔画粗细变化。
- **Optical size adjustment**：小字号更宽等针对阅读尺度的修正。
- **Family coherence**：成员在结构上同源，不只是视觉近似。

## Mental Models

- 把字体家族看成二维坐标系，而不是字体菜单。
- 把历史原型视为积累了无名工匠经验的数据，不因“原创”冲动轻易丢弃。
- 参数化生成之后仍要逐字检查；字母不是可无损缩放的几何图标。

## Anti-patterns

- **Novelty as progress**：新造字形却没有改善阅读或家族关系。
- **Independent styles bundled as family**：各字重、宽度由不同逻辑构造。
- **Pure pantograph scaling**：直接缩放所有字号，忽略小字阅读需求。
- **Geometry without rhythm**：字母单看规整，词和段落灰度失衡。
- **System without market/process reality**：程序完整，却忽略铸字、照排、发行和维护条件。

## Reference Table: Gerstner Programme

| 轴 | 原则 |
|---|---|
| 基础字形 | 以正常版本 `bb` 的 `n` 建立轴线关系 |
| 宽度扩展 | 相邻宽度约乘 `1.25` |
| 宽度收窄 | 使用相反方向的 `-1.25` 关系 |
| 粗细扩展 | 两个细体和两个粗体由同一因子推导 |
| 家族矩阵 | 横向更宽、纵向更粗，形成 16 个版本 |
| 斜体 | 系统整体倾斜后再处理，而非独立无关设计 |

## Worked Example

Gerstner、Gredinger + Kutter 团队比较 Berthold、Futura、Gill、Univers、Folio 与 Helvetica。他们认为 Berthold 的匿名工艺传统保留了小字号更宽、字面与节奏稳定等细节，但存在四个粗体基线不一、缺少斜体等问题。

团队以 `n` 的轴线距离为起点，让宽度和粗细按 1.25 因子形成矩阵，再细调基础字母并生成八个正体、八个斜体。技术上先利用摄影，最终制作字模。programme 证明家族可被统一推导，但其短暂商业寿命也说明设计系统受生产与发行生态影响。

## Key Takeaways

1. 参数化字体首先需要可信的基础字形。
2. 家族一致性来自轴与构形原则，不只是共同名称。
3. 数学因子建立关系，光学校正保证阅读。
4. 历史原型可以被系统更新，不必在复古与彻底重造间二选一。
5. 字体 programme 还要面对生产、发行和技术生命周期。

## Connects To

- **Ch 2**：把参数、组件和评价条件应用到字体家族。
- **Ch 9**：数字技术取消固定尺寸后，programme 获得更连续的实现空间。
- **Ch 10**：字体家族最终要在 integral typography 中承担语言任务。
