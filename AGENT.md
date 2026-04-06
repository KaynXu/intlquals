# AGENT.md

Operational guide for humans and AI agents working in `intlquals`.
`intlquals` 项目中供人类与 AI agent 协作使用的操作说明。

## Branch Roles / 分支角色

- `main`: stable branch
  中文：稳定分支，只放已经确认可发布的版本。
- `develop`: active integration branch
  中文：日常开发主线，新的功能先汇总到这里。
- `feat/*`: feature branches created from `develop`
  中文：所有新功能从 `develop` 拉分支开发。
- `hotfix/*`: urgent fixes created from `main`
  中文：线上紧急修复从 `main` 拉出。

## Default Workflow / 默认流程

1. Start from `develop`.
2. Create a dedicated feature branch.
3. Prefer a dedicated git worktree.
4. Make focused, reviewable commits.
5. Verify changes before merge.
6. Merge the feature branch back into `develop`.
7. Merge `develop` into `main` only when the integrated state is ready.

In short / 一句话总结:

- daily development happens on `develop`
- `main` is the stable release line
- do not develop directly on `main`

## Recommended Commands / 推荐命令

Create a new feature branch from `develop`:

```bash
git checkout develop
git pull
git worktree add .worktrees/feature-name -b feat/feature-name develop
cd .worktrees/feature-name
```

Merge a completed feature back into `develop`:

```bash
git checkout develop
git merge --no-ff feat/feature-name
```

Promote a ready integration state into `main`:

```bash
git checkout main
git merge --no-ff develop
```

## Hotfix Workflow / 紧急修复流程

Use this only for urgent fixes that must land on `main` first.

```bash
git checkout main
git pull
git worktree add .worktrees/hotfix-name -b hotfix/hotfix-name main
```

After the hotfix is merged into `main`, merge it back into `develop` as well.

中文：`hotfix` 修完后，要同时回灌到 `develop`，避免分叉。

## Verification Before Merge / 合并前验证

Run these before merging code changes:

```bash
npm test
npm run lint:types
npm run build
```

If the change is docs-only, say so clearly in the merge note or PR.

## CLI Project Guardrails / CLI 项目边界

- Keep the project terminal-first.
- Keep the scope focused on AP, A-Level, and IB workflows.
- Prefer provider-oriented and pipeline-friendly designs.
- Do not turn the project into a generic education platform.
- Do not couple business logic tightly to command parsing.

## Architecture Reminder / 架构提醒

When adding new behavior, prefer this split:

- `src/cli`: command definitions and argument parsing
- `src/providers`: external data source adapters
- `src/domain/<provider-id>`: provider-specific use cases and domain models

中文：命令层负责“接命令”，每个 provider 拥有自己对应的 domain，provider 层负责“接外部数据”。

## Provider-First Architecture Policy / 以 Provider 为先的架构策略

- Prefer `one provider, one domain`.
- Each provider must have its own folder under `src/providers/<provider-id>/`.
- Each provider must have its own matching domain area under `src/domain/<provider-id>/`.
- Do not introduce a shared global domain by default.
- Do not force different providers into one fake universal entity shape.

中文：

- 采用 `one provider, one domain` 原则。
- 每个 provider 都必须在 `src/providers/<provider-id>/` 下拥有自己的文件夹。
- 每个 provider 也必须在 `src/domain/<provider-id>/` 下拥有自己的对应 domain 区域。
- 默认不建立全局共享 domain。
- 不要为了表面统一，强行把不同 provider 塞进一个假的通用实体里。

## Domain Evolution Rule / Domain 演进规则

- Keep each provider's domain self-contained.
- When a new provider arrives, create a new provider folder and a new matching domain folder.
- Shared abstractions are the exception, not the default.
- If a future shared contract is introduced, it must be justified explicitly and kept extremely small.

中文：

- 每个 provider 的 domain 应尽量自包含。
- 当新 provider 接入时，新建自己的 provider 文件夹和对应的 domain 文件夹。
- 共享抽象是例外，不是默认做法。
- 如果未来真的要引入共享契约，必须单独论证，而且要保持极小。

## Collaboration Notes / 协作说明

- Keep changes narrow and explicit.
- Prefer deleting dead command surface instead of leaving confusing half-supported flows.
- When branch roles conflict, follow this rule:
  `feature -> develop -> main`
- If `develop` and `main` diverge, treat `develop` as the active build line and promote to `main` intentionally.

## Current Project Policy / 当前项目政策

At this stage of `intlquals`:

- `main` is the public stable line
- `develop` is the branch where new work happens
- every new feature starts from `develop`
- release-worthy states move from `develop` to `main`
