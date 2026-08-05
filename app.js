(function () {
  "use strict";

  const STATUSES = [
    { key: "attempted", label: "Attempted" },
    { key: "solved", label: "Solved" },
    { key: "revise", label: "Revise" }
  ];

  const USERS = (typeof REVISERS !== "undefined" && REVISERS.length === 2) ? REVISERS : ["Pruthviraj", "Vahini"];
  const USER_GLOW = { [USERS[0]]: "#6d5bff", [USERS[1]]: "#ff5f9e" };
  let currentUser = null;
  let currentTopicId = null;
  let pendingScrollTarget = null;

  const DEFAULT_TOPIC = "arrays";

  // progressByUser[user][topicId] = { [problemId]: {status, notes} }
  const progressByUser = {};
  USERS.forEach((u) => { progressByUser[u] = {}; });

  function registry() { return window.TOPIC_REGISTRY || {}; }
  function topicIds() { return Object.keys(registry()); }
  function topicEntry(id) { return registry()[id]; }
  function currentPatterns() { const t = topicEntry(currentTopicId); return t ? t.patterns : []; }
  function currentTopicMeta() { const t = topicEntry(currentTopicId); return t ? t.topic : { title: "", tagline: "" }; }

  const TOPIC_ACCENTS = ["#7c6bff", "#22d3ee", "#ff5f9e", "#2fd490", "#f5a524"];
  function topicAccent(id) {
    const ids = topicIds();
    return TOPIC_ACCENTS[ids.indexOf(id) % TOPIC_ACCENTS.length];
  }

  // ============================================================
  // Icons — simple line SVGs, one per pattern (across all topics) + home
  // ============================================================
  const ICONS = {
    home: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11.5 12 4l8 7.5"/><path d="M6 10.5V20h5v-6h2v6h5v-9.5"/></svg>`,
    // Arrays
    "array-basics": `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 20V14M9 20V6M14 20V11M19 20V16"/><circle cx="9" cy="6" r="1.5" fill="currentColor" stroke="none"/></svg>`,
    "in-place-manipulation": `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2.1l4 4-4 4"/><path d="M3 12.7V12a9 9 0 0 1 9-9c2.4 0 4.5.9 6.1 2.4M7 21.9l-4-4 4-4"/><path d="M21 11.3V12a9 9 0 0 1-9 9c-2.4 0-4.5-.9-6.1-2.4"/></svg>`,
    "two-pointers": `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h6M21 12h-6"/><path d="M9 8l-6 4 6 4M15 8l6 4-6 4"/></svg>`,
    "sliding-window": `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="7" width="18" height="10" rx="1.5"/><rect x="8" y="7" width="6" height="10" fill="currentColor" opacity="0.3" stroke="none"/></svg>`,
    "prefix-sum": `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h13l-6.5 8L18 20H5"/></svg>`,
    kadane: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 16l4-8 4 5 3-9 4 7 3-4"/></svg>`,
    "binary-search": `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="10" cy="10" r="6"/><path d="M15 15l5 5"/></svg>`,
    "binary-search-2d": `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="2" y="2" width="13" height="13" rx="1"/><path d="M2 8.5h13M8.5 2v13"/><circle cx="17" cy="17" r="4" stroke-linejoin="round"/><path d="M20 20l2.3 2.3" stroke-linecap="round"/></svg>`,
    "binary-search-answer": `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.2"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/></svg>`,
    hashing: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 4 4.5 20M18 4l-1.5 16M3 9h18M2.5 15h18"/></svg>`,
    "cyclic-sort": `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 0 1 14-5"/><path d="M18 3v4h-4"/><path d="M20 12a8 8 0 0 1-14 5"/><path d="M6 21v-4h4"/></svg>`,
    "merge-intervals": `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="6" width="11" height="5" rx="1.5"/><rect x="10" y="13" width="11" height="5" rx="1.5"/></svg>`,
    matrix: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="1.5"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>`,
    "monotonic-stack": `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 20V13M9 20V8M14 20V11M19 20V5"/></svg>`,
    greedy: `<svg class="icon" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M13 2 4 14h6l-1 8 9-12h-6z"/></svg>`,
    "sorting-tricks": `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4v16M7 4 4 7M7 4l3 3"/><path d="M17 20V4M17 20l-3-3M17 20l3-3"/></svg>`,
    "bit-manipulation": `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="9" width="6" height="6" rx="1"/><rect x="15" y="9" width="6" height="6" rx="1" fill="currentColor"/></svg>`,
    "construction-rearrangement": `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.3"/></svg>`,
    // Linked List
    "ll-basics": `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="4" cy="12" r="2.3"/><path d="M6.3 12h4.4"/><circle cx="12" cy="12" r="2.3"/><path d="M14.3 12h4.4"/><circle cx="20" cy="12" r="2.3" fill="currentColor" stroke="none"/></svg>`,
    "fast-slow-pointers": `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="4" r="1.7" fill="currentColor" stroke="none"/><circle cx="18.9" cy="15" r="1.7" fill="currentColor" stroke="none"/></svg>`,
    reversal: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M3.5 13a9 9 0 1 0 2.6-6.4L3 9"/></svg>`,
    "gap-technique": `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="5" cy="12" r="2.2"/><circle cx="19" cy="12" r="2.2"/><path d="M8 12h8" stroke-dasharray="2.2 2.2"/></svg>`,
    "dummy-node": `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="2" y="9" width="5" height="5" rx="1" stroke-dasharray="2 2"/><path d="M8 11.5h4M16 11.5h4"/><circle cx="12" cy="11.5" r="2.3"/></svg>`,
    "merge-sort-ll": `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 6l8 6M20 6l-8 6M12 12v6"/><circle cx="4" cy="6" r="1.6" fill="currentColor" stroke="none"/><circle cx="20" cy="6" r="1.6" fill="currentColor" stroke="none"/><circle cx="12" cy="18" r="1.6" fill="currentColor" stroke="none"/></svg>`,
    rewiring: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="8" width="8" height="8" rx="4"/><rect x="13" y="8" width="8" height="8" rx="4"/></svg>`,
    "doubly-linked-list": `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="4" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="20" cy="12" r="2" fill="currentColor" stroke="none"/><path d="M6.2 10.3h3.6M14.2 10.3h3.6"/><path d="M9.8 13.7H6.2M17.8 13.7h-3.6"/></svg>`,
    // Stacks & Queues
    "stack-fundamentals": `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="5" y="4" width="14" height="4" rx="1"/><rect x="5" y="10" width="14" height="4" rx="1"/><rect x="5" y="16" width="14" height="4" rx="1"/></svg>`,
    "bracket-matching": `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4c-2 0-3 1-3 3v3c0 1-1 2-2 2 1 0 2 1 2 2v3c0 2 1 3 3 3"/><path d="M15 4c2 0 3 1 3 3v3c0 1 1 2 2 2-1 0-2 1-2 2v3c0 2-1 3-3 3"/></svg>`,
    "area-water": `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 20V10M9 20V6M14 20V13M19 20V8"/><path d="M2 16q2-1.5 4 0t4 0 4 0 4 0" opacity="0.6"/></svg>`,
    "design-structures": `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h10M7 13h6"/><circle cx="17.5" cy="15.5" r="1.3" fill="currentColor" stroke="none"/></svg>`
  };

  function hexToRgba(hex, alpha) {
    const h = hex.replace("#", "");
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const bigint = parseInt(full, 16);
    const r = (bigint >> 16) & 255, g = (bigint >> 8) & 255, b = bigint & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  // ============================================================
  // Store: abstracts Firebase Realtime Database vs. localStorage.
  // Data is namespaced per user AND per topic.
  // ============================================================
  const Store = (function () {
    let useFirebase = false;
    let db = null;

    function localKey(user, topicId) { return `dsa_progress_${user}_${topicId}`; }
    function readLocal(user, topicId) {
      try { return JSON.parse(localStorage.getItem(localKey(user, topicId))) || {}; }
      catch (e) { return {}; }
    }
    function writeLocal(user, topicId, data) { localStorage.setItem(localKey(user, topicId), JSON.stringify(data)); }

    function init() {
      if (typeof FIREBASE_CONFIG === "object" && FIREBASE_CONFIG !== null && typeof firebase !== "undefined") {
        try {
          firebase.initializeApp(FIREBASE_CONFIG);
          db = firebase.database();
          useFirebase = true;
        } catch (e) {
          console.error("Firebase init failed, falling back to local-only storage.", e);
          useFirebase = false;
        }
      }
      return useFirebase;
    }

    function subscribe(user, topicId, cb) {
      if (useFirebase) db.ref(`progress/${user}/${topicId}`).on("value", (snap) => cb(user, topicId, snap.val() || {}));
      else cb(user, topicId, readLocal(user, topicId));
    }

    function setEntry(user, topicId, problemId, patch) {
      if (useFirebase) {
        const clean = {};
        Object.keys(patch).forEach((k) => { clean[k] = patch[k] === undefined ? null : patch[k]; });
        db.ref(`progress/${user}/${topicId}/${problemId}`).update(clean);
      } else {
        const data = readLocal(user, topicId);
        data[problemId] = Object.assign({}, data[problemId], patch);
        writeLocal(user, topicId, data);
        localListeners.forEach((fn) => fn(user, topicId, data));
      }
    }

    let localListeners = [];
    function onLocalChange(fn) { localListeners.push(fn); }

    return { init, subscribe, setEntry, onLocalChange, isFirebase: () => useFirebase };
  })();

  function slug(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
  function escapeHtml(str) { return str.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); }
  function problemIdOf(pattern, problem) { return `${pattern.id}--${slug(problem.name)}`; }

  // ============================================================
  // Confetti
  // ============================================================
  const CONFETTI_COLORS = ["#ff5f9e", "#6d5bff", "#22d3ee", "#10b981", "#f59e0b"];
  function celebrate(originEl) {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = originEl.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;
    for (let i = 0; i < 16; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      const angle = (Math.PI * 2 * i) / 16 + Math.random() * 0.5;
      const distance = 40 + Math.random() * 50;
      piece.style.left = originX + "px";
      piece.style.top = originY + "px";
      piece.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      piece.style.setProperty("--dx", (Math.cos(angle) * distance) + "px");
      piece.style.setProperty("--dy", (Math.sin(angle) * distance - 20) + "px");
      piece.style.setProperty("--rot", Math.floor(Math.random() * 360) + "deg");
      document.body.appendChild(piece);
      piece.addEventListener("animationend", () => piece.remove());
    }
  }

  // ============================================================
  // Progress ring helper
  // ============================================================
  function ringMarkup(ringId, size, sw) {
    size = size || 60; sw = sw || 6;
    const r = (size - sw) / 2;
    const c = 2 * Math.PI * r;
    return `<div class="progress-ring-wrap" data-ring="${ringId}">
      <svg viewBox="0 0 ${size} ${size}">
        <circle class="track" cx="${size / 2}" cy="${size / 2}" r="${r}"></circle>
        <circle class="fill" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-dasharray="${c}" stroke-dashoffset="${c}"></circle>
      </svg>
      <div class="ring-pct"></div>
    </div>`;
  }
  function animateRing(ringId, pct, label) {
    const wrap = document.querySelector(`[data-ring="${ringId}"]`);
    if (!wrap) return;
    const circle = wrap.querySelector("circle.fill");
    const c = parseFloat(circle.getAttribute("stroke-dasharray"));
    const offset = c * (1 - pct);
    const pctLabel = wrap.querySelector(".ring-pct");
    if (pctLabel) pctLabel.textContent = label;
    requestAnimationFrame(() => requestAnimationFrame(() => { circle.style.strokeDashoffset = offset; }));
  }

  // ============================================================
  // Progress computation (always relative to the ACTIVE topic)
  // ============================================================
  function computeUserPatternStats(user, pattern) {
    let solved = 0;
    const total = pattern.problems.length;
    const topicData = (progressByUser[user] || {})[currentTopicId] || {};
    pattern.problems.forEach((problem) => {
      const entry = topicData[problemIdOf(pattern, problem)];
      if (entry && entry.status === "solved") solved++;
    });
    return { solved, total };
  }
  function computeUserTotals(user) {
    let solved = 0, total = 0;
    currentPatterns().forEach((p) => {
      const s = computeUserPatternStats(user, p);
      solved += s.solved; total += s.total;
    });
    return { solved, total };
  }

  // ============================================================
  // Router — hash format: #{topicId}/home  or  #{topicId}/pattern/{patternId}
  // ============================================================
  function currentRoute() {
    const parts = location.hash.replace("#", "").split("/").filter(Boolean);
    const topic = parts[0] && topicEntry(parts[0]) ? parts[0] : (currentTopicId || DEFAULT_TOPIC);
    if (parts[1] === "pattern" && parts[2]) return { topic, view: "pattern", id: parts[2] };
    return { topic, view: "home" };
  }

  function navigate(hash) { location.hash = hash; }
  function navHome(topicId) { navigate(`${topicId || currentTopicId}/home`); }
  function navPattern(patternId, topicId) { navigate(`${topicId || currentTopicId}/pattern/${patternId}`); }

  function handleRoute() {
    const route = currentRoute();
    currentTopicId = route.topic;
    localStorage.setItem("dsa_last_topic", currentTopicId);

    closeMobileDrawer();
    renderTopicSwitcher();
    renderSidebar(route.view === "pattern" ? route.id : "home");

    const topbar = document.getElementById("topbar");
    document.getElementById("search-input").value = "";
    document.getElementById("mobile-title").textContent = currentTopicMeta().title + " · Pattern Atlas";

    if (route.view === "pattern") {
      const pattern = currentPatterns().find((p) => p.id === route.id);
      if (!pattern) { navHome(); return; }
      topbar.classList.add("in-pattern");
      setCrumb(pattern.name);
      renderPatternView(pattern);
    } else {
      topbar.classList.remove("in-pattern");
      setCrumb(null);
      renderHome();
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function setCrumb(patternName) {
    const crumb = document.getElementById("crumb");
    if (!patternName) {
      crumb.innerHTML = `<span class="current">${currentTopicMeta().title}</span>`;
    } else {
      crumb.innerHTML = `<a href="#${currentTopicId}/home">${currentTopicMeta().title}</a><span class="sep">/</span><span class="current">${patternName}</span>`;
    }
  }

  // ============================================================
  // Topic switcher (sidebar)
  // ============================================================
  function renderTopicSwitcher() {
    const el = document.getElementById("topic-switcher");
    if (!el) return;
    el.innerHTML = topicIds().map((id) => {
      const meta = topicEntry(id).topic;
      const active = id === currentTopicId;
      return `<button class="topic-pill ${active ? "active" : ""}" data-topic="${id}" style="--tcolor:${topicAccent(id)}">${meta.title}</button>`;
    }).join("");
    el.querySelectorAll("[data-topic]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.topic === currentTopicId) return;
        navHome(btn.dataset.topic);
      });
    });
  }

  // ============================================================
  // Sidebar
  // ============================================================
  function renderSidebar(activeId) {
    const nav = document.getElementById("sidebar-nav");
    let html = `<button class="nav-item ${activeId === "home" ? "active" : ""}" data-nav="home">
        <span class="nav-icon">${ICONS.home}</span><span class="nav-label">Home</span>
      </button>
      <div class="nav-section-label">Patterns</div>`;
    currentPatterns().forEach((p) => {
      const stats = currentUser ? computeUserPatternStats(currentUser, p) : { solved: 0, total: p.problems.length };
      html += `<button class="nav-item ${activeId === p.id ? "active" : ""}" data-nav="pattern/${p.id}" data-pattern="${p.id}" style="--pcolor:${p.color}">
        <span class="nav-icon">${ICONS[p.icon]}</span>
        <span class="nav-label">${p.name}</span>
        <span class="nav-progress">${stats.solved}/${stats.total}</span>
      </button>`;
    });
    nav.innerHTML = html;
    nav.querySelectorAll("[data-nav]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.nav === "home") navHome();
        else navPattern(btn.dataset.pattern);
      });
    });
  }

  function updateSidebarProgress() {
    document.querySelectorAll(".nav-item[data-pattern]").forEach((item) => {
      const pattern = currentPatterns().find((p) => p.id === item.dataset.pattern);
      if (!pattern) return;
      const stats = computeUserPatternStats(currentUser, pattern);
      const el = item.querySelector(".nav-progress");
      if (el) el.textContent = `${stats.solved}/${stats.total}`;
    });
  }

  // ============================================================
  // Skeletons + view transition
  // ============================================================
  function showSkeleton(count) {
    const root = document.getElementById("view-root");
    let cards = "";
    for (let i = 0; i < (count || 6); i++) cards += `<div class="skeleton-card"></div>`;
    root.innerHTML = `<div class="skeleton-grid">${cards}</div>`;
  }
  function revealView(html) {
    const root = document.getElementById("view-root");
    root.innerHTML = html;
    root.classList.add("view-enter");
    requestAnimationFrame(() => {
      root.classList.add("view-enter-active");
      requestAnimationFrame(() => root.classList.remove("view-enter", "view-enter-active"));
    });
  }

  // ============================================================
  // Home dashboard
  // ============================================================
  function renderHome() {
    showSkeleton(8);
    const topicAtRequest = currentTopicId;
    setTimeout(() => {
      if (currentTopicId !== topicAtRequest) return; // topic changed mid-flight, bail
      const totalsHtml = USERS.map((u) => {
        const totals = computeUserTotals(u);
        return `<div class="progress-card">
          ${ringMarkup("user-" + u, 60, 6)}
          <div>
            <div class="stats-name">${u}${u === currentUser ? " (you)" : ""}</div>
            <div class="stats-frac">${totals.solved}<span> / ${totals.total} solved</span></div>
          </div>
        </div>`;
      }).join("");

      const patternCards = currentPatterns().map((p, i) => {
        const searchBlob = (p.name + " " + p.trigger + " " + p.problems.map((x) => x.name).join(" ")).toLowerCase();
        return `<button class="pattern-card stagger-in" style="--pcolor:${p.color};--pcolor-soft:${hexToRgba(p.color, 0.14)};animation-delay:${Math.min(i * 45, 400)}ms" data-pattern="${p.id}" data-search="${escapeHtml(searchBlob)}">
          <div class="icon-badge">${ICONS[p.icon]}</div>
          <h3>${p.name}</h3>
          <p class="card-trigger">${p.trigger}</p>
          <div class="card-foot">
            <div class="mini-bar"><div class="mini-bar-fill" data-fill="${p.id}"></div></div>
            <span data-frac="${p.id}">0/${p.problems.length}</span>
          </div>
        </button>`;
      }).join("");

      const html = `
        <h1 class="dash-greeting">Welcome back, ${currentUser}</h1>
        <p class="dash-sub">${currentTopicMeta().tagline}</p>

        <div class="progress-overview">${totalsHtml}</div>

        <div class="revise-queue" id="revise-queue">
          <div class="section-label">Needs revision</div>
          <div class="revise-scroll" id="revise-scroll"></div>
        </div>

        <div class="section-label">Browse by pattern</div>
        <p class="finder-hint">Type in the search bar above to filter by pattern, trigger keyword, or problem name.</p>
        <div class="pattern-grid" id="pattern-grid">${patternCards}</div>
      `;
      revealView(html);

      document.querySelectorAll(".pattern-card").forEach((card) => {
        card.addEventListener("click", () => navPattern(card.dataset.pattern));
      });

      updateHomeProgress();
    }, 260);
  }

  function updateHomeProgress() {
    if (currentRoute().view !== "home") return;
    USERS.forEach((u) => {
      const totals = computeUserTotals(u);
      const pct = totals.total ? totals.solved / totals.total : 0;
      animateRing("user-" + u, pct, Math.round(pct * 100) + "%");
    });
    currentPatterns().forEach((p) => {
      const stats = computeUserPatternStats(currentUser, p);
      const fill = document.querySelector(`[data-fill="${p.id}"]`);
      const frac = document.querySelector(`[data-frac="${p.id}"]`);
      if (fill) requestAnimationFrame(() => { fill.style.width = (stats.total ? (stats.solved / stats.total * 100) : 0) + "%"; });
      if (frac) frac.textContent = `${stats.solved}/${stats.total}`;
    });
    renderReviseQueue();
  }

  function renderReviseQueue() {
    const box = document.getElementById("revise-queue");
    const scroll = document.getElementById("revise-scroll");
    if (!box || !scroll) return;
    const items = [];
    const topicData = (progressByUser[currentUser] || {})[currentTopicId] || {};
    currentPatterns().forEach((p) => {
      p.problems.forEach((problem) => {
        const pid = problemIdOf(p, problem);
        const entry = topicData[pid];
        if (entry && entry.status === "revise") items.push({ name: problem.name, patternId: p.id, problemId: pid });
      });
    });
    scroll.innerHTML = items.map((i) => `<a class="revise-chip" href="#${currentTopicId}/pattern/${i.patternId}" data-problem="${i.problemId}"><span class="dot"></span>${i.name}</a>`).join("");
    box.classList.toggle("has-items", items.length > 0);
    scroll.querySelectorAll(".revise-chip").forEach((chip) => {
      chip.addEventListener("click", () => { pendingScrollTarget = chip.dataset.problem; });
    });
  }

  function filterHomeCards(query) {
    const q = query.trim().toLowerCase();
    document.querySelectorAll(".pattern-card").forEach((card) => {
      card.dataset.hidden = String(!(!q || card.dataset.search.includes(q)));
    });
  }

  // ============================================================
  // Pattern detail view
  // ============================================================
  function renderProblemCard(pattern, problem) {
    const problemId = problemIdOf(pattern, problem);
    const topicIdAtRender = currentTopicId;
    const card = document.createElement("article");
    card.className = "problem-card";
    card.dataset.problemId = problemId;
    card.dataset.name = problem.name.toLowerCase();
    card.dataset.difficulty = problem.difficulty;

    const variations = (problem.variations || []).length
      ? `<div class="mini-list-label">Variations</div><ul class="mini-list">${problem.variations.map((v) => `<li>${v}</li>`).join("")}</ul>`
      : "";
    const gotchas = (problem.gotchas || []).length
      ? `<div class="mini-list-label">Gotchas</div><ul class="mini-list gotchas">${problem.gotchas.map((g) => `<li>${g}</li>`).join("")}</ul>`
      : "";

    const reviserRow = USERS.map((user) => {
      if (user === currentUser) {
        const btns = STATUSES.map((s) => `<button class="status-btn" data-status="${s.key}" type="button">${s.label}</button>`).join("");
        return `<div class="reviser-block is-me" data-user="${user}"><span class="reviser-name">${user} (you)</span><div class="status-select">${btns}</div></div>`;
      }
      return `<div class="reviser-block" data-user="${user}"><span class="reviser-name">${user}</span><span class="status-dot" data-user-dot="${user}"></span><span class="status-readonly-label" data-user-label="${user}">Not started</span></div>`;
    }).join("");

    const notesGrid = USERS.map((user) => `
      <div class="notes-block">
        <div class="mini-list-label">${user}${user === currentUser ? " (editable)" : ""}</div>
        <textarea class="notes" data-user="${user}" ${user === currentUser ? "" : "disabled"}
          placeholder="${user === currentUser ? "Jot a reminder for next time…" : "No notes yet."}"></textarea>
      </div>`).join("");

    card.innerHTML = `
      <div class="problem-top">
        <h3><a href="${problem.link}" target="_blank" rel="noopener">${problem.name}</a></h3>
        <span class="badge diff-${problem.difficulty}">${problem.difficulty}</span>
      </div>
      <div class="approach-label">Approach</div>
      <p class="idea">${problem.idea}</p>
      <div class="complexity-row"><span class="badge">Time ${problem.time}</span><span class="badge">Space ${problem.space}</span></div>
      <details class="code-details">
        <summary>Code template</summary>
        <pre><code>${escapeHtml(problem.code)}</code></pre>
      </details>
      ${variations}
      ${gotchas}
      <div class="reviser-row">${reviserRow}</div>
      <div class="notes-grid">${notesGrid}</div>
    `;

    card.querySelectorAll(".status-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const topicData = progressByUser[currentUser][topicIdAtRender] || {};
        const cur = (topicData[problemId] || {}).status;
        const newStatus = cur === btn.dataset.status ? null : btn.dataset.status;
        Store.setEntry(currentUser, topicIdAtRender, problemId, { status: newStatus });
        if (newStatus === "solved") celebrate(btn);
      });
    });

    const myTextarea = card.querySelector(`textarea.notes[data-user="${currentUser}"]`);
    if (myTextarea) {
      myTextarea.addEventListener("blur", () => Store.setEntry(currentUser, topicIdAtRender, problemId, { notes: myTextarea.value }));
    }

    return card;
  }

  function renderPatternView(pattern) {
    showSkeleton(5);
    const topicAtRequest = currentTopicId;
    setTimeout(() => {
      if (currentTopicId !== topicAtRequest) return;
      const stats = computeUserPatternStats(currentUser, pattern);
      const html = `
        <a class="back-link" href="#${currentTopicId}/home">&larr; All patterns</a>
        <div class="pattern-view-header" style="--pcolor:${pattern.color};--pcolor-soft:${hexToRgba(pattern.color, 0.14)}">
          <div class="icon-badge-lg">${ICONS[pattern.icon]}</div>
          <div>
            <h1>${pattern.name}</h1>
            <p class="trigger">Spot it when: ${pattern.trigger}</p>
            <p class="summary">${pattern.summary}</p>
          </div>
          <div class="pv-ring">${ringMarkup("pattern-header", 56, 5)}</div>
        </div>
        <div class="problem-grid" id="problem-grid" style="--pcolor:${pattern.color};--pcolor-soft:${hexToRgba(pattern.color, 0.14)}"></div>
      `;
      revealView(html);

      const grid = document.getElementById("problem-grid");
      pattern.problems.forEach((problem, i) => {
        const card = renderProblemCard(pattern, problem);
        card.classList.add("stagger-in");
        card.style.animationDelay = Math.min(i * 55, 400) + "ms";
        grid.appendChild(card);
      });

      USERS.forEach((u) => applyProgressToPatternCards(u, currentTopicId, progressByUser[u][currentTopicId] || {}));
      const pct = stats.total ? stats.solved / stats.total : 0;
      animateRing("pattern-header", pct, `${stats.solved}/${stats.total}`);

      if (pendingScrollTarget) {
        const card = document.querySelector(`[data-problem-id="${pendingScrollTarget}"]`);
        if (card) {
          setTimeout(() => {
            card.scrollIntoView({ behavior: "smooth", block: "center" });
            card.style.boxShadow = "0 0 0 2px var(--status-revise)";
            setTimeout(() => (card.style.boxShadow = ""), 1600);
          }, 150);
        }
        pendingScrollTarget = null;
      }
    }, 220);
  }

  function applyProgressToPatternCards(user, topicId, data) {
    progressByUser[user][topicId] = data || {};
    if (topicId !== currentTopicId) { updateSidebarProgress(); return; } // data for a background topic — store only
    if (currentRoute().view !== "pattern") { updateSidebarProgress(); updateHomeProgress(); return; }

    document.querySelectorAll(".problem-card").forEach((card) => {
      const problemId = card.dataset.problemId;
      const entry = progressByUser[user][topicId][problemId] || {};
      if (user === currentUser) {
        card.querySelectorAll(".status-btn").forEach((btn) => { btn.dataset.active = String(btn.dataset.status === entry.status); });
        const ta = card.querySelector(`textarea.notes[data-user="${user}"]`);
        if (ta && document.activeElement !== ta) ta.value = entry.notes || "";
      } else {
        const dot = card.querySelector(`[data-user-dot="${user}"]`);
        const label = card.querySelector(`[data-user-label="${user}"]`);
        if (dot) dot.dataset.status = entry.status || "";
        if (label) {
          const sd = STATUSES.find((s) => s.key === entry.status);
          label.textContent = sd ? sd.label : "Not started";
        }
        const ta = card.querySelector(`textarea.notes[data-user="${user}"]`);
        if (ta) ta.value = entry.notes || "";
      }
    });
    updateSidebarProgress();
    const route = currentRoute();
    const pattern = currentPatterns().find((p) => p.id === route.id);
    if (pattern) {
      const stats = computeUserPatternStats(currentUser, pattern);
      animateRing("pattern-header", stats.total ? stats.solved / stats.total : 0, `${stats.solved}/${stats.total}`);
    }
  }

  function filterPatternCards() {
    const q = document.getElementById("search-input").value.trim().toLowerCase();
    const diff = document.getElementById("difficulty-filter").value;
    const statusFilter = document.getElementById("status-filter").value;
    const topicData = (progressByUser[currentUser] || {})[currentTopicId] || {};
    document.querySelectorAll(".problem-card").forEach((card) => {
      const matchesQuery = !q || card.dataset.name.includes(q);
      const matchesDiff = diff === "all" || card.dataset.difficulty === diff;
      const entry = topicData[card.dataset.problemId];
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "none" && !(entry && entry.status)) ||
        (entry && entry.status === statusFilter);
      card.dataset.hidden = String(!(matchesQuery && matchesDiff && matchesStatus));
    });
  }

  // ============================================================
  // Mobile drawer
  // ============================================================
  function openMobileDrawer() {
    document.getElementById("sidebar").classList.add("open");
    document.getElementById("sidebar-backdrop").classList.add("show");
  }
  function closeMobileDrawer() {
    const sidebar = document.getElementById("sidebar");
    const backdrop = document.getElementById("sidebar-backdrop");
    if (sidebar) sidebar.classList.remove("open");
    if (backdrop) backdrop.classList.remove("show");
  }

  // ============================================================
  // Top bar wiring
  // ============================================================
  function wireTopbar() {
    const search = document.getElementById("search-input");
    search.addEventListener("input", () => {
      if (currentRoute().view === "home") filterHomeCards(search.value);
      else filterPatternCards();
    });
    document.getElementById("difficulty-filter").addEventListener("change", filterPatternCards);
    document.getElementById("status-filter").addEventListener("change", filterPatternCards);
  }

  function showSyncBanner(isFirebase) {
    const banner = document.getElementById("sync-banner");
    const dot = document.getElementById("sync-dot");
    if (isFirebase) {
      banner.textContent = "Synced live — progress is shared between Pruthviraj and Vahini.";
      banner.classList.add("show", "ok");
      if (dot) dot.classList.add("ok");
    } else {
      banner.innerHTML = `Not synced yet — progress is only saved on this browser. Add your Firebase config in <code>config.js</code> to share progress between both of you.`;
      banner.classList.add("show", "warn");
    }
  }

  // ============================================================
  // Name gate
  // ============================================================
  function buildGate() {
    const row = document.getElementById("picker-row");
    row.innerHTML = USERS.map((user) => `
      <button class="picker-card" type="button" data-user="${user}" style="--card-glow:${USER_GLOW[user]}">
        <div class="picker-avatar">${user.charAt(0)}</div>
        <div class="picker-name">${user}</div>
        <div class="picker-hint">Tap to continue</div>
      </button>
    `).join("");
    row.querySelectorAll(".picker-card").forEach((btn) => btn.addEventListener("click", () => selectUser(btn.dataset.user)));
  }

  function selectUser(user) {
    currentUser = user;
    const row = document.getElementById("picker-row");
    const loading = document.getElementById("gate-loading");
    document.getElementById("gate-loading-text").textContent = `Loading ${user}'s progress…`;
    row.style.display = "none";
    loading.classList.add("show");

    setTimeout(() => {
      bootApp();
      document.getElementById("gate").classList.add("hidden");
      document.getElementById("app-root").classList.add("show");
    }, 650);
  }

  // ============================================================
  // Boot the main app (after a name is chosen)
  // ============================================================
  function bootApp() {
    const savedTopic = localStorage.getItem("dsa_last_topic");
    currentTopicId = (savedTopic && topicEntry(savedTopic)) ? savedTopic : (topicEntry(DEFAULT_TOPIC) ? DEFAULT_TOPIC : topicIds()[0]);

    document.getElementById("sidebar-user-avatar").textContent = currentUser.charAt(0);
    document.getElementById("mobile-avatar").textContent = currentUser.charAt(0);

    const userSelect = document.getElementById("user-switch");
    userSelect.innerHTML = USERS.map((u) => `<option value="${u}">${u}</option>`).join("");
    userSelect.value = currentUser;
    userSelect.addEventListener("change", (e) => {
      currentUser = e.target.value;
      document.getElementById("sidebar-user-avatar").textContent = currentUser.charAt(0);
      document.getElementById("mobile-avatar").textContent = currentUser.charAt(0);
      handleRoute();
    });

    document.getElementById("hamburger").addEventListener("click", openMobileDrawer);
    document.getElementById("sidebar-backdrop").addEventListener("click", closeMobileDrawer);

    initSidebarResize();
    wireTopbar();

    const isFirebase = Store.init();
    showSyncBanner(isFirebase);
    Store.onLocalChange((u, t, data) => applyProgressToPatternCards(u, t, data));
    USERS.forEach((u) => {
      topicIds().forEach((t) => {
        Store.subscribe(u, t, (uu, tt, data) => applyProgressToPatternCards(uu, tt, data));
      });
    });

    window.addEventListener("hashchange", handleRoute);
    if (!location.hash) navHome(currentTopicId);
    else handleRoute();
  }

  // ============================================================
  // Draggable sidebar resize
  // ============================================================
  function initSidebarResize() {
    const handle = document.getElementById("sidebar-resize-handle");
    if (!handle) return;

    const MIN_W = 200, MAX_W = 380;
    const saved = parseInt(localStorage.getItem("dsa_sidebar_width"), 10);
    if (saved && saved >= MIN_W && saved <= MAX_W) {
      document.documentElement.style.setProperty("--sidebar-w", saved + "px");
    }

    let dragging = false;

    function onMove(clientX) {
      const w = Math.min(MAX_W, Math.max(MIN_W, clientX));
      document.documentElement.style.setProperty("--sidebar-w", w + "px");
    }
    function stopDrag() {
      if (!dragging) return;
      dragging = false;
      handle.classList.remove("dragging");
      document.body.classList.remove("resizing-sidebar");
      const current = getComputedStyle(document.documentElement).getPropertyValue("--sidebar-w").trim();
      localStorage.setItem("dsa_sidebar_width", parseInt(current, 10));
    }

    handle.addEventListener("mousedown", (e) => {
      if (window.innerWidth <= 860) return;
      dragging = true;
      handle.classList.add("dragging");
      document.body.classList.add("resizing-sidebar");
      e.preventDefault();
    });
    window.addEventListener("mousemove", (e) => { if (dragging) onMove(e.clientX); });
    window.addEventListener("mouseup", stopDrag);

    handle.addEventListener("touchstart", () => {
      if (window.innerWidth <= 860) return;
      dragging = true;
      handle.classList.add("dragging");
      document.body.classList.add("resizing-sidebar");
    }, { passive: true });
    window.addEventListener("touchmove", (e) => { if (dragging && e.touches[0]) onMove(e.touches[0].clientX); }, { passive: true });
    window.addEventListener("touchend", stopDrag);
  }

  document.addEventListener("DOMContentLoaded", buildGate);
})();