# PA State Jobs Helper

**Your past work fits more PA state jobs than you think.**

The **PA State Jobs Helper** is a free, open-source career and application helper for people exploring or applying for jobs with the [Commonwealth of Pennsylvania (Employment.pa.gov)](https://www.pa.gov/agencies/employment) on the [NEOGOV / GovernmentJobs portal](https://www.governmentjobs.com/careers/pabureau).

It pairs the **Job Helper Prompt** (for ChatGPT, Google Gemini, or Anthropic Claude) with the **PA Jobs Bookmark** (an optional computer bookmarklet) to walk you through the entire application workflow:

1. **Load Your Experience:** Share your resume or describe past jobs in plain sentences so the AI can translate your everyday skills into state classification terms and recommend which `Job Category` filters to check.
2. **Find & Compare Openings:** Pull single job postings or scan a page of openings from the PA portal so the AI can check minimum requirements and point out **Direct Fits** and **Creative Pivots** (state jobs with unfamiliar titles whose day-to-day work matches skills you already have).
3. **Answer the Job Questions:** Share the full job posting and its **Job Questions** (from the posting's **Questions** tab or the logged-in application stage). The AI asks you follow-up questions to pull out real details from your past work and draft answers aimed at the highest score you honestly qualify for.
4. **Check & Auto-Fill Your Form:** Once you are happy with your answers, use **PA Jobs Bookmark** and the AI's auto-fill code to check character limits and required fields (`Check Answers (Recommended)`) before filling the form (`Approve & Fill Form`).

---

## Repository Structure (5 Core Files)

```text
PA-State-Jobs-Helper/
├── index.html                           # Single-page GitHub Pages site (auto-loads prompt & bookmarklet from repo)
├── README.md                            # Setup, workflow, troubleshooting, and privacy guide
├── LICENSE                              # MIT License
├── bookmarklet/
│   └── CWOPA-Neogov-Extractor.js        # PA Jobs Bookmark source (scanner, answer checker, and auto-fill)
└── prompt/
    └── CWOPA-Career-CoPilot.md          # Job Helper Prompt
```

> **Automatic GitHub Pages Sync:** When hosted on GitHub Pages, `index.html` automatically fetches the latest `prompt/CWOPA-Career-CoPilot.md` and `bookmarklet/CWOPA-Neogov-Extractor.js` directly from the repository (and strips code comments to attach a valid `javascript:` URL to the bookmark button in the browser). You can edit either file in GitHub without needing to manually update `index.html`.

---

## How the Workflow Goes

### Step 1: Start Your AI Session & Load Your Experience
Copy [`prompt/CWOPA-Career-CoPilot.md`](prompt/CWOPA-Career-CoPilot.md) (or click **Copy Job Helper Prompt** on the GitHub Pages site), open [ChatGPT](https://chatgpt.com/), [Google Gemini](https://gemini.google.com/), or [Anthropic Claude](https://claude.ai/), and paste it in. Then upload your resume or describe your past work in a few sentences. The AI will:
* Translate your day-to-day tasks using its **7-Level Independence Scale**.
* Suggest **3 to 5 non-obvious `Job Category` filters** to check on the [PA State Jobs Portal](https://www.governmentjobs.com/careers/pabureau).

### Step 2: Scan Job Openings & Choose an Application
Filter the PA jobs site using those categories and bring postings back to your chat:
* **On any device:** Copy and paste a job posting directly into the chat.
* **With PA Jobs Bookmark (on a computer):** Drag the **`PA Jobs Bookmark`** button from the website onto your Bookmarks Bar (`Ctrl + Shift + B` or `Cmd + Shift + B`) and click it on a search results page to scan the openings on that page at once. Open **Filter Options** inside the scanner if you want to restrict results to remote/telework jobs or exclude seasonal roles.

### Step 3: Answer the Job Questions
Once you pick an opening to apply for, share the full job posting **and its application questions** with the AI:
* **Where to find the questions:** On the job posting's **Questions** tab, or on the **Questions** step while logged in and applying on NEOGOV (clicking **`PA Jobs Bookmark`** on either page copies them with `Q01..Qnn` tags).
* **Working through the questions together:** On many postings, your answers to these questions determine whether you qualify and how your application is scored. Instead of guessing, the AI asks targeted follow-up questions to pull out real examples, tools, headcounts, and dates from your experience so your answers earn the highest score you honestly qualify for.

### Step 4: Check & Auto-Fill Your Application Form
When you are satisfied with all your drafted answers:
1. Copy the final auto-fill code (`json` block) that the AI provides alongside your plain-text answers.
2. On the NEOGOV application Questions page (`/apply/questions`), click your **`PA Jobs Bookmark`** and select **Auto-Fill Answers**.
3. Paste the code and click **Check Answers (Recommended)**. If any required fields or character limits are flagged, click **Copy Fix Request for AI** and paste it back into your chat. Once everything passes, click **Approve & Fill Form** to fill the page in one click.

---

## Troubleshooting

* **Bookmarks Bar is hidden:** Press `Ctrl + Shift + B` (Windows/Linux) or `Cmd + Shift + B` (Mac).
* **Filtering for Remote / Telework only:** Inside the **PA Jobs Bookmark: Scan Job List** window, open **Filter Options (Remote, Seasonal, Local Gov)** and check *"Show remote/telework jobs only"*. By default, all jobs on the page are scanned so on-site and county roles are included.
* **Errors or Warnings in `Check Answers`:** The bookmark automatically strips ```` ```json ```` code fences, normalizes quotes/dashes, and matches multiple-choice options by letter grade (`A`, `Level A`, `Yes`) or text. If the checker flags any red `ERR_` or yellow `WARN_` items (such as missing dates/hours or AI writing tells), click **Copy Fix Request for AI** at the bottom of the window and paste that report back into your chat so the AI can repair the flagged questions.

---

## Privacy, Accuracy & Screening Notes

* **Local Browser Execution:** `CWOPA-Neogov-Extractor.js` runs strictly in your browser on the pages you choose to scan. It has no external tracking servers and never accesses your NEOGOV password.
* **User-Controlled AI Sharing:** Information is only shared with ChatGPT, Gemini, or Claude when you copy and paste text or upload a document. Remove your street address and phone number before uploading a resume.
* **Rule 0 (Absolute Accuracy):** The prompt instructs the AI never to invent experience, and you confirm every fact. Always read and verify every generated work-history bullet and questionnaire response before submitting your application on NEOGOV.
* **Commonwealth Screening Variations:** While the prompt models the standard Office of Administration / NEOGOV Minimum Experience and Training (MET) screening workflow, specific procedures vary across classifications, union agreements, exam vs. non-exam tracks, and independent state commissions. See [Employment.pa.gov FAQs](https://www.pa.gov/agencies/employment/how-to-apply/faqs) for official guidance.

---

## Disclaimer

*Independent, community-created open-source project. Not affiliated with, endorsed by, or sponsored by the Commonwealth of Pennsylvania, the Pennsylvania Office of Administration, NEOGOV, GovernmentJobs.com, OpenAI, Google, or Anthropic.*
