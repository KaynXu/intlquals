# International Qualifications CLI Design

## Summary

`intlquals` is an open-source, terminal-first, AI-native CLI for researching, collecting, normalizing, searching, comparing, and exporting data across the international qualifications ecosystem.

The product is intentionally narrow in scope. It is not a general education platform and not a beginner-first consumer app. It is built for AP, A-Level, and IB ecosystem power users who are comfortable using AI tools and the command line to do real research work.

The first release uses a pipeline-first product strategy and a ranking-first MVP. The initial provider is AdmitRanking, with the first concrete workflow focused on international school ranking research and school-level data retrieval.

## Product Definition

### One-line positioning

An open-source, terminal-first, AI-native CLI for international qualifications research.

### Expanded positioning

The CLI gives users a reproducible data workflow:

- fetch structured data from relevant providers
- normalize source-specific payloads into a stable internal schema
- search and filter entities from the terminal
- compare records across a shared model
- export clean outputs for spreadsheets, docs, scripts, and AI workflows

The product should feel credible to international users, including overseas developers, researchers, consultants, and AI-native operators. The preferred umbrella term is `international qualifications`, not `international education platform` and not a pure `developer tool`.

## Users

### Primary users

- International education researchers
- Admissions and school-choice consultants
- AI-native students, parents, and operators with command line fluency
- Independent analysts studying AP, A-Level, and IB-adjacent ecosystems
- Developers or technical operators building education data workflows

### Secondary users

- Content teams producing research reports
- Education founders validating market assumptions
- Analysts collecting structured inputs for LLM summarization and reporting

### Non-target users

- Fully non-technical beginners who need a GUI-first experience
- Institutions seeking a CRM, LMS, or end-to-end education management system
- Users looking for a broad consumer study app

## Scope Boundaries

### In scope

- AP, A-Level, and IB ecosystem data workflows
- Rankings, school data, requirements data, and paper metadata over time
- Data fetching, normalization, filtering, comparison, and export
- Provider-based expansion to additional sources
- AI-ready outputs, but not necessarily embedded AI features in MVP

### Out of scope

- General-purpose education tooling
- Full web platform or SaaS dashboard
- Student learning product, tutoring product, or content platform
- Hosting large libraries of copyrighted exam papers
- Trying to solve every international education workflow in version one

## Positioning Options

### Option A: International Qualifications Research CLI

This framing treats the project as a research and data workflow product for the international qualifications ecosystem.

Pros:

- strong long-term brand fit
- works for rankings, papers, requirements, and future AI layers
- easiest for international users to understand without overspecifying the MVP

Cons:

- less immediately concrete than a ranking-specific name

### Option B: International School Ranking and Outcomes CLI

This framing leans into the current MVP and emphasizes ranking research and school comparison.

Pros:

- very clear for the first release
- easy to explain in one sentence

Cons:

- narrows the perceived roadmap too early
- becomes awkward when papers and other qualification data arrive later

### Option C: AI-native Education Data Pipeline CLI

This framing emphasizes the architecture and workflow style.

Pros:

- accurately describes the pipeline-first product decision
- attractive to technical power users

Cons:

- sounds too developer-centric
- weak on the AP, A-Level, IB identity

### Recommended positioning

Use Option A as the main product positioning and Option B as the MVP framing.

Recommended phrasing:

- product: `International Qualifications Research CLI`
- MVP: `Pipeline-first core, ranking-first MVP, AdmitRanking as the first provider`

## Naming Directions

### Direction 1: Domain-first

Examples:

- `intlquals`
- `international-quals-cli`
- `quals-cli`

Style:

- durable
- internationally legible
- best for long-term branding

### Direction 2: Workflow-first

Examples:

- `rankpipe`
- `qualpipe`
- `iq-pipeline`

Style:

- technical
- productized infrastructure
- communicates the pipeline-first decision quickly

### Direction 3: Research-first

Examples:

- `iq-research`
- `qualresearch`
- `rankresearch-cli`

Style:

- analytical
- obvious research orientation
- less brandable, but very descriptive

### Recommended naming choice

- repository name: `intlquals`
- CLI executable: `iq`

This keeps the repository brand broad while keeping the CLI short and memorable.

## MVP Strategy

## Why pipeline-first

The first release should not be designed as a one-off AdmitRanking scraper. It should establish a reusable workflow that can later support more providers and more entity types without rethinking the product.

Core pipeline:

`source -> fetch -> normalize -> search/filter -> compare -> export`

This is the strongest long-term decision because:

- it keeps the MVP narrow while still creating a reusable core
- it lets ranking data become the first high-value use case
- it naturally extends later to paper metadata, requirements data, and AI analysis

## MVP Capability Set

The MVP should contain five first-class capabilities.

### 1. Provider fetch

Fetch ranking and school data from AdmitRanking.

### 2. Normalize

Map third-party payloads into internal domain models.

### 3. Search and filter

Filter by ranking, keyword, curriculum, region, school type, and related attributes.

### 4. Compare

Support lightweight school comparison using normalized fields.

### 5. Export

Export results to JSON, CSV, and Markdown.

## MVP Use Cases

### Core use case 1: Ranking research

The user lists available rankings, inspects a specific ranking, fetches ranking entries, and exports them for reporting or further analysis.

### Core use case 2: School search

The user searches for schools using keywords and filters, then drills into a school record and exports or compares it.

### Core use case 3: AI-ready research prep

The user exports normalized data to feed another analysis step, including spreadsheets, scripts, or LLM prompts.

## MVP Command Structure

```bash
iq source list
iq source info admitranking

iq rank list
iq rank list --provider admitranking
iq rank show 52
iq rank entries 52 --page 1 --size 50

iq school search --keyword "Shanghai" --curriculum AP
iq school show 90
iq school compare 90 103 32

iq export rank 52 --format csv --output ranks.csv
iq export school 90 --format json
iq export search --keyword "AP" --format md

iq cache status
iq cache clear

iq doctor
```

## Version Roadmap

### v0.1

- AdmitRanking provider
- ranking list, detail, and entries
- school search and detail
- JSON and CSV export
- local cache
- structured logs
- retry and throttling

### v0.2

- school compare
- Markdown export
- snapshot metadata
- stronger filters and keyword assistance

### v1.0

- second provider
- formal provider registry
- snapshot versioning
- AI-ready analysis hooks
- more complete schema validation and extension points

## Technology Decisions

## Recommended stack

- runtime: Node.js 22+
- language: TypeScript
- CLI framework: Commander
- HTTP client: Undici
- validation: Zod
- logging: Pino
- local cache and metadata store: better-sqlite3
- HTML fallback parser: Cheerio
- browser fallback: Playwright, optional only

## Why this stack

- strong CLI ecosystem
- good cross-platform packaging story
- good fit for HTTP-heavy and schema-heavy work
- good fit for future plugin/provider architecture
- fast enough to build and maintain
- simpler than Rust for a new open-source product

## Architecture

### High-level architecture

```text
CLI Commands
  -> Application Services
    -> Provider Registry
      -> AdmitRanking Provider
        -> HTTP Client / Cache / Retry / Throttle
          -> Source Payload Mapping
            -> Domain Models
              -> Renderer / Exporter / Snapshot Store
```

### Layer responsibilities

#### CLI layer

- parse user input
- call application services
- render terminal output
- write exported files

#### Application service layer

- orchestrate use cases
- apply business rules
- coordinate provider calls and normalization

#### Provider layer

- interact with source-specific endpoints
- handle source-specific request behavior
- map source payloads into shared domain models

#### Infrastructure layer

- HTTP behavior
- retry, timeout, throttling
- caching
- file output
- structured logging

## Provider Architecture

Providers should be isolated behind a stable interface so the CLI never depends on source-specific wire formats.

Example interface:

```ts
interface RankingProvider {
  id: string
  capabilities: ProviderCapability[]
  listRankings(input: ListRankingsInput): Promise<RankingListResult>
  getRanking(input: GetRankingInput): Promise<Ranking>
  listRankingEntries(input: ListRankingEntriesInput): Promise<RankingEntryPage>
  searchSchools?(input: SearchSchoolsInput): Promise<SchoolPage>
  getSchool?(input: GetSchoolInput): Promise<School>
}
```

### AdmitRanking provider responsibilities

- discover available rankings
- fetch ranking details
- fetch ranking entries
- fetch search filters and keyword suggestions
- fetch school detail data
- preserve raw source metadata for traceability

## Best AdmitRanking Integration Strategy

The first provider should use the AdmitRanking JSON API layer, not HTML scraping as the primary method.

### Recommended access order

1. undocumented JSON API first
2. request signing or auth middleware as fallback
3. browser automation only as an emergency fallback

### Reasoning

- the site is a SPA, so HTML scraping is structurally weak
- ranking and school endpoints currently return structured JSON successfully
- structured responses make normalization and export much simpler
- browser-first automation is heavier, slower, and less maintainable

### Known relevant endpoints

- `GET /mb/api/intl/rank/getRankByType`
- `GET /mb/api/intl/rank/getRankDetail`
- `GET /mb/api/intl/home/getSchoolOption`
- `POST /mb/api/intl/school/getComPageRankEnV2`
- `GET /mb/api/intl/school/getIntlSchoolKeywordDropdown`
- `GET /mb/api/intl/school/getComDetailById`

### Signing and fallback note

The current frontend bundle contains signing logic based on request params and md5, plus app-specific request metadata. The MVP should not depend on this path by default because the ranking and school endpoints currently respond without reproducing the full signing flow. The provider should still reserve an extension point for a signer middleware in case the source changes later.

## Data Model

### source

- `id`
- `provider`
- `type`
- `originUrl`
- `fetchedAt`
- `licenseNote`
- `rawFingerprint`

### ranking

- `id`
- `provider`
- `title`
- `titleEn`
- `year`
- `scope`
- `region`
- `description`
- `methodology`
- `sourceRef`

### rankingEntry

- `rankingId`
- `entityId`
- `rank`
- `score`
- `subscores`
- `labels`
- `snapshotId`

### school

- `id`
- `provider`
- `name`
- `nameEn`
- `country`
- `province`
- `city`
- `schoolType`
- `curricula`
- `gradeRange`
- `tags`
- `stats`
- `sourceRef`

### exportTask

- `id`
- `entityType`
- `query`
- `format`
- `outputPath`
- `createdAt`
- `status`

### snapshot

- `id`
- `provider`
- `entityType`
- `entityId`
- `fetchedAt`
- `versionHash`

## Project Structure

```text
intlquals/
  src/
    cli/
      index.ts
      commands/
        source.ts
        rank.ts
        school.ts
        export.ts
        cache.ts
        doctor.ts
    core/
      app.ts
      config.ts
      errors.ts
      logger.ts
      result.ts
    providers/
      registry.ts
      types.ts
      admitranking/
        index.ts
        client.ts
        signer.ts
        endpoints.ts
        mapper.ts
        schemas.ts
    domain/
      models/
        source.ts
        ranking.ts
        school.ts
        export-task.ts
        snapshot.ts
      services/
        fetch-rankings.ts
        fetch-schools.ts
        compare-schools.ts
        export-data.ts
    infra/
      http/
        client.ts
        retry.ts
        throttle.ts
      cache/
        sqlite.ts
        keys.ts
      storage/
        files.ts
      serializers/
        json.ts
        csv.ts
        markdown.ts
    tests/
      unit/
      integration/
      fixtures/
  docs/
    architecture.md
    providers.md
    compliance.md
  examples/
  package.json
  README.md
```

## Operational Concerns

### Error handling

Create explicit error classes:

- `ProviderError`
- `NetworkError`
- `ValidationError`
- `RateLimitError`
- `ComplianceError`

Default output should be human-readable. Verbose mode should reveal raw source and debug details.

### Cache

- default SQLite-backed cache
- TTL-based invalidation
- cache key includes provider, endpoint, params, and schema version
- support `--no-cache`
- support `iq cache clear`

### Rate limiting

- provider-level rate limiting
- conservative defaults
- low concurrency by default
- configurable policies later

### Retry

- retry on timeout, `429`, and `5xx`
- exponential backoff with jitter
- do not retry validation or permanent auth errors

### Logging

- concise human-readable logs by default
- machine-readable logs with `--json`
- request lifecycle details with `--verbose`

## Decoupling Rules

The codebase must keep the scraping and provider logic separated from the CLI layer.

### Do not do

- embed request logic directly in commands
- embed terminal rendering logic in providers
- let provider wire formats leak into business services

### Do instead

- CLI parses input and prints output
- services orchestrate workflows
- providers fetch and map source data
- exporters serialize normalized models

## Compliance and Risk

### AdmitRanking and third-party ranking risk

This provider uses third-party endpoints that are not documented for external developer use. This creates risk around:

- endpoint stability
- rate limiting
- terms of service
- redistribution of source content

Mitigations:

- aggressive caching
- conservative rate limiting
- source attribution
- explicit provider documentation
- no assumption of long-term endpoint stability

### Robots and access intent

Robots directives may not fully describe API expectations. The project should act conservatively and expose policy controls.

Recommended behavior:

- identifiable user agent
- low default request rate
- easy cache reuse
- clear compliance guidance in docs

### Copyright

Ranking titles, methodology descriptions, school intros, and editorial content may be copyright-protected.

Recommendations:

- prefer structured field exports over bulk text republishing
- avoid long-form default output of copyrighted descriptions
- preserve source references rather than mirroring large amounts of prose

### Past papers and documents

Exam papers and learning materials are a much higher-risk area than rankings.

Decision:

- do not include paper hosting or bulk paper distribution in MVP
- future support should be metadata-first
- paper files, if ever addressed, require a separate compliance review

### Open-source posture

The repository should include a dedicated compliance document that states:

- sources are owned by their original publishers
- providers may break
- users are responsible for complying with local law and source-specific terms
- the project is a research and workflow tool, not a redistribution platform

## Explicit MVP Exclusions

- AI chat interface inside the CLI
- browser UI
- hosted sync service
- full paper library ingestion
- too many providers in v0
- educational super-app features

## Recommended Next Step

After the user reviews this written spec, the next step is to create an implementation plan that turns the spec into a small, testable, provider-first CLI skeleton.

The implementation should start with:

- repository scaffold
- CLI shell
- AdmitRanking provider
- normalized ranking and school models
- export pipeline
- caching and observability primitives
