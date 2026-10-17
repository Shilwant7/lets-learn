# Let's Learn

A free, single-page programming study website, ready for GitHub Pages. Built with plain HTML, CSS and JavaScript; no build step, database or dependencies.

## Features
- Top subject navigation, context-sensitive topic sidebar and question/answer reading panel
- Responsive desktop/mobile layout
- Topic search within the selected subject
- Light/dark toggle, remembered in your browser
- Direct links to subjects and topics using URL hashes
- HTML escaping for content, including code examples

## Folder structure
```text
lets-learn/
├── index.html                  # Single-page layout
├── README.md                   # This guide
├── assets/
│   ├── css/style.css           # Styling, layout and dark mode
│   └── js/app.js               # Navigation, rendering and search
└── data/
    ├── c.json
    ├── cpp.json
    ├── data-structures.json
    ├── design-patterns.json
    ├── linux.json
    └── database.json           # Subject content
```

## Run locally
Because content is fetched from JSON files, **do not double-click `index.html` using a `file://` URL**. Start a local HTTP server from the project root:

```bash
python -m http.server 8000
```

Open http://localhost:8000 in your browser. Alternatively, use VS Code's Live Server extension.

## Add a question/answer
Open the relevant `data/*.json` file. Find the topic you want and append another object to its `questions` array. `answer` is an array of paragraphs; `code` is optional. Example:

```json
{
  "question": "What is a virtual function?",
  "answer": [
    "A virtual function allows a derived class override to be selected through a base-class pointer or reference."
  ],
  "code": "struct Base { virtual void run() {} };"
}
```

Separate adjacent objects with commas. Keep JSON valid: use double quotes for strings, escape embedded quotes as `\"` and line breaks in code as `\n`. Do not add a trailing comma after the last item. You can validate a file with `python -m json.tool data/cpp.json`.

## Add a new topic to an existing subject
Append a topic object to the `topics` array in that subject's JSON file:

```json
{
  "id": "smart-pointers",
  "title": "Smart Pointers",
  "description": "Ownership and automatic resource management.",
  "questions": [
    {
      "question": "What does unique_ptr do?",
      "answer": ["It represents exclusive ownership of a dynamically allocated object."],
      "code": "auto p = std::make_unique<int>(10);"
    }
  ]
}
```

Each topic `id` must be unique within its subject. It is used in the URL, e.g. `#cpp/smart-pointers`.

## Add a completely new subject
1. Create `data/python.json` with a top-level `topics` array, using the same structure as above.
2. Add `{id:'python',name:'Python',file:'python.json'}` to the `subjects` array near the top of `assets/js/app.js`.
3. Refresh the page. The header and sidebar will update automatically.

## Publish on GitHub Pages
1. Create a public GitHub repository named `lets-learn` (or any name you prefer).
2. Upload the **contents** of this folder to the repository root, ensuring `index.html` is at the root. Or from a terminal in this folder:

```bash
git init
git add .
git commit -m "Initial Let's Learn website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/lets-learn.git
git push -u origin main
```

3. On GitHub open **Settings → Pages → Build and deployment**.
4. Set **Source** to **Deploy from a branch**, choose **main** and **/(root)**, then click **Save**.
5. Wait for deployment. Your site should appear at `https://YOUR_USERNAME.github.io/lets-learn/` (assuming that repository name). Check the Pages screen for its actual URL.
6. To publish edits later, commit and push changes to `main` (or edit the JSON file in GitHub and commit there). Pages will redeploy automatically.

For a root site at `https://YOUR_USERNAME.github.io/`, name the repository `YOUR_USERNAME.github.io` instead.

## Troubleshooting
- Blank content locally: serve via HTTP, not `file://`.
- A topic fails to load: check the JSON syntax, filename and browser console.
- GitHub Pages 404: ensure `index.html` is at the selected publishing root and deployment has finished.
- Updates not visible: wait for deployment, then hard-refresh.

## Content format
Content is treated as plain text, not HTML or Markdown. This is intentional: it keeps notes and code safe to display. The site is static and does not collect user information; only the selected theme is saved locally in browser storage.

## License
Use and adapt this starter for your own learning notes.
