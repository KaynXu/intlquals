# Rank And School Sections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the AdmitRanking MVP CLI with the agreed output shape: ranking directory list, lightweight ranking show output, and section-based school detail commands.

**Architecture:** Keep the current `one provider, one domain` structure. Refine the domain models and provider mappers so `list` and `show` return lighter ranking data, while `school` exposes explicit sections from the richer school detail payload instead of dumping a single large object.

**Tech Stack:** TypeScript, Commander, Vitest, tsup

---

### Task 1: Define the new command behavior with tests

**Files:**
- Modify: `tests/unit/cli/rank-command.test.ts`
- Modify: `tests/unit/cli/rank-admitranking-help.test.ts`
- Modify: `tests/unit/domain/fetch-ranking-show.test.ts`
- Modify: `tests/integration/providers/admitranking/rankings.test.ts`

- [ ] **Step 1: Write failing tests for the new behavior**
- [ ] **Step 2: Run targeted tests to verify they fail**
- [ ] **Step 3: Confirm the failures match the new CLI contract**

### Task 2: Refine ranking list and ranking show output

**Files:**
- Modify: `src/domain/admitranking/models/ranking.ts`
- Modify: `src/domain/admitranking/services/fetch-rankings.ts`
- Modify: `src/providers/admitranking/mapper.ts`
- Modify: `src/providers/admitranking/index.ts`

- [ ] **Step 1: Update the ranking list output shape**
- [ ] **Step 2: Update ranking entry mapping to keep only ranking-focused school fields**
- [ ] **Step 3: Run ranking-related tests**

### Task 3: Add section-based school detail output

**Files:**
- Modify: `src/domain/admitranking/models/school.ts`
- Modify: `src/domain/admitranking/services/fetch-schools.ts`
- Modify: `src/providers/admitranking/mapper.ts`
- Modify: `src/providers/admitranking/index.ts`
- Modify: `src/cli/commands/rank.ts`

- [ ] **Step 1: Add a section list for school detail**
- [ ] **Step 2: Add overview/apply/media/contact style section mapping**
- [ ] **Step 3: Wire the `school` command to show sections or a requested section**
- [ ] **Step 4: Run school-related tests**

### Task 4: Update docs and run full verification

**Files:**
- Modify: `README.md`
- Modify: `README.zh-CN.md`

- [ ] **Step 1: Refresh examples to match the new command surface**
- [ ] **Step 2: Run `npm test`**
- [ ] **Step 3: Run `npm run lint:types`**
- [ ] **Step 4: Run `npm run build`**
