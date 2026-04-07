# Implementation: about-page

**Implementation guide for:** `.plans/about-page/plan.md`

## Summary

Make small, targeted changes in `app/about/page.tsx`:

- Update the page wrapper to use the same horizontal padding as `app/dashboard/page.tsx` (add `px-8`).
- Adjust the main/container classes to align with dashboard container spacing.
- Replace the existing footer (white bar with border) with the simpler docs footer (centered, small text, `text-slate-600`).

## Exact changes (patch-style instructions)

1. Replace the current top-level wrapper and main/container classes:

Old snippet:

return (

<div className="flex min-h-screen flex-col bg-[#e8e8e8]/50">
{/_ Main Content _/}
<main className="flex-1 py-8">
<div className="mx-auto w-[1280px] space-y-16 px-4 md:px-6">

New snippet:

return (

<div className="min-h-screen bg-[#e8e8e8]/50 px-8">
{/_ Main Content _/}
<main className="py-8">
<div className="mx-auto w-[1280px] px-4 py-5 md:px-6 space-y-16">

Notes:

- This adds the `px-8` page-level gutter and standardizes the container `py-5` spacing.
- Removing `flex` and `flex-col` is intentional to match `app/dashboard/page.tsx`. If layout issue observed during QA (e.g., footer placement), we can reintroduce `flex` but keep `px-8`.

2. Replace the existing footer block with the docs-style footer:

Old snippet:

      {/* Footer */}
      <footer className="text-foreground mt-8 border-t border-[#ced1cd] bg-white py-8">
        <div className="mx-auto w-[1280px] px-4 text-center md:px-6">
          <p className="text-base md:text-sm">
            © 2025 Team 2Ls, University of the Philippines Cebu. Building
            resilient cities through open-source innovation.
          </p>
        </div>
      </footer>

New snippet:

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-slate-600">
        <p>Built by Computer Science students from University of the Philippines - Cebu</p>
        <p className="mt-1">© 2024 drAin Project. All rights reserved.</p>
      </div>

Notes:

- Uses the same footer concept and subtle styling as `app/docs/page.tsx`.
- Content text chosen from docs; adjust if you prefer to keep the Team 2Ls phrasing.

## Testing / QA

1. Run type-checks: `pnpm type-check` or `pnpm build`.
2. Run lint: `pnpm lint`.
3. Start dev server: `pnpm dev` and visually inspect `http://localhost:3000/about` at desktop and mobile widths.
4. Confirm padding aligns with `/dashboard` and footer matches `/docs` concept.

## Implementation checklist

- [ ] Apply changes to `app/about/page.tsx` as described
- [ ] Run `pnpm type-check` & `pnpm lint`
- [ ] Visual QA on multiple viewports
- [ ] Commit and open PR
