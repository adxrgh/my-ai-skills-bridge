# Chapter 9: IBM Original and Digital Type

## Core Idea

数字技术让尺寸、宽度、粗细、字距和倾斜都可连续调整，但技术自由不会自动产生新字体。IBM Original 的目标是在无衬线构造、古典形态与阅读流之间建立新的构形原则，并让家族可被程序化扩展。

## Frameworks Introduced

- **New Life for Familiar Letters**：不重造字母表，而是在数百年形成的可读字母中寻找新的系统综合。
  - **When to use**：创新必须保持广泛阅读能力。
  - **How**：识别历史形态的核心功能；区分书写遗迹与阅读需要；提出可跨字母成立的新原则；用难字检验。

- **Open Form Principle**：尽量避免 punches，即封闭内部空间，让 B、P、R 等构成开放。
  - **When to use**：希望以一致结构建立独特字面，同时保持阅读。
  - **Failure mode**：为了规则牺牲字母辨识，或只在容易字母上成立。

- **Classical Contrast without Serifs**：无衬线并不要求横竖笔画等粗；古典字形的对比可服务阅读流。

- **Digital Continuum**：数字排印不再受固定铅字尺寸限制，宽度、粗细、字距与倾斜可连续变化。
  - **Guardrail**：软件的 warp、contour 和 slant 只是操作能力，字体仍需 programme 决定合法范围与光学修正。

## Key Concepts

- **Punch**：字母的封闭内空间。
- **Stroke contrast**：横笔与竖笔的粗细差异。
- **Reading flow**：字母连接成词和行时形成的连续视觉节奏。
- **Interpolation**：在设计轴上生成中间状态。
- **Digital implementation**：把构形原则变成可由计算机调用的字体版本。

## Mental Models

- 技术消除固定档位后，programme 更重要，因为“任何值都能选”不等于“任何值都合理”。
- 用最难服从原则的字母测试字体系统，而不是只展示 O、H 等容易字形。
- 新字体既要在字母层有原则，也要在正文层有节奏。

## Anti-patterns

- **Alphabet reinvention for spectacle**：能组成醒目词图，却无法承载连续文本。
- **Software transform as type design**：把机械拉伸、描边和倾斜直接当作合格字族。
- **Rule that breaks hard glyphs**：原则只适合部分字母，难字靠无数例外拼补。
- **Upright simply slanted**：把斜体等同于正体倾斜，忽略阅读流和字形自身形式。
- **Technology-led identity**：因为数字工具能变，就让所有轴都变化。

## Reference Table: IBM Original Principles

| 原则 | 设计含义 |
|---|---|
| Classical shape basis | 大写字母保留古典形态依据 |
| Remove script-era joins | 曲线进入直线处减少书写时代的收束遗迹 |
| Stroke differentiation | 以横竖对比服务节奏与阅读 |
| Open form | 能避免时减少封闭内空间 |
| Modified diagonal openness | 对角字母以适合自身的方式落实开放原则 |
| Dedicated italic cues | 通过圆润收笔等方式强调斜体阅读流 |

## Worked Example

IBM 在 1980 年代委托 Gerstner 设计 company typeface。他既拒绝把字母表改造成难读的未来符号，也不满足于复制 Futura。他希望无衬线更构造化、减少书写时代的遗迹，同时重新引入古典字体的横竖对比。

B、P、R 成为 programme 的压力测试：开放内部空间的原则在这些字母上经历多年推敲。项目最终未被 IBM 使用，字体又历经 Gerstner Original、kg vera、kg privata 等版本。后续修改加强横竖对比，说明 programme 不是一次完成的数学证明，而是由正文效果与技术环境持续校正的学习过程。

## Key Takeaways

1. 数字连续轴扩大实现自由，也扩大选择责任。
2. 字体创新应保留语言长期形成的可读结构。
3. 用困难字形和连续正文验证构形原则。
4. 机械插值不能替代光学与语义判断。
5. 未被商业采用不等于 programme 没有知识价值；失败会暴露下一轮参数。

## Connects To

- **Ch 5**：数字字体轴是 controlled continuity 的具体应用。
- **Ch 8**：从离散家族矩阵过渡到数字连续自由。
- **Ch 12**：programme 通过反馈和新参数继续演化。
