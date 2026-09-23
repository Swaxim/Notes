---
name: lecture-to-obsidian
description: Converts a single raw lecture note (PDF, text, slides) into a detailed, high-fidelity Obsidian-flavored Markdown note, integrating it into the master note.
---

# Lecture to Obsidian Processor

This skill guides you in transforming a **single** raw lecture material (text file, PDF, or slides) into a rich, highly detailed Obsidian-flavored Markdown note, integrating it into the subject's master note without losing detail.

## 1. Core Principles

1. **Automatic Activation**: Whenever you are asked to write or update a single lecture note, you MUST automatically use this skill to write/update it in the Obsidian Markdown format without losing any detail of the source.
2. **No Loss of Detail**: Your primary mandate is to **preserve all details, examples, code snippets, and nuances** from the source material. The output must be comprehensive. Do not excessively summarize or omit information.
3. **Dependencies**:
   - Use the `obsidian-markdown` skill to guide the markdown formatting (callouts, links, math, code blocks, etc.).
   - Use the `pdf-extractor` skill **if and only if** the source PDF is too big to be read directly (e.g., exceeds file read limits or context limits). For very large PDFs, use chunked splitting (`--chunk 20`) to process page ranges sequentially. For files that can be read directly, do not use `pdf-extractor`.
4. **Consistency**: Ensure that the headings, titles, and subheadings added are consistent in style and hierarchy with the existing chapters in the master note.
5. **Clarity Enhancement (Extra Notes)**: If a part of the lecture notes is not clearly explained or lacks sufficient context, you MUST provide additional explanation or context. This must be clearly labeled as "Extra Notes" using an Obsidian callout.
6. **No Redundant Headers**: Do NOT add course overviews. Start directly with the content or the chapter/topic header.
7. **Properties/Frontmatter Block**: **NEVER** add frontmatter to the top of compiled or appended lecture sections, as it will break the rendering of the master note. If working on a standalone file that requires frontmatter, place it at the very top of the file as per the `obsidian-markdown` guidelines.

---

## 2. Single-Lecture Processing Workflow

1. **Activate Dependencies**: Activate the `obsidian-markdown` and `pdf-extractor` skills.
2. **Locate Target Section**: Locate the corresponding chapter or section in the master note.
3. **Read Lecture Content**: Read the content of the single lecture. If the file is too big to read directly, use `pdf-extractor` to split it into chunks or extract specific page ranges first.
4. **Compare and Integrate:**
   - Compare the source content with the existing note.
   - If the note already contains the chapter, merge any missing details, examples, formulas, tables, or diagrams.
   - If the chapter is missing, format it and append it to the end of the master note.
   - **Mixed Content**: If the lecture notes contain distinct materials (like a lab, assignment, tutorial, or appendix), use the appropriate special section prefix (e.g. `# Lab X: [Title]` or `# Appendix X: [Title]`) so they are correctly numbered in separate sequences.
5. **Verify Style**: Check that all new sections conform to the **Obsidian Formatting Guidelines** below.

---

## 3. Obsidian Formatting Guidelines

When structuring the note, apply the following (as per the `obsidian-markdown` skill):

### 3.1 Hierarchical Headings
Organize content logically using Markdown headers (`#`, `##`, `###`).
- **Chapter/Topic Titles**: For top-level chapters/topics, explicitly write the chosen prefix before the number (e.g., `# Chapter X: [Title]` or `# Topic X: [Title]`).
- **Special Sections**: For labs, tutorials, assignments, or appendices, use their distinct prefix (e.g., `# Lab X: [Title]` or `# Appendix X: [Title]`).
- **Subtopics**: For all subtopics (level 2 and below), just use the hierarchical numbers without the prefix word (e.g., `## X.Y [Subtitle]`). Do NOT write prefix words like "Chapter" or "Topic" in level 2+ headings.
- **Unnumbered Subheadings**: If a subheading represents a small section without a number, do not include any number or prefix (e.g., `### Defining Variables`).

### 3.2 Callouts for Emphasis
Use Obsidian callouts (`> [!type]`) to highlight key information extensively:
- **Definitions**: `> [!info] Definition: [Term]`
- **Important Notes**: `> [!note] Important`
- **Examples**: `> [!example] Example: [Title]`
- **Warnings**: `> [!warning] Common Mistake`
- **Extra Notes**: `> [!tip] Extra Notes: [Title]\n> [Explanation from external knowledge to clarify unclear parts]`

### 3.3 Code Blocks and Math
- Use fenced code blocks with language identifiers (e.g., ` ```cpp `).
- Use LaTeX for formulas: `$E = mc^2$` for inline and `$$ ... $$` for blocks.
