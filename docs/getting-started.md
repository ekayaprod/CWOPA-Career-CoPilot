# Getting Started with the Commonwealth Career Co-Pilot

## What Problem Does This Solve?

Applying for state government jobs with the [Commonwealth of Pennsylvania](https://www.pa.gov/agencies/employment) can feel like learning a foreign language:
* **Unfamiliar Job Titles:** Roles like *Management Technician*, *Administrative Officer 1*, *Purchasing Agent*, or *Income Maintenance Caseworker* don't sound like private-sector titles—even when the day-to-day work is nearly identical to what you have already done in retail, logistics, healthcare, hospitality, or office administration.
* **Strict Minimum Experience and Training (MET) Screening:** State HR analysts evaluate applications against a literal qualification rubric. If your resume uses private-sector shorthand or leaves out the exact scope and independence of your duties, you may not receive credit for work you genuinely performed.
* **Repetitive Supplemental Questionnaires:** Every application asks detailed multiple-choice and narrative questions that must match your NEOGOV Work History without contradiction.

## How the Two Tools Work Together

| Component | Where It Lives | What It Does |
| :--- | :--- | :--- |
| **1. The NEOGOV Extractor Bookmarklet** | A bookmark button on your web browser's bookmarks bar | Runs when you click it on [GovernmentJobs.com / PA Bureau](https://www.governmentjobs.com/careers/pabureau). It scans batches of job listings, extracts individual job descriptions, grabs your current NEOGOV Work History, and auto-fills verified questionnaire answers back onto the page. |
| **2. The AI Career Co-Pilot Prompt** | Inside your preferred AI chat ([ChatGPT](platforms/chatgpt.md), [Gemini](platforms/gemini.md), or [Claude](platforms/claude.md)) | Acts as your personal career strategist. It reads the job batches you paste from the bookmarklet, identifies **Direct Fits** and **Creative Pivots**, helps rewrite your NEOGOV Work History, and drafts truthful, audit-checked questionnaire answers. |

## The 10-Minute Quick Start

1. **Install the Bookmarklet (2 minutes):** Follow the [Bookmarklet Installation Guide](install-bookmarklet.md) to drag the **CWOPA Extractor** button onto your desktop browser's bookmarks bar.
2. **Start Your AI Session (2 minutes):** Copy the Master Prompt from [`prompt/CWOPA-Career-CoPilot.md`](../prompt/CWOPA-Career-CoPilot.md) and paste it into a new chat in ChatGPT, Gemini, or Claude (see [Set Up Your AI Co-Pilot](install-ai-copilot.md)).
3. **Share Your Background (3 minutes):** Upload or paste your resume—or, if you don't have one ready, just tell the AI what you did in your last job and let it interview you to build your profile.
4. **Scan a Batch of Jobs (3 minutes):** Open the [PA GovernmentJobs portal](https://www.governmentjobs.com/careers/pabureau), filter by your county or keyword, click your **CWOPA Extractor** bookmarklet, scan 1 page of jobs, click **Copy Payload**, and paste it into your AI chat!
