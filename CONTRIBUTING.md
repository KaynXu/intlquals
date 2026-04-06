# Contributing

Thank you for contributing to `intlquals`.

[中文贡献说明 / Chinese Version](./CONTRIBUTING.zh-CN.md)

`intlquals` is a focused open-source CLI for international qualifications research. Please keep changes reviewable, narrow in scope, and aligned with the project's terminal-first workflow.

## Branching

- `main`: stable branch
- `develop`: active integration branch
- `feat/*`: feature branches from `develop`
- `hotfix/*`: urgent fixes from `main`

## Recommended Flow

1. Start from `develop`.
2. Create a feature branch.
3. Prefer a dedicated worktree.
4. Make focused commits.
5. Run verification before merge.
6. Merge back into `develop`.

Example:

```bash
git checkout develop
git pull
git worktree add .worktrees/feature-name -b feat/feature-name develop
cd .worktrees/feature-name
```

## Verification

Run before merging behavior or docs changes:

```bash
npm test
npm run lint:types
npm run build
```

If the change is docs-only, call that out clearly in the PR or merge note.

## Scope

Please avoid turning `intlquals` into:

- a generic education platform
- a GUI-first product
- a broad rewrite unrelated to the task

## Compliance

Provider integrations must stay conservative.

- respect source-specific terms and operational limits
- avoid aggressive scraping behavior
- do not add bulk redistribution behavior for protected materials

See [docs/compliance.md](./docs/compliance.md).
