# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start Eleventy dev server with live reload
npm run build    # Build static site to _site/
```

No test suite is configured.

## Architecture

This is an **Eleventy 3.0** static site — a creative resume built as a **manila folder desktop experience**. A wooden desk background reveals a manila folder that slides open to expose 4 stacked typewriter-style resume pages.

### Data flow

All resume content lives in a single file: **`src/_data/resume.json`**. Every template reads from this. To update content (experience, skills, projects, philosophy, etc.), edit only this file.

### Template structure

`src/index.njk` → `src/_includes/base.njk` (HTML shell) + 4 page partials:

| Partial | Content |
|---|---|
| `page-one.njk` | Header/contact, hero identity statement, technical skills |
| `page-two.njk` | Professional experience (first 6 roles) |
| `page-three.njk` | Remaining experience + selected work projects |
| `page-four.njk` | Design philosophy, cultural practice, education, languages, accessibility expertise, speaking/writing |

### Styling system

**`src/css/style.css`** uses CSS custom properties for the entire visual theme:
- Wood desk texture via layered `linear-gradient` + `radial-gradient` on `body`
- Manila folder colors, aged cream paper tones, typewriter ink shades
- **Fonts**: Courier Prime (typewriter body), Caveat (handwritten labels — Google Fonts)
- `prefers-reduced-motion` respected throughout — animations disabled, folder opens immediately
- Print styles strip decorative elements and set proper page breaks

### Interactivity

**`src/js/folder-interaction.js`** handles the core UX: folder auto-opens after 800ms on load, toggles on click/Enter/Space, full ARIA keyboard support.

### Custom Eleventy filter

`.eleventy.js` registers an `md` filter (markdown-it) used in templates to render markdown strings from JSON data (primarily experience bullet points in `resume.json`).

### Deployment

GitHub Actions (`.github/workflows/deploy.yml`) triggers on push to `gh-pages` branch → `npm ci` → `npx eleventy` → deploys `_site/` to GitHub Pages.

### Design intent

The site has an **afrofuturist typewriter aesthetic**. When adding sections or visual elements, preserve: aged paper/wood grain textures, Courier Prime typography, the manila folder metaphor, and the staggered page-reveal animation system.

## Frontend Design Skill

When building or refining UI — components, layouts, animations, or visual details — apply this design thinking:

**Before coding**, commit to a bold aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme and execute it with precision — brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, etc.
- **Differentiation**: What makes this unforgettable? What's the one thing someone will remember?

**Aesthetics guidelines**:
- **Typography**: Avoid generic fonts (Arial, Inter, Roboto, Space Grotesk, system fonts). Choose unexpected, characterful fonts that elevate the aesthetic — pair a distinctive display font with a refined body font.
- **Color**: Commit to a cohesive palette using CSS custom properties. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: High-impact moments over scattered micro-interactions. One well-orchestrated page load with staggered reveals (`animation-delay`) creates more delight than many small effects. Use scroll-triggering and hover states that surprise.
- **Spatial composition**: Unexpected layouts. Asymmetry. Overlap. Grid-breaking elements. Generous negative space OR controlled density — pick one.
- **Backgrounds & depth**: Create atmosphere — gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, grain overlays — rather than defaulting to solid colors.

**Never** use overused color schemes (purple gradients on white), predictable layouts, or cookie-cutter patterns that lack context-specific character. No two designs should converge on the same choices.

**Match complexity to vision**: Maximalist designs need elaborate animations and effects. Minimalist designs need restraint, precision, and careful attention to spacing and subtle details. Execute the chosen vision fully.
