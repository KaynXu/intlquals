# Team Development Guide

English-first, with concise Chinese notes where helpful.

This document explains how we use Git, branches, worktrees, verification, and collaboration rules in the `intlquals` repository.

中文说明：
这是团队内部和长期协作的开发约定。对外贡献入口请优先看 [CONTRIBUTING.md](/Users/ark.mini/Desktop/untitled%20folder/CONTRIBUTING.md)。

## 1. Branch Strategy

We use a simple, modern branch model:

- `main`: production-ready or stable branch
- `develop`: ongoing integration branch for feature work
- `feat/*`: feature branches created from `develop`
- `hotfix/*`: urgent fixes created from `main`

Recommended interpretation:

- `main` should stay calm and stable
- `develop` is where validated new work accumulates
- every meaningful new feature should start from its own `feat/*` branch

Chinese note:
- `main` 只放稳定内容
- `develop` 是功能集成主线
- 新功能从 `develop` 切 `feat/*`

## 2. Default Feature Workflow

The default workflow for new development is:

1. Update `develop`
2. Create a new feature branch from `develop`
3. Create a dedicated worktree for that branch
4. Implement and verify the change
5. Merge the feature branch back into `develop`
6. Merge `develop` into `main` only when intentionally promoting a stable set of changes

Example:

```bash
git checkout develop
git pull
git worktree add .worktrees/provider-qs -b feat/provider-qs develop
cd .worktrees/provider-qs
```

## 3. Worktree Convention

We prefer project-local worktrees.

- directory: `.worktrees/`
- one worktree per feature branch
- keep `.worktrees/` ignored in `.gitignore`
- preserve a feature worktree if more work is expected
- remove the worktree after merge only when it is no longer needed

Example naming:

- `.worktrees/provider-qs`
- `.worktrees/papers-index`
- `.worktrees/export-polish`

Do not:

- use one worktree for multiple unrelated features
- develop directly in `main` unless doing a deliberate hotfix
- leave broken experiments mixed into an integration worktree

## 4. Merge Policy

Normal path:

- `feat/* -> develop`

Release or stabilization path:

- `develop -> main`

Hotfix path:

- `hotfix/* -> main`
- then sync the same fix back into `develop`

General rule:

- do not merge unverified feature work into `develop`
- do not merge broad WIP branches into `main`

## 5. Verification Rules

Before merging code changes into `develop`, run:

```bash
npm test
npm run lint:types
npm run build
```

If the work changes runtime behavior, these checks are the minimum bar.

If the work is docs-only:

- mention clearly that it is docs-only
- do not claim test coverage for behavior you did not change

Chinese note:
不要用“应该没问题”替代验证结果。先跑命令，再说通过。

## 6. Commit Conventions

We prefer small, intentional commits.

Recommended prefixes:

- `feat:`
- `fix:`
- `docs:`
- `refactor:`
- `test:`
- `chore:`

Good examples:

- `feat: add admitranking rank command`
- `fix: map school curricula from detail payload`
- `docs: add team development guide`

Avoid:

- vague messages like `update files`
- giant mixed commits with refactor + feature + formatting
- hidden behavioral changes under `chore:`

## 7. Scope and Review Discipline

Keep branches narrow.

One branch should usually represent:

- one feature
- one fix
- one refactor with a single clear purpose

Review principles:

- prefer reviewable diffs over heroic batches
- preserve provider boundaries
- do not expand a small task into a platform rewrite
- note known follow-ups explicitly instead of sneaking them into the same branch

## 8. Source and Compliance Discipline

This repository interacts with third-party providers, including undocumented APIs.

When changing provider logic:

- be conservative with request behavior
- avoid unnecessary traffic
- preserve source boundaries
- document compliance-sensitive decisions

Do not add:

- aggressive crawling defaults
- bulk redistribution behavior for protected source content
- hidden provider-specific hacks without comments or docs

Related reference:
- [docs/compliance.md](/Users/ark.mini/Desktop/untitled%20folder/docs/compliance.md)

## 9. Suggested Daily Commands

### Start a new feature

```bash
git checkout develop
git pull
git worktree add .worktrees/feature-name -b feat/feature-name develop
cd .worktrees/feature-name
```

### Verify before merge

```bash
npm test
npm run lint:types
npm run build
```

### Merge feature into develop

```bash
git checkout develop
git merge --no-ff feat/feature-name
```

### Start a hotfix from main

```bash
git checkout main
git pull
git worktree add .worktrees/hotfix-name -b hotfix/hotfix-name main
```

## 10. Repository Hygiene

Keep the repository easy to reason about.

- keep `.worktrees/` ignored
- avoid committing generated output unless intentional
- keep `develop` usable
- keep `main` stable
- keep docs aligned with actual workflow

If the team workflow changes, update:

- [CONTRIBUTING.md](/Users/ark.mini/Desktop/untitled%20folder/CONTRIBUTING.md)
- [docs/team-development.md](/Users/ark.mini/Desktop/untitled%20folder/docs/team-development.md)

at the same time.
