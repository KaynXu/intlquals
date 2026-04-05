# Public Repo Docs And Bilingual Entry Design

## Summary

This spec defines a lightweight cleanup of the public-facing repository structure for `intlquals`.

The goal is to make the project look and read like a credible open source CLI project:

- keep the public repo focused on product, usage, contribution, and compliance
- remove internal planning workflow traces from the main documentation surface
- introduce explicit English and Simplified Chinese entry documents instead of mixed-language docs

This is a documentation and repository-structure change only. It does not modify CLI behavior.

## Problem

The repository is currently technically clean, but its public presentation still carries some internal workflow artifacts:

- `docs/superpowers/specs/**`
- `docs/superpowers/plans/**`
- `docs/team-development.md`

These files are useful during internal collaboration, but they are not the right default surface for public GitHub visitors.

At the same time, the project positioning was discussed as bilingual, but the current public entry docs are mostly English-only. That creates a mismatch between the intended audience and the actual repository experience.

## Goals

- make the repo feel like a public open source project rather than an internal workspace
- keep English as the default GitHub-facing language
- provide a full Chinese entry path through dedicated mirrored documents
- keep the change small and maintainable

## Non-Goals

- no full bilingual mirror for every technical document in the repository
- no redesign of the CLI command structure
- no provider or data model changes
- no website or docs portal

## Recommended Approach

Use a two-track public documentation model:

- English primary files for the default GitHub surface
- dedicated Simplified Chinese mirror files for the most important entry docs

At the same time, remove internal planning and team-process documents from the public doc surface.

## Public Documentation Structure

### Keep

- `README.md`
- `CONTRIBUTING.md`
- `docs/compliance.md`
- source code, tests, and project configuration files

### Add

- `README.zh-CN.md`
- `CONTRIBUTING.zh-CN.md`

### Remove From Public Surface

- `docs/superpowers/specs/**`
- `docs/superpowers/plans/**`
- `docs/team-development.md`

## README Strategy

### English README

`README.md` should remain the default landing page for GitHub visitors.

It should communicate:

- what `intlquals` is
- why CLI is the first interface
- current MVP scope
- quick start
- core examples
- contribution entry
- language switch link to the Chinese version

The tone should stay product-facing and open-source-friendly, not internal or process-heavy.

### Chinese README

`README.zh-CN.md` should be a full Chinese mirror of the public entry experience, not a short summary block.

It should contain the same top-level sections as the English README, adapted naturally into Chinese rather than mechanically translated line by line.

It should also link back to `README.md`.

## CONTRIBUTING Strategy

### English CONTRIBUTING

`CONTRIBUTING.md` remains the default contribution guide.

It should cover:

- repo workflow
- branching expectation
- local development
- testing and verification
- contribution etiquette
- link to Chinese version

### Chinese CONTRIBUTING

`CONTRIBUTING.zh-CN.md` should provide the same contributor path for Chinese-speaking collaborators.

It should prioritize clarity over literal translation and should stay aligned with the English version.

## Compliance Document

`docs/compliance.md` stays in English for now.

Reason:

- it is specialized
- it is lower-traffic than the entry docs
- it is better to keep one maintained version first than create a stale mirror

A Chinese mirror can be added later if the project starts receiving more Chinese contributors who need it.

## Internal Workflow Docs

The repository should stop exposing internal planning artifacts as part of the normal public structure.

For this cleanup, the simplest path is to remove the current internal planning docs from the tracked repository state rather than trying to reframe them as public docs.

If similar planning files are still useful later, they can live in a private workspace or be regenerated during future internal planning sessions without becoming part of the long-term public repo surface.

## GitHub Surface Expectations

After this change, the public repo should look like this:

- a clear English landing page
- an obvious Chinese alternative
- a clean contribution entry in both languages
- a small, intentional public docs area
- no visible agent-workflow or planning-framework leftovers

## Success Criteria

- GitHub visitors can understand the project from `README.md` alone
- Chinese-speaking users have a first-class entry point through `README.zh-CN.md`
- contributors can choose between English and Chinese contribution guides
- internal planning docs are no longer part of the public repository structure
- README links do not point to removed internal files

## Risks And Mitigations

### Risk: losing useful internal context

Mitigation:

- keep public-facing docs concise and durable
- rely on commit history if old planning context is ever needed

### Risk: bilingual docs drift apart

Mitigation:

- mirror only the top-level entry docs for now
- keep section structure aligned between English and Chinese files

### Risk: deleting too much too early

Mitigation:

- limit removals to obviously internal workflow files
- keep compliance and contribution docs in place

## Implementation Outline

1. Update `README.md` to be a stronger English public landing page with a language switch link.
2. Add `README.zh-CN.md` as a Chinese public entry doc.
3. Update `CONTRIBUTING.md` to point to a Chinese mirror.
4. Add `CONTRIBUTING.zh-CN.md`.
5. Remove `docs/superpowers/specs/**`, `docs/superpowers/plans/**`, and `docs/team-development.md`.
6. Verify no public docs still link to removed files.

