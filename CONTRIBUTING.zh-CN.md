# 贡献指南

感谢你为 `intlquals` 做贡献。

[English Version](./CONTRIBUTING.md)

`intlquals` 是一个聚焦型、terminal-first、AI-native 的国际课程研究 CLI。请尽量保持改动范围清晰、易于 review，并与项目当前方向保持一致。

## 分支约定

- `main`: 稳定分支
- `develop`: 当前集成主线
- `feat/*`: 从 `develop` 拉出的功能分支
- `hotfix/*`: 从 `main` 拉出的紧急修复分支

## 推荐流程

1. 从 `develop` 开始。
2. 新建功能分支。
3. 尽量使用独立 worktree。
4. 做小而清晰的提交。
5. 合并前先跑验证。
6. 合回 `develop`。

示例：

```bash
git checkout develop
git pull
git worktree add .worktrees/feature-name -b feat/feature-name develop
cd .worktrees/feature-name
```

## 合并前验证

在合并行为或文档改动前运行：

```bash
npm test
npm run lint:types
npm run build
```

如果这次改动只是文档，请在 PR 或合并说明里明确写出 docs-only。

## 范围约束

请避免把 `intlquals` 做成：

- 泛教育平台
- GUI-first 产品
- 与当前任务无关的大重构

## 合规

provider 相关改动请保持克制：

- 尊重来源站点条款和限制
- 避免激进抓取
- 不增加受保护材料的批量再分发能力

详见 [docs/compliance.md](./docs/compliance.md)。
