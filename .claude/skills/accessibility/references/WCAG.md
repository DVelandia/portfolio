# WCAG 2.2 reference (filtered for a static portfolio)

Adapted from addyosmani/web-quality-skills (`accessibility`), MIT license. Criteria about forms, authentication,
time limits, media players, drag gestures and live captions were removed: the site has none of those. Full list:
https://www.w3.org/WAI/WCAG22/quickref/

## Contents

- [Principles and levels](#principles-and-levels)
- [Level A](#level-a)
- [Level AA](#level-aa)
- [Contrast thresholds](#contrast-thresholds)
- [New in WCAG 2.2](#new-in-wcag-22)
- [Testing tools](#testing-tools)

## Principles and levels

POUR: Perceivable, Operable, Understandable, Robust. Target for this site: level AA (A + AA). AAA items are not
tracked except 7:1 contrast where it comes for free from the palette.

## Level A

| Criterion                           | What it means here                                                  |
| ----------------------------------- | ------------------------------------------------------------------- |
| 1.1.1 Non-text Content              | `alt` on images, `aria-hidden` on decorative SVGs, named icon buttons |
| 1.3.1 Info and Relationships        | Headings, lists and landmarks are real elements, not styled `<div>`s |
| 1.3.2 Meaningful Sequence           | DOM order = visual/reading order (watch grid reordering)            |
| 1.3.3 Sensory Characteristics       | Instructions do not rely on shape, color or position only           |
| 1.4.1 Use of Color                  | Active nav / tags / links also differ by text, icon or underline    |
| 2.1.1 Keyboard                      | All menus, toggles and links work with the keyboard                 |
| 2.1.2 No Keyboard Trap              | Tab leaves every menu; Escape closes it                             |
| 2.2.2 Pause, Stop, Hide             | Nothing auto-moves for more than 5 s without a way to stop it       |
| 2.3.1 Three Flashes                 | No flashing content                                                 |
| 2.4.1 Bypass Blocks                 | Skip link + landmarks                                               |
| 2.4.2 Page Titled                   | Descriptive, unique `<title>` per page and locale                   |
| 2.4.3 Focus Order                   | Focus follows the visual order; menus return focus to the trigger   |
| 2.4.4 Link Purpose (In Context)     | Link text or its `sr-only` suffix says where it goes                |
| 2.5.3 Label in Name                 | Visible button text is contained in its accessible name             |
| 3.1.1 Language of Page              | `<html lang>` = `es` or `en`                                        |
| 3.2.1 / 3.2.2 On Focus / On Input   | Focusing or changing a control does not navigate or change context  |
| 3.2.6 Consistent Help               | Contact links appear in the same place on every page                |
| 4.1.2 Name, Role, Value             | Native elements; `aria-expanded` / `aria-controls` kept in sync     |

## Level AA

| Criterion                           | What it means here                                                  |
| ----------------------------------- | ------------------------------------------------------------------- |
| 1.3.4 Orientation                   | Works in portrait and landscape                                     |
| 1.4.3 Contrast (Minimum)            | Text 4.5:1, large text 3:1, in light AND dark theme                 |
| 1.4.4 Resize Text                   | Usable at 200% zoom                                                 |
| 1.4.5 Images of Text                | Real text, not text baked into images (OG image excluded)           |
| 1.4.10 Reflow                       | No horizontal scroll at 320px wide                                  |
| 1.4.11 Non-text Contrast            | Focus rings, borders, icons 3:1 against background                  |
| 1.4.12 Text Spacing                 | Layout survives increased line height / letter spacing              |
| 1.4.13 Content on Hover or Focus    | Tooltips/menus dismissible with Escape, hoverable, persistent       |
| 2.4.5 Multiple Ways                 | Nav + sitemap + internal links                                      |
| 2.4.6 Headings and Labels           | Headings and `aria-label`s describe the content                     |
| 2.4.7 Focus Visible                 | Visible focus indicator on every control                            |
| 2.4.11 Focus Not Obscured (Minimum) | Fixed header never fully covers the focused element                 |
| 2.5.8 Target Size (Minimum)         | 24x24 CSS px for buttons and icon links (inline text links exempt)  |
| 3.1.2 Language of Parts             | `lang` on inline text in the other language                         |
| 3.2.3 Consistent Navigation         | Same nav order on every page and locale                             |
| 3.2.4 Consistent Identification     | Same icon/label for the same action everywhere                      |
| 4.1.3 Status Messages               | If a status is shown (e.g. "copied"), announce it with `role="status"` |

## Contrast thresholds

| Text size                         | AA minimum | AAA   |
| --------------------------------- | ---------- | ----- |
| Normal text (< 24px / < 19px bold) | 4.5:1      | 7:1   |
| Large text (>= 24px / >= 19px bold) | 3:1        | 4.5:1 |
| UI components, icons, focus rings | 3:1        | 3:1   |

Check every text/background pair for both `.dark` and light tokens from `src/styles/global.css`.

## New in WCAG 2.2

| Change  | Criterion                                   | Level | Applies here |
| ------- | ------------------------------------------- | ----- | ------------ |
| Removed | 4.1.1 Parsing                               | A     | n/a          |
| Added   | 2.4.11 Focus Not Obscured (Minimum)         | AA    | yes (fixed header) |
| Added   | 2.5.8 Target Size (Minimum)                 | AA    | yes          |
| Added   | 3.2.6 Consistent Help                       | A     | yes (contact links) |
| Added   | 2.5.7 Dragging Movements                    | AA    | no drag UI   |
| Added   | 3.3.7 Redundant Entry, 3.3.8 Accessible Auth | A/AA | no forms/auth |

## Testing tools

| Tool                        | Type               | Where                                            |
| --------------------------- | ------------------ | ------------------------------------------------ |
| axe-core (Playwright)       | automated, in repo | `pnpm test:e2e -- tests/e2e/accessibility.spec.ts` |
| Lighthouse CI               | automated, in repo | `pnpm test:lighthouse`                            |
| axe DevTools / WAVE         | browser extension  | https://www.deque.com/axe/ , https://wave.webaim.org/ |
| NVDA                        | screen reader (Win) | https://www.nvaccess.org/                        |
| WebAIM Contrast Checker     | web                | https://webaim.org/resources/contrastchecker/    |
| Chrome DevTools             | rendering panel    | emulate `prefers-reduced-motion`, vision deficiencies |
