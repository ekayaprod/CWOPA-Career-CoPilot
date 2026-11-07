# Commonwealth Career Co-Pilot (CWOPA)

**Your experience is more transferable than you think.**

The **Commonwealth Career Co-Pilot** is a free, open-source toolkit for people exploring or applying for jobs with the [Commonwealth of Pennsylvania (Employment.pa.gov)](https://www.pa.gov/agencies/employment) on the [NEOGOV / GovernmentJobs portal](https://www.governmentjobs.com/careers/pabureau).

It pairs a lightweight **Browser Bookmarklet** with a structured **AI Career Co-Pilot Prompt** (compatible with ChatGPT, Google Gemini, and Anthropic Claude) to help you:

1. **Batch-scan Commonwealth job openings** and filter out non-remote, temporary, or local-government listings in seconds.
2. **Discover "Creative Pivots"**—state government positions with unfamiliar titles or departments whose actual day-to-day work matches skills you already use in the private sector.
3. **Translate your work history** into accurate, verifiable language that state HR analysts recognize when grading Minimum Experience and Training (MET) requirements.
4. **Draft and audit supplemental questionnaire answers** with strict anti-hallucination safeguards, then **auto-fill approved answers** directly back into NEOGOV.

---

## Choose Your Starting Path

### Path 1: I'm New Here (Guided Setup)
New to state government applications or using an AI assistant for job hunting? Follow the step-by-step guide:
1. **[Start Here: Getting Started Guide](docs/getting-started.md)** — Understand how the two tools work together in 3 minutes.
2. **[Step 1: Install the Bookmarklet](docs/install-bookmarklet.md)** — Drag the button to your browser's bookmarks bar from our live GitHub Pages site.
3. **[Step 2: Set Up Your AI Co-Pilot](docs/install-ai-copilot.md)** — Copy the master prompt into [ChatGPT](docs/platforms/chatgpt.md), [Google Gemini](docs/platforms/gemini.md), or [Claude](docs/platforms/claude.md).
4. **[Step 3: Build Your Experience Profile](docs/building-your-experience-profile.md)** — Start with an existing resume, your NEOGOV profile, or a guided interview.
5. **[Step 4: Run Your First Job Scan](docs/first-job-search.md)** — Scan 5–10 jobs and learn how to read [Direct Fits vs. Creative Pivots](docs/understanding-results.md).
6. **[Step 5: Complete an Application](docs/completing-an-application.md)** — Draft verified questionnaire answers and inject them into NEOGOV.

### Path 2: I Already Know What I'm Doing (Quick Access)
* **Master Prompt (v2.0):** [`prompt/CWOPA-Career-CoPilot.md`](prompt/CWOPA-Career-CoPilot.md)
* **Bookmarklet Source (v2.0 Hardened):** [`bookmarklet/CWOPA-Neogov-Extractor.js`](bookmarklet/CWOPA-Neogov-Extractor.js)
* **Minified Bookmarklet URI (Copy-Paste Fallback):** [`bookmarklet/CWOPA-Neogov-Extractor.min.txt`](bookmarklet/CWOPA-Neogov-Extractor.min.txt)
* **Interactive GitHub Pages Hub:** Open `index.html` (or visit your deployed GitHub Pages URL) for the live draggable bookmarklet button and one-click prompt copy.

---

## Core Safeguards: Accuracy First

Unlike generic "resume booster" prompts that invent buzzwords or exaggerate titles, the Commonwealth Career Co-Pilot enforces **Rule 0 (Absolute Accuracy)**:
* **Zero Fabricated Facts:** Never invents employers, dates, credentials, metrics, or duties.
* **True Independence Grading:** Distinguishes between *Assisting*, *Performing Independently*, *Leading*, and *Approving* so your application never overclaims authority.
* **Gated Rubric Awareness:** Separates employer-only experience questions from open-ended questions where volunteer or personal project experience is allowed.
* **Human-in-the-Loop Auto-Fill:** You review, edit, and verify every answer before the bookmarklet fills any form field on NEOGOV.

Read our full **[Privacy & Safety Guide](docs/privacy-and-safety.md)** and **[Troubleshooting Guide](docs/troubleshooting.md)**.

---

## Disclaimer

*Independent, community-created open-source project. Not affiliated with, endorsed by, or sponsored by the Commonwealth of Pennsylvania, the Pennsylvania Office of Administration, NEOGOV, GovernmentJobs.com, OpenAI, Google, or Anthropic. Users are solely responsible for verifying the accuracy of all information submitted in their employment applications.*
