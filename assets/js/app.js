const subjects = [
  { id: "c", name: "C", file: "c.json" },
  { id: "cpp", name: "C++", file: "cpp.json" },
  { id: "data-structures", name: "Data Structures", file: "data-structures.json", },
  { id: "design-patterns", name: "Design Patterns", file: "design-patterns.json", },
  { id: "IPC", name: "IPC", file: "IPC.json", },
  { id: "linux", name: "Linux", file: "linux.json" },
  { id: "database", name: "Database", file: "database.json" },
  { id: "Debugging", name: "Debugging", file: "Debugging.json" },
  { id: "Others", name: "Other", file: "Others.json" },

];
const $ = (id) => document.getElementById(id);
let selected = null,
  items = [],
  topic = null;
const cache = {};
function escapeHTML(s) {
  return String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}

/* ---------- Lightweight, safe Markdown support ---------- */

// Inline formatting: `code`, ***bold italic***, **bold**, *italic*,
// ~~strike~~, <u>underline</u>, [text](http://link)
function inlineMD(s) {
  let t = escapeHTML(s);
  const codes = [];
  // Pull out inline code first so nothing inside it gets formatted
  t = t.replace(/`([^`]+)`/g, (m, c) => {
    codes.push(c);
    return "\u0000" + (codes.length - 1) + "\u0000";
  });
  // Allow only <u>...</u> as raw HTML
  t = t.replace(/&lt;u&gt;([\s\S]*?)&lt;\/u&gt;/g, "<u>$1</u>");
  t = t.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  t = t.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/\*(?!\s)([^*]+?)\*/g, "<em>$1</em>");
  t = t.replace(/~~(.+?)~~/g, "<del>$1</del>");
  t = t.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  );
  // Restore inline code
  t = t.replace(/\u0000(\d+)\u0000/g, (m, i) => `<code>${codes[i]}</code>`);
  return t;
}

// Block formatting: headings, bullet lists, numbered lists, paragraphs.
// One "answer" string may contain several lines separated by \n.
function blockMD(text) {
  const lines = String(text ?? "").split("\n");
  let html = "",
    para = [],
    list = null; // "ul" | "ol"
  const flushPara = () => {
    if (para.length) {
      html += `<p>${para.map(inlineMD).join("<br>")}</p>`;
      para = [];
    }
  };
  const closeList = () => {
    if (list) {
      html += `</${list}>`;
      list = null;
    }
  };
  let inCode = false,
    codeLines = [];
  for (const line of lines) {
    // Fenced code block: ``` ... ```
    if (inCode) {
      if (/^\s*```\s*$/.test(line)) {
        html += `<pre><code>${escapeHTML(codeLines.join("\n"))}</code></pre>`;
        inCode = false;
        codeLines = [];
      } else codeLines.push(line);
      continue;
    }
    if (/^\s*```/.test(line)) {
      flushPara();
      closeList();
      inCode = true;
      continue;
    }
    let m;
    if ((m = line.match(/^\s*(#{1,6})\s+(.*)$/))) {
      flushPara();
      closeList();
      const level = Math.max(3, m[1].length); // h1/h2 are used by the page
      html += `<h${level}>${inlineMD(m[2])}</h${level}>`;
    } else if ((m = line.match(/^\s*[-*+]\s+(.*)$/))) {
      flushPara();
      if (list !== "ul") {
        closeList();
        html += "<ul>";
        list = "ul";
      }
      html += `<li>${inlineMD(m[1])}</li>`;
    } else if ((m = line.match(/^\s*\d+[.)]\s+(.*)$/))) {
      flushPara();
      if (list !== "ol") {
        closeList();
        html += "<ol>";
        list = "ol";
      }
      html += `<li>${inlineMD(m[1])}</li>`;
    } else if (!line.trim()) {
      flushPara();
      closeList();
    } else {
      closeList();
      para.push(line);
    }
  }
  if (inCode) {
    // unclosed fence: still show what was written
    html += `<pre><code>${escapeHTML(codeLines.join("\n"))}</code></pre>`;
  }
  flushPara();
  closeList();
  return html;
}

// One item of the "answer" array: either a text string (Markdown),
// or an object like { "code": ["line 1", "line 2"] } for a code block.
function renderPart(p) {
  if (p && typeof p === "object" && p.code !== undefined) {
    const code = Array.isArray(p.code) ? p.code.join("\n") : String(p.code);
    return `<pre><code>${escapeHTML(code)}</code></pre>`;
  }
  return blockMD(p);
}
function renderHome() {
  selected = null;
  topic = null;
  $("sideTitle").textContent = "Explore";
  $("count").textContent = "";
  $("search").value = "";
  $("topics").innerHTML =
    "<p>Choose a subject above to explore its topics.</p>";
  $("subjects")
    .querySelectorAll("button")
    .forEach((b) => b.classList.remove("active"));
  $("content").innerHTML =
    `<section class="hero"><span class="pill">YOUR LEARNING SPACE</span><h1>Learn something new.<br>One topic at a time.</h1><p class="lead">Clear explanations, practical examples and quick interview-ready answers. Pick a subject to get started.</p></section><div class="cards">${subjects.map((s) => `<button class="card" data-subject="${s.id}"><span>EXPLORE →</span><b>${escapeHTML(s.name)}</b><span>Notes, questions & examples</span></button>`).join("")}</div>`;
  $("content")
    .querySelectorAll("[data-subject]")
    .forEach((b) => (b.onclick = () => (location.hash = b.dataset.subject)));
}
function renderNav() {
  $("subjects").innerHTML = subjects
    .map(
      (s) =>
        `<button data-id="${s.id}" class="${selected === s.id ? "active" : ""}">${escapeHTML(s.name)}</button>`,
    )
    .join("");
  $("subjects")
    .querySelectorAll("button")
    .forEach((b) => (b.onclick = () => (location.hash = b.dataset.id)));
}
async function loadSubject(id) {
  const s = subjects.find((x) => x.id === id);
  if (!s) {
    renderHome();
    return;
  }
  selected = id;
  renderNav();
  $("sideTitle").textContent = s.name;
  $("content").innerHTML = "<p>Loading topics…</p>";
  try {
    if (!cache[id]) {
      const response = await fetch("data/" + s.file);
      if (!response.ok) throw Error("Content unavailable");
      cache[id] = await response.json();
    }
    if (selected !== id) return;
    items = cache[id].topics || [];
    renderTopics();
    const requested = decodeURIComponent(location.hash.split("/")[1] || "");
    showTopic(items.find((t) => t.id === requested) || items[0]);
  } catch (e) {
    $("content").innerHTML =
      "<h1>Unable to load content</h1><p>Use a local web server (see README), or check the JSON file.</p>";
  }
}
function renderTopics() {
  const term = $("search").value.toLowerCase().trim();
  const filtered = items.filter((t) =>
    (t.title + " " + t.questions.map((q) => q.question).join(" "))
      .toLowerCase()
      .includes(term),
  );
  $("count").textContent = filtered.length + " topics";
  $("topics").innerHTML = filtered.length
    ? filtered
        .map(
          (t) =>
            `<button data-topic="${escapeHTML(t.id)}" class="${topic === t.id ? "active" : ""}">${escapeHTML(t.title)}</button>`,
        )
        .join("")
    : "<p>No matching topics.</p>";
  $("topics")
    .querySelectorAll("button")
    .forEach(
      (b) =>
        (b.onclick = () =>
          (location.hash =
            selected + "/" + encodeURIComponent(b.dataset.topic))),
    );
}
// "Collapse answers" setting (off by default, remembered in the browser)
let accordion = false;
try {
  accordion = localStorage.getItem("lets-learn-accordion") === "1";
} catch (e) {}

function renderQuestion(q, i) {
  const body =
    (q.answer || []).map(renderPart).join("") +
    (q.code ? `<pre><code>${escapeHTML(q.code)}</code></pre>` : "");
  const pill = `<span class="pill">QUESTION ${i + 1}</span>`;
  if (accordion) {
    // Always starts collapsed: only the question is visible
    return `<details class="qa acc"><summary>${pill}<span class="qtext">${inlineMD(q.question)}</span></summary><div class="ans">${body}</div></details>`;
  }
  return `<section class="qa">${pill}<h2>${inlineMD(q.question)}</h2>${body}</section>`;
}
function showTopic(t, keepScroll) {
  topic = t?.id || null;
  renderTopics();
  if (!keepScroll) {
    window.scrollTo(0, 0); // always start from the first question
    $("content").scrollTop = 0;
  }
  if (!t) {
    $("content").innerHTML =
      "<h1>Coming soon</h1><p>Add a topic in the corresponding JSON file.</p>";
    return;
  }
  $("content").innerHTML =
    `<span class="eyebrow">${escapeHTML(subjects.find((s) => s.id === selected).name)} / LEARNING NOTES</span><h1>${escapeHTML(t.title)}</h1><p class="lead">${inlineMD(t.description || "Questions and answers")}</p>${t.questions.map(renderQuestion).join("")}`;
}
function route() {
  const [id] = decodeURIComponent(location.hash.slice(1)).split("/");
  if (!id || id === "home") {
    renderHome();
    return;
  }
  if (selected === id) {
    showTopic(
      items.find(
        (t) => t.id === decodeURIComponent(location.hash.split("/")[1] || ""),
      ) || items[0],
    );
    return;
  }
  loadSubject(id);
}
$("search").addEventListener("input", renderTopics);
$("brand").onclick = () => {
  if (location.hash === "#home") renderHome();
};
$("theme").onclick = () => {
  const dark = document.body.classList.toggle("dark");
  localStorage.setItem("lets-learn-theme", dark ? "dark" : "light");
  $("theme").textContent = dark ? "☀" : "☾";
};
if (localStorage.getItem("lets-learn-theme") === "dark") {
  document.body.classList.add("dark");
  $("theme").textContent = "☀";
}
function syncAccordionButton() {
  $("accordion").setAttribute("aria-pressed", accordion ? "true" : "false");
}
$("accordion").onclick = () => {
  accordion = !accordion;
  try {
    localStorage.setItem("lets-learn-accordion", accordion ? "1" : "0");
  } catch (e) {}
  syncAccordionButton();
  const current = items.find((x) => x.id === topic);
  if (selected && current) showTopic(current, true);
};
syncAccordionButton();
window.addEventListener("hashchange", route);
renderNav();
route();
