# drAIn Design System

This document outlines the comprehensive design system used throughout the drAIn application, excluding the documentation and about pages.

---

## Table of Contents
- [Color Palette](#color-palette)
- [Typography](#typography)
- [Spacing System](#spacing-system)
- [Border Radius](#border-radius)
- [Border Styles](#border-styles)
- [Shadow Implementation](#shadow-implementation)
- [Component Patterns](#component-patterns)
- [Layout System](#layout-system)
- [Animations](#animations)
- [Interactive States](#interactive-states)

---

## Color Palette

### Base Colors (Light Mode)
```css
--background: oklch(1 0 0)                    /* Pure white */
--foreground: oklch(0.145 0 0)                /* Near black */
--card: oklch(1 0 0)                          /* White */
--card-foreground: oklch(0.145 0 0)           /* Near black */
--popover: oklch(1 0 0)                       /* White */
--popover-foreground: oklch(0.145 0 0)        /* Near black */
```

### Primary Colors
```css
--primary: oklch(0.205 0 0)                   /* Dark gray */
--primary-foreground: oklch(0.985 0 0)        /* Off-white */
--secondary: oklch(0.97 0 0)                  /* Light gray */
--secondary-foreground: oklch(0.205 0 0)      /* Dark gray */
```

### Accent Colors
```css
--muted: oklch(0.97 0 0)                      /* Light gray */
--muted-foreground: oklch(0.556 0 0)          /* Medium gray */
--accent: oklch(0.97 0 0)                     /* Light gray */
--accent-foreground: oklch(0.205 0 0)         /* Dark gray */
```

### Functional Colors
```css
--destructive: oklch(0.577 0.245 27.325)      /* Red */
--border: oklch(0.922 0 0)                    /* Light gray - #ebebeb */
--input: oklch(0.922 0 0)                     /* Light gray */
--ring: oklch(0.708 0 0)                      /* Medium gray */
```

### Brand Colors (Used in Components)
- **Primary Blue**: `#3B82F6` (buttons, active states, timeline dots)
- **Hover Blue**: `#2563EB` (button hover states)
- **Switch Active**: `#3F83DB` (switches, toggles)
- **Secondary Blue**: `#4b72f3` (default button background)
- **Dark Border**: `#2b3ea7` (button borders)

### Chart Colors
```css
--chart-1: oklch(0.646 0.222 41.116)
--chart-2: oklch(0.6 0.118 184.704)
--chart-3: oklch(0.398 0.07 227.392)
--chart-4: oklch(0.828 0.189 84.429)
--chart-5: oklch(0.769 0.188 70.08)
```

### Sidebar Colors
```css
--sidebar: #ffffff
--sidebar-foreground: oklch(0.145 0 0)
--sidebar-primary: oklch(0.205 0 0)
--sidebar-primary-foreground: oklch(0.985 0 0)
--sidebar-accent: oklch(0.97 0 0)
--sidebar-accent-foreground: oklch(0.205 0 0)
--sidebar-border: #141414
--sidebar-ring: oklch(0.708 0 0)
```

### Dark Mode Colors
```css
.dark {
  --background: oklch(0.145 0 0)              /* Near black */
  --foreground: oklch(0.985 0 0)              /* Off-white */
  --card: oklch(0.205 0 0)                    /* Dark gray */
  --card-foreground: oklch(0.985 0 0)         /* Off-white */
  --border: oklch(1 0 0 / 10%)                /* White 10% opacity */
  --input: oklch(1 0 0 / 15%)                 /* White 15% opacity */
}
```

### Vulnerability Badge Colors
- **High**: 
  - Background: `bg-red-100` (light), `bg-red-900/20` (dark)
  - Text: `text-red-800` (light), `text-red-400` (dark)
  - Border: `border-red-200` (light), `border-red-800` (dark)

- **Moderate**:
  - Background: `bg-yellow-100` (light), `bg-yellow-900/20` (dark)
  - Text: `text-yellow-800` (light), `text-yellow-400` (dark)
  - Border: `border-yellow-200` (light), `border-yellow-800` (dark)

- **Low**:
  - Background: `bg-green-100` (light), `bg-green-900/20` (dark)
  - Text: `text-green-800` (light), `text-green-400` (dark)
  - Border: `border-green-200` (light), `border-green-800` (dark)

### Alert/Notice Colors
- **Amber (Warning)**:
  - Background: `bg-amber-50` (light), `bg-amber-950/20` (dark)
  - Text: `text-amber-800` (light), `text-amber-300` (dark)
  - Border: `border-amber-200` (light), `border-amber-900/30` (dark)
  - Icon: `text-amber-600` (light), `text-amber-500` (dark)

### Background Variants
- **Primary Background**: `bg-[#e8e8e8]/50` (slightly transparent gray)
- **Secondary Background**: `bg-[#f7f7f7]` (light gray)
- **Hover Background**: `bg-[#f5f5f5]` (very light gray)

### Component-Specific Colors
- **Standard Border**: `#ced1cd` (cards, inputs)
- **Light Border**: `#e2e2e2` (subtle divisions)
- **Timeline Dot Active**: `#3b82f6` (blue)
- **Timeline Dot Inactive**: `bg-white` with `border-gray-300`
- **Timeline Line**: `bg-gray-200` (inactive), `#3b82f6` (active)

### Flood Hazard Levels
- **High**: `#d73027` (red)
- **Medium**: `#fc8d59` (orange)
- **Low**: `#fee090` (yellow)

---

## Typography

### Font Families
- **Sans-serif (Primary)**: `var(--font-geist-sans)` - Geist Sans
- **Monospace**: `var(--font-geist-mono)` - Geist Mono
- **Display Font**: `var(--font-century-gothic)` - Century Gothic (for hero sections)

### Font Sizes
Following Tailwind's default scale:

```css
text-xs: 0.75rem (12px)     /* Small labels, descriptions */
text-sm: 0.875rem (14px)    /* Body text, button text */
text-base: 1rem (16px)      /* Default body text */
text-lg: 1.125rem (18px)    /* Emphasized text */
text-xl: 1.25rem (20px)     /* Card values, stats */
text-2xl: 1.5rem (24px)     /* Section headings */
text-3xl: 1.875rem (30px)   /* Page titles */
text-5xl: 3rem (48px)       /* Hero headings */
```

### Specific Component Text Sizes
- **Card Title**: `text-xl font-bold` (20px, bold)
- **Card Value**: `text-xl font-bold` (20px, bold)
- **Card Label**: `text-xs font-semibold` (12px, semibold)
- **Card Description**: `text-[11px]` (11px)
- **Button Text**: `text-sm font-medium` (14px, medium)
- **Badge Text**: `text-xs font-medium` (12px, medium)
- **Input Text**: `text-base md:text-sm` (16px mobile, 14px desktop)
- **Label Text**: `text-sm font-medium` (14px, medium)

### Font Weights
```css
font-normal: 400
font-medium: 500
font-semibold: 600
font-bold: 700
```

### Line Heights
```css
leading-none: 1
leading-relaxed: 1.625     /* Used for descriptions */
leading-2: 0.5rem          /* Tight spacing for hero text */
```

### Letter Spacing
```css
tracking-wider: 0.05em     /* Used for uppercase labels */
```

---

## Spacing System

### Standard Tailwind Spacing Scale
```css
0: 0
0.5: 0.125rem (2px)
1: 0.25rem (4px)
1.5: 0.375rem (6px)
2: 0.5rem (8px)
2.5: 0.625rem (10px)
3: 0.75rem (12px)
4: 1rem (16px)
5: 1.25rem (20px)
6: 1.5rem (24px)
8: 2rem (32px)
10: 2.5rem (40px)
12: 3rem (48px)
16: 4rem (64px)
20: 5rem (80px)
```

### Component-Specific Spacing

#### Card Spacing
- **Card Gap**: `gap-6` (24px between elements)
- **Card Padding**: `py-6` (24px vertical), `px-6` (24px horizontal)
- **Card Content**: `px-6` (24px horizontal padding)
- **Control Panel Card**: `px-4 space-y-4 pb-8` (16px horizontal, 16px vertical gap, 32px bottom)

#### Button Spacing
- **Default Button**: `h-9 px-4 py-2` (36px height, 16px horizontal, 8px vertical)
- **Small Button**: `h-8 px-3` (32px height, 12px horizontal)
- **Large Button**: `h-10 px-6` (40px height, 24px horizontal)
- **Icon Button**: `size-10 py-4` (40px × 40px, 16px vertical)
- **Button Gap**: `gap-2` (8px between icon and text)

#### Badge Spacing
- **Badge Padding**: `px-2.5 py-0.5` (10px horizontal, 2px vertical)
- **Badge Gap**: `gap-1` (4px between icon and text)

#### Input Spacing
- **Input Padding**: `px-3 py-1` (12px horizontal, 4px vertical)
- **Input Height**: `h-9` (36px)

#### Layout Spacing
- **Content Padding**: `px-4` (16px) or `px-6` (24px)
- **Section Spacing**: `space-y-4` (16px), `space-y-6` (24px)
- **Timeline Gap**: `gap-3` (12px between timeline and cards)
- **Timeline Column**: `gap-4` (16px between dots)

#### List Item Spacing
- **List Gap**: `space-y-1` (4px between items)
- **Grid Gap**: `gap-6` (24px), `gap-8` (32px)

---

## Border Radius

### Global Border Radius Variable
```css
--radius: 0.625rem (10px)
```

### Radius Scale
```css
--radius-sm: calc(var(--radius) - 4px)   /* 6px */
--radius-md: calc(var(--radius) - 2px)   /* 8px */
--radius-lg: var(--radius)                /* 10px */
--radius-xl: calc(var(--radius) + 4px)   /* 14px */
```

### Component-Specific Border Radius

- **Buttons**: `rounded-sm` (2px) - Very subtle rounding
- **Cards**: `rounded-xl` (12px) - Pronounced rounding
- **Inputs**: `rounded-md` (6px) - Medium rounding
- **Badges**: `rounded-md` (6px) or `rounded-full` (full circle)
- **Vulnerability Badges**: `rounded-full` (pill shape)
- **Timeline Dots**: `rounded-full` (perfect circles)
- **Toggles/Switches**: `rounded-full` (pill shape)
- **Model Viewer Container**: `rounded-md` (6px)
- **Flood Scenario Indicators**: `rounded-lg` (8px)
- **3D Model Button**: `rounded-lg` (8px)

### Special Cases
- **Scrollbar Thumb**: `border-radius: 10px`
- **Mapbox Popup**: `border-radius: 8px`
- **No Background Popup**: `border-radius: 100% 100% 100% 0px` (teardrop shape)

---

## Border Styles

### Border Widths
```css
border: 1px
border-2: 2px
border-4: 4px (used for button transparent borders)
```

### Common Border Colors
- **Default**: `border-[#ced1cd]` (medium gray)
- **Subtle**: `border-[#e2e2e2]` (light gray)
- **Input**: `border-input` (light gray)
- **Primary**: `border-[#2b3ea7]` (dark blue - for primary buttons)
- **Ring**: `border-ring` (focus states)
- **Active Toggle**: `border-[#3F83DB]` (blue)
- **Inactive Toggle**: `border-gray-300` (light gray)

### Border Combinations
- **Card**: `border border-[#ced1cd]` (1px solid gray)
- **Button Default**: `border border-[#2b3ea7]` (1px solid dark blue)
- **Timeline Dots**: `border-2` with conditional colors
- **Switch**: `border border-transparent` (hidden border)

### Border Variants by Component

#### Cards
```css
border: 1px solid #ced1cd
rounded-xl
```

#### Buttons
```css
/* Default */
border: 1px solid #2b3ea7

/* Outline */
border: 1px solid var(--border)
```

#### Inputs
```css
border: 1px solid var(--input)
rounded-md
```

#### Badges
```css
border: 1px solid (varies by variant)
rounded-md or rounded-full
```

---

## Shadow Implementation

### No Shadow Policy
The design system **explicitly avoids box shadows** for most components, creating a flat, clean aesthetic.

### Shadow Exceptions (Minimal Use)

#### Shadow XS (Very Subtle)
```css
shadow-xs: Used minimally for buttons in certain states
```

#### Component-Specific Shadows
- **Timeline Dots (Active)**: 
  ```css
  boxShadow: 0 0 0 8px rgba(59, 130, 246, 0.2) /* Pulsing glow effect */
  ```

- **Overlay Legend Dots (Active)**:
  ```css
  boxShadow: 0 0 8px ${overlay.color}40 /* 25% opacity glow */
  ```

- **Mapbox Popup**:
  ```css
  box-shadow: none (explicitly removed)
  ```

### Alternative to Shadows
The design uses **borders** and **background colors** instead of shadows for depth and hierarchy:
- Border colors for separation
- Background color variations for layers
- State-based color changes for interaction

---

## Component Patterns

### Buttons

#### Default Button
```tsx
className="inline-flex items-center justify-center gap-2 whitespace-nowrap 
           rounded-sm text-sm font-medium transition-all 
           bg-[#4b72f3] border border-[#2b3ea7] text-white 
           hover:bg-blue-600 disabled:opacity-50 
           h-9 px-4 py-2"
```

#### Outline Button
```tsx
className="border bg-background hover:bg-accent hover:text-accent-foreground
           dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
```

#### Ghost Button
```tsx
className="hover:bg-accent hover:text-accent-foreground 
           dark:hover:bg-accent/50"
```

#### Icon Button
```tsx
className="size-10 py-4"
```

### Cards

#### Standard Card
```tsx
className="bg-card text-card-foreground flex flex-col gap-6 
           rounded-xl border border-[#ced1cd] py-6"
```

#### Data Field Card
```tsx
className="overflow-hidden border-none p-0 py-3"
```

### Inputs

#### Standard Input
```tsx
className="flex h-9 w-full min-w-0 rounded-md border border-input 
           bg-transparent px-3 py-1 text-base transition-[color,box-shadow]
           dark:bg-input/30 md:text-sm"
```

### Badges

#### Default Badge
```tsx
className="inline-flex items-center justify-center rounded-md border 
           px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap"
```

#### Vulnerability Badge
```tsx
className="inline-flex items-center px-2.5 py-0.5 rounded-full 
           text-xs font-medium border"
/* Colors vary by rating: high, moderate, low */
```

### Switches

#### Toggle Switch
```tsx
className="peer data-[state=checked]:bg-[#3F83DB] 
           data-[state=unchecked]:bg-input 
           inline-flex h-[1.15rem] w-8 shrink-0 items-center 
           rounded-full border border-transparent"
```

### Labels

#### Standard Label
```tsx
className="flex items-center gap-2 text-sm leading-none font-medium 
           select-none"
```

---

## Layout System

### Grid Systems

#### Two-Column Layout (Sidebar + Content)
```tsx
className="grid grid-cols-1 lg:grid-cols-4 gap-8"
/* Sidebar: lg:col-span-1 */
/* Content: lg:col-span-3 */
```

#### Three-Column Grid
```tsx
className="grid md:grid-cols-3 gap-6"
```

#### Flex Layouts

##### Timeline Layout
```tsx
/* Container */
className="flex gap-3"

/* Timeline Column */
className="relative flex flex-col gap-4" 
style={{ width: "20px" }}

/* Cards Column */
className="flex-1 flex flex-col gap-4"
```

##### Row Layout
```tsx
className="flex flex-row items-center justify-between"
```

### Container Widths
- **Max Width**: `max-w-7xl` (1280px) - For page containers
- **Max Width Medium**: `max-w-3xl` (768px) - For centered content
- **Full Width**: `w-full` - For responsive components

### Viewport Constraints
```css
min-h-screen: Full viewport height
h-full: 100% of parent
flex-1: Grow to fill available space
```

---

## Animations

### Keyframe Animations

#### Rotate In (Logo)
```css
@keyframes rotateIn {
  from {
    transform: rotate(-40deg);
    opacity: 1;
  }
  to {
    transform: rotate(0deg);
    opacity: 1;
  }
}

className="animate-rotate-in"
duration: 0.4s ease-out
```

#### Shimmer (Loading State)
```css
@keyframes shimmer {
  to {
    background-position: 200% center;
  }
}

className="animate-shimmer"
duration: 3s linear infinite
```

#### Shine Glow (Metallic Text)
```css
@keyframes shineGlow {
  0%, 100% {
    filter: brightness(1);
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
  }
  50% {
    filter: brightness(1.5);
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.8),
                 0 0 30px rgba(255, 255, 255, 0.5);
  }
}

className="text-shine"
color: #7a7b7f
duration: 4s ease-in-out infinite
```

#### Gradient Shift (Animated Text)
```css
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

className="text-gradient-animated"
background: linear-gradient(90deg, #7a80cc, #282d6f, #7a80cc)
background-size: 200% auto
duration: 3s ease-in-out forwards (hover: 2s infinite)
```

### Framer Motion Animations

#### Timeline Dots
```tsx
/* Pulsing Scale */
animate={{
  scale: isCurrent ? [1, 1.3, 1] : 1,
}}
transition={{
  duration: 0.6,
  repeat: isCurrent ? Infinity : 0,
  repeatType: "loop",
}}

/* Expanding Ring */
animate={{
  boxShadow: [
    "0 0 0 0 rgba(59, 130, 246, 0)",
    "0 0 0 8px rgba(59, 130, 246, 0.2)",
    "0 0 0 0 rgba(59, 130, 246, 0)",
  ]
}}
transition={{
  duration: 1.5,
  repeat: Infinity,
  repeatType: "loop",
}}
```

#### Timeline Progress Line
```tsx
animate={{
  height: `calc(${((activeIndex + 0.5) / fields.length) * 100}% - ...)`
}}
transition={{
  type: "spring",
  stiffness: 100,
  damping: 20,
}}
```

### Transition Properties

#### Standard Transitions
```css
transition-all: All properties
transition-colors: Color properties only
transition-transform: Transform properties only
transition-[color,box-shadow]: Specific properties
```

#### Duration Classes
```css
duration-200: 200ms
duration-300: 300ms
```

#### Timing Functions
```css
ease-in-out: Smooth start and end
ease-out: Smooth end
linear: Constant speed
```

---

## Interactive States

### Hover States

#### Buttons
```css
hover:bg-blue-600        /* Primary button */
hover:bg-[#2563EB]       /* Large button */
hover:bg-accent          /* Outline button */
hover:text-accent-foreground
```

#### Cards
```css
hover:bg-[#f5f5f5]       /* Model viewer button */
```

#### Links
```css
hover:text-primary       /* Navigation links */
transition-colors
```

#### Toggles/Layers
```css
group-hover:text-foreground    /* Layer labels */
```

### Focus States

#### Focus Visible (Inputs, Buttons)
```css
focus-visible:border-ring
focus-visible:ring-ring/50
focus-visible:ring-[3px]
outline-none
```

#### Invalid State (Forms)
```css
aria-invalid:ring-destructive/20
aria-invalid:border-destructive
dark:aria-invalid:ring-destructive/40
```

### Active States

#### Timeline Dots
```css
/* Active */
bg-[#3b82f6] border-[#3b82f6]

/* Inactive */
bg-white border-gray-300
```

#### Switches
```css
/* Checked */
data-[state=checked]:bg-[#3F83DB]

/* Unchecked */
data-[state=unchecked]:bg-input
```

#### Toggle Buttons
```css
/* Pressed */
border-[#3F83DB]
text-[#3F83DB]

/* Unpressed */
border-gray-300
text-gray-400
```

### Disabled States

#### Universal Disabled
```css
disabled:pointer-events-none
disabled:cursor-not-allowed
disabled:opacity-50
```

#### Group/Peer Disabled
```css
group-data-[disabled=true]:pointer-events-none
group-data-[disabled=true]:opacity-50
peer-disabled:cursor-not-allowed
peer-disabled:opacity-50
```

### Selection States

#### Text Selection
```css
selection:bg-primary
selection:text-primary-foreground
```

#### User Select
```css
select-none    /* Labels, non-selectable text */
```

---

## Scrollbar Styling

### Control Panel Scrollbar
```css
.control-panel-scroll {
  scrollbar-gutter: stable;
}

.control-panel-scroll::-webkit-scrollbar {
  width: 14px;
}

.control-panel-scroll::-webkit-scrollbar-track {
  background: transparent;
  margin-bottom: 16px;
  margin-right: 8px;
}

.control-panel-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  border: 4px solid transparent;
  border-right: 5px solid transparent;
  background-clip: padding-box;
}

.control-panel-scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.3);
}
```

### Hidden Scrollbar (Maintenance)
```css
.maintenance-scroll-hidden {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Edge, IE */
}

.maintenance-scroll-hidden::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}
```

---

## Responsive Design

### Breakpoints (Tailwind Defaults)
```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Mobile-First Patterns

#### Text Sizing
```css
text-base md:text-sm    /* 16px mobile, 14px desktop */
```

#### Grid Layouts
```css
grid-cols-1 md:grid-cols-2 lg:grid-cols-4
```

#### Spacing
```css
px-4 md:px-6    /* 16px mobile, 24px desktop */
```

---

## Design Principles

### 1. Flat Design
- **No shadows** except for functional pulsing effects
- Borders and background colors create hierarchy
- Clean, minimalist aesthetic

### 2. Subtle Rounding
- Buttons: Minimal rounding (`rounded-sm` - 2px)
- Cards: Pronounced rounding (`rounded-xl` - 12px)
- Badges/Pills: Full rounding (`rounded-full`)

### 3. Blue Accent System
- Consistent use of blue (`#3B82F6`, `#3F83DB`) for:
  - Interactive elements
  - Active states
  - Primary actions
  - Progress indicators

### 4. Monochromatic Base
- Gray scale for structure and hierarchy
- Color used sparingly and purposefully
- Dark mode support through OKLCH color space

### 5. Smooth Transitions
- `transition-all` or `transition-colors` on interactive elements
- Framer Motion for complex animations
- Spring animations for natural movement

### 6. Accessibility First
- Focus states clearly visible
- Sufficient color contrast
- Semantic HTML structure
- ARIA labels where needed

---

## Component Hierarchy

### Z-Index Layers
```css
z-10: Timeline dots, foreground content
z-20: Fullscreen toggle button
relative: Default positioned elements
```

### Stacking Context
- Cards create natural stacking through borders
- No shadow-based depth
- Opacity used for layered backgrounds

---

## Data Visualization

### Vulnerability Levels
- **High**: Red tones (`#d73027`, red-100/800)
- **Moderate**: Yellow tones (yellow-100/800)
- **Low**: Green tones (green-100/800)

### Flood Hazard Gradient
- High → Medium → Low
- Red → Orange → Yellow
- `#d73027` → `#fc8d59` → `#fee090`

### Timeline Indicators
- Gray line (inactive): `bg-gray-200`
- Blue line (active): `#3b82f6`
- Dot progression with pulsing animation

---

## Best Practices

### Spacing
- Use consistent gap values: 2, 3, 4, 6, 8
- Card padding: Always `py-6 px-6`
- Section spacing: `space-y-4` or `space-y-6`

### Colors
- Use CSS variables for theme colors
- Hardcode only brand/accent colors
- Support dark mode with OKLCH

### Typography
- Headings: Bold weight
- Body: Normal/Medium weight
- Labels: Medium/Semibold with uppercase tracking

### Borders
- Default: `border-[#ced1cd]`
- Use `border-2` for emphasis (dots, active states)
- Always pair with appropriate border-radius

### Interactive Elements
- Always include hover states
- Use `transition-colors` or `transition-all`
- Disable properly with opacity + pointer-events

---

## File References

### Core Styling
- **Global Styles**: `app/globals.css`
- **Tailwind Config**: Uses `@tailwindcss/postcss`
- **CSS Custom Properties**: Defined in `:root` and `.dark`

### Component Library
- **Buttons**: `components/ui/button.tsx`
- **Cards**: `components/ui/card.tsx`
- **Inputs**: `components/ui/input.tsx`
- **Badges**: `components/ui/badge.tsx`
- **Switches**: `components/ui/switch.tsx`
- **Labels**: `components/ui/label.tsx`

### Custom Components
- **Vulnerability Badge**: `components/vulnerability-badge.tsx`
- **Data Field Card**: `components/control-panel/components/DataFieldCard.tsx`
- **Detail View**: `components/control-panel/components/detail-view.tsx`
- **Overlay Legend**: `components/overlay-legend.tsx`
- **Flood Scenario Card**: `components/flood-scenario-card.tsx`

---

## Version
Design System Version: 1.0  
Last Updated: 2025  
Framework: Next.js 15 + Tailwind CSS v4
