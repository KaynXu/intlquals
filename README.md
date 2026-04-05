# intlquals

Terminal-first, AI-native CLI for international qualifications research.

## Vision

`intlquals` is not just trying to become a useful CLI for a niche workflow.

The long-term goal is to become the standard research and data workflow layer for the international qualifications ecosystem, starting with a terminal-first interface.

In practical terms, that means:

- collect data from multiple sources
- normalize it into one consistent workflow
- search, compare, and export it reliably
- prepare clean inputs for spreadsheets, scripts, and AI analysis

## Why CLI

We believe AI is making command-line workflows more accessible and more powerful.

The point is not to imitate GUI products inside a terminal. The point is to give power users a high-leverage control layer for research work: something composable, scriptable, automatable, and ready to connect with AI systems.

For `intlquals`, CLI is the first interface, not the final boundary.

## Quick Start

```bash
npm install
npm run dev -- source list
npm run dev -- rank list
npm run dev -- school search --keyword "AP"
```

Current status:

- early MVP
- first provider: AdmitRanking
- primary workflow: ranking and school research

Requirements:

- Node.js 22+

## Install and Local Development

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd intlquals
npm install
```

Run the CLI in development mode:

```bash
npm run dev -- source list
```

Run verification locally:

```bash
npm test
npm run lint:types
npm run build
```

## MVP

- AdmitRanking provider
- ranking list, detail, and entries
- school search, detail, and compare
- export to JSON, CSV, and Markdown
- provider-first architecture for future expansion

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

## Development Workflow

- External contribution guide: [CONTRIBUTING.md](/Users/ark.mini/Desktop/untitled%20folder/CONTRIBUTING.md)
- Team Git workflow and collaboration rules: [docs/team-development.md](/Users/ark.mini/Desktop/untitled%20folder/docs/team-development.md)

## Roadmap

### v0.1

- AdmitRanking provider
- ranking list, detail, and entries
- school search, detail, compare, and export
- JSON, CSV, and Markdown output

### v0.2

- stronger filtering and search ergonomics
- better snapshot and cache behavior
- improved export polish and comparison views

### v1.0

- second provider
- stronger provider registry and extension points
- AI-ready analysis hooks on top of normalized data
