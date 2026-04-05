# Contributing

Thank you for contributing to `intlquals`.

This project is an open-source, terminal-first, AI-native CLI for international qualifications research. We want contributions to stay easy to review, safe to merge, and consistent across local and collaborative development.

Chinese note:
This document is English-first for international contributors. A more detailed bilingual team workflow guide is available in [docs/team-development.md](/Users/ark.mini/Desktop/untitled%20folder/docs/team-development.md).

## Project Workflow

We use a lightweight branching model:

- `main`: stable branch
- `develop`: active integration branch for new work
- `feat/*`: feature branches created from `develop`
- `hotfix/*`: urgent fixes created from `main`

In practice:

- Do not start new feature work directly on `main`
- Prefer starting feature work from `develop`
- Merge feature branches back into `develop`
- Merge `develop` into `main` only when the result is stable and intentionally ready

## Recommended Development Flow

1. Make sure `develop` is up to date.
2. Create a feature branch from `develop`.
3. Prefer a dedicated git worktree for the branch.
4. Make small, reviewable commits.
5. Run verification before merging.
6. Merge back into `develop`.

Example:

```bash
git checkout develop
git pull
git worktree add .worktrees/provider-qs -b feat/provider-qs develop
cd .worktrees/provider-qs
```

## Git Worktrees

We recommend using project-local worktrees for isolated feature development.

- Preferred directory: `.worktrees/`
- Keep `.worktrees/` ignored in Git
- One feature branch per worktree
- Do not develop multiple unrelated features in the same worktree

Example:

```bash
git worktree add .worktrees/feature-name -b feat/feature-name develop
```

## Commit Guidelines

Keep commits focused and easy to understand.

Preferred style:

- `feat: add ranking export command`
- `fix: handle empty school comparison`
- `docs: update team development guide`
- `refactor: simplify provider mapping`
- `test: add serializer coverage`

Guidelines:

- one logical change per commit when practical
- do not mix unrelated refactors with feature work
- write commit messages that explain intent, not just files touched

## Verification Before Merge

Before merging a branch into `develop`, run:

```bash
npm test
npm run lint:types
npm run build
```

If the change is documentation-only, say so clearly in the PR or merge note.

## Pull Requests and Reviews

If you open a PR, keep it narrow and include:

- what changed
- why it changed
- how you verified it
- any known follow-up work

Prefer small PRs over large batches.

## Scope Discipline

This project intentionally stays narrow.

Please avoid turning a contribution into:

- a generic education platform
- a GUI-first product
- a large refactor unrelated to the task
- a broad multi-provider rewrite when a focused provider change is enough

## Compliance and Source Respect

This repository works with third-party data providers. Please be conservative.

- respect source-specific terms and operational limits
- avoid aggressive scraping behavior
- do not add bulk redistribution patterns for copyrighted materials
- keep compliance-sensitive changes well documented

See [docs/compliance.md](/Users/ark.mini/Desktop/untitled%20folder/docs/compliance.md) for the current baseline.

## Questions

If you are unsure where a contribution belongs:

- product or workflow questions: start from `develop` and ask before widening scope
- provider-specific changes: keep them isolated to the provider and mapping layers
- architecture questions: prefer small, reversible steps
