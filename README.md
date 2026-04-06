# intlquals

Terminal-first, AI-native CLI for international qualifications research.

[中文说明 / Chinese README](./README.zh-CN.md)

## What It Is

`intlquals` is a focused CLI for international qualifications research workflows, starting with ranking and school research around AP, A-Level, and IB adjacent ecosystems.

It is built for power users who are comfortable with terminals, spreadsheets, scripts, and AI-assisted workflows.

## Why It Exists

- collect data from focused sources
- normalize it into one consistent workflow
- inspect focused ranking and school data reliably
- prepare clean inputs for spreadsheets, scripts, and AI analysis

## Why CLI

We believe AI is making command-line workflows more accessible and more powerful.

The goal is not to imitate GUI products inside a terminal. The goal is to provide a high-leverage control layer for research work that is composable, scriptable, automatable, and ready to connect with AI systems.

## Current Scope

- early MVP
- first provider: AdmitRanking
- current focus: ranking and school research

## Current Architecture

The current codebase follows `one provider, one domain`.

For the MVP, that means:

- `src/providers/admitranking/*` handles AdmitRanking source integration
- `src/domain/admitranking/*` handles AdmitRanking-specific domain models and use cases
- `src/cli/*` exposes the terminal command surface

Requirements:

- Node.js 22+

## Quick Start

```bash
git clone https://github.com/KaynXu/intlquals.git
cd intlquals
npm install
npm run dev -- rank admitranking list
npm run dev -- rank admitranking show 52
```

## Examples

- `iq rank admitranking list`
- `iq rank admitranking show 52`
- `iq rank admitranking school 90`

## Development

Run local verification:

```bash
npm test
npm run lint:types
npm run build
```

- Contribution guide: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Compliance notes: [docs/compliance.md](./docs/compliance.md)

## Roadmap

### v0.1

- AdmitRanking provider
- provider-scoped ranking list
- ranking show with collected schools
- provider-scoped school detail

### Next

- stronger school output
- better ranking presentation
- additional providers after the core workflow is stable
