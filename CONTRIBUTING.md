# Contributing to Commonwealth Career Co-Pilot

Thank you for helping improve the Commonwealth Career Co-Pilot! Contributions must preserve two core principles:

1. **Rule 0 (Absolute Accuracy):** Never weaken the prompt's anti-hallucination or evidence-verification rules.
2. **Zero-Friction Onboarding:** Keep documentation clear and approachable for career-changers who have never used NEOGOV or an AI assistant before.

## How to Test Changes

Before submitting a pull request that modifies either `prompt/CWOPA-Career-CoPilot.md` or `bookmarklet/CWOPA-Neogov-Extractor.js`, test your changes against three user scenarios:

| Test Persona | What to Verify |
| :--- | :--- |
| **1. First-Time User (No AI / NEOGOV Experience)** | Does saying *"Hi, how do I use this?"* produce a warm, jargon-free explanation and offer to build a profile from scratch? |
| **2. Private-Sector Career Changer** | When given a non-government resume and a batch of 5–10 PA job listings, does Mode 2 accurately identify **Creative Pivots** (`Strong`, `Moderate`, `Speculative`) and explain the transferable work mechanics in plain English? |
| **3. Veteran User (Direct Payload)** | When pasting `### ENHANCED VIABILITY SCAN` or `### APPLICATION QUESTIONS` in the very first turn, does the prompt skip onboarding tutorials and execute Mode 2 or Mode 4 immediately? |
