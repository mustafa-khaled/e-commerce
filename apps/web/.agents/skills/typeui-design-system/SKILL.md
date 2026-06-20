# Design System — Agent Instructions

This skill describes the visual design language for all UI output. Every component, layout, and page should follow the design specs in the module files below. These describe _what the design looks like_ — you choose how to implement the styles.

## Style

A nostalgic desktop-OS interface — toasted-cream surfaces, espresso-brown ink, and a glowing orange accent. UI is framed like a vintage operating system: a fixed top menu bar, draggable "windows" with title bars instead of plain cards, folder-style icons, and crisp 1px taupe borders on everything. Corners are sharp (3px), shadows are warm and directional, headings are set in a literary serif, body/UI text in a clean geometric sans, and code/metadata in a monospace. The result feels like a sun-faded retro manual in light mode and a CRT terminal at night in dark mode.

## Before Writing Any Code

1. **Read every module that applies.** For a landing page, read at minimum: `layout.md`, `typography.md`, `colors.md`, `buttons.md`, `cards.md`, `shadows.md`, `radius.md`, `borders.md`. Do NOT write any component markup until you have loaded all relevant modules.

## Critical Rules

- **Stay stack-agnostic.** This design system is technology-agnostic. Do not assume or hardcode any specific stack, framework, or styling library. The rules, colors, and styles must be implementable with any technology.

- **Tokens are AGNOSTIC design tokens, NOT utility classes:** The tokens defined in the `.md` files (like `neutral-primary-soft`, `heading`, `border-default`) are abstract design system tokens, NOT literal class names. Do not assume any predefined class exists — map each token to your project's styling layer yourself.

- **The desktop metaphor is the soul of this system.** Treat primary content containers as "windows": a title-bar header (with a label and, where appropriate, window controls) sitting on a bordered body. The orange `bg-desktop` is the _wallpaper behind windows only_ — never a content surface.

- **Sharp, not soft.** Border-radius maxes out at 3px for surfaces and controls (pills/dots may use full radius). Never use large 8–16px rounding. Every surface, control, and panel carries a crisp 1px `border-default` (taupe-brown) line.

- **Flat chrome, physical feedback.** Buttons and controls are flat fills with a 1px border — no glossy gradients or glint highlights. Interactivity is expressed through a color/fill shift on hover and a subtle inset "pressed-key" shadow on `:active`.

- **Cross-reference modules.** A window containing buttons must satisfy both `cards.md` AND `buttons.md`.
- **Dark mode is automatic.** The CSS custom properties resolve differently in light/dark via `@media (prefers-color-scheme: dark)` (or a `data-theme` attribute). Never manually swap colors.
- **Every interactive element needs hover, focus, and disabled states** — defined in the relevant module. Focus uses a visible 2px outline offset from the control (keyboard-friendly retro outlines).
- **Use semantic HTML:** proper heading hierarchy (`h1`→`h6`), `<button>` for actions, `<a>` for navigation, ARIA attributes where needed.

## Module Index

### Foundation (read first for any UI work)

- [colors.md](colors.md) — all background, text, and border color tokens
- [typography.md](typography.md) — heading scale, paragraphs, labels, links
- [layout.md](layout.md) — spacing rhythm, containers, animation, visual depth
- [radius.md](radius.md) — border-radius scale
- [shadows.md](shadows.md) — elevation tokens
- [borders.md](borders.md) — border widths and styles

### Components

- [buttons.md](buttons.md) — flat retro button variants, sizes, states, pressed feedback
- [button-group.md](button-group.md) — grouped button structure
- [cards.md](cards.md) — window/title-bar chrome, panels, interactivity
- [inputs.md](inputs.md) — form controls, labels, states
- [alerts.md](alerts.md) — alert variants
- [badges.md](badges.md) — badge variants, sizes, dismissible chips
- [lists.md](lists.md) — list components
- [avatars.md](avatars.md) — avatar variants, sizes, indicators
- [icon-shapes.md](icon-shapes.md) — icon containers

### Complex Components

- [accordion.md](accordion.md) — accordion variants
- [dropdown.md](dropdown.md) — dropdown menus
- [modals.md](modals.md) — modal dialogs
- [tabs.md](tabs.md) — tab navigation
- [tables.md](tables.md) — table structure
- [pagination.md](pagination.md) — pagination components
- [sidebars.md](sidebars.md) — sidebar navigation
- [radios-checkboxes-toggle.md](radios-checkboxes-toggle.md) — selection controls
- [tooltips-popovers.md](tooltips-popovers.md) — tooltips and popovers
- [content.md](content.md) — grid system, responsiveness

# Accordion

> Dependencies: `colors.md`, `radius.md`

## Core Specs

- **Wrapper:** full width, 1px border (border-default color), 3px radius — clips first/last item corners
- **Item separator:** 1px bottom border (border-default) on every item except last

## Trigger (Button)

- **Layout:** flex, space-between, full width
- **Padding:** 20px horizontal, 16px vertical
- **Font:** 14px, medium weight
- **Text color:** heading
- **Background:** neutral-secondary-soft
- **Hover:** neutral-tertiary-soft background
- **Focus:** 2px solid border-brand outline, 2px offset
- **Transition:** colors, 120ms
- **Open state:** neutral-tertiary-soft background

## Panel (Content)

- **Padding:** 20px horizontal, 16px vertical
- **Background:** neutral-primary-soft
- **Top border:** 1px, border-default color
- **Font:** 14px, body color, 1.625 line-height

## Chevron Icon

- Size: 16x16px
- Color: body text color
- Closed: 0deg rotation
- Open: 180deg rotation
- Transition: transform, 150ms

## Variants

### Default (Collapse)

One panel open at a time. Items stacked inside a single shared bordered/rounded wrapper.

### Separated Cards

Each item is independent — has its own 1px border-default frame and 3px radius (no shadow). 8px bottom margin between items. No shared outer border.

### Always Open

Multiple panels can expand simultaneously. Same styling as Default.

### Flush

No outer border. Trigger and panel have transparent backgrounds. Only bottom border dividers between items. Use inside containers that already provide a background.

## States

| State    | Trigger appearance                                   |
| -------- | ---------------------------------------------------- |
| Closed   | heading text, neutral-secondary-soft background      |
| Open     | heading text, neutral-tertiary-soft background       |
| Hover    | neutral-tertiary-soft background                     |
| Focus    | 2px border-brand outline, 2px offset                 |
| Disabled | fg-disabled text, not-allowed cursor, no hover/focus |

# Alerts

> Dependencies: `colors.md`, `radius.md`

## Core Specs

- **Padding:** 14px
- **Radius:** 3px (base) — sharp
- **Border:** 1px (always bordered, matching the intent color)
- **Shadow:** none (in-flow) — bordered, not floating
- **Heading:** 14px sans, medium weight
- **Body:** 13px sans, normal weight, 1.5 line-height
- **Optional leading icon** in a matching intent color, 16px

Alerts can also be framed as a small **window** (title bar + body) for system-style messages (e.g. an "Error" dialog), per `cards.md`.

## Variants

### Brand

- **Background:** brand-softer
- **Border:** border-brand-subtle
- **Text:** fg-brand-strong

### Success

- **Background:** success-soft
- **Border:** border-success-subtle
- **Text:** fg-success-strong

### Danger

- **Background:** danger-soft
- **Border:** border-danger-subtle
- **Text:** fg-danger-strong

### Warning

- **Background:** warning-soft
- **Border:** border-warning-subtle
- **Text:** fg-warning

# Avatars

> Dependencies: `colors.md`, `radius.md`

## Core Specs

- **Circular shape:** fully rounded (999px)
- **Squared shape:** 3px radius (sharp — the retro default; reads like a framed photo/portrait tile)
- **Default size:** 40x40px
- **Image fit:** cover
- **Frame:** squared avatars carry a 1px border-default frame

Prefer the **squared** (3px) shape for the retro look; use circular only when a round portrait is explicitly desired.

## Sizes

| Size        | Dimensions | Radius |
| ----------- | ---------- | ------ |
| Extra Small | 18x18px    | 3px    |
| Small       | 24x24px    | 3px    |
| Base        | 32x32px    | 3px    |
| Large       | 44x44px    | 3px    |
| XL          | 56x56px    | 3px    |
| 2XL         | 64x64px    | 3px    |

## Bordered Avatar

- 4px padding, fully rounded, 2px outline in border-default color
- Alternative: 2px box-shadow ring in border-default color

## Stacked Avatars

- Displayed in a row (flex)
- Each avatar: 40x40px, fully rounded, 2px border in border-buffer color
- Overlap: -16px negative margin on all except first

### Stacked Counter

- Same size as avatars (40x40px), fully rounded
- Background: dark-strong, text: white, 12px font, medium weight
- Same overlap margin as other avatars

## Avatar with Text

- Flex row, 10px gap between avatar and text
- Avatar: 40x40px, fully rounded, cover fit
- Name: heading color, medium weight
- Subtitle: 14px, body color

# Badges

> Dependencies: `colors.md`, `radius.md`

## Core Specs

- **Border:** 1px (always bordered — badges read like little OS tags)
- **Default radius:** 3px (sharp)
- **Pill radius:** 999px
- **Font:** sans; mono is appropriate for version/system tags (e.g. `v1.0`, `README.TXT`)

## Sizes

| Size            | Font size | Horizontal padding | Vertical padding |
| --------------- | --------- | ------------------ | ---------------- |
| Default (small) | 12px      | 6px                | 2px              |
| Large           | 14px      | 8px                | 4px              |

## Variants

### Brand

- **Background:** brand-softer
- **Border:** border-brand-subtle
- **Text:** fg-brand-strong

### Alternative (Neutral Soft)

- **Background:** neutral-primary-soft
- **Border:** border-default
- **Text:** heading

### Gray (Neutral Medium)

- **Background:** neutral-secondary-medium
- **Border:** border-default
- **Text:** heading

### Danger

- **Background:** danger-soft
- **Border:** border-danger-subtle
- **Text:** fg-danger-strong

### Success

- **Background:** success-soft
- **Border:** border-success-subtle
- **Text:** fg-success-strong

### Warning

- **Background:** warning-soft
- **Border:** border-warning-subtle
- **Text:** fg-warning

### Dark

- **Background:** dark
- **Border:** transparent
- **Text:** white

## Pill Badges

Use 999px radius instead of 3px on any variant.

## Badges with Icons

- Icon size (default): 12x12px
- Icon size (large): 14x14px
- Icon spacing: 4px margin next to label

## Icon-only Badge

Square shape — equalize dimensions to 24x24px, no horizontal text padding.

## Dismissible Badges

Badge content + a close button. Close button hover backgrounds per variant:

| Variant     | Close button hover background |
| ----------- | ----------------------------- |
| Brand       | brand-soft                    |
| Alternative | neutral-tertiary              |
| Gray        | neutral-quaternary            |
| Danger      | danger-medium                 |
| Success     | success-medium                |
| Warning     | warning-medium                |

## Dot / Notification Badge

- Positioned absolutely: -4px top, -4px right
- Size: 12x12px, fully rounded (999px)
- 2px border in border-buffer color
- Background: danger

# Borders

Borders are the backbone of this retro system. **Almost everything has a visible 1px border** in the taupe-brown `border-default` color — windows, panels, buttons, inputs, badges, list rows, menu bars. The border is what makes the UI feel like crisp, drawn OS chrome rather than soft floating cards.

## Width Scale

| Context                                                              | Width                                      |
| -------------------------------------------------------------------- | ------------------------------------------ |
| Default (windows, cards, buttons, inputs, list rows, badges, chrome) | 1px                                        |
| Focus outline                                                        | 2px (outline, offset 2px from the control) |
| Heavy emphasis / window active frame                                 | 2px (rare)                                 |

## Rules

- Use **solid** borders everywhere by default.
- The default border color is `border-default` (taupe-brown). Use `border-default-strong` (espresso) for high-contrast emphasis and active window frames; `border-default-subtle` for the faintest dividers.
- Dashed borders only for special cases like file dropzones or "empty desktop" placeholders.
- Components in the same family must use matching border widths.
- Never mix 1px and 2px borders within a single component.
- Borders are always visible — do not rely on shadow alone to separate in-flow elements.

## Usage

| Context                      | Width / Color                                                                                            |
| ---------------------------- | -------------------------------------------------------------------------------------------------------- |
| Windows / panels / cards     | 1px `border-default` (1px `border-default-strong` for the active/focused window)                         |
| Menu bar                     | 1px `border-default` bottom edge only                                                                    |
| Inputs / selects / textareas | 1px `border-default`; 1px `border-brand` on focus (plus 2px focus outline), 1px `border-danger` on error |
| Buttons                      | 1px border matching the variant (see `buttons.md`)                                                       |
| Dividers                     | 1px `border-default-subtle`                                                                              |
| Focus outline                | 2px solid `border-brand`, 2px offset, on every interactive element                                       |

# Button Groups

> Dependencies: `buttons.md`, `colors.md`, `radius.md`

## Core Specs

- **Wrapper:** inline-flex, 3px radius, no shadow (the shared border defines the group)
- **Children overlap:** -1px left margin on all except first button (borders merge into a single seam)
- **Buttons inside the group must NOT have individual shadows.**

## Anatomy

### Wrapper

- Display: inline-flex
- Radius: 3px
- Shadow: none

### First Button

- 3px radius on inline-start side only, 0 on inline-end

### Middle Button(s)

- No radius (0 on all corners)

### Last Button

- 3px radius on inline-end side only, 0 on inline-start

### All buttons except first

- -1px left margin to overlap borders into one crisp seam

## Rules

- Buttons inside groups follow all styles from `buttons.md` (background, border, focus outline) except individual shadows
- Icon-only buttons: 14–16px icon, match height of text buttons

# Buttons

> Dependencies: `colors.md`, `radius.md`, `shadows.md`, `borders.md`

Retro OS buttons are **flat, bordered keys** — no gradients, no glossy glint. They read like physical buttons on a vintage interface: a solid fill, a crisp 1px border, sharp 3px corners, and a tactile inset "press" on click.

## Core Specs (all buttons except ghost and disabled)

- **Radius:** 3px (base). Use `full` (999px) only for explicit pill buttons.
- **Border:** 1px solid (color depends on variant).
- **Shadow:** none at rest (the border separates it). On `:active`, apply `inset-press`.
- **Font:** sans (DM Sans), weight 500 (medium).
- **Box sizing:** border-box.
- **Transition:** background-color and color, ~120ms.
- **Active (pressed):** apply the `inset-press` inset shadow and shift content down 1px — feels like pushing a key.
- **Focus:** 2px solid `border-brand` outline, 2px offset (visible keyboard focus). No soft glow.

## Sizes

| Size           | Font size | Horizontal padding | Vertical padding |
| -------------- | --------- | ------------------ | ---------------- |
| Extra small    | 11px      | 8px                | 4px              |
| Small          | 12px      | 10px               | 5px              |
| Base (default) | 13px      | 14px               | 7px              |
| Large          | 14px      | 18px               | 9px              |
| Extra large    | 15px      | 22px               | 11px             |

## Variants

### Primary

- **Background:** button-primary (espresso in light, glowing orange in dark)
- **Border:** border-default-strong
- **Text:** white (cream) in light; black (espresso) in dark
- **Hover:** brand background (orange) in light; brand-strong in dark — the button "lights up"
- **Active:** inset-press
- **Focus ring:** 2px border-brand outline, offset 2px

### Secondary

- **Background:** button-secondary (rust)
- **Border:** border-default-strong
- **Text:** white (cream)
- **Hover:** brand-strong background
- **Active:** inset-press
- **Focus ring:** 2px border-brand outline, offset 2px

### Tertiary (neutral bordered)

- **Background:** neutral-primary-soft
- **Border:** border-default
- **Text:** heading color
- **Hover:** neutral-secondary-medium background
- **Active:** inset-press
- **Focus ring:** 2px border-brand outline, offset 2px

### Success

- **Background:** success token
- **Border:** border-success
- **Text:** white (cream)
- **Hover:** success-strong background
- **Active:** inset-press

### Danger

- **Background:** danger token
- **Border:** border-danger
- **Text:** white (cream)
- **Hover:** danger-strong background
- **Active:** inset-press

### Warning

- **Background:** warning token
- **Border:** border-warning
- **Text:** white (cream)
- **Hover:** warning-strong background
- **Active:** inset-press

### Ghost (NO border fill, NO shadow)

- **Background:** transparent
- **Border:** transparent (becomes border-default on hover, optional)
- **Text:** heading color
- **Hover:** neutral-secondary-medium background
- **Active:** neutral-secondary-strong background
- **Focus ring:** 2px border-brand outline, offset 2px
- Used for menu-bar items and low-emphasis actions.

### Disabled (NO hover, NO active)

- **Background:** disabled token
- **Border:** border-default-subtle
- **Text:** fg-disabled color
- **Cursor:** not-allowed
- **No hover, no focus ring, no press**

## Icons in Buttons

- Icon size: 14–16px
- Spacing: 6px gap between icon and label
- Layout: inline-flex, vertically centered
- Icon-only buttons stay square (equal padding) with a 3px radius.

# Cards / Windows

> Dependencies: `colors.md`, `radius.md`, `shadows.md`, `borders.md`, `typography.md`

In this system a "card" is a **window** — a framed panel modeled on a vintage OS window. Most content containers should adopt the window pattern: a **title bar** on top of a **body**. Plain borderless cards do not belong here.

## Anatomy

```
┌───────────────────────────────┐  ← 1px border-default frame, 3px radius
│ ● ●  Window Title          ▢ ✕ │  ← title bar (menu-bar surface, bottom border)
├───────────────────────────────┤
│                               │
│  Body content on              │  ← neutral-primary-soft surface
│  neutral-primary-soft         │
│                               │
└───────────────────────────────┘  ← shadow-window when floating
```

## Core Specs

- **Frame:** 1px solid `border-default`, 3px radius (`base`). The active/focused window may use `border-default-strong`.
- **Title bar:** `menu-bar` background, 32px tall, 1px `border-default` bottom edge, holds the window title (12–13px, semibold, sans) and optional window controls. Top corners follow the 3px radius; the bottom edge is square where it meets the body.
- **Window controls (optional):** small circular dots (`full` radius, ~10px) or tiny bordered squares for minimize/expand/close, sized to match the title-bar height. Decorative-but-accessible: real controls need labels/ARIA.
- **Body:** `neutral-primary-soft` background, 20–24px padding.
- **Shadow:** `shadow-window` when the window floats over the wallpaper; `shadow-none` for windows that sit in-flow within a page layout.

## Card Heading

- The window **title** (in the title bar) is the container label: 12–13px, semibold, sans, heading color.
- A content heading _inside_ the body uses the serif scale (see `typography.md`): desktop 18–22px, mobile 16–18px, medium weight, heading color.
- Never skip heading levels — the page hierarchy must logically arrive at the card heading level.

## Variants

### Window Card (default)

- Full anatomy: title bar + body.
- Frame: 1px border-default, 3px radius.
- Floating: shadow-window. In-flow: shadow-none.

### Panel (title-less)

- A simpler bordered panel for nested/secondary content: 1px border-default, 3px radius, `neutral-primary-soft` (or `neutral-secondary-soft` for inset/recessed panels), no title bar, no shadow.

## States

### Static (no interactivity)

- No hover styles. Non-interactive windows/panels must NOT have hover background changes.

### Interactive (clickable card / opens a window)

- Same base styles.
- Hover: `neutral-secondary-medium` body background, and/or border shifts to `border-default-strong`.
- Active: `inset-press` shadow.
- Cursor: pointer.

## Rules

- Default container = **window** (title bar + body). Reach for a title-less **panel** only for nested/secondary content.
- Frame: always 1px `border-default`; 3px radius.
- Body surface: `neutral-primary-soft`. Inset/recessed panels: `neutral-secondary-soft`.
- Title bar surface: `menu-bar`, with a 1px bottom border.
- Floating windows use `shadow-window`; in-flow cards use no shadow.
- Non-interactive cards: no hover styles.
- Never round corners beyond 3px (except true pill/dot controls).

# Color Tokens

A warm, nostalgic desktop-OS palette: toasted cream surfaces, espresso-brown ink, and a glowing orange accent that powers the "wallpaper", folder icons, and primary actions. Light mode reads like a sun-faded vintage manual; dark mode like a CRT terminal at night.

## Background Tokens

### Neutral

| Token                    | Light   | Dark    |
| ------------------------ | ------- | ------- |
| neutral-primary-soft     | #FFEEDD | #221811 |
| neutral-primary          | #FFEEDD | #1F150E |
| neutral-primary-medium   | #F6E3D2 | #2A1E15 |
| neutral-primary-strong   | #ECD9C8 | #30231B |
| neutral-secondary-soft   | #F6E6D6 | #2A1E15 |
| neutral-secondary        | #E5D4C5 | #30231B |
| neutral-secondary-medium | #DBC8B6 | #3A2A1F |
| neutral-secondary-strong | #CDB7A1 | #463225 |
| neutral-tertiary-soft    | #EADAC9 | #2A1E15 |
| neutral-tertiary         | #DBC8B6 | #30231B |
| neutral-tertiary-medium  | #CDB7A1 | #3A2A1F |
| neutral-quaternary       | #C3A98E | #463225 |
| quaternary-medium        | #B79A7E | #5A4233 |
| gray                     | #8D6C5D | #7F6759 |

### Brand (orange accent — the signature glow)

| Token        | Light   | Dark    |
| ------------ | ------- | ------- |
| brand-softer | #FFF1EB | #2E1C12 |
| brand-soft   | #FFD2B8 | #3C2519 |
| brand        | #FF631A | #FF9A63 |
| brand-medium | #FFBA94 | #4A3120 |
| brand-strong | #D94A00 | #FFB07E |

### Status

| Token          | Light   | Dark    |
| -------------- | ------- | ------- |
| success-soft   | #E2F4DB | #182A14 |
| success        | #2F6C2D | #6FBF6A |
| success-medium | #CDEAC4 | #20361C |
| success-strong | #1F4F1D | #98E2A8 |
| danger-soft    | #FFF1EB | #2E1410 |
| danger         | #B0300A | #FF8F7E |
| danger-medium  | #F6DDD2 | #4A1A12 |
| danger-strong  | #7A2200 | #FFB0A3 |
| warning-soft   | #FFEFD6 | #2E2110 |
| warning        | #C2410C | #E5A85A |
| warning-medium | #FBE3C0 | #46341A |
| warning-strong | #8A4A08 | #F0C58A |

### Desktop / OS surfaces (retro-specific)

These power the desktop metaphor: the wallpaper, the menu bar, window primary actions, folder icon bodies, and code/terminal panes.
| Token | Light | Dark | Role |
|---|---|---|---|
| bg-desktop | #FF631A | #7F492F | Wallpaper / desktop backdrop behind windows |
| bg-fourth | #8D6C5D | #7F6759 | Muted brown used for chrome borders & folder outlines |
| menu-bar | #E5D4C5 | #30231B | Fixed top menu bar surface |
| button-primary | #3F1400 | #FF9A63 | Primary action fill (espresso in light, glowing orange in dark) |
| button-secondary | #9D3200 | #BE7247 | Secondary action fill (rust) |
| button-tertiary | #8D6C5D | #7F6759 | Tertiary action fill (taupe) |
| code-bg | #2B1B11 | #130D09 | Code blocks / terminal background |
| code-text | #FFE6D1 | #EAD7C4 | Code blocks / terminal foreground |

### Button Pressed/Inset (CSS custom properties, used for the retro "pushed key" inset)

Buttons here are flat — no glossy glint. A pressed (`:active`) state uses an inset shadow to feel like a physical key going down.
| Variable | Light | Dark |
|---|---|---|
| `--inset-press` | rgba(56,28,0,0.28) | rgba(0,0,0,0.55) |

### Utility

| Token       | Light   | Dark    |
| ----------- | ------- | ------- |
| dark        | #3F1400 | #2A1E15 |
| dark-strong | #2A0E00 | #1F150E |
| disabled    | #E5D4C5 | #30231B |

### Accent (theme-switchable hues; orange is the default)

| Token   | Value (same both modes) |
| ------- | ----------------------- |
| purple  | #8B58DD                 |
| sky     | #2D7FF0                 |
| teal    | #2F9B7A                 |
| pink    | #D94A6E                 |
| cyan    | #2F9B9B                 |
| fuchsia | #B03990                 |
| indigo  | #55308C                 |
| orange  | #FF631A                 |

## Text Color Tokens

### Base

| Token       | Light   | Dark    |
| ----------- | ------- | ------- |
| white       | #FFF6EE | #FFF6EE |
| black       | #381C00 | #381C00 |
| heading     | #381C00 | #F2DFCB |
| body        | #4A3826 | #E4D3C0 |
| body-subtle | #6C5945 | #C3AB97 |

### Brand

| Token           | Light   | Dark    |
| --------------- | ------- | ------- |
| fg-brand-subtle | #C26A3A | #FFB07E |
| fg-brand        | #9D3200 | #FF9A63 |
| fg-brand-strong | #7A2200 | #FFB07E |

### Status

| Token             | Light   | Dark    |
| ----------------- | ------- | ------- |
| fg-success        | #2F6C2D | #79CA8E |
| fg-success-strong | #1F4F1D | #98E2A8 |
| fg-danger         | #7A2200 | #FF8F7E |
| fg-danger-strong  | #5A1800 | #FFB0A3 |
| fg-warning-subtle | #C2410C | #E5B57A |
| fg-warning        | #8A4A08 | #F0C58A |
| fg-disabled       | #A8917C | #7F6B59 |

### Informational / Accent

| Token            | Light   | Dark    |
| ---------------- | ------- | ------- |
| fg-yellow        | #B8860B | #E5C97A |
| fg-info          | #184B8F | #7EB0FF |
| fg-purple        | #7242BB | #BB93FF |
| fg-purple-strong | #55308C | #D0B3FF |
| fg-cyan          | #2F8A8A | #7FB8B8 |
| fg-indigo        | #55308C | #A78FB5 |
| fg-pink          | #C03A6A | #E59AB0 |
| fg-lime          | #4C8A2D | #98D27E |

## Border Color Tokens

Retro chrome leans on one workhorse border — a muted taupe-brown (`border-default` = `bg-fourth`). Borders are crisp, 1px, and always visible; they define every window, control, and panel.

| Token                 | Light   | Dark    |
| --------------------- | ------- | ------- |
| border-dark           | #3F1400 | #A8876F |
| border-buffer         | #FFEEDD | #221811 |
| border-buffer-medium  | #F6E3D2 | #2A1E15 |
| border-buffer-strong  | #E5D4C5 | #30231B |
| border-muted          | #EADAC9 | #2A1E15 |
| border-light-subtle   | #E5D4C5 | #2A1E15 |
| border-light          | #DBC8B6 | #30231B |
| border-light-medium   | #CDB7A1 | #3A2A1F |
| border-default-subtle | #C3A98E | #5A4233 |
| border-default        | #8D6C5D | #7F6759 |
| border-default-medium | #6C5945 | #8A6F5C |
| border-default-strong | #3F1400 | #A8876F |
| border-success-subtle | #CDEAC4 | #20361C |
| border-success        | #2F6C2D | #6FBF6A |
| border-danger-subtle  | #F6DDD2 | #4A1A12 |
| border-danger         | #B0300A | #FF8F7E |
| border-warning-subtle | #FBE3C0 | #46341A |
| border-warning        | #C2410C | #E5A85A |
| border-brand-subtle   | #FFD2B8 | #4A3120 |
| border-brand-light    | #FFBA94 | #BE7247 |
| border-brand          | #FF631A | #FF9A63 |
| border-dark-subtle    | #6C5945 | #5A4233 |
| border-purple         | #8B58DD | #8B58DD |
| border-orange         | #FF631A | #FF9A63 |

## Semantic Usage Rules

- **Wallpaper vs. windows:** `bg-desktop` (orange) is the backdrop _behind_ windows only. Window/card/panel content surfaces use `neutral-primary-soft` (cream / espresso).
- Page/section backgrounds: neutral-primary-soft (default), neutral-secondary-soft (alternating/inset panels).
- Top menu bar: `menu-bar` background with a 1px `border-default` bottom edge.
- Primary buttons: `button-primary` fill (espresso ink in light, glowing orange in dark) with cream/espresso text respectively.
- Secondary buttons: `button-secondary` (rust). Tertiary buttons: `button-tertiary` (taupe) or a bordered neutral button.
- Headings: heading text color. Body text: body color. Captions/meta: body-subtle.
- Links / CTAs: fg-brand text color, underlined.
- Default borders: border-default (taupe-brown) — the defining line of all retro chrome.
- Status borders match intent: success → border-success, danger → border-danger, warning → border-warning.
- Code / terminal panes: code-bg background with code-text foreground.
- Disabled: disabled background + fg-disabled text.

## Prohibited

- No raw hex/rgb values in component code — always use design tokens.
- No brand text color for long-form paragraphs.
- No accent text tokens (fg-purple, etc.) for body copy or navigation.
- Do NOT use the orange `bg-desktop` as a content/section surface — it is wallpaper only. Content lives on cream/espresso window surfaces.
- No manual light/dark value swapping — let the CSS custom properties handle it.
- No soft pastel/glassy fills — surfaces are opaque, warm, and bordered.

# Content & Grid System

> Dependencies: `layout.md`, `typography.md`

## Containers

| Type               | Max width    | Horizontal padding             |
| ------------------ | ------------ | ------------------------------ |
| Standard           | 1100px       | 16px (mobile) / 24px (desktop) |
| Window body        | window width | 20–24px body padding           |
| Internal (reading) | 720px        | — (45–75 char line length)     |

## Vertical Padding

| Breakpoint        | Vertical padding                       |
| ----------------- | -------------------------------------- |
| Mobile            | 32px                                   |
| Tablet (≥768px)   | 48px                                   |
| Desktop (≥1024px) | 64px or 96px for hero/feature sections |

## Grid System

Mobile-first with flexible desktop configurations.

| Context                          | Gap  |
| -------------------------------- | ---- |
| Standard content/cards (windows) | 24px |
| Compact widgets/metadata         | 16px |
| Desktop icon grid                | 16px |

### Responsive Columns

| Breakpoint            | Columns |
| --------------------- | ------- |
| Mobile (default)      | 1–2     |
| Small/Tablet (≥640px) | 2–4     |
| Desktop (≥1024px)     | 3–12    |

Full support for 6, 7, 8, 9+ column grids where needed.

## Breakpoints

| Name           | Width  |
| -------------- | ------ |
| Small          | 640px  |
| Medium         | 768px  |
| Large          | 1024px |
| Extra large    | 1280px |
| 2x Extra large | 1536px |

## Rules

- Always design mobile-first
- Use layout shifts (column → row) to accommodate horizontal space
- Lists: 24px indentation, 8px vertical gap between items
- Body copy: 15px, 1.65 line-height (sans)
- All interactive links follow brand (rust) underline/hover protocol

# Dropdown

> Dependencies: `colors.md`, `radius.md`, `shadows.md`, `inputs.md`

## Core Specs

### Chevron Icon

- Size: 16x16px
- Spacing: 6px left margin, -2px right margin
- Color: inherits from trigger button

### Menu Container

- Background: neutral-primary-soft
- Border: 1px, border-default
- Radius: 3px (base)
- Shadow: shadow-menu (warm directional)
- Z-index: elevated above content

### Menu List

- Padding: 4px
- Font: 13px sans, body color, medium weight

### Menu Item

- Layout: inline-flex, vertically centered, full width
- Padding: 8px horizontal, 6px vertical
- Radius: 3px (default)
- Hover: neutral-secondary-medium background, heading text
- Transition: colors, 120ms

## Trigger Sizes

| Size  | Font size | Horizontal padding | Vertical padding |
| ----- | --------- | ------------------ | ---------------- |
| Small | 14px      | 12px               | 8px              |
| Base  | 14px      | 16px               | 10px             |
| Large | 16px      | 20px               | 12px             |

## Icon-only Trigger

- Padding: 8px
- Min size: 44x44px
- Icon: 20x20px

## Variants

### Default

- Menu width: 176px, items have 3px radius

### With Divider

- Top border (border-default) between child groups, skip first group

### With Header

- Header padding: 16px horizontal, 12px vertical
- Bottom border: border-default
- Name: heading color, 14px, semibold weight
- Email: body-subtle color, 14px, truncated

### With Icons

- Icon before label: 16x16px, 8px right margin, body color
- On hover, icon color changes to heading

### With Checkbox / Radio

- Inputs: 16x16px, 2px radius, focus outline in border-brand
- Helper text: 12px, body-subtle color, 2px top margin

### With Search

- Search input at top of menu following `inputs.md` specs
- Left icon: 12px left padding, input 36px left padding

### Scrollable

- Max height: 192px, vertical scroll overflow

## States

| State            | Appearance                                              |
| ---------------- | ------------------------------------------------------- |
| Focused trigger  | 2px border-brand outline, 2px offset                    |
| Hover item       | neutral-secondary-medium background, heading text       |
| Active/open item | neutral-tertiary-soft background, heading text          |
| Disabled item    | fg-disabled text, not-allowed cursor, no pointer events |

# Icon Shapes

> Dependencies: `colors.md`, `radius.md`

## Core Specs

- Box sizing: border-box
- Icon must be perfectly centered (inline-flex, centered both axes)
- Circle: fully rounded (999px)
- Squared (default, retro): 3px radius at every size, with a 1px border-default frame

Prefer the **squared** (3px) shape — it matches the OS-icon aesthetic. Use circle only when a round container is explicitly wanted.

## Sizes

| Size | Container | Icon    |
| ---- | --------- | ------- |
| XS   | 24x24px   | 14x14px |
| SM   | 32x32px   | 16x16px |
| MD   | 40x40px   | 20x20px |
| LG   | 48x48px   | 24x24px |
| XL   | 56x56px   | 28x28px |

## Color Variants

### Brand

- Shape: squared (3px)
- Background: brand-softer
- Border: border-brand-subtle
- Icon color: fg-brand-strong

### Gray

- Shape: squared (3px)
- Background: neutral-secondary-soft
- Border: border-default
- Icon color: body

### Danger

- Shape: squared (3px)
- Background: danger-soft
- Border: border-danger-subtle
- Icon color: fg-danger-strong

### Success

- Shape: squared (3px)
- Background: success-soft
- Border: border-success-subtle
- Icon color: fg-success-strong

### Warning

- Shape: squared (3px)
- Background: warning-soft
- Border: border-warning-subtle
- Icon color: fg-warning

# Inputs

> Dependencies: `colors.md`, `radius.md`

## Core Specs

- **Display:** block, full width
- **Radius:** 3px (base) — sharp, like a recessed OS field
- **Border:** 1px, border-default
- **Background:** neutral-secondary-soft (slightly recessed/inset against the window body)
- **Shadow:** none (the border defines the field)
- **Font:** 13px sans, heading color
- **Padding:** 10px horizontal, 7px vertical
- **Placeholder:** body-subtle color
- **Transition:** border-color and background-color, 120ms

## Label

- Display: block
- Font: 13px sans, medium weight, heading color
- Margin bottom: 6px
- Label `htmlFor` must match the input `id`

## States

### Default

- Border: border-default
- Background: neutral-secondary-soft

### Hover

- Border: border-default-strong

### Focus

- Border: border-brand
- Outline: 2px solid border-brand, 2px offset (visible retro focus outline)

### Success

- Border: border-success
- Focus outline: 2px border-success, 2px offset

### Error / Danger

- Border: border-danger
- Focus outline: 2px border-danger, 2px offset

### Disabled

- Background: disabled
- Text: fg-disabled
- Cursor: not-allowed

## Input with Icons

- Icon size: 16x16px
- Icon color: body
- Container: relative positioned wrapper
- Start icon: absolutely positioned left, 12px left padding — input gets 36px left padding
- End icon: absolutely positioned right, 12px right padding — input gets 36px right padding
- Icons vertically centered within the wrapper

## Rules

- Every input must have a unique `id`
- Every label must have a matching `htmlFor`
- Padding: 10px horizontal, 7px vertical unless overridden for icon variants
- No arbitrary hex or hardcoded colors

# Layout & Spacing

This system is organized around a **desktop-OS metaphor**: an orange wallpaper backdrop (`bg-desktop`), a fixed top menu bar, and content presented inside bordered "windows". Spacing is tighter and more utilitarian than a typical marketing site — it should feel like a well-organized application, not an airy landing page.

## Spacing Rhythm

Base unit: **4px**. Spacing values are multiples of 4px (8px is the most common step).

| Context                                         | Value                          |
| ----------------------------------------------- | ------------------------------ |
| Menu-bar height                                 | 36px                           |
| Window title-bar height                         | 32px                           |
| Window body padding                             | 20px or 24px                   |
| Section vertical padding (within a window/page) | 48px or 64px                   |
| Section header → content                        | 32px or 48px                   |
| Heading → paragraph                             | 12px                           |
| Flex/grid row gap                               | 12px or 16px                   |
| Card/window grid gap                            | 16px or 24px                   |
| Desktop icon grid gap                           | 16px                           |
| Container horizontal padding                    | 16px (mobile) / 24px (desktop) |

## Container

Standard content container: max-width 1100px, centered, 24px horizontal padding. Inside a window, content respects the window body padding instead.

## The Desktop Shell

A typical page is composed as:

1. **Wallpaper** — full-viewport `bg-desktop` (orange) backdrop. No content sits directly on it except desktop icons.
2. **Menu bar** — fixed top bar (36px), `menu-bar` surface, 1px `border-default` bottom edge, holds the app/brand mark and menu items.
3. **Desktop icons** (optional) — folder-style icons with a label, arranged top-left.
4. **Windows** — one or more bordered windows (see `cards.md`) floating on the wallpaper, each with a title bar and body. Long-form content lives inside a window body.

## Content Composition Order

Inside each window/section, follow this order:

1. Title bar / heading (`h1`–`h3`, serif)
2. Leading paragraph
3. Normal paragraph(s)
4. Lists, CTA links, or component grids

## Motion & Animation

- Prefer CSS-native: `transition`, `animation`, `@keyframes`. Use a motion library only when CSS cannot achieve the behavior.
- Lean into the OS metaphor: windows can fade/scale-in on open, a brief "boot/loading" sheen, staggered desktop-icon reveals. Keep durations short (120–220ms) and snappy — retro UIs feel responsive, not floaty.
- Hover/press feedback is immediate: a fill shift on hover, an inset press on `:active`.
- Reserve scroll-triggered transitions for moments that reinforce hierarchy.

## Backgrounds & Visual Depth

- Depth comes from **borders + warm directional shadows**, not gradients or glass.
- The orange wallpaper provides the atmospheric color; windows are opaque cream/espresso panels layered on top with `shadow-window`.
- Optional period-appropriate texture (subtle paper grain, faint scanlines, dithered patterns) is welcome on the wallpaper but must never reduce content legibility.
- Every decorative element must serve a compositional purpose (depth, separation, emphasis).

## Must

- Wallpaper = `bg-desktop` only; all real content lives inside bordered windows on cream/espresso surfaces.
- Consistent 4px-based spacing; avoid crowded or uneven gaps.
- Every window carries a 1px `border-default` frame and a title bar.
- Layouts readable and properly spaced on both desktop and mobile (windows may go full-width / stack on small screens).

# Lists

> Dependencies: `colors.md`

## Core Specs

- Item spacing: 16px vertical gap between list items
- Text: body color

## List Icons

- Size: 20x20px
- Prevent squishing: no shrink
- Spacing: 6px right margin between icon and text
- Active/featured icon: fg-brand color
- Neutral icon: body color

## Inactive / Disabled Items

Strikethrough text with body color decoration on the list item.

## Pattern

Vertical flex list with 16px gap. Each item is a flex row with centered alignment — icon (20x20, no-shrink, 6px right margin) followed by a span of body-colored text.

# Modals

> Dependencies: `colors.md`, `radius.md`, `shadows.md`, `buttons.md`, `inputs.md`

A modal is a **floating window dialog** — same anatomy as a window (see `cards.md`): a title bar with a label and close control, sitting over a dimmed wallpaper.

## Core Specs

### Overlay (Backdrop)

- Fixed, covers full screen
- Z-index: 40
- Background: the espresso ink / black at ~55% opacity (warm dim, not neutral gray)
- Backdrop blur: small amount, optional

### Content Container (Window)

- Background: neutral-primary-soft
- Border: 1px border-default-strong (active-window frame)
- Radius: 3px (base)
- Shadow: shadow-window
- Padding: 0 (header/body/footer manage their own padding)

## Anatomy

### Title Bar (Header)

- Background: menu-bar surface
- Height: 32px (or auto with 8px vertical padding for taller dialogs)
- Bottom border: 1px border-default
- Title: 12–13px, semibold, sans, heading color (left aligned)
- Close control: small bordered/dot control on the right (Ghost button from `buttons.md`, 4px padding) with an accessible label

### Body

- Padding: 20px
- Vertical spacing between elements: 16px
- Heading inside body (if any): serif scale per `typography.md`
- Text: 14px sans, 1.5 line-height, body color

### Footer

- Top border: border-default
- Padding: 12px 20px
- Action buttons right-aligned (primary + secondary per `buttons.md`)

## Variants

### Default (Information)

Standard header + body + footer with primary/secondary action buttons.

### Pop-up (Confirmation)

A classic system alert dialog. Centered text, prominent icon, reduced padding:

- Body: 20px padding, text centered
- Icon: centered, 12px bottom margin, 40x40px, in a squared icon-shape per `icon-shapes.md`

### Form Modal

Body contains inputs following `inputs.md`. Vertical spacing between form elements: 16px.

## Rules

- Backdrop covers full screen with fixed positioning (warm espresso dim, not gray)
- Content is a window: neutral-primary-soft background, 1px border-default-strong frame, 3px radius, shadow-window
- Title bar uses the menu-bar surface with a 1px bottom border
- Header/Footer separated by border-default borders
- Close control must be present, labeled, and functional
- Accessibility: `role="dialog"`, implement focus trap in code
- Dark mode automatic via token system

# Pagination

> Dependencies: `colors.md`, `radius.md`

## Container

Font: 13px sans (mono is fine for page numbers, tabular-nums). Items displayed as flex with -1px overlap for seamless borders.

## Pagination Item

- Layout: flex, centered both axes
- Size: 34x34px (or 36x36px)
- Text: body color, medium weight
- Background: neutral-secondary-soft
- Border: 1px, border-default
- Hover: neutral-secondary-medium background, heading text
- Focus: 2px border-brand outline, 2px offset
- Overlap: -1px left margin

## Previous / Next Buttons

- Horizontal padding: 12px, height: 34px
- First item: 3px radius on inline-start side
- Last item: 3px radius on inline-end side

## Active Page Item

- Text: cream/espresso text on button-primary background
- Background: button-primary
- Hover text: stays the same

## Rules

- Display as flex with -1px child overlap for seamless borders
- Items: neutral-secondary-soft background, border-default border, body text
- Active: button-primary background with cream/espresso text
- First item: rounded start (3px), Last item: rounded end (3px)
- All items need hover and focus states (focus = 2px border-brand outline, offset 2px)

# Radios, Checkboxes & Toggles

> Dependencies: `colors.md`, `radius.md`

## Checkbox

- Size: 16x16px
- Radius: 2px (sharp, near-square)
- Border: 1px, border-default
- Background: neutral-secondary-soft
- Checked: button-primary fill, cream/espresso checkmark
- Focus: 2px border-brand outline, 2px offset

### Disabled

- Border: border-light
- Text: fg-disabled

## Radio

- Size: 16x16px
- Radius: fully rounded (999px)
- Border: 1px, border-default
- Background: neutral-secondary-soft
- Focus: 2px border-brand outline, 2px offset
- Checked: border-brand, indicator: button-primary fill dot

### Disabled

- Border: border-light-medium
- Text: fg-disabled

Group all radio items under the same `name` attribute.

## Toggle

### Track

- Fully rounded (999px), 1px border-default
- Background: neutral-quaternary
- Focus-within: 2px border-brand outline, 2px offset
- Checked track: brand background
- Disabled track: neutral-tertiary background

### Thumb

- Fully rounded (999px)
- Background: white (cream)
- Border: 1px border-default

### Disabled

- Track: neutral-tertiary background
- Label: fg-disabled text

## Rules

- All selection inputs must have `id` matching label `htmlFor`
- Focus states use a 2px border-brand outline offset 2px (no soft glow)
- Selection controls carry a visible 1px border-default at rest
- Disabled states: no hover/focus interaction

# Border Radius

This is a **sharp-cornered** system. Corners are barely rounded — just enough to soften a pixel edge, never enough to read as "modern rounded UI". The retro desktop look depends on crisp, near-square corners.

| Token | Value | Default usage                                                                              |
| ----- | ----- | ------------------------------------------------------------------------------------------ |
| base  | 3px   | Windows, cards, buttons, inputs, modals, menus, badges, panels — almost everything         |
| sm    | 2px   | Checkboxes, tiny chips, nested controls                                                    |
| none  | 0     | Edge-to-edge elements: menu-bar, full-bleed dividers, window title bars flush to the frame |
| full  | 999px | Pills, status dots, toggles, radio dots, circular avatars                                  |

## Rules

- **3px is the default radius across the entire product.** When in doubt, use 3px.
- Never use 8px, 12px, 16px or other "soft" radii — they break the retro chrome.
- A window and its title bar share the same outer radius; the title bar's bottom corners stay square where it meets the body.
- Radius must be consistent within each component family.
- Only true pills, dots, toggles, and circular avatars may use `full`.

# Shadows

Shadows here are **warm and directional** — tinted with the espresso-brown ink color (not neutral gray) so they read like sunlight falling across a physical desktop. They are used sparingly: flat chrome rarely needs elevation, but floating surfaces (windows, menus, popovers, modals) lift clearly off the wallpaper.

The shadow color is the brown ink at low alpha in light mode, and near-black in dark mode (resolved via custom properties `--shadow-window`, `--shadow-window-active`, `--shadow-menu`).

| Token          | Light value                                                     | Dark value                                                  | Use                                                       |
| -------------- | --------------------------------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------- |
| shadow-none    | none                                                            | none                                                        | Flat, in-flow chrome (buttons, inputs, badges, list rows) |
| shadow-menu    | `0 5px 16px rgba(56,28,0,0.15)`                                 | `0 5px 16px rgba(0,0,0,0.40)`                               | Dropdowns, context menus, popovers, tooltips              |
| shadow-menu-lg | `0 8px 22px rgba(56,28,0,0.15)`                                 | `0 8px 22px rgba(0,0,0,0.40)`                               | Larger floating menus, command palettes                   |
| shadow-window  | `0 4px 10px rgba(56,28,0,0.18), 0 20px 38px rgba(56,28,0,0.28)` | `0 4px 10px rgba(0,0,0,0.46), 0 20px 38px rgba(0,0,0,0.62)` | Windows, modals, prominent floating cards                 |
| inset-press    | `inset 0 2px 4px rgba(56,28,0,0.28)`                            | `inset 0 2px 4px rgba(0,0,0,0.55)`                          | `:active` pressed-key feedback on buttons/controls        |

## Component Mapping

| Component type                                                  | Token                                               |
| --------------------------------------------------------------- | --------------------------------------------------- |
| Buttons, inputs, badges, inline chips, list rows, in-flow cards | shadow-none                                         |
| Dropdowns, popovers, tooltips, context menus                    | shadow-menu                                         |
| Large floating menus / palettes                                 | shadow-menu-lg                                      |
| Windows, modals, dialogs, dragged/active windows                | shadow-window                                       |
| Pressed (`:active`) buttons and controls                        | inset-press (combine with the control's own border) |

## Rules

- The default for in-flow, bordered chrome is **shadow-none** — the 1px border does the separation work, not a shadow.
- Floating surfaces (anything that overlays content) get exactly one of the menu/window tokens. Never stack two elevation tokens.
- Shadows are tinted brown/black via the custom properties — never use neutral gray shadows.
- Use `shadow-window` only for true overlay surfaces; never for dense list items or body containers.
- `inset-press` is the only inset shadow and is reserved for the pressed state.

# Sidebars

> Dependencies: `colors.md`, `radius.md`, `typography.md`, `badges.md`, `alerts.md`

## Core Specs

- Background: neutral-primary-soft
- Right border: 1px, border-default (for left-sidebar); left border for right-sidebar
- Width: 256px

## Anatomy

### Outer Container

Hidden on mobile, visible at small breakpoint. Needs a toggle/trigger for mobile.

### Inner Wrapper

- Full height, vertical scroll overflow
- Padding: 12px horizontal, 16px vertical

### Navigation List

- Vertical spacing: 8px between items
- Font weight: medium

### Navigation Item

- Layout: flex, vertically centered
- Padding: 8px horizontal, 7px vertical
- Text: heading color
- Radius: 3px (base)
- Hover: neutral-secondary-medium background
- Transition: colors, 120ms
- Icon: 18x18px, body color, hover → heading color
- Label: 10px left margin from icon (sans, 13px)

### Active Item

- Background: neutral-secondary-strong
- Text: fg-brand-strong

### Separator

- 16px top padding, 16px top margin
- Top border: border-default
- 8px vertical spacing below

### Bottom CTA / Card

- Padding: 16px
- Top margin: 24px
- Radius: 3px (base)
- Border: 1px border-default
- Background: brand-softer
- Can also use any alert variant from `alerts.md`

## Rules

- Responsive: hidden on mobile with a trigger mechanism
- Icons: 20x20px, body color (hover: heading color)
- Multi-level menus: indent with 44px left padding
- Spacing follows 8px grid
- Only neutral, brand, or status tokens — no arbitrary colors

# Tables

> Dependencies: `colors.md`, `radius.md`, `shadows.md`

## Wrapper

- Horizontal scroll overflow
- Background: neutral-primary-soft
- Radius: 3px (base)
- Border: 1px, border-default
- Shadow: none (bordered, in-flow). A table presented as its own window may use shadow-window.

## Table Element

- Full width, left-aligned text (right-aligned for RTL)
- Font: 13px sans, body color (mono is appropriate for numeric/ID columns, tabular-nums)

## Table Head

- Font: 12px sans, body color, semibold weight (optionally uppercase, 0.4px letter-spacing — a "column header" system look)
- Background: menu-bar surface
- Bottom border: border-default
- Cell padding: 16px horizontal, 9px vertical

## Table Body

- Row background: neutral-primary-soft
- Row bottom border: border-default-subtle (omit on last row to avoid doubling with wrapper border)
- Row hover: neutral-secondary-soft background (optional)
- Row header: medium weight, heading color, no-wrap
- Cell padding: 16px horizontal, 10px vertical

## Rules

- Wrapper must have horizontal scroll overflow for responsive scrolling
- Last row: omit bottom border to avoid doubling with wrapper border
- Row headers: always `scope="row"` for semantic structure
- Hover on rows is optional
- No arbitrary hex codes — use token colors only

# Tabs

> Dependencies: `colors.md`, `radius.md`, `shadows.md`

## Core Specs

- Typography: 13px sans, medium weight, body color
- Transitions: colors, 120ms

## Variants

### 1. Underline (Default)

**Wrapper:** bottom border, border-default

**Tab Item:**

- Padding: 14px horizontal, 10px vertical
- Bottom border: 2px, transparent
- Top corners: 3px radius
- Transition: colors, 120ms

| State    | Appearance                                                                           |
| -------- | ------------------------------------------------------------------------------------ |
| Active   | fg-brand text, border-brand bottom border                                            |
| Inactive | transparent bottom border; hover → heading text, border-default-strong bottom border |
| Disabled | fg-disabled text, not-allowed cursor                                                 |

### 2. Pills

**Tab Item:**

- Padding: 14px horizontal, 7px vertical
- Radius: 3px (base)
- Border: 1px border-default
- Font weight: medium
- Transition: colors, 120ms

| State    | Appearance                                                           |
| -------- | -------------------------------------------------------------------- |
| Active   | button-primary background, cream/espresso text, inset-press feel     |
| Inactive | body text; hover → neutral-secondary-medium background, heading text |
| Disabled | fg-disabled text, not-allowed cursor                                 |

### 3. Full Width

Children overlap with -1px left margin on all except first.

**Tab Item:**

- Full width, centered text
- Padding: 14px horizontal, 10px vertical
- Background: neutral-primary-soft
- Border: 1px, border-default
- Transition: colors, 120ms
- Hover: neutral-secondary-medium background, heading text

| State      | Appearance                                  |
| ---------- | ------------------------------------------- |
| Active     | neutral-secondary background, fg-brand text |
| First item | rounded start (3px)                         |
| Last item  | rounded end (3px)                           |

## Tabs with Icons

- Icon size: 16x16px or 20x20px
- Spacing: 8px right margin
- Layout: inline-flex, centered
- Icons inherit the text color of the tab state

# Tooltips & Popovers

> Dependencies: `colors.md`, `radius.md`, `shadows.md`

## Tooltips

### Core Specs

- Padding: 8px horizontal, 5px vertical
- Font: 12px sans, medium weight
- Radius: 3px (default)
- Border: 1px (matches variant)
- Shadow: shadow-menu
- Transition: opacity, 120ms

### Dark (Default)

- Background: dark (espresso)
- Text: white (cream)
- Border: border-default-strong

### Light

- Background: neutral-primary-medium
- Text: heading color
- Border: 1px, border-default

## Popovers

A popover is a small floating **window/panel**: bordered, sharp, with a warm directional shadow.

### Core Specs

- Background: neutral-primary-soft
- Radius: 3px (base)
- Shadow: shadow-menu
- Border: 1px, border-default
- Transition: opacity, 120ms

### Header / Title

- Padding: 8px horizontal, 6px vertical
- Background: menu-bar surface
- Bottom border: border-default
- Font: 12–13px sans, semibold weight, heading color

### Body / Content

- Standard: 10px horizontal, 8px vertical padding; 13px, body color
- Rich: 16px padding; 13px, body color

## Arrows

- Size: 8x8px rotated 45deg, with a 1px border-default on the exposed edges
- Color must match the background of the tooltip/popover variant

## Rules

- Tooltips & popovers: 3px radius, always bordered
- Floating shadow: shadow-menu (warm, directional)
- Dark tooltips: espresso background, cream text
- Light tooltips/popovers: semantic neutral background + border tokens
- Arrows match parent background color and border

# Typography

> Dependencies: `colors.md`

Three typefaces work together to create the nostalgic feel:

- **Display / Headings — a literary serif** (e.g. _Newsreader_, fallback Georgia/Times/serif). Gives headings an editorial, old-print character.
- **Body / UI — a clean geometric sans** (e.g. _DM Sans_, fallback system sans-serif). Used for paragraphs, labels, buttons, navigation.
- **Mono — a monospace** (e.g. _Geist Mono_, fallback ui-monospace/monospace). Used for code, terminal panes, timestamps, file metadata, keyboard hints, and "system" labels that should feel machine-printed.

## Core Rules

- **Headings use the serif display font**, heading text color, medium weight (500). They may use a slightly tighter line-height for a nostalgic-print look.
- **Body copy uses the sans font**, body text color. Never use brand/accent color for paragraphs longer than one sentence.
- **Mono is intentional, not decorative** — reserve it for code, timestamps, metadata, file names, and short system labels.
- **Semantic HTML:** Use `h1`–`h6` in order, never skip levels.

## Heading Scale (serif)

### Desktop

| Element | Size | Line-height | Letter-spacing | Margin-bottom |
| ------- | ---- | ----------- | -------------- | ------------- |
| `h1`    | 52px | 1.05        | -0.5px         | 24px          |
| `h2`    | 40px | 1.1         | -0.3px         | —             |
| `h3`    | 32px | 1.15        | —              | —             |
| `h4`    | 26px | 1.2         | —              | —             |
| `h5`    | 22px | 1.3         | —              | —             |
| `h6`    | 18px | 1.35        | —              | —             |

### Responsive

| Element | Tablet (≥768px) | Mobile (default) |
| ------- | --------------- | ---------------- |
| `h1`    | 38px            | 30px             |
| `h2`    | 32px            | 26px             |
| `h3`    | 28px            | 22px             |
| `h4`    | 24px            | 20px             |
| `h5`    | 20px            | 18px             |
| `h6`    | 17px            | 16px             |

Mobile-first: start with mobile sizes, scale up at tablet and desktop breakpoints. Never reduce a heading's line-height below 1.05.

## Paragraphs (sans)

### Leading Paragraph

- Size: 18px
- Weight: normal
- Color: body
- Line-height: 1.65
- Max width: ~70 characters

### Normal Paragraph

- Size: 15px
- Weight: normal
- Color: body
- Line-height: 1.65
- Max width: ~65 characters

### Small Supporting Copy

- Size: 13px
- Weight: normal
- Color: body-subtle
- Line-height: 1.5
- Use only for helper text, legal text, captions, metadata.

## UI Labels (sans, unless noted)

| Context                                 | Size    | Weight                      |
| --------------------------------------- | ------- | --------------------------- |
| Button labels                           | 13–14px | 500 (medium)                |
| Input labels                            | 13–14px | 500 (medium)                |
| Menu-bar items                          | 12–13px | 500–600                     |
| Window title-bar label                  | 12–13px | 600 (semibold)              |
| Captions / meta / badges                | 11–12px | 500 (medium)                |
| Timestamps / file names / system labels | 11–13px | 500, **mono**, tabular-nums |

Do not apply paragraph line-height to control labels.

## Mono Usage

- Code blocks & inline code: mono, `code-text` on `code-bg`.
- Terminal / console panes: mono, `terminal`-style foreground on `code-bg`.
- Timestamps, durations, counts: mono with tabular figures so digits don't shift.
- Short uppercase "system" tags (e.g. `README.TXT`, `v1.0`): mono, uppercase, 0.4px letter-spacing.

## Links

- **Inline links:** Same size as surrounding text, fg-brand (rust) color, underline, hover → no underline.
- **CTA links:** fg-brand color, medium weight, underline, hover → no underline.

## Emphasis

- `<strong>` for high-priority emphasis in body text.
- `<em>` for tone emphasis only, not visual hierarchy.
- All-caps only for short labels: uppercase, 0.4px letter-spacing, 11–12px (often mono).

## Dark Mode

Hierarchy and typefaces stay identical. Only color tokens change (automatic via CSS custom properties). Size, weight, and spacing remain constant.
