# Changelog

## [Release 2.0.0] - 2026-11-06
* **Repository Version:** `2.0.0`
* **Prompt Version:** `2.0.0`
* **Bookmarklet Version:** `2.0.0`

### Added
* **Interactive GitHub Pages Site (`index.html` & `site/index.html`):** Built a responsive, self-contained landing page featuring a live draggable bookmarklet button, one-click Master Prompt copy, interactive "I'm New Here" vs. "Experienced User" pathways, an interactive Creative Pivot translator showcase, and a built-in documentation & file explorer.
* **Adaptive Onboarding in Master Prompt (`prompt/CWOPA-Career-CoPilot.md`):**
  * Upgraded Mode 1 to automatically detect whether the user is pasting an immediate work payload (Veteran fast-path) or arriving for the first time.
  * Added a plain-language welcome message explaining **Creative Pivots** with a concrete private-sector-to-Commonwealth example.
  * Added a guided conversational Experience Profile Builder for users who do not yet have a resume.
  * Added the **Progressive Artifact Rule** (Section 5.1) so users can scan jobs immediately without needing an official Classification Specification PDF upfront.
* **Platform Setup Guides (`docs/platforms/`):** Added dedicated setup guides for [ChatGPT](docs/platforms/chatgpt.md), [Google Gemini](docs/platforms/gemini.md), and [Anthropic Claude](docs/platforms/claude.md), emphasizing zero-cost direct-paste fallbacks alongside persistent Projects/Gems.
* **Comprehensive Beginner Documentation (`docs/`):** Added step-by-step guides covering bookmarklet installation, first job scan, understanding Creative Pivot grades, building an experience profile, completing questionnaires, privacy/safety, and troubleshooting.
* **Archive Reference Copies:** Preserved original v1 prompt and bookmarklet under `prompt/archive/` and `bookmarklet/archive/`.

### Changed & Hardened
* **DOM XSS Hardening (`bookmarklet/CWOPA-Neogov-Extractor.js`):** Added strict HTML entity escaping (`esc()`) and `textContent` helpers (`elTxt()`) across all scraped job metadata, descriptions, requirements, keyword snippets, and questionnaire items so untrusted page markup is never executed as HTML inside the bookmarklet modal.
* **Platform-Neutral Bookmarklet Copy:** Replaced Gemini-specific wording (`"Paste this into the Gem for alignment"`) with platform-neutral instructions (`"Copy and paste this into your AI Career Co-Pilot to align your work history"`).
* **Expanded Work History Detection:** Updated the Work History extractor trigger to support `/profile` and `.work-tab` pages in addition to `/apply/work`.
* **Fixed Native CSS Selector & Clipboard Fallback:** Removed the invalid jQuery `:contains('$')` selector in `Ext.d()` and added a `document.execCommand('copy')` fallback when `navigator.clipboard` is restricted.
* **Qualified Screening Reality Claims (Prompt Section 4):** Clarified that while central HR / MET rubric screening is the standard operating model for most Commonwealth postings, specific procedures can vary by agency, union status, or hiring track.
