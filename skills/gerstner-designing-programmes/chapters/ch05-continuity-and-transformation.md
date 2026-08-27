# Chapter 5: Continuity and Transformation

## Core Idea

视觉元素不是孤立类别：颜色、形状、比例和运动都能沿连续关系相互过渡。programme 的工作是控制起止点、步长、方向和节奏，使变化既连续又具有结构。

## Frameworks Introduced

- **Visual Continuity**：任何颜色可过渡到另一颜色，任何形状可变成另一形状；运动可被分解为连续静态阶段。
  - **When to use**：响应式形态、动态身份、色彩梯度、状态动画或形变系统。
  - **How**：定义维度与端点；选择步数；规定每步关系；检查中间态；决定是否闭环。

- **Continuity vs Constancy**：连续指状态相接，恒定指步长均匀；两者可以分别控制。
  - **When to use**：过渡看似平滑，但变化在某一区域突然加速或停滞。

- **Movement as Phased Form**：运动由形态连续变化产生，电影通过静态阶段重建运动幻觉。
  - **How**：找出能代表变化法则的关键帧，不只设计首尾。

- **Correlated Form and Colour**：形式、体积与颜色系统应能建立共同的 transformation model。

## Key Concepts

- **Series**：按参照关系排列的状态集合。
- **Step size**：相邻状态的变化量。
- **Closed system**：终点能重新接回起点的序列。
- **Phase**：连续运动中的离散状态。
- **Controlled irregularity**：连续但步长不恒定的有意变化。

## Mental Models

- 把 transition 看成一个完整设计对象，而不是两个界面之间的补间。
- 连续性回答“能否顺畅经过”，恒定性回答“步伐是否均匀”。
- 中间态不是副产品；它们决定使用者感受到的运动性质。

## Anti-patterns

- **Endpoint design**：只批准起点与终点，不检查中间阶段。
- **Smoothness assumed**：使用默认 easing 或插值后就宣称连续关系成立。
- **Dimension mixing**：同时改变颜色、比例与方向，却没有说明它们如何联动。
- **Infinite variation claim**：强调可生成无数状态，却没有有意义的选择原则。
- **Category lock**：把圆、方、色彩视为封闭类别，忽略可设计的过渡空间。

## Worked Example

印刷 screen 从白底小黑圆点逐渐变为黑白等量方格，再变成黑底小白圆点。色调连续变化，同时形态完成圆—方—圆。三角形向圆的变换则说明 continuity 与 constancy 不同：状态相接，但靠近三角形处的变化可能比靠近圆处更大。

Gerstner 的“squaring the circle”进一步提出，生命中的成长也是颜色和形状的微小连续变化。为“optical torture room”设想的棋盘格可以在形、色、体积和纹理上持续改变。programme 不只列端点，还要规定每条变化轴如何同步或独立运行。

## Key Takeaways

1. 任何视觉过渡都应显式定义维度、端点和步长。
2. 连续不等于均匀，均匀也不等于有意义。
3. 运动可以通过阶段结构被分析和 programme 化。
4. 色彩与形式的变化应建立联动规则。
5. 中间态质量决定整个系统的可信度。

## Connects To

- **Ch 3**：印刷 screen 是形与色同步变化的模型。
- **Ch 9**：数字字体插值提供连续自由，但仍需要构形原则。
- **Ch 12**：从有序灰阶到 permutation 的 movement 建立完整方法。
