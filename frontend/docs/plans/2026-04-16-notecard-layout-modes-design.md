# NoteCard Layout Modes Design

**Date:** 2026-04-16
**Feature:** Dual-mode NoteCard with Grid/List layout toggle
**Files Affected:** NotesPanel.jsx, NoteCard.jsx

## Overview

Implement two layout modes for NoteCard component to give users flexibility in viewing evolution notes:
- **Grid Mode** (default): 3-column responsive grid, compact card view
- **List Mode**: Single-column full-width rows with expanded information

A toggle control with icon buttons (no text) in NotesPanel switches between modes.

## Design Specifications

### 1. Grid Mode (Compact Card)

**Visual Structure:**
```
┌─────────────────────────────┐
│ [Edit] Fecha ○              │  ← Header: date + selection indicator
├─────────────────────────────┤
│ Dr. Nombre        HH:MM h   │  ← Doctor info + time
├─────────────────────────────┤
│ Motivo de consulta          │
│ Lorem ipsum dolor sit amet… │  ← Motivo (truncated, 2-3 lines)
├─────────────────────────────┤
│ [CIE-10] [CIE-10]           │
│ [+2 more]                   │  ← Diagnósticos (4 visible, +N indicator)
└─────────────────────────────┘
```

**Styling Details:**
- Fixed height: ~200px (current)
- Width: Responsive via CSS Grid with `auto-fit, minmax(280px, 1fr)`
- Rounded corners: 12px
- Border: 1px gray-200 (default), teal-400 when selected
- Shadow: sm (default), md on hover
- Hover state: border-teal-300, elevated shadow
- Selected state: border-teal-400, ring-2 ring-teal-100

**Typography Hierarchy:**
- Date: text-6, font-mono, font-semibold, uppercase, zinc-600
- Doctor name: text-6, truncate, zinc-400
- Time: text-6, font-mono, zinc-400
- "Motivo de consulta" label: text-7, font-medium, uppercase, zinc-400
- Motivo text: text-5, zinc-600 (or italic zinc-300 if empty)
- CIE-10 codes: text-6, font-mono, font-semibold

**Interactive Elements:**
- Edit button: Ghost variant, appears on hover or when selected
- Card click: Select note (emit onClick)
- Edit click: Open edit form (emit onEdit, stopPropagation)

### 2. List Mode (Expanded Row)

**Visual Structure:**
```
┌──────────────────────────────────────────────────────────────────────┐
│ [Foto]│ Dr. Nombre    │ 15/04/2026 10:30h   │ [Edit] │              │
│ Motivo: Lorem ipsum dolor sit amet consectetur adipiscing elit...     │
│ CIE-10: [A01] [B02] [C03] [+1 more]                                  │
└──────────────────────────────────────────────────────────────────────┘
```

**Styling Details:**
- Height: auto, min-height ~80px (content-driven)
- Width: 100% (full container)
- Rounded corners: 12px
- Border: 1px gray-200 (default), teal-400 when selected
- Shadow: sm (default), md on hover
- Padding: 16px
- Flex layout: row-based, items spaced

**Structure Breakdown:**
1. **Doctor Avatar + Name** (left):
   - Avatar: 32px × 32px, rounded-full
   - Name: text-6, truncate if needed, zinc-700
   - Flex: shrink-0, gap-2

2. **DateTime** (center-left):
   - Formatted as "15/04/2026 10:30h"
   - text-6, font-mono, zinc-600
   - Flex: shrink-0

3. **Edit Button** (right):
   - Ghost variant, sm size
   - Only visible on hover or selected
   - Flex: shrink-0

4. **Motivo Section** (full width below):
   - Label: "Motivo:", text-6, font-medium, zinc-500
   - Content: text-5, zinc-600, no truncate in list mode (visible in full)
   - Flex: grow if needed

5. **CIE-10 Section** (full width below):
   - Label: "CIE-10:", text-6, font-medium, zinc-500
   - Tags: text-6, font-mono, same styling as grid mode
   - Flex: wrap, show all with +N indicator

**Interactive Elements:**
- Card click: Select note
- Edit button: Open edit form
- Same selection states as grid mode

### 3. NotesPanel Changes

**Toggle Control:**
- Location: Top-right, next to "Nueva nota" button
- Style: Two icon buttons in a group (no text labels)
- Icons:
  - Grid mode: `HiOutlineSquares2X2` or similar grid icon
  - List mode: `HiOutlineListBullet` or similar list icon
- Active state: button has primary color background
- Inactive state: ghost variant

**Grid Container:**
- Grid mode: `grid auto-fit minmax(280px, 1fr) gap-3`
- List mode: `flex flex-col gap-3`

**State Management:**
- Add state: `const [layout, setLayout] = useState('grid')`
- Pass to NoteCard: `<NoteCard layout={layout} ... />`
- Persist to localStorage (optional, for user preference)

## Component Prop Changes

### NoteCard.jsx
```javascript
export default function NoteCard({
  note,
  onClick,
  onEdit,
  isSelected = false,
  layout = 'grid',  // NEW: 'grid' | 'list'
})
```

### NotesPanel.jsx
```javascript
const [layout, setLayout] = useState('grid')  // NEW state
// Pass to NoteCard and use for container className
```

## Responsive Behavior

**Grid Mode (auto-fit):**
- Desktop (1400px+): 4 columns
- Laptop (1024px): 3 columns
- Tablet (768px): 2 columns
- Mobile (< 640px): 1 column

**List Mode:**
- Always single-column, full-width (responsive to container)

## Visual Enhancements

**Color Palette (existing, maintained):**
- Borders: gray-200 → teal-400 when selected
- Ring: teal-100 when selected
- Hover shadow: teal-300 border + elevated shadow
- Text hierarchy: zinc-600 (primary), zinc-400 (secondary), zinc-300 (tertiary)
- CIE-10 badges: blue-50 background, blue-700 text, blue-100 border

**Transitions:**
- Border & shadow: 150ms ease
- Opacity (edit button): 200ms ease
- Layout switch: instant (no animation needed)

## Accessibility

- Buttons labeled with aria-label
- Card clickable: semantic `<article>` with cursor-pointer
- Focus states: defined for keyboard navigation
- Color not only indicator: selection indicator dot + border change
