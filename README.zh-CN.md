# intlquals

面向国际课程研究的 terminal-first、AI-native CLI。

[English README](./README.md)

## 它是什么

`intlquals` 是一个聚焦型命令行工具，服务于国际课程与国际化学校研究工作流。当前第一阶段重点围绕 AP、A-Level、IB 相关生态中的榜单与学校研究。

它不是泛教育平台，也不是零门槛工具，而是为熟悉命令行、表格、脚本和 AI 工作流的 power users 准备的研究工具。

## 为什么做它

- 聚合聚焦的数据源
- 统一成可复用的工作流
- 稳定地搜索、对比、导出
- 为表格、脚本和 AI 分析准备干净输入

## 为什么是 CLI

我们认为，AI 正在让命令行工作流变得更易用，也更有力量。

目标不是在终端里复制 GUI，而是提供一层高杠杆的研究控制面，让查询、组合、自动化和 AI 对接都更自然。

## 当前范围

- 早期 MVP
- 首个 provider: AdmitRanking
- 当前重点: 榜单与学校研究

环境要求：

- Node.js 22+

## 快速开始

```bash
git clone https://github.com/KaynXu/intlquals.git
cd intlquals
npm install
npm run dev -- rank admitranking list
npm run dev -- rank admitranking show 52
```

## 常用示例

- `iq rank admitranking list`
- `iq rank admitranking show 52`
- `iq rank admitranking school 90`

## 开发与验证

本地验证命令：

```bash
npm test
npm run lint:types
npm run build
```

- 贡献说明: [CONTRIBUTING.zh-CN.md](./CONTRIBUTING.zh-CN.md)
- 合规说明: [docs/compliance.md](./docs/compliance.md)

## 路线图

### v0.1

- AdmitRanking provider
- provider 作用域下的榜单列表
- 带学校内容的榜单详情
- provider 作用域下的学校详情

### 下一步

- 更强的学校输出能力
- 更好的榜单展示体验
- 在核心工作流稳定后接入更多 provider
