# LoveAudit Questions Spec (Concise MVP)

This file defines the concise MVP questionnaire for LoveAudit.
It is optimized for mobile completion speed:
- single-choice questions use **4 options only**
- multi-select questions may use more options
- `不确定 / 跳过` should be rendered as a **secondary UI action**, not as a main option

---

## Quiz Metadata
- Total questions: 25
- Estimated time: 3–4 minutes
- Primary mode: mobile, one question at a time
- Question types: single-choice, multi-select, optional free text
- Single-choice rule: max 4 options
- Secondary actions: `不确定`, `跳过本题`

---

## Chapter 1: 安全与底线

### Q1. 在边界和忠诚上，伴侣更接近：
Type: `single`
Options:
- A. 边界清楚，我很安心
- B. 偶尔让我不舒服，但能沟通
- C. 经常越界，还说我想太多
- D. 有隐瞒暧昧、背叛或反复欺骗


### Q2. 在诚实和透明度上，伴侣更接近：
Type: `single`
Options:
- A. 基本透明坦诚
- B. 有过隐瞒，但沟通后愿意坦诚
- C. 重要事情常靠我发现
- D. 经常撒谎或有重大隐瞒


### Q3. 在查手机、社交对象这些事上，对方通常：
Type: `single`
Options:
- A. 尊重边界，不过度查问
- B. 偶尔在意，但讲得通
- C. 常查问、试探、要求解释
- D. 会监控、检查或限制我
Critical:
- D is a strong control marker.


### Q4. 在钱和财务边界上，伴侣更接近：
Type: `single`
Options:
- A. 对钱坦诚，会主动商量
- B. 偶尔保留，但不伤信任
- C. 会隐瞒消费、债务或借贷
- D. 会控制我用钱或逼我承担
Critical:
- D is a serious red flag.


### Q5. 在身体边界上，对方通常：
Type: `single`
Options:
- A. 尊重我的意愿和节奏
- B. 偶有落差，但能沟通调整
- C. 会施压，让我有负担
- D. 有过强迫、羞辱或明显越界
Critical:
- D is a serious red flag.


### Q6. 你是否曾因对方感到害怕或不敢表达？
Type: `single`
Options:
- A. 从未，能安心表达
- B. 有时会怕对方生气或冷暴力
- C. 会，经常被对方责骂、威胁
- D. 非常，害怕被对方跟踪、侮辱或伤及人身安全
Critical:
- C/D are serious red flags.


---

## Chapter 2: 互动与情绪模式

### Q7. 关系出问题时，你通常先：
Type: `single`
Options:
- A. 积极沟通，想解决办法
- B. 沉默、回避或消失，希望问题自动解决
- C. 情绪失控，需要被安抚和理解
- D. 防御辩解，指责对方错得更多


### Q8. 关系出问题时，伴侣通常先：
Type: `single`
Options:
- A. 积极沟通，想解决办法
- B. 沉默、回避或消失，希望问题自动解决
- C. 情绪失控，需要被安抚和理解
- D. 防御辩解，指责你错得更多


### Q9. 吵完架后，你们最常见的处理是：
Type: `single`
Options:
- A. 能很快沟通修复矛盾
- B. 过一阵能修复
- C. 一直冷战或拖着不谈
- D. 翻旧账、反复爆发或拉黑


### Q10. 当你表达不满或边界时，对方通常：
Type: `single`
Options:
- A. 认真听并调整
- B. 当下防御，之后会改
- C. 常把问题推回给我
- D. 用失联、分手、自伤或情绪失控逼我让步
Critical:
- D is a severe coercion marker.


---

## Chapter 3: 价值观与核心规划

### Q11. 在花钱和财务协作上，你们更接近：
Type: `single`
Options:
- A. 观念接近，会商量
- B. 有差异，但能尊重
- C. 没规则，常有摩擦
- D. 经常因为钱吵架


### Q12. 在未来规划上，你们更接近：
Type: `single`
Options:
- A. 大方向吻合
- B. 大方向一致，细节在磨合
- C. 还没认真谈过
- D. 分歧大，或对方一直回避


### Q13. 对婚姻的理解，你们更接近：
Type: `single`
Options:
- A. 对未来方向和节奏都有共识
- B. 大方向一致，但一些现实安排还在磨合
- C. 还没认真谈过未来规划
- D. 分歧明显，或对方常回避相关讨论


### Q14. 对结婚这件事，伴侣目前更接近：
Type: `single`
Options:
- A. 有明确结婚意愿，也愿意推进现实规划
- B. 有结婚意愿，但还没准备好进入具体规划
- C. 态度不明确，常回避或拖延讨论
- D. 明确表示目前不考虑结婚


### Q15. 对你追求兴趣、事业和成长，伴侣更接近：
Type: `single`
Options:
- A. 支持并鼓励
- B. 尊重，不太干涉
- C. 嘴上支持，实际常泼冷水
- D. 会贬低、阻拦或控制


### Q16. 在责任分配上，你们更接近：
Type: `single`
Options:
- A. 分工大致均衡，彼此都认可
- B. 偶有偏多偏少，但整体还能协调
- C. 长期主要由我承担，我常觉得失衡
- D. 基本由对方承担

---

## Chapter 4: 家庭边界

### Q17. 伴侣原生家庭的互动模式更接近：
Type: `single`
Options:
- A. 和谐稳定，互相尊重
- B. 有冲突，但能修复
- C. 冷漠、压抑或回避
- D. 强行控制，暴力或其他严重问题


### Q18. 在对父母的边界感上，伴侣更接近：
Type: `single`
Options:
- A. 亲近但有边界
- B. 会受父母影响，但会和我商量
- C. 明显更站父母那边
- D. 父母说了算

---

## Chapter 5: 主观体感

### Q19. 用一句话形容这段关系，你更接近： 
Type: `single` 
Options: 
- A. 安稳踏实自在，能坚定往前走 
- B. 有爱也有矛盾，能在磨合中前进 
- C. 好的时候很好，坏的时候很伤 
- D. 常在这段关系里失去自我


### Q20. 这段关系里，最让你感到消耗的是？（可选 1–2 项）
Type: `multi`
Max selections: 2
Options:
- A. 常感到不被理解或不被回应
- B. 缺乏稳定感与安全感
- C. 冲突反复，难以真正修复
- D. 现实压力长期压在关系上
- E. 边界不被尊重，常需要委屈自己
- F. 基本没有明显消耗


### Q21. 还有什么想补充的吗？（可跳过）
Type: `text`
Optional: true
Prompt:
- 只写一个最能代表这段关系的瞬间即可。
- 例如：最近一次让你怀疑“TA 适不适合结婚”的事。
Privacy:
- Do not require completion.
- Do not heavily analyze free text in MVP.

---

## Scoring Guidance Summary

Vis我如何 indices:
- 安全指数
- 适配指数
- 修复指数

Hidden dimension:
- 消耗指数

Red-flag-heavy questions:
- Q3
- Q4
- Q5
- Q6
- Q18

Strong trigger examples:
- physical violence
- coercive control
- sexual coercion
- severe financial control
- self-harm / breakup threats used as coercion

These should affect:
- score deduction
- result-type override logic
- warning UI priority

---

## Implementation Notes

- Keep question copy short enough for one mobile screen.
- Single-choice questions must stay at 4 main options.
- Render `不确定` and `跳过本题` as small tertiary buttons under the options.
- Store skipped / unsure as `null` or `unknown`, not as a scored option.
- Do not flatten red flags into a generic compatibility score.
