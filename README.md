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

## Writing Content in JSON

Each subject has a JSON file in `data/` (for example `data/c.json`).

### File structure

```json
{
  "topics": [
    {
      "id": "pointers",
      "title": "Pointers",
      "description": "A short intro shown under the title.",
      "questions": [
        {
          "question": "What is a pointer?",
          "answer": [
            "A **pointer** is a variable that stores a memory address.",
            "Second paragraph here."
          ],
          "code": "int x = 10;\nint *p = &x;"
        }
      ]
    }
  ]
}
```

- `answer` is an array. **Each string is one block** (a paragraph, a heading, or a list).
- `code` is optional. It is shown as a code block exactly as written, with no formatting applied.

### Supported formatting

| What you want | Write this in JSON | Result |
|---|---|---|
| Bold | `"**Bold text**"` | **Bold text** |
| Italic | `"*Italic text*"` | *Italic text* |
| Bold + italic | `"***Bold and italic***"` | ***Bold and italic*** |
| Underline | `"<u>Underlined text</u>"` | <u>Underlined text</u> |
| Strikethrough | `"~~Strikethrough text~~"` | ~~Strikethrough text~~ |
| Inline code | ``"`Inline code`"`` | `Inline code` |
| Mixed in a sentence | `"This is **bold** and *italic*."` | This is **bold** and *italic*. |
| Heading | `"### This is a heading"` | Heading |
| Bullet list | `"- First item\n- Second item"` | • First item<br>• Second item |
| Numbered list | `"1. First step\n2. Second step"` | 1. First step<br>2. Second step |
| Line break in a paragraph | `"Line one\nLine two"` | Two lines, same paragraph |
| Link | `"[Click here](https://example.com)"` | Link (opens in a new tab) |

### Examples

```json
"answer": [
  "### Key points",
  "- Uses **malloc** to allocate memory\n- Always call `free()` afterwards\n- Never use freed memory",
  "1. Declare the pointer\n2. Allocate memory\n3. Use it\n4. Free it",
  "This is <u>important</u>: ~~old way~~ is no longer recommended.",
  "See the [C reference](https://en.cppreference.com/w/c) for more."
]
```

### Rules and tips

- **Headings:** `#`, `##` and `###` all render at the same level (the page already uses H1 and H2). `####` and deeper render slightly smaller.
- **Lists:** start each line with `- ` (dash and space), or `1. ` for numbered lists. Separate lines with `\n` inside the same string.
- **Italic:** `*text*` needs no space after the first `*`. Underscore italics (`_text_`) are not supported.
- **Quotes inside text:** escape double quotes in JSON: `"He said \"hello\""`.
- **Backslashes:** write `\\` for one backslash, for example `"Use \\n for a newline in C"`.
- **Newlines:** JSON strings cannot contain real line breaks. Use `\n`.
- **HTML:** only `<u>...</u>` is allowed. Any other HTML tag is shown as plain text, not run.
- **Formatting inside `code`:** none. Markdown is not applied there.
- **Formatting inside questions and descriptions:** bold, italic, underline, strikethrough and inline code work there too. Headings and lists do not.

### Code blocks between text

To place a code snippet between two descriptions, add a `{ "code": [...] }` object as its own item in the `answer` array. Each string inside `code` is one line of code.

```json
{
  "question": "How do you print a value in C++?",
  "answer": [
    "Hi, following is a code snippet:",
    { "code": ["cout<<a<<endl;"] },
    "**Explanation:** `cout` will print a value on the console.",
    "Here is a full program:",
    { "code": [
        "#include <iostream>",
        "using namespace std;",
        "",
        "int main() {",
        "    int a = 5;",
        "    cout << a << endl;",
        "    return 0;",
        "}"
    ] },
    "It prints `5`."
  ]
}
```

**Rules**

- Items appear in the order you write them, so you can alternate text and code as many times as you like.
- Text items are plain strings and support bold, italic, lists and so on.
- Code items are objects with a `"code"` key whose value is an array of lines, not a single string.
- Use an empty string `""` for a blank line in code.
- Put indentation spaces at the start of the line string, for example `"    return 0;"`.
- Escape double quotes inside code, for example `"cout << \"Hello\";"`.
- Every item in the array needs a comma after it except the last one.
- No formatting is applied inside code, so `**` and `<` are shown exactly as typed.
- The older `"code": "..."` field next to `answer` still works, but it always appears after all the answer text, not in between.

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
