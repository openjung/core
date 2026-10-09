# Changelog

All notable changes to this package are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/).

## [Unreleased]

Nothing under the `@openjung/core` name has been published yet. The last release
on npm is `@openmbti/core@1.0.1`; everything below is new since then.

### Changed

- **Package renamed** from `@openmbti/core` to `@openjung/core`. Import paths change; the API does not.
- Build targets Node ESM (`module: NodeNext`); relative imports now carry `.js` extensions so `dist/` loads in Node without a bundler.
- `quickTestQuestionIds` is typed as `DimensionQuestions` (readonly arrays keyed by dimension) instead of `Record<string, number[]>`.
- `BilingualText` is now an alias of the new `MultilingualText` interface and is deprecated.
- Scoring for the full, quick, single-dimension and PurrJung tests shares one internal engine. Results are byte-for-byte identical.

### Added

- Quick test mode: 8 questions, 2 per dimension, with its own scoring functions.
- Single-dimension tests: `generateDimensionResult` and friends, plus range constants.
- Quality metrics: per-dimension confidence, profile clarity index, answer-consistency checks, confidence labels.
- PurrJung cat temperament test: 16 questions in five locales with matching scoring functions.
- Question titles (`title`) on all 32 questions.
- 39 additional locales on every OEJTS question (44 in total). AI-assisted drafts; see TRANSLATIONS.md.
- `SUPPORTED_LOCALES`, `PURRJUNG_LOCALES`, `DEFAULT_LOCALE`, `Locale` and `getLocalizedText()`.
- Test suite covering scoring contracts, data integrity, locales, PurrJung and the public export list.
- CI on Node 20/22/24 with typecheck, Prettier, tests, build, a Node ESM import smoke test, `publint` and `@arethetypeswrong/cli`.
- `LICENSE` (MIT, code) and `LICENSE-DATA` (CC BY-NC-SA 4.0, questionnaire content).
- `CONTRIBUTING.md`, issue templates (bug, translation correction), PR template, Dependabot.

### Fixed

- Test files are no longer compiled into `dist/` or shipped in the npm tarball.
- `package.json` `exports` lists `types` first so TypeScript resolves declarations under every module setting.

## [1.0.1] - 2025-12-16

Published as `@openmbti/core`.

### Added

- OEJTS 1.2 question bank (32 bipolar pairs) in `en`, `zh`, `ja`, `ko`, `zh-tw`.
- Scoring: dimension sums, type determination, pole percentages, completeness check.
- GitHub Actions workflow for npm publishing.

### Fixed

- TF dimension Q2 scoring direction (Skeptical / Wants to believe) now matches the OEJTS loading.

[Unreleased]: https://github.com/openjung/core/compare/main...HEAD
[1.0.1]: https://github.com/openjung/core/commits/main
