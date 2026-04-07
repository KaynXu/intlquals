# intlquals

面向国际课程研究的 terminal-first、AI-native CLI。

[English README](./README.md)

## 它是什么

`intlquals` 是一个聚焦型命令行工具，服务于国际课程与国际化学校研究工作流。当前第一阶段重点围绕 AP、A-Level、IB 相关生态中的榜单与学校研究。

它不是泛教育平台，也不是零门槛工具，而是为熟悉命令行、表格、脚本和 AI 工作流的 power users 准备的研究工具。

## 为什么做它

- 聚合聚焦的数据源
- 统一成可复用的工作流
- 稳定地查看聚焦的榜单与学校数据
- 为表格、脚本和 AI 分析准备干净输入

## 为什么是 CLI

我们认为，AI 正在让命令行工作流变得更易用，也更有力量。

目标不是在终端里复制 GUI，而是提供一层高杠杆的研究控制面，让查询、组合、自动化和 AI 对接都更自然。

## 当前范围

- 早期 MVP
- 首个 provider: AdmitRanking
- 当前重点: 榜单与学校研究

## 当前架构

当前代码结构遵循 `one provider, one domain`。

在 MVP 阶段，这意味着：

- `src/providers/admitranking/*` 负责 AdmitRanking 数据源接入
- `src/domain/admitranking/*` 负责 AdmitRanking 专属的 domain 模型与业务动作
- `src/cli/*` 负责终端命令面

环境要求：

- Node.js 22+

## 快速开始

```bash
git clone https://github.com/KaynXu/intlquals.git
cd intlquals
npm install
npm run dev -- rank admitranking list
npm run dev -- rank admitranking list --year 2025
npm run dev -- rank admitranking list --all-years
npm run dev -- rank admitranking show 52
npm run dev -- rank admitranking school --help
npm run dev -- rank admitranking school 12523
npm run dev -- rank admitranking school 12523 apply
```

## 常用示例

- `iq rank admitranking list`
- `iq rank admitranking list --year 2025`
- `iq rank admitranking list --all-years`
- `iq rank admitranking show 52`
- `iq rank admitranking school --help`
- `iq rank admitranking school 12523`
- `iq rank admitranking school 12523 apply`
- `iq rank admitranking school 12523 contact`
- `iq rank admitranking school 12523 media`
- `iq rank admitranking school 12523 signals`

当前命令语义：

- `list` 返回榜单目录
- `list --year <year>` 返回指定年份的已发现榜单
- `list --all-years` 按年份分组返回已发现榜单
- `show <rankId>` 返回轻量榜单学校列表
- `school --help` 显示可用详情分块
- `school <schoolId>` 默认返回 `overview`
- `school <schoolId> <section>` 返回指定学校详情分块

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
