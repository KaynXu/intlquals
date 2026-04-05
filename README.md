# intlquals

Terminal-first, AI-native CLI for international qualifications research.

[中文说明 / Chinese README](./README.zh-CN.md)

## What It Is

`intlquals` is a focused CLI for international qualifications research workflows, starting with ranking and school research around AP, A-Level, and IB adjacent ecosystems.

It is built for power users who are comfortable with terminals, spreadsheets, scripts, and AI-assisted workflows.

## Why It Exists

- collect data from focused sources
- normalize it into one consistent workflow
- search, compare, and export it reliably
- prepare clean inputs for spreadsheets, scripts, and AI analysis

## Why CLI

We believe AI is making command-line workflows more accessible and more powerful.

The goal is not to imitate GUI products inside a terminal. The goal is to provide a high-leverage control layer for research work that is composable, scriptable, automatable, and ready to connect with AI systems.

## Current Scope

- early MVP
- first provider: AdmitRanking
- current focus: ranking and school research

Requirements:

- Node.js 22+

## Quick Start

```bash
git clone https://github.com/KaynXu/intlquals.git
cd intlquals
npm install
npm run dev -- source list
npm run dev -- rank list
npm run dev -- school search --keyword "AP"
```

## Examples

- `iq rank list`
- `iq rank show 52`
- `iq rank entries 52 --page 1 --size 20`
- `iq school search --keyword "AP"`
- `iq school show 90`
- `iq school compare 90 103 32`
- `iq export rank 52 --format csv --output ranks.csv`
- `iq export school 90 --format json --output school.json`
- `iq cache status`
- `iq doctor`

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
- ranking list, detail, and entries
- school search, detail, compare, and export
- JSON, CSV, and Markdown output

### Next

- stronger school search filters
- better export polish
- additional providers after the core workflow is stable
