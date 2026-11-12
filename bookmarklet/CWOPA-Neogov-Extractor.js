/**
 * PA State Jobs Helper - PA Jobs Bookmark (Scanner, Answer Checker & Auto-Fill)
 * License: MIT
 */
javascript:(async function() {
  const u = window.location.href;
  if (!u.includes("governmentjobs.com") && !u.includes("pa.gov")) {
    window.open("https://www.governmentjobs.com/careers/pabureau", "_blank");
    return;
  }
  const mId = "jc-job-modal";
  const oId = "jc-job-overlay";
  const closeModal = () => {
    document.getElementById(mId)?.remove();
    document.getElementById(oId)?.remove();
  };

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  }[c]));

  const el = (tag, html, parent, attributes) => {
    const e = document.createElement(tag);
    if (html) e.innerHTML = html;
    if (attributes) {
      for (const [k, v] of Object.entries(attributes)) {
        k === "class" ? (e.className = v) : e.setAttribute(k, v);
      }
    }
    if (parent) parent.appendChild(e);
    return e;
  };

  const elTxt = (tag, text, parent, attributes) => {
    const e = el(tag, "", parent, attributes);
    if (text !== undefined && text !== null) e.textContent = String(text);
    return e;
  };

  const norm = (s) => (s || "").replace(/\s+/g, " ").trim();
  const trunc = (s, n) => (s.length > n ? s.substring(0, n) + "..." : s);

  const getT = (selectors, context = document) => {
    for (const s of selectors) {
      try {
        const n = context.querySelector(s);
        if (n && n.textContent) return norm(n.textContent);
      } catch (e) {}
    }
    return "";
  };

  const copyText = async (payload) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(payload);
        return true;
      } catch (e) {}
    }
    const ta = document.createElement("textarea");
    ta.value = payload;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (e) {}
    ta.remove();
    return ok;
  };

  const fetchDOM = async (url) => {
    const res = await fetch(url);
    const html = await res.text();
    return new DOMParser().parseFromString(html, "text/html");
  };

  const getJobId = (url) => {
    const m = url.match(/\/jobs\/(\d+)/);
    return m ? m[1] : url;
  };

  const LABEL_KEY = "jc_job_labels_v1";
  const loadLabelStore = () => {
    try {
      const s = JSON.parse(localStorage.getItem(LABEL_KEY));
      return (s && s.jobs) ? s : { counter: 0, jobs: {} };
    } catch (e) {
      return { counter: 0, jobs: {} };
    }
  };
  const saveLabelStore = (store) => {
    try { localStorage.setItem(LABEL_KEY, JSON.stringify(store)); } catch (e) {}
  };
  const assignLabels = (jobs) => {
    const store = loadLabelStore();
    const now = Date.now();
    const ttlMs = 30 * 24 * 60 * 60 * 1000;
    Object.keys(store.jobs).forEach(id => {
      if (now - (store.jobs[id]?.lastSeen || 0) > ttlMs) delete store.jobs[id];
    });
    jobs.forEach(j => {
      const existing = store.jobs[j.jobId];
      if (existing) {
        existing.lastSeen = now;
        existing.title = j.title;
      } else {
        store.counter++;
        store.jobs[j.jobId] = { label: store.counter, title: j.title, url: j.url, lastSeen: now };
      }
    });
    saveLabelStore(store);
    return store;
  };

  const css = `:root{--p:#0284c7;--bg:#fff;--t:#1f2937;--b:#e5e7eb;--s:#10b981;--w:#f59e0b;--e:#ef4444}@keyframes i{from{opacity:0}to{opacity:1}}@keyframes u{from{transform:translate(-50%,-45%);opacity:0}to{transform:translate(-50%,-50%);opacity:1}}@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(16,185,129,.4)}70%{box-shadow:0 0 0 6px rgba(16,185,129,0)}100%{box-shadow:0 0 0 0 rgba(16,185,129,0)}}.jc-overlay{position:fixed;inset:0;background:rgba(15,23,42,.75);z-index:99998;animation:i .2s}.jc-modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:var(--bg);padding:24px;width:680px;max-width:92vw;border-radius:12px;z-index:99999;box-shadow:0 20px 25px -5px rgba(0,0,0,.15);font-family:system-ui;display:flex;flex-direction:column;gap:14px;color:var(--t);animation:u .3s;max-height:90vh;overflow:hidden}.jc-header{margin:0;font-size:20px;font-weight:700;text-align:center;color:var(--p)}.jc-flex-col{display:flex;flex-direction:column;flex:1;min-height:0;gap:12px}.jc-textarea{width:100%;padding:12px;border:1px solid var(--b);border-radius:6px;font-size:13px;box-sizing:border-box;resize:vertical;min-height:260px;font-family:monospace;background:#f9fafb}.jc-textarea:focus{outline:none;border-color:var(--p)}.jc-actions{display:flex;gap:8px;justify-content:space-between;border-top:1px solid var(--b);padding-top:14px;flex-shrink:0;flex-wrap:wrap}.jc-btn{padding:9px 14px;border-radius:6px;font-weight:600;font-size:13px;cursor:pointer;border:1px solid transparent;transition:all .2s}.jc-btn:active{transform:scale(0.96)}.jc-btn-primary{background:var(--p);color:#fff}.jc-btn-ghost{background:0 0;color:#6b7280}.jc-btn-success{background:var(--s);color:#fff}.jc-btn-warn{background:var(--w);color:#fff}.jc-btn-err{background:var(--e);color:#fff}.ai-filled{border:2px solid var(--s)!important;animation:pulse 1.2s ease-out 2 forwards;position:relative}.ai-badge{position:absolute;top:-10px;right:-10px;background:var(--s);color:#fff;font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;z-index:100;pointer-events:none}.jc-scroll-list{overflow-y:auto;flex:1;min-height:200px;border:1px solid var(--b);border-radius:8px;background:#f8fafc;padding:12px}.jc-list-item{background:#fff;border:1px solid var(--b);border-radius:6px;padding:12px;margin-bottom:12px}.jc-item-title{font-size:15px;font-weight:700;color:#0284c7;text-decoration:none;display:block;margin-bottom:4px}.jc-item-meta{font-size:11px;font-weight:600;color:#64748b;margin-bottom:8px;text-transform:uppercase}.jc-progress{font-size:16px;font-weight:600;text-align:center;color:var(--p);padding:40px}.jc-toggles{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}.jc-pill{padding:6px 14px;border-radius:99px;border:1px solid var(--b);cursor:pointer;font-size:13px;font-weight:600;user-select:none}.jc-pill[data-active="true"]{background:var(--p);color:#fff;border-color:var(--p)}.jc-diag-err{background:#fef2f2;border:1px solid #fecaca;color:#991b1b;padding:8px 10px;border-radius:6px;font-size:12px;margin-top:6px}.jc-diag-warn{background:#fffbeb;border:1px solid #fde68a;color:#92400e;padding:8px 10px;border-radius:6px;font-size:12px;margin-top:6px}.jc-diag-ok{background:#ecfdf5;border:1px solid #a7f3d0;color:#065f46;padding:8px 10px;border-radius:6px;font-size:12px}`;

  const initUI = (title, headerText, contentNode, getCopyPayload, extraButtons = []) => {
    if (!document.getElementById("jc-styles")) {
      el("style", css, document.head, { id: "jc-styles" });
    }
    closeModal();
    el("div", "", document.body, { id: oId, class: "jc-overlay" }).onclick = closeModal;
    const mo = el("div", "", document.body, { id: mId, class: "jc-modal" });
    elTxt("h2", title, mo, { class: "jc-header" });
    if (headerText) elTxt("div", headerText, mo, { style: "font-size:13px;text-align:center;color:#4b5563;font-weight:600" });
    mo.appendChild(contentNode);
    const act = el("div", "", mo, { class: "jc-actions" });
    if (getCopyPayload) {
      const cp = elTxt("button", "Copy for AI Chat", act, { class: "jc-btn jc-btn-primary" });
      cp.onclick = async () => {
        const payload = getCopyPayload();
        if (!payload) return alert("Nothing to copy yet.");
        const ok = await copyText(payload);
        if (ok) {
          cp.textContent = "Copied! Paste into AI Chat";
          cp.classList.add("jc-btn-success");
          setTimeout(() => {
            cp.textContent = "Copy for AI Chat";
            cp.classList.remove("jc-btn-success");
          }, 1600);
        } else {
          alert("Clipboard permission denied. Please select the text box and press Ctrl+C / Cmd+C.");
        }
      };
    }
    extraButtons.forEach(b => {
      const btn = elTxt("button", b.text, act, { class: "jc-btn " + (b.class || "jc-btn-primary") });
      btn.onclick = () => b.action(mo, btn);
    });
    elTxt("button", "Close", act, { class: "jc-btn jc-btn-ghost" }).onclick = closeModal;
    return mo;
  };

  const Ext = {
    RX_REMOTE: /telework|home headquartered|remote/i,
    RX_SCHEDULE: /(?:Work Schedule and Additional Information:|Work Schedule:)[\s\S]*?(?=REQUIRED EXPERIENCE|QUALIFICATIONS|How to Apply:)/is,
    RX_REQUIREMENTS: /(?:QUALIFICATIONS|Minimum Experience)[\s\S]*?(?=How to Apply:|EXAMINATION INFORMATION|Veterans:|Telecommunications Relay)/is,
    RX_DUTIES: /Description of Work[\s\S]*?(?=Work Schedule)/is,

    CHECKLIST_RULES: [
      {
        label: "Employer",
        askRx: /employer|company|organization/i,
        ansRx: /(?:\b(?:[Ee]mployer|[Cc]ompany|[Oo]rganization|[Aa]gency|[Dd]ept|[Dd]epartment|[Ww]orkplace|[Ff]irm|[Hh]ospital|[Cc]linic|[Ss]tore|[Ww]arehouse)\s*[:=-]|\b(?:Inc\.?|LLC|Corp\.?|Co\.?|Ltd\.?|Department|Agency|Bureau|Commission|County|Commonwealth|Hospital|University|College|Bank|Logistics|Services|Systems|Group|Associates)\b|\b(?:[Aa]t|[Ff]or|[Ww]ith)\s+(?!(?:a|an|the|my|our|their|this|that|each|every|all|any|some|most|least|first|last|home|work|night|noon|once|present|risk|fault|will|large|hand|length|random|stake|ease|best|worst)\b)[A-Z][A-Za-z0-9&.'-]{1,}|^[^.\n]{2,90}\|)/
      },
      {
        label: "Title",
        askRx: /job title|title held|position title/i,
        ansRx: /(?:\b(?:title|role|position|classification)\s*[:=-]|\b(?:as\s+(?:a|an|the)|worked\s+as|served\s+as|hired\s+as|promoted\s+to)\s+[a-z]{2,}|^[^.\n]{2,90}\||\b(?:lead|leader|manager|mgr|supervisor|supv|specialist|spec|analyst|clerk|tech|technician|coordinator|coord|officer|assistant|asst|associate|assoc|director|administrator|admin|representative|rep|agent|worker|caseworker|interviewer|inspector|investigator|examiner|auditor|accountant|bookkeeper|cashier|teller|driver|operator|dispatcher|handler|loader|picker|packer|stocker|receiving|shipping|forklift|mechanic|machinist|electrician|plumber|carpenter|maintenance|custodian|janitor|aide|nurse|lpn|rn|cna|therapist|counselor|teacher|instructor|trainer|cook|chef|server|bartender|barista|baker|dietary|keyholder|buyer|scheduler|planner|receptionist|secretary|typist|biller|coder|collector|adjuster|processor|reviewer|screener|liaison|consultant|advisor|engineer|developer|programmer|designer|scientist|forester|ranger|warden|guard|intern|trainee|apprentice|contractor)\b)/i
      },
      { label: "Dates", askRx: /\bdates\b|month\/year|from\/to|dates of employment/i, ansRx: /\b(19|20)\d{2}\b|\b\d{1,2}\/\d{2,4}\b|\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b|\bpresent\b/i },
      { label: "Hours/Week", askRx: /hours per week|hrs\/wk|hours worked/i, ansRx: /\b(?:\d+(?:\.\d+)?\s*(?:hours|hrs?|per\s+week|\/wk|\/week|weekly|a\s+week)|full[- ]time|part[- ]time)\b/i }
    ],

    cln(h) {
      let c = (h || "").replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>|<\/div>|<\/h[1-6]>/gi, "\n\n").replace(/<\/li>/gi, "\n");
      const d = new DOMParser().parseFromString(c, "text/html");
      return (d.body.textContent || "").replace(/[ \t]+/g, " ").replace(/[ \t]*\n[ \t]*/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
    },

    detectJobFlags(clnText, meta = {}) {
      const flags = [];
      if (/Promotion Without Examination|Competitive Promotion Without Examination|internal candidates only|restricted to current commonwealth/i.test(clnText)) {
        flags.push("INTERNAL / PROMOTION GATE");
      }
      if (/have held regular civil service status|next lower class/i.test(clnText)) {
        flags.push("CIVIL SERVICE STATUS / NEXT LOWER CLASS");
      }
      if (/attach a copy of your.*transcript|official or unofficial transcript|transcripts? must be attached/i.test(clnText)) {
        flags.push("TRANSCRIPT ATTACHMENT IF CLAIMING EDUCATION");
      }
      if (/Employee Performance Review|\bEPR\b/i.test(clnText)) {
        flags.push("EPR ATTACHMENT NOTED");
      }
      if (/Be a resident of Pennsylvania|Pennsylvania residency/i.test(clnText)) {
        flags.push("PA RESIDENCY REQUIRED");
      }
      if (/Commercial Driver's License|\bCDL\b|valid motor vehicle operator's license|valid driver's license|valid Pennsylvania driver's license/i.test(clnText)) {
        flags.push("DRIVER'S LICENSE / CDL");
      }
      if (/telework|home headquartered/i.test(clnText) || /home headquartered/i.test(meta["Location"] || "")) {
        flags.push("TELEWORK / HOME HQ ELIGIBLE");
      }
      return flags.length ? flags.join(" | ") : "None detected (Open / Standard)";
    },

    getQNodes(context = document) {
      const scoped = context.querySelectorAll(".supplementary-questions .question-item, .box .question-item");
      return Array.from(scoped.length ? scoped : context.querySelectorAll(".question-item"));
    },
    padQ(qNum) {
      return "Q" + String(qNum).padStart(2, "0");
    },
    getQNum(qEl, idx) {
      const idxNode = qEl.querySelector(".question-index, .span2");
      const m = idxNode && idxNode.textContent ? idxNode.textContent.match(/\d+/) : null;
      return m ? parseInt(m[0], 10) : (idx + 1);
    },
    getQKey(qEl, idx) {
      return this.padQ(this.getQNum(qEl, idx));
    },
    getQText(qEl, fallback = "") {
      const tEl = qEl.querySelector(".question-container > span, .question-text span, .question-text label");
      return tEl ? norm(this.cln(tEl.innerHTML)) : fallback;
    },
    getQOptions(qEl) {
      const seenText = new Set();
      const rawNodes = Array.from(qEl.querySelectorAll(".radio-set label, ul > li label, ul > li, select option"));
      return rawNodes.reduce((acc, node) => {
        if (node.closest(".question-text")) return acc;
        if (node.tagName === "LI" && node.querySelector("label")) return acc;
        const text = norm(node.textContent);
        if (!text || /^(Select one|Choose option|--)/i.test(text) || seenText.has(text)) return acc;
        seenText.add(text);
        acc.push({ node, text });
        return acc;
      }, []);
    },

    q(context = document) {
      const sQ = new Set();
      const qMetaList = [];
      const nodes = this.getQNodes(context);
      nodes.forEach((qEl, idx) => {
        const qKey = this.getQKey(qEl, idx);
        if (sQ.has(qKey)) return;
        sQ.add(qKey);
        const t = this.getQText(qEl);
        if (!t) return;
        const ops = this.getQOptions(qEl).map(o => o.text);
        const hasTa = !!qEl.querySelector("textarea");
        const hasTxtInp = !!qEl.querySelector("input[type='text']");
        const isMC = ops.length > 0 && !hasTa && !hasTxtInp;
        const tags = [];
        tags.push(isMC ? "[TYPE: Multiple-Choice]" : (hasTa ? "[TYPE: Narrative Text Box]" : "[TYPE: Short Text Input]"));

        if (!isMC && qMetaList.length > 0) {
          const prev = qMetaList[qMetaList.length - 1];
          if (/above|previous question|selected|answered yes|your response|your selection|supports your|claimed/i.test(t)) {
            tags.push("[PAIRED WITH " + prev.qKey + "]");
          }
        }
        if (ops.some(o => /^[A-D][:.\s-]/i.test(o) || /coursework/i.test(o)) || /employer\(s\) where you gained|only experience gained/i.test(t)) {
          tags.push("[GATE: Employer/Coursework Restricted]");
        }
        if (/coursework|college credits|transcript/i.test(t) && !isMC && /if you selected|if claiming/i.test(t)) {
          tags.push("[CONDITIONAL: Coursework Follow-Up]");
        }
        const reqFields = this.CHECKLIST_RULES.filter(r => r.askRx.test(t)).map(r => r.label);
        if (!isMC && reqFields.length > 0) {
          tags.push("[REQUIRED FIELDS: " + reqFields.join(", ") + "]");
        }

        qMetaList.push({
          qKey,
          isMC,
          line: qKey + " " + tags.join(" ") + ": " + t + (ops.length ? "\n - " + ops.join("\n - ") : "")
        });
      });
      return qMetaList.map(x => x.line).join("\n\n");
    },

    san(txt, morphStats = null) {
      if (!txt) return "";
      let out = String(txt);
      const beforeMd = out;
      out = out.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/__([^_]+)__/g, "$1").replace(/^#{1,6}[ \t]+/gm, "");
      if (morphStats && out !== beforeMd) morphStats.strippedMarkdown++;

      const beforeTypo = out;
      out = out.replace(/[\u2018\u2019]/g, "'")
               .replace(/[\u201C\u201D]/g, "\"")
               .replace(/(\d)[ \t]*[\u2013\u2014][ \t]*(\d)/g, "$1-$2")
               .replace(/[ \t]*[\u2013\u2014][ \t]*/g, " - ")
               .replace(/[\u00A0\t]+/g, " ");
      if (morphStats && out !== beforeTypo) morphStats.fixedTypography++;

      const beforeVerb = out;
      out = out.replace(/\bUtiliz(e|ed|es|ing)\b/g, (m, suf) => "Us" + suf.toLowerCase())
               .replace(/\butiliz(e|ed|es|ing)\b/g, "us$1")
               .replace(/\bLeverag(ed|ing)\b/g, (m, suf) => "Us" + suf.toLowerCase())
               .replace(/\bleverag(ed|ing)\b/g, "us$1");
      if (morphStats && out !== beforeVerb) morphStats.swappedVerbs++;

      return out.replace(/ {2,}/g, " ").trim();
    },

    parsePayloadJSON(rawStr) {
      const morphStats = { strippedFences: false, strippedMarkdown: 0, fixedTypography: 0, swappedVerbs: 0 };
      let s = (rawStr || "").trim();
      if (!s) return { ok: false, error: "ERR_EMPTY_PAYLOAD: The text box is empty. Paste the auto-fill code from your AI chat." };

      const fenceMatch = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
      if (fenceMatch) {
        s = fenceMatch[1].trim();
        morphStats.strippedFences = true;
      }
      if (!s.startsWith("{")) {
        const firstBrace = s.indexOf("{");
        const lastBrace = s.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace > firstBrace) {
          s = s.substring(firstBrace, lastBrace + 1);
          morphStats.strippedFences = true;
        }
      }
      try {
        const rawObj = JSON.parse(s);
        if (!rawObj || typeof rawObj !== "object" || Array.isArray(rawObj)) {
          return { ok: false, error: "ERR_JSON_SYNTAX: Expected a JSON object mapping Q01..Qnn to answers.", rawSnippet: s.substring(0, 220) };
        }
        const normObj = {};
        for (const [k, v] of Object.entries(rawObj)) {
          const m = String(k).match(/(\d+)/);
          const cleanKey = m ? ("Q" + String(parseInt(m[1], 10)).padStart(2, "0")) : k.trim().toUpperCase();
          normObj[cleanKey] = typeof v === "string" ? this.san(v, morphStats) : String(v ?? "");
        }
        return { ok: true, data: normObj, morphStats };
      } catch (e) {
        return {
          ok: false,
          error: "ERR_JSON_SYNTAX: Could not parse JSON (" + (e.message || "invalid syntax") + ").",
          rawSnippet: s.substring(0, 220)
        };
      }
    },

    matchOption(qEl, fAns) {
      const opts = this.getQOptions(qEl);
      if (!opts.length) return { matched: false, target: null, validOptions: [] };
      const cleanAns = norm(fAns).toLowerCase();

      let hit = opts.find(o => o.text.toLowerCase() === cleanAns);
      if (hit) return { matched: true, target: hit.node, matchedText: hit.text, validOptions: opts.map(o => o.text) };

      hit = opts.find(o =>
        (cleanAns.length >= 3 && o.text.toLowerCase().startsWith(cleanAns.substring(0, Math.min(25, cleanAns.length)))) ||
        (o.text.length >= 4 && cleanAns.startsWith(o.text.toLowerCase().substring(0, 25))));
      if (hit) return { matched: true, target: hit.node, matchedText: hit.text, validOptions: opts.map(o => o.text) };

      const letterMatch = norm(fAns).match(/^(?:level\s+|option\s+|grade\s+)?([A-F])(?:\b|[:.\s-])/i);
      if (letterMatch) {
        const letter = letterMatch[1].toUpperCase();
        hit = opts.find(o => new RegExp("^" + letter + "(?:[:.\\s-]|\\b)", "i").test(o.text));
        if (!hit) {
          const idx = letter.charCodeAt(0) - 65;
          if (idx >= 0 && idx < opts.length && opts.length <= 6) hit = opts[idx];
        }
        if (hit) return { matched: true, target: hit.node, matchedText: hit.text, validOptions: opts.map(o => o.text) };
      }\n
      if (/^(yes|no)\b/i.test(cleanAns)) {
        const yn = cleanAns.startsWith("yes") ? "yes" : "no";
        hit = opts.find(o => o.text.toLowerCase().startsWith(yn));
        if (hit) return { matched: true, target: hit.node, matchedText: hit.text, validOptions: opts.map(o => o.text) };
      }

      if (cleanAns.length >= 8) {
        const byLen = [...opts].sort((a, b) => b.text.length - a.text.length);
        hit = byLen.find(o => o.text.toLowerCase().includes(cleanAns) || cleanAns.includes(o.text.toLowerCase()));
        if (hit) return { matched: true, target: hit.node, matchedText: hit.text, validOptions: opts.map(o => o.text) };
      }

      return { matched: false, target: null, validOptions: opts.map(o => o.text) };
    },

    lintQuestion(qEl, qKey, qTxt, ans) {
      const errors = [];
      const warnings = [];
      const taNat = qEl.querySelector("textarea, input[type='text']");
      const isNarrative = !!taNat;

      if (!ans) {
        if (!/if you selected|coursework|if applicable|optional/i.test(qTxt)) {
          warnings.push({
            code: "WARN_UNANSWERED",
            msg: "Question has no answer yet.",
            fixHint: "Provide an answer for " + qKey + ": \"" + trunc(qTxt, 80) + "\""
          });
        }
        return { errors, warnings, isNarrative };
      }

      if (!isNarrative) {
        const mRes = this.matchOption(qEl, ans);
        if (!mRes.matched) {
          errors.push({
            code: "ERR_OPTION_MISMATCH",
            msg: "Value \"" + trunc(ans, 45) + "\" did not match any option on the page.",
            fixHint: "Valid options for " + qKey + " are:\n" + mRes.validOptions.map(o => "   * \"" + o + "\"").join("\n")
          });
        }
        return { errors, warnings, isNarrative };
      }

      if (taNat.maxLength && taNat.maxLength > 0 && ans.length > taNat.maxLength) {
        errors.push({
          code: "ERR_CHAR_LIMIT",
          msg: "Answer is " + ans.length + " chars, exceeding the field limit of " + taNat.maxLength + " chars.",
          fixHint: "Compress " + qKey + " to under " + taNat.maxLength + " characters."
        });
      }

      const isNA = /^(n\/a|none|not applicable)\.?$/i.test(ans.trim());
      if (isNA) return { errors, warnings, isNarrative };

      const missingFields = this.CHECKLIST_RULES
        .filter(r => r.askRx.test(qTxt) && !r.ansRx.test(ans))
        .map(r => r.label);
      if (missingFields.length) {
        warnings.push({
          code: "WARN_MISSING_CHECKLIST_FIELD",
          msg: "Question asks for [" + missingFields.join(", ") + "], which appears missing in the answer.",
          fixHint: "Add verified [" + missingFields.join(", ") + "] to " + qKey + "."
        });
      }

      const tailMatch = ans.match(/,\s+\b(ensuring|fostering|highlighting|underscoring|contributing to|reflecting|demonstrating|showcasing|cultivating)\b[^.!?]{3,}[.!?]?$/im);
      if (tailMatch) {
        warnings.push({
          code: "WARN_AI_TELL_TAIL",
          msg: "Ends with an AI-style '-ing' significance tail (\"" + trunc(tailMatch[0].trim(), 55) + "\").",
          fixHint: "In " + qKey + ", remove the trailing \"" + trunc(tailMatch[0].trim(), 45) + "\" clause and end the sentence on the concrete fact or result."
        });
      }

      const buzzMatches = ans.match(/\b(delve\w*|spearhead\w*|bolster\w*|garner\w*|tapestry|testament|pivotal|multifaceted|intricacies|interplay|underscor(?:e|es|ed|ing)|showcas(?:e|es|ed|ing)|foster(?:s|ed|ing)?|meticulously)\b/gi);
      if (buzzMatches) {
        const uniq = [...new Set(buzzMatches.map(x => x.toLowerCase()))];
        warnings.push({
          code: "WARN_AI_BUZZWORD",
          msg: "Contains AI buzzword(s): " + uniq.map(w => "\"" + w + "\"").join(", ") + ".",
          fixHint: "In " + qKey + ", replace AI buzzwords (" + uniq.join(", ") + ") with plain, concrete verbs."
        });
      }

      if (/\bnot\s+(?:only|just)\b[\s\S]{1,80}\bbut\b/i.test(ans)) {
        warnings.push({
          code: "WARN_NEGATIVE_PARALLELISM",
          msg: "Contains 'Not only/just X, but Y' phrasing (common AI tell).",
          fixHint: "In " + qKey + ", rewrite the 'not only/just... but' sentence as a direct factual statement."
        });
      }

      const absMatch = ans.match(/\b(?:always|never|100\s*percent|every\s+single)\b|\b100%/i);
      if (absMatch) {
        warnings.push({
          code: "WARN_ABSOLUTE_CLAIM",
          msg: "Contains absolute claim (\"" + absMatch[0] + "\").",
          fixHint: "In " + qKey + ", replace \"" + absMatch[0] + "\" with the actual frequency or verified metric."
        });
      }

      if (/\[[^\]]+\]|\bTBD\b|\bTODO\b/.test(ans)) {
        warnings.push({
          code: "WARN_PLACEHOLDER_LEFT",
          msg: "Contains bracketed placeholder or TBD text.",
          fixHint: "In " + qKey + ", replace any bracketed placeholder with verified user facts."
        });
      }

      return { errors, warnings, isNarrative };
    },

    buildDiagnosticReport(parseRes, itemDiagnostics) {
      if (!parseRes.ok) {
        return "### BOOKMARKLET DIAGNOSTIC REPORT\n" +
          "- " + parseRes.error + "\n" +
          (parseRes.rawSnippet ? "  Snippet: " + parseRes.rawSnippet + "\n" : "") +
          "\nPlease output a valid, plain JSON object `{ \"Q01\": \"...\" }` with all internal quotes properly escaped.";
      }
      const lines = [];
      itemDiagnostics.forEach(d => {
        d.errors.forEach(e => {
          lines.push("- " + d.qKey + " [" + e.code + "]: " + e.msg + "\n  Action: " + e.fixHint);
        });
        d.warnings.forEach(w => {
          lines.push("- " + d.qKey + " [" + w.code + "]: " + w.msg + "\n  Action: " + w.fixHint);
        });
      });
      if (!lines.length) return "";
      return "### BOOKMARKLET DIAGNOSTIC REPORT\n" +
        "Please fix only the flagged questions below and output the updated JSON block:\n\n" +
        lines.join("\n\n");
    },

    injAns(qEl, fAns) {
      if (!fAns || !fAns.trim()) return 0;
      let inj = 0;
      const taNat = qEl.querySelector("textarea, input[type='text']");
      if (taNat) {
        taNat.value = fAns;
        taNat.dispatchEvent(new Event("input", { bubbles: true }));
        taNat.dispatchEvent(new Event("change", { bubbles: true }));
        taNat.classList.add("ai-filled");
        if (!taNat.parentElement.querySelector(".ai-badge")) elTxt("div", "Filled", taNat.parentElement, { class: "ai-badge" });
        inj++;
      } else {
        const mRes = this.matchOption(qEl, fAns);
        const tgt = mRes.target;
        if (tgt) {
          if (tgt.tagName === "OPTION") {
            tgt.selected = true;
            tgt.parentElement.dispatchEvent(new Event("change", { bubbles: true }));
            tgt.parentElement.classList.add("ai-filled");
            inj++;
          } else {
            const forId = tgt.getAttribute("for");
            const inp = tgt.querySelector("input") || (forId && document.getElementById(forId)) || tgt.parentElement?.querySelector("input");
            if (inp) {
              if (!inp.checked) inp.click();
              inp.dispatchEvent(new Event("change", { bubbles: true }));
              tgt.classList.add("ai-filled");
              if (!tgt.querySelector(".ai-badge-inline")) elTxt("span", " (Filled)", tgt, { class: "ai-badge-inline", style: "color:var(--s);font-weight:700;margin-left:6px;font-size:11px;" });
              inj++;
            }
          }
        }
      }
      return inj;
    },

    getMeta(context) {
      return Array.prototype.reduce.call(context.querySelectorAll(".term-block, dt"), (m, elNode) => {
        const isDt = elNode.tagName === "DT";
        const lEl = isDt ? elNode : elNode.querySelector(".term-description");
        const nxt = elNode.nextElementSibling;
        const vEl = isDt ? (nxt?.tagName === "DD" ? nxt : null) : elNode.querySelector(".span8");
        if (lEl && vEl) {
          const l = norm(lEl.textContent.replace("Location Information Icon", ""));
          m[l] = norm(vEl.textContent);
        }
        return m;
      }, {});
    },
    d() {
      let t = getT(["h1.t-24", ".jobsearch-JobInfoHeader-title", ".entity-title", "h1.title", "h1"]) || "[Title]";
      let c = getT([".job-details-jobs-unified-top-card__company-name", ".agency-name dd", ".company-name"]) || "Commonwealth of Pennsylvania";
      let meta = this.getMeta(document);
      let s = meta["Salary"] || getT([".salary", ".pay-range", ".job-details-jobs-unified-top-card__job-insight"]);
      if (s && !meta["Salary"]) meta["Salary"] = s;
      let ds = this.cln(document.querySelector("#details-info, .job-description")?.innerHTML || "");
      let autoFlags = this.detectJobFlags(ds, meta);
      return { t, c, s, meta, ds, autoFlags, q: this.q() };
    },
    w(context = document) {
      let exp = [];
      const wCtx = context.querySelector(".work-tab") || context;
      wCtx.querySelectorAll("li dl, .box-container dl").forEach(dl => {
        let title = "", employer = "", duties = "", dates = "", isWork = false;
        dl.querySelectorAll("dt").forEach(dt => {
          let label = norm(dt.textContent).toLowerCase();
          let dd = dt.nextElementSibling;
          if (dd && dd.tagName === "DD") {
            let val = norm(dd.textContent);
            if (label.includes("position")) { title = val; isWork = true; }
            else if (label.includes("company") || label.includes("employer") || label.includes("agency")) { employer = val; isWork = true; }
            else if (label.includes("duties")) duties = val;
            else if (label.includes("dates")) dates = val;
          }
        });
        if (isWork && (title || employer)) {
          let md = "### " + (title || "Unknown Title") + "\n**Employer:** " + (employer || "Unknown Employer");
          if (dates && dates !== " - ") md += "\n**Dates:** " + dates.replace(/( - )/g, " - ").replace(/\s+/g, " ");
          md += "\n**Duties:**\n" + (duties || "No description provided.");
          exp.push(md);
        }
      });
      if (exp.length === 0) {
        let blocks = wCtx.querySelectorAll(".experience-block, .work-item, .list-item, fieldset, .card");
        if (blocks.length === 0) blocks = [wCtx];
        const getVal = (txtSel, inpSel, ctx) => getT(txtSel, ctx) || ctx.querySelector(inpSel)?.value || "";
        exp = Array.prototype.reduce.call(blocks, (acc, b) => {
          let t = getVal(['[data-automation-id="job-title"]', ".job-title"],
            'input[name*="jobTitle" i], input[name*="title" i], input[id*="title" i]', b);
          let e = getVal(['[data-automation-id="company"]', ".employer-name", ".company"],
            'input[name*="employer" i], input[name*="company" i], input[id*="employer" i]', b);
          let d = getVal(['[data-automation-id="duties"]', ".duties", ".description"],
            'textarea[name*="duties" i], textarea[name*="description" i], textarea[id*="duties" i], textarea', b);
          if ((t || e) && t.length <= 100 && e.length <= 100) {
            acc.push("### " + (t || "Unknown Title") + "\n**Employer:** " +
              (e || "Unknown Employer") + "\n**Duties:**\n" + (d || "No description provided."));
          }
          return acc;
        }, exp);
      }
      return exp.length ? [...new Set(exp)].join("\n\n---\n\n") : null;
    },
    async l(options, cb) {
      let rx = null;
      if (options.kw) {
        try {
          rx = new RegExp(options.kw, "i");
        } catch (e) {
          rx = new RegExp(options.kw.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"), "i");
        }
      }
      let jobLinks = new Map();
      const sleep = ms => new Promise(r => setTimeout(r, ms));
      const scrapeCurrent = () => {
        document.querySelectorAll(".list-item .item-details-link").forEach(a => {
          let hr = a.getAttribute("href");
          if (hr) jobLinks.set(hr, norm(a.textContent) || "Unknown");
        });
      };
      scrapeCurrent();
      let pNum = 1;
      const getNext = () => {
        let btn = document.querySelector("li.PagedList-skipToNext a");
        return (btn && !btn.parentElement.classList.contains("disabled") && btn.getAttribute("aria-disabled") !== "true") ? btn : null;
      };
      let nextBtn = getNext();
      while (nextBtn && pNum < options.maxP) {
        pNum++;
        cb(0, 0, "Traversing Page " + pNum + "...");
        nextBtn.click();
        await sleep(2500);
        scrapeCurrent();
        nextBtn = getNext();
      }
      const reachedEnd = !nextBtn;
      let jobsArray = Array.from(jobLinks.entries(), ([hr, ti]) => ({ ti, hr }));
      const m = [];
      let processed = 0;
      const chunkSize = 4;
      for (let i = 0; i < jobsArray.length; i += chunkSize) {
        const chunk = jobsArray.slice(i, i + chunkSize);
        await Promise.all(chunk.map(async (job) => {
          const ln = job.hr.startsWith("http") ? job.hr : window.location.origin + job.hr;
          try {
            const dc = await fetchDOM(ln);
            let pageMeta = this.getMeta(dc);
            let pg = pageMeta["Pay Group"] || "N/A";
            let jt = pageMeta["Job Type"] || "N/A";
            let tp = Array.prototype.reduce.call(dc.querySelectorAll(".tab-pane"), (acc, p) =>
              (p.id !== "details-questions" && p.id !== "details-benefits" ? acc + p.innerHTML + "<br><br>" : acc),
            "");
            const cln = this.cln(tp);
            let isRemote = this.RX_REMOTE.test(cln) || /home headquartered/i.test(pageMeta["Location"] || "") || /home headquartered/i.test(pg);
            const excluded =
              (options.exLG && pg.toUpperCase().includes("LG")) ||
              (options.exSeas && (jt.toLowerCase().includes("seasonal") || jt.toLowerCase().includes("temporary"))) ||
              (options.exNonRemote && !isRemote);

            if (!excluded && (!rx || rx.test(cln))) {
              let kwSnip = "";
              if (rx) {
                let match = cln.match(rx);
                if (match) {
                  let start = Math.max(0, match.index - 80);
                  let end = Math.min(cln.length, match.index + 150);
                  kwSnip = "..." + cln.substring(start, end).replace(/\n/g, " ").trim() + "...";
                }
              }

              let schSnippet = "Not specified";
              let fullSchedule = "Not specified";
              let schMatch = cln.match(this.RX_SCHEDULE);
              if (schMatch) {
                fullSchedule = schMatch[0].trim();
                schSnippet = trunc(norm(schMatch[0]), 300);
              }

              let reqSnippet = "N/A";
              let fullReq = "N/A";
              let reqMatch = cln.match(this.RX_REQUIREMENTS);
              if (reqMatch) {
                fullReq = reqMatch[0].trim();
                reqSnippet = trunc(norm(reqMatch[0]), 3000);
              }

              let dutiesMatch = cln.match(this.RX_DUTIES);
              let fullDuties = dutiesMatch ? dutiesMatch[0].trim() : this.cln(dc.querySelector("#details-info")?.innerHTML || "").trim();
              let coreDuties = trunc(norm(fullDuties), 500);

              let questions = this.q(dc);
              let autoFlags = this.detectJobFlags(cln, pageMeta);

              m.push({
                jobId: getJobId(ln),
                ti: job.ti,
                ln,
                pg,
                sal: pageMeta["Salary"] || "N/A",
                jt,
                loc: pageMeta["Location"] || pageMeta["City"] || "N/A",
                un: pageMeta["Union"] || "N/A",
                dep: pageMeta["Department"] || "N/A",
                div: pageMeta["Division"] || "N/A",
                close: pageMeta["Closing Date"] || "N/A",
                cn: pageMeta["Contact Name"] || "N/A",
                ce: pageMeta["Contact Email"] || "N/A",
                autoFlags,
                schedule: schSnippet,
                fullSchedule,
                reqSnippet,
                fullReq,
                coreDuties,
                fullDuties,
                questions,
                kwSnip
              });
            }
          } catch (e) {} finally {
            processed++;
            cb(processed, jobsArray.length, job.ti);
          }
        }));
      }
      try {
        let p1 = document.querySelector('a[aria-label="Go to Page 1"]');
        if (p1) p1.click();
      } catch (e) {}
      const allJobIds = jobsArray.map(j => getJobId(j.hr.startsWith("http") ? j.hr : window.location.origin + j.hr));
      return { tot: jobsArray.length, m, reachedEnd, allJobIds };
    }
  };

  const autoResize = (ta) => {
    ta.style.height = "auto";
    ta.style.height = (ta.scrollHeight + 5) + "px";
  };

  const attachAutoResize = (ta, delay = 500) => {
    ta.style.overflow = "hidden";
    const rsz = () => autoResize(ta);
    ta.addEventListener("input", rsz);
    setTimeout(rsz, delay);
  };

  document.querySelectorAll("textarea:not(.jc-textarea)").forEach(ta => {
    if (!ta.dataset.jcr) {
      ta.dataset.jcr = "1";
      ta.style.minHeight = "80px";
      attachAutoResize(ta);
    }
  });

  const buildScanPayload = (dt) => {
    return "### ENHANCED VIABILITY SCAN\nFound " + dt.m.length + " matching jobs. Reference each one by its # label.\n\n" + dt.m.map(m => {
      let res = "**#" + m.label + " - " + m.ti + "**\n* **Link:** " + m.ln + "\n* **Meta:** " + m.pg + " | " + m.sal + " | " + m.jt + " | " + m.loc + " | " + m.un + "\n* **Agency:** " + m.dep + " / " + m.div + "\n* **Deadline:** " + m.close + " | **Contact:** " + m.cn + " - " + m.ce + "\n* **Auto-Flags:** " + m.autoFlags + "\n* **Schedule/Loc:** \"" + m.schedule + "\"\n* **Requirements:** \"" + m.reqSnippet + "\"\n* **Core Duties:** \"" + m.coreDuties + "\"";
      if (m.kwSnip) res += "\n* **Keyword Snippet:** \"" + m.kwSnip + "\"";
      return res;
    }).join("\n\n---\n\n");
  };

  const buildJobDetailPayload = (m) => {
    return "### JOB DETAIL - #" + m.label + "\n**Title:** " + m.ti + "\n**Link:** " + m.ln +
      "\n**Meta:** " + m.pg + " | " + m.sal + " | " + m.jt + " | " + m.loc + " | " + m.un +
      "\n**Agency:** " + m.dep + " / " + m.div + "\n**Deadline:** " + m.close + " | **Contact:** " + m.cn + " - " + m.ce +
      "\n**Auto-Flags:** " + m.autoFlags +
      "\n**Schedule/Loc:** " + m.fullSchedule +
      "\n\n### DESCRIPTION\n" + m.fullDuties +
      "\n\n### REQUIREMENTS\n" + m.fullReq +
      (m.questions ? "\n\n### APPLICATION QUESTIONS\n" + m.questions : "");
  };

  const showJobDetail = (m, dt) => {
    const c = el("div", "", null, { class: "jc-scroll-list", style: "white-space:pre-wrap;font-size:13px;line-height:1.6;" });
    c.innerHTML =
      "<div style='margin-bottom:14px;'><strong>" + esc(m.pg) + " | " + esc(m.sal) + "</strong><br>" + esc(m.jt) + " | " + esc(m.loc) + " | " + esc(m.un) + "<br>" + esc(m.dep) + " / " + esc(m.div) + "<br>Closes: " + esc(m.close) + " | Contact: " + esc(m.cn) + " - " + esc(m.ce) + "<br><strong>Flags:</strong> " + esc(m.autoFlags) + "</div>" +
      "<div style='margin-bottom:14px;'><strong>Schedule/Loc</strong><br>" + esc(m.fullSchedule) + "</div>" +
      "<div style='margin-bottom:14px;'><strong>Description</strong><br>" + esc(m.fullDuties) + "</div>" +
      "<div style='margin-bottom:14px;'><strong>Requirements</strong><br>" + esc(m.fullReq) + "</div>" +
      (m.questions ? "<div><strong>Application Questions</strong><br>" + esc(m.questions) + "</div>" : "");
    initUI("#" + m.label + " - " + m.ti, null, c, () => buildJobDetailPayload(m), [
      { text: "Back to Results", action: () => renderResultsList(dt) }
    ]);
  };

  const renderResultsList = (dt) => {
    const listC = el("div", "", null, { class: "jc-scroll-list" });
    if (!dt.m.length) {
      elTxt("div", "No matches detected.", listC, { style: "text-align:center;padding:40px" });
    } else {
      dt.m.forEach(m => {
        const i = el("div", "", listC, { class: "jc-list-item" });
        const titleRow = el("div", "", i, { style: "display:flex;justify-content:space-between;align-items:flex-start;gap:8px;" });
        const safeHref = /^https?:\/\//i.test(m.ln) ? m.ln : "#";
        elTxt("a", "#" + m.label + " - " + m.ti, titleRow, { class: "jc-item-title", href: safeHref, target: "_blank", rel: "noopener noreferrer", style: "flex:1;" });
        const expBtn = elTxt("button", "Expand", titleRow, { class: "jc-btn jc-btn-ghost", style: "padding:4px 10px;font-size:12px;flex-shrink:0;" });
        expBtn.onclick = () => showJobDetail(m, dt);
        elTxt("div", m.pg + " | " + m.sal + " | " + m.autoFlags, i, { class: "jc-item-meta" });
        el("div", "<strong>Schedule/Loc:</strong> " + esc(m.schedule), i, { style: "font-size:12px;color:#059669;margin-bottom:4px;" });
        if (m.reqSnippet) el("div", "<strong>Reqs:</strong> " + esc(m.reqSnippet), i, { style: "font-size:12px;color:#475569;margin-bottom:4px;" });
        if (m.kwSnip) el("div", "<strong>Keyword:</strong> <span style=\"background:#fef08a;padding:2px 4px;border-radius:2px;\">" + esc(m.kwSnip) + "</span>", i, { style: "font-size:12px;color:#854d0e;margin-top:4px;" });
      });
    }
    const hdTxt = dt.m.length ? "Found " + dt.m.length + " jobs (out of " + dt.tot + ")" : "No jobs found (out of " + dt.tot + ").";
    initUI("Scan Results", hdTxt, listC, () => buildScanPayload(dt));
  };

  const verifyPayload = (rawJsonStr, modal) => {
    const parseRes = Ext.parsePayloadJSON(rawJsonStr);
    modal.innerHTML = "";
    elTxt("h2", "PA Jobs Bookmark: Check Answers", modal, { class: "jc-header" });
    const listC = el("div", "", modal, { class: "jc-scroll-list", style: "display:flex;flex-direction:column;gap:12px;" });

    if (!parseRes.ok) {
      const errBox = el("div", "", listC, { class: "jc-diag-err" });
      elTxt("div", parseRes.error, errBox, { style: "font-weight:700;margin-bottom:6px;" });
      if (parseRes.rawSnippet) elTxt("pre", parseRes.rawSnippet, errBox, { style: "white-space:pre-wrap;font-size:11px;margin:0;" });
      const report = Ext.buildDiagnosticReport(parseRes, []);
      const actBot = el("div", "", modal, { class: "jc-actions" });
      const cpErrBtn = elTxt("button", "Copy Error Report for AI", actBot, { class: "jc-btn jc-btn-err" });
      cpErrBtn.onclick = async () => {
        await copyText(report);
        cpErrBtn.textContent = "Copied Error Report! Paste into AI Chat";
      };
      elTxt("button", "Close", actBot, { class: "jc-btn jc-btn-ghost" }).onclick = closeModal;
      return;
    }

    const data = parseRes.data;
    const ms = parseRes.morphStats;
    const morphNotes = [];
    if (ms.strippedFences) morphNotes.push("stripped code fences");
    if (ms.strippedMarkdown) morphNotes.push("cleaned Markdown in " + ms.strippedMarkdown + " answer(s)");
    if (ms.fixedTypography) morphNotes.push("normalized dashes/quotes in " + ms.fixedTypography + " answer(s)");
    if (ms.swappedVerbs) morphNotes.push("replaced utilize/leveraged in " + ms.swappedVerbs + " answer(s)");
    if (morphNotes.length) {
      elTxt("div", "Auto-Sanitized: " + morphNotes.join(", ") + ".", listC, { class: "jc-diag-ok" });
    }

    const qNodes = Ext.getQNodes(document);
    const vState = [];
    const itemDiagnostics = [];
    const seen = new Set();

    const actBot = el("div", "", modal, { class: "jc-actions" });
    const injBtn = elTxt("button", "Approve & Fill Form", actBot, { class: "jc-btn jc-btn-success" });
    const diagBtn = elTxt("button", "", actBot, { class: "jc-btn jc-btn-warn", style: "display:none;" });
    elTxt("button", "Cancel", actBot, { class: "jc-btn jc-btn-ghost" }).onclick = closeModal;

    const refreshFooterTotals = () => {
      const filledCount = vState.filter(v => v.ta.value.trim().length > 0).length;
      injBtn.textContent = "Approve & Fill Form (" + filledCount + ")";
      const tErr = itemDiagnostics.reduce((s, d) => s + d.errors.length, 0);
      const tWarn = itemDiagnostics.reduce((s, d) => s + d.warnings.length, 0);
      if (tErr > 0 || tWarn > 0) {
        diagBtn.style.display = "";
        diagBtn.className = "jc-btn " + (tErr > 0 ? "jc-btn-err" : "jc-btn-warn");
        diagBtn.textContent = "Copy Fix Request for AI (" + tErr + " Err, " + tWarn + " Warn)";
      } else {
        diagBtn.style.display = "none";
      }
    };

    qNodes.forEach((qEl, idx) => {
      const qKey = Ext.getQKey(qEl, idx);
      if (seen.has(qKey)) return;
      seen.add(qKey);

      const txt = Ext.getQText(qEl, "Question " + (idx + 1));
      const ans = data[qKey] ? data[qKey].trim() : "";

      const iBox = el("div", "", listC, { style: "background:#fff;padding:12px;border:1px solid var(--b);border-radius:6px;" });
      el("div", "<strong>" + esc(qKey) + "</strong>: " + esc(txt), iBox, { style: "font-size:13px;margin-bottom:8px;color:var(--t);" });

      const ta = el("textarea", "", iBox, { class: "jc-textarea", style: "min-height:auto !important; resize:none !important; overflow:hidden;" });
      ta.value = ans;
      attachAutoResize(ta, 10);

      const diagContainer = el("div", "", iBox);
      const mRow = elTxt("div", "W: 0 | C: 0", iBox, { style: "font-size:11px;color:#6b7280;margin-top:4px;text-align:right;font-family:monospace;" });

      const diagEntry = { qKey, errors: [], warnings: [] };
      itemDiagnostics.push(diagEntry);
      vState.push({ ta, mRow, qEl });

      const renderRowLint = () => {
        const val = ta.value.trim();
        const w = val ? val.split(/\s+/).length : 0;
        mRow.textContent = "W: " + w + " | C: " + val.length;
        const lint = Ext.lintQuestion(qEl, qKey, txt, val);
        diagEntry.errors = lint.errors;
        diagEntry.warnings = lint.warnings;
        diagContainer.innerHTML = "";
        lint.errors.forEach(e => {
          elTxt("div", "⛔ [" + e.code + "] " + e.msg, diagContainer, { class: "jc-diag-err" });
        });
        lint.warnings.forEach(wn => {
          elTxt("div", "⚠️ [" + wn.code + "] " + wn.msg, diagContainer, { class: "jc-diag-warn" });
        });
        refreshFooterTotals();
      };

      ta.addEventListener("input", renderRowLint);
      renderRowLint();
    });

    injBtn.onclick = () => {
      let inj = 0;
      vState.forEach(v => {
        inj += Ext.injAns(v.qEl, Ext.san(v.ta.value));
      });
      alert("Success! Auto-filled " + inj + " matching fields on page.");
      closeModal();
    };

    diagBtn.onclick = async () => {
      const rep = Ext.buildDiagnosticReport(parseRes, itemDiagnostics);
      await copyText(rep);
      diagBtn.textContent = "Copied! Paste into AI Chat to Auto-Fix";
    };
  };

  const injectAnswers = (rawJsonStr, modal) => {
    const parseRes = Ext.parsePayloadJSON(rawJsonStr);
    if (!parseRes.ok) {
      verifyPayload(rawJsonStr, modal);
      return;
    }
    const data = parseRes.data;
    let count = 0;
    Ext.getQNodes(document).forEach((qEl, idx) => {
      const qKey = Ext.getQKey(qEl, idx);
      const answer = data[qKey];
      if (!answer) return;
      count += Ext.injAns(qEl, answer);
    });
    alert("Success! Auto-filled " + count + " fields. Please review visually before submitting.");
    closeModal();
  };

  const isL = document.querySelector(".list-item");
  if (u.includes("/apply/questions")) {
    const q = Ext.getQNodes(document);
    if (q.length === 0) return alert("We couldn't find any supplemental questions. Please ensure you are on the Application Questions step.");
    const c = el("div", "", null, { class: "jc-flex-col" });
    const ta = el("textarea", "", c, { class: "jc-textarea", readonly: true, style: "flex:1;resize:none;overflow-y:auto;" });
    ta.value = "### APPLICATION QUESTIONS\n\n" + Ext.q();
    initUI("PA Jobs Bookmark: Application Questions", "Copy these questions into your AI chat, or click Auto-Fill Answers once your answers are ready.", c, () => ta.value, [
      {
        text: "Auto-Fill Answers",
        class: "jc-btn-success",
        action: () => {
          const wrap = el("div", "", null, { class: "jc-flex-col" });
          const injTa = el("textarea", "", wrap, { class: "jc-textarea", style: "flex:1;resize:none;overflow-y:auto;", placeholder: "Paste the auto-fill code from your AI chat here..." });
          initUI("PA Jobs Bookmark: Auto-Fill Answers", "Paste the auto-fill code from your AI chat below:", wrap, null, [
            { text: "Check Answers (Recommended)", action: (m) => verifyPayload(injTa.value, m) },
            { text: "Fill Form Directly", action: (m) => injectAnswers(injTa.value, m) }
          ]);
        }
      }
    ]);
  } else if (u.includes("/apply/work") || u.includes("/profile") || document.querySelector(".work-tab")) {
    const wData = Ext.w();
    if (!wData) return alert("We couldn't find any work experience data on this page. Please ensure your work history entries are visible.");
    const c = el("div", "", null, { class: "jc-flex-col" });
    const ta = el("textarea", "", c, { class: "jc-textarea", readonly: true, style: "flex:1;resize:none;overflow-y:auto;" });
    ta.value = "### EXTRACTED WORK EXPERIENCE\n\n" + wData;
    initUI("PA Jobs Bookmark: Work History", "Copy and paste this into your AI chat to align your work history.", c, () => ta.value);
  } else if (document.querySelector("#details-info") || document.querySelector(".box-container dl")) {
    const d = Ext.d();
    const has = { m: !!d.t && d.t !== "[Title]", d: !!d.ds, q: !!d.q };
    const active = { m: has.m, d: has.d, q: has.q };
    if (!has.m && !has.d && !has.q) return alert("We couldn't find any job data. Please navigate to a valid job description page and try again.");

    const c = el("div", "", null, { class: "jc-flex-col" });
    const rw = el("div", "", c, { class: "jc-toggles", style: "flex-shrink:0;" });
    const ta = el("textarea", "", c, { class: "jc-textarea", readonly: true, style: "flex:1;resize:none;overflow-y:auto;" });

    const gTxt = () => {
      const wanted = [
        "Pay Group", "Salary", "Job Type", "Department", "Division", "Location",
        "City", "Union", "Closing Date", "Contact Name", "Contact Email"
      ];
      const mStr = active.m && has.m && wanted.reduce((ms, k) => {
        const mk = Object.keys(d.meta).find(x => x.includes(k));
        return mk && d.meta[mk] ? `${ms}\n**${k}:** ${d.meta[mk]}` : ms;
      }, `### JOB METADATA\n**Title:** ${d.t}\n**Link:** ${window.location.href}\n**Company:** ${d.c}\n**Auto-Flags:** ${d.autoFlags}`);
      return [
        mStr,
        active.d && has.d && `### DESCRIPTION\n${d.ds}`,
        active.q && has.q && `### APPLICATION QUESTIONS\n${d.q}`
      ].filter(Boolean).join("\n\n---\n\n");
    };

    const mkP = (k, l) => {
      if (!has[k]) return;
      const p = elTxt("div", l, rw, { class: "jc-pill", "data-active": active[k] ? "true" : "false" });
      p.onclick = () => {
        active[k] = !active[k];
        p.setAttribute("data-active", active[k] ? "true" : "false");
        ta.value = gTxt();
      };
    };

    mkP("m", "Metadata");
    mkP("d", "Description");
    mkP("q", "Questions");
    ta.value = gTxt();
    initUI("PA Jobs Bookmark: Job Posting", "Toggle sections below and click Copy for AI Chat to send to your chat.", c, gTxt);
  } else if (isL) {
    const topWrap = el("div", "", null, { style: "display:flex;flex-direction:column;gap:12px;" });
    const searchRow = el("div", "", topWrap, { style: "display:flex;gap:10px;align-items:center;" });
    const kwInp = el("input", "", searchRow, { class: "jc-textarea", style: "min-height:auto;padding:10px;flex:1;", placeholder: "Optional: Keyword filter inside full job text (e.g., SQL, audit, logistics)" });
    const pagesWrap = el("div", "", searchRow, { style: "display:flex;align-items:center;gap:8px;" });
    elTxt("span", "Pages:", pagesWrap, { style: "font-size:13px;font-weight:600;" });
    const pagesInp = el("input", "", pagesWrap, { type: "number", class: "jc-textarea", style: "min-height:auto;padding:10px;width:60px;", value: "1", min: "1", max: "50" });

    const advWrap = el("details", "", topWrap, { style: "background:#f8fafc;padding:12px;border-radius:6px;border:1px solid #e2e8f0;font-size:13px;" });
    elTxt("summary", "Filter Options (Remote, Seasonal, Local Gov)", advWrap, { style: "font-weight:600;cursor:pointer;color:#0284c7;outline:none;" });
    const togWrap = el("div", "", advWrap, { style: "display:flex;flex-direction:column;gap:8px;margin-top:10px;" });
    const rmLbl = el("label", "<input type='checkbox'> Show remote/telework jobs only", togWrap, { style: "display:flex;align-items:center;gap:6px;cursor:pointer;" });
    const rmCb = rmLbl.querySelector("input");
    const lgLbl = el("label", "<input type='checkbox'> Exclude Local Government", togWrap, { style: "display:flex;align-items:center;gap:6px;cursor:pointer;" });
    const lgCb = lgLbl.querySelector("input");
    const seasLbl = el("label", "<input type='checkbox'> Exclude Seasonal / Temporary", togWrap, { style: "display:flex;align-items:center;gap:6px;cursor:pointer;" });
    const seasCb = seasLbl.querySelector("input");

    initUI("PA Jobs Bookmark: Scan Job List", "Scan multiple Commonwealth job listings at once to find Direct Fits and Creative Pivots.", topWrap, null, [
      {
        text: "Scan Jobs",
        action: async (mo) => {
          const options = { kw: kwInp.value.trim(), maxP: parseInt(pagesInp.value) || 1, exNonRemote: rmCb.checked, exLG: lgCb.checked, exSeas: seasCb.checked };
          mo.innerHTML = "";
          elTxt("h2", "PA Jobs Bookmark: Scan Job List", mo, { class: "jc-header" });
          const pe = el("div", "Initializing scan...", mo, { class: "jc-progress" });

          const dt = await Ext.l(options, (c, t, n) => {
            if (t === 0) {
              pe.innerHTML = esc(n) + "<br><span style=\"font-size:12px\">Loading more jobs...</span>";
            } else {
              pe.innerHTML = "Fetching Job " + Number(c) + " of " + Number(t) + "...<br><span style=\"font-size:12px\">" + esc(n) + "</span>";
            }
          });

          const store = assignLabels(dt.m.map(x => ({ jobId: x.jobId, title: x.ti, url: x.ln })));
          dt.m.forEach(x => { x.label = store.jobs[x.jobId].label; });

          renderResultsList(dt);
        }
      }
    ]);
  } else {
    alert("No supported NEOGOV data structure detected on this page. Navigate to a PA job search list, job posting, work history tab, or application questionnaire page and click PA Jobs Bookmark again.");
  }
})();
