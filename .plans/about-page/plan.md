# Plan: about-page

**Feature name:** about-page

**Description:** Reorganize the About page UI to follow the same layout and design principles used on the Dashboard page (page-level padding, container width, visual rhythm). Remove the current footer and replace it with the simpler footer concept used on the Documentation page.

## Goals

- Apply consistent horizontal padding/page gutters equal to `app/dashboard/page.tsx`.
- Use same `w-[1280px]` container and `px-4 md:px-6` container padding pattern.
- Replace current prominent About footer with the minimal centered footer used on `app/docs/page.tsx`.
- Preserve accessibility and no regressions.

## Files to change

- `app/about/page.tsx`

## Tasks

1. Update outer wrapper classes to match dashboard (add page `px-8` and remove differing flex rules if needed).
2. Adjust the main/container classes so content aligns with dashboard spacing (use `mx-auto w-[1280px] px-4 md:px-6` and container `py-5` where appropriate).
3. Remove current `<footer>` element and replace with the docs-style footer block (centered, small text, `text-slate-600`).
4. Run type-check and lint, preview locally and manually visually inspect at multiple widths.
5. Commit changes to a feature branch and open a PR.

## Acceptance criteria

- The About page has the same page-level horizontal padding as Dashboard and the content aligns with other top-level pages.
- The footer matches the docs-style (centered, small text, subtle color) and is removed from the previous heavy white bar.
- No TypeScript errors; ESLint passes.
- Visual QA (desktop and mobile) confirms no layout regressions.

## Rollback plan

- Revert the commit/PR if any regressions are found.

## Estimate

~1–2 hours (small UI changes and QA)
