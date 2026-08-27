# Chapter 4: Programmed Images and Computation

## Core Idea

摄影、商业设计和计算机图形都可以被 programme 化：人定义元素、视角、组合与评价，设备执行或扩展变化。工具不会自动生成意义，programme 的质量仍来自人的建模与判断。

## Frameworks Introduced

- **Programmed Viewpoints**：以固定序列从多个角度观察对象，让不同视图累积成新的整体。
  - **When to use**：单一视角无法表达空间、时间或对象的不变量。
  - **How**：定义相机位置、距离与步长；保持对象或视角中的关键不变量；并置或依序呈现结果。

- **Invariant through Variants**：对象在多种视图中保持同一，而每个图像只是相对于观察点的变体。
  - **Why it works**：programme 不追求“唯一真实视图”，而组织视图间的法则。

- **Cumulative Packaging Pattern**：单件包装保持品牌区别，多件并列时图案继续连接，整体大于单件之和。
  - **When to use**：自助货架、集合陈列或模块化组合需要群体效应。

- **Human-Written, Machine-Executed Aesthetic Programme**：人选择视觉对象类别并彻底形式化，机器自动执行。
  - **How**：确定元素；把颜色、形状、频率、邻近、张力等概念转成可计算关系；编程；生成；评价。
  - **Failure mode**：把 chance generator 当成 imagination 本身。

## Key Concepts

- **Viewpoint programme**：观察点按规则排列的系统。
- **Invariant**：多种图像背后保持不变的对象或关系。
- **Cumulative effect**：多个实例组合后产生超出单件的连续整体。
- **Formalization**：把视觉概念转成机器可执行描述。
- **Chance generator**：在限定结构中产生非重复变体的机制。

## Mental Models

- 把相机当作 programme 的执行器，而不是中性的记录设备。
- 让单件与群组同时通过测试；货架也是一种版面。
- 计算机生成的审美 programme 仍是人写的，责任不能转移给机器。

## Anti-patterns

- **More views, no new whole**：增加角度却没有累积结构。
- **Shelf wallpaper**：连续图案损害单件识别或真实陈列中无法对齐。
- **Randomness as creativity**：只因结果不重复就认为具有想象力。
- **Unformalized adjectives**：把“动感、和谐、未来感”直接交给程序，没有操作定义。
- **Machine output as final judgment**：只筛选视觉新奇，不检查任务与意义。

## Worked Example

摄影案例用周期性固定的相机位置拍摄汽车，再把不同角度组合为平面图像。另一件 pastework 从更近距离拍摄局部；两者 programme 差异不大：都让原本随时间逐一看到的空间视图同时出现。对象是 invariant，照片是 variants。

洗衣粉包装则为三个不同品牌设计波形：单包必须区分，各包并列时波纹无论同款、混款、正面或侧面都能形成连续结构。形式 programme 还必须与心理 programme 相符，不能用群组效果掩盖产品定位。

Frieder Nake 的计算机图形把横竖等长线作为元素，将选择、位置和关系形式化，再由计算机与绘图机执行。chance generator 使 programme 可重复运行而不产生相同结果，但审美 class 与规则仍由人决定。

## Key Takeaways

1. 多视角 programme 设计的是视图之间的法则。
2. 组合系统要同时检查单件完整性与群组效应。
3. 自动生成扩大可能性，不提供评价标准。
4. 随机性必须在明确结构中工作。
5. 形式 programme 应与语义、心理和商业条件相符。

## Connects To

- **Ch 3**：周期性从网格扩展到视角与实例组合。
- **Ch 5**：多视角和机器生成依赖连续、步长和变化关系。
- **Ch 12**：Carro 64 把作者 programme 与使用者重组结合。
