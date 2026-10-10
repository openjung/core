# Contributing

Thanks for helping. This package is small and deliberately boring: data, pure functions, no dependencies. Keep it that way.

## Setup

```bash
git clone https://github.com/openjung/core.git
cd core
npm ci
npm run check   # typecheck + format + tests + build + package lint
```

Node 20, 22 and 24 are tested in CI. `.node-version` pins 24 for local tooling.

| Script                  | What it does                                                   |
| ----------------------- | -------------------------------------------------------------- |
| `npm test`              | Run the Vitest suite once                                      |
| `npm run test:watch`    | Re-run tests on change                                         |
| `npm run typecheck`     | `tsc --noEmit` over sources and tests                          |
| `npm run format`        | Prettier, in place                                             |
| `npm run build`         | Emit `dist/` (ESM + declarations) from `tsconfig.build.json`   |
| `npm run check:package` | `publint` and `@arethetypeswrong/cli` against a packed tarball |
| `npm run check`         | Everything CI runs                                             |

## What must not change silently

These are relied on by openjung.org, its mobile app and stored user results. Changing any of them is a breaking change and needs a major version bump and a changelog entry.

- **Question IDs and dimension membership.** `dimensionQuestions`, `quickTestQuestionIds` and `purrjungDimensionQuestions` are stable.
- **Answer direction.** 1 = left trait, 5 = right trait. Low scores resolve to E, S, F, J on the human test and to E, S, T, J on PurrJung.
- **Score ranges and thresholds.** 8–40 with midpoint 24 (full and single-dimension), 2–10 with midpoint 6 (quick), 4–20 with midpoint 12 (PurrJung). A score exactly on the midpoint resolves to the left pole.
- **Exported names.** `src/index.test.ts` pins the runtime export list. Add names freely; never remove or rename without a major bump.
- **Translation tuple order.** `questionTranslations[locale][id]` is `[title, leftTrait, rightTrait]`.

## Translations

Wording fixes for any locale are welcome; use the _Translation correction_ issue template or open a PR that edits `src/questionTranslations.ts` (or `src/questions.ts` for `en`, `zh`, `ja`, `ko`, `zh-tw`). Keep the scoring direction. If you believe a pair is reversed, that is a scoring bug, not a translation fix, and needs its own issue.

Please record who reviewed what in `TRANSLATIONS.md` when a locale gets a native-speaker pass.

## Pull requests

- Keep PRs focused. Data, scoring and tooling changes are easier to review apart.
- Add or update tests next to the code (`src/*.test.ts`).
- Run `npm run check` before pushing; CI runs the same steps.
- Fill in the PR template's contract checklist.

## Releasing

Releases are published to npm by GitHub Actions when a GitHub release is published.

1. Update `CHANGELOG.md`: move entries from _Unreleased_ under the new version and date.
2. Bump the version: `npm version patch` (or `minor` / `major`). This commits and tags `vX.Y.Z`.
3. Push with tags: `git push --follow-tags`.
4. Create a GitHub release from the tag. The publish workflow checks that the tag matches `package.json`, runs the full check, and publishes with provenance.

The workflow uses the `NPM_TOKEN` repository secret (an npm granular token with publish rights on `@openjung`). Once the package exists on npm, consider switching to npm trusted publishing and dropping the token.
