# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PJDSC is a Next.js 15 application for visualizing and managing drainage infrastructure data. It features an interactive 3D Mapbox-based map displaying drainage pipes, inlets, outlets, and storm drains with authentication via Supabase.

## Commands

### Development

```bash
pnpm run dev        # Start dev server with Turbopack
pnpm run build      # Build production bundle with Turbopack
pnpm start          # Start production server
pnpm run lint       # Run ESLint
```

## Architecture

### Core Structure

**Next.js App Router** (`app/`)

- Uses `(auth)` route group for login/signup pages
- Main pages: home (`page.tsx`), map (`map/page.tsx`), timeline, about
- Global layout wraps app with `AuthProvider` → `Providers` (theme) → `AuthGuard`

**Authentication Flow**

1. `AuthProvider` (`components/context/AuthProvider.tsx`) - React Context managing Supabase auth state
2. `AuthGuard` (`components/auth/AuthGuard.tsx`) - Protects routes, redirects unauthenticated users to `/login`
3. Supabase client initialized in `api/client.ts` using env vars:
   - `NEXT_PUBLIC_SUPABSE_URL` (note typo in variable name)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Map Architecture** (`app/map/page.tsx`)

- Mapbox GL JS with 3D terrain (DEM exaggeration 1.5) and 3D buildings
- Four GeoJSON layers loaded from `public/drainage/`:
  - `man_pipes.geojson` - Purple pipe lines
  - `storm_drains.geojson` - Blue circles
  - `inlets.geojson` - Green circles
  - `outlets.geojson` - Red circles
- Configuration centralized in `lib/map/config.ts` (token, bounds, styles, overlay config)
- Click handlers show popups with feature properties
- Can toggle between Streets and Satellite views

**Control Panel** (`components/control-panel/`)

- Modular component structure:
  - `index.tsx` - Main orchestrator
  - `components/sidebar.tsx` - Tab navigation
  - `components/top-bar.tsx` - Search, dataset selector, back button
  - `components/content-renderer.tsx` - Renders tables/overlays/reports based on active tab
  - `components/detail-view.tsx` - Detail view for selected items
- State managed by custom hook `hooks/use-control-panel-state`
- Supports tabs: Data (tables), Overlays, Reports, Simulations

**Data Hooks** (`hooks/`)
All follow same pattern - fetch GeoJSON from `/drainage/*.geojson`, transform to TypeScript interface:

- `useInlets()` → `Inlet[]`
- `useOutlets()` → `Outlet[]`
- `usePipes()` → `Pipe[]`
- `useDrain()` → `Drain[]` (storm drains)

Each hook exposes `{ data, loading }` and includes a transform function to parse GeoJSON features into strongly-typed objects with extracted coordinates.

**UI Components** (`components/ui/`)

- Built with Radix UI primitives (dialog, select, checkbox, switch, popover, etc.)
- Styled with Tailwind CSS using `cn()` utility from `lib/utils.ts`
- Forms use react-hook-form + Zod validation

### Key Data Types

**Drainage Infrastructure**

- `DrainagePipe` - Mock data in `lib/drainage.ts` (not used by map, which uses GeoJSON)
- `Inlet` - Drainage inlets with properties: Inv_Elev, MaxDepth, Length, Height, Weir_Coeff, ClogFac
- `Outlet` - Drainage outlets with Inv_Elev, AllowQ, FlapGate
- `Pipe` - Pipe segments with TYPE, Pipe_Shape, Pipe_Lngth, Height, Width, Mannings, ClogPer
- `Drain` - Storm drains with InvElev, Max_Depth, Length, Height, clog_per

**Reports** (`data/content.ts`)

- Array of drainage issue reports with geocode (lat/lng), category, description, image URL
- Categories: Clogged, Damage Drain, Overflow, Open Drain

### Important Patterns

**Path Aliasing**

- `@/*` maps to project root via `tsconfig.json`
- Always use `@/` prefix for imports (e.g., `@/components/ui/button`)

**Client Components**

- Most components are "use client" due to interactivity requirements
- Providers, auth context, map, control panel all require client-side rendering

**Styling**

- Tailwind v4 with PostCSS
- Custom animations via `tw-animate-css`
- Theme support via `next-themes` (light/dark mode)

**Type Safety**

- Strict TypeScript mode enabled
- GeoJSON types from `@types/geojson`
- Three.js types for 3D components (ModelViewer)

### Known Issues/Notes

- Typo in env var: `NEXT_PUBLIC_SUPABSE_URL` (missing "A" in SUPABASE)
- `lib/drainage.ts` contains mock data not used by the actual map implementation
- Mapbox token is hardcoded in `lib/map/config.ts` (consider moving to env)
- GeoJSON files in `public/drainage/` are the source of truth for map data
