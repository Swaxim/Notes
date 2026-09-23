# Properties (YAML Frontmatter) Reference

Properties help you organize structured data about your Obsidian notes. They are written in YAML format at the very beginning of the file, enclosed between two lines of triple-dashes (`---`).

## Standard Property Types

| Property | YAML Type | Obsidian Type | Description |
|---|---|---|---|
| `title` | Text | Text | The display title of the note. |
| `tags` | List of strings | Tags | Searchable labels. Do not use `#` inside the frontmatter. |
| `aliases` | List of strings | Text / List | Alternative names for the note, useful for link auto-completion. |
| `created` | DateTime | Date / Date & time | The creation timestamp. |
| `updated` | DateTime | Date / Date & time | The last update timestamp. |
| `status` | Text | Text | Workflow status (e.g., `todo`, `in-progress`, `complete`). |
| `cssclasses` | List of strings | List | Custom CSS class names to style this specific note. |

## YAML Formatting Rules

1. **Location**: Properties must be at the very top of the markdown file. No lines (not even blank lines or comments) can appear before the first `---`.
2. **Key-Value Pairs**: Use `key: value` format. The colon must be followed by a space.
3. **Strings with Special Characters**: If a value contains special characters (like colons, brackets, or quotes), wrap the value in double quotes.
4. **Lists**: Lists can be formatted in inline style `[item1, item2]` or block style with a hyphen and space.

### Example Frontmatter

```yaml
---
title: "CKC112: Object-Oriented Programming"
date: 2026-06-30
tags:
  - computer-science
  - university/y1s2
aliases:
  - OOP
  - Object Oriented Programming
status: active
completed: false
cssclasses:
  - lecture-notes
  - dark-mode
---
```

## Tag Syntax in Frontmatter

- Do **NOT** prefix tags with `#` in the frontmatter. Write them as plain text strings (e.g., `university/y1s2` instead of `#university/y1s2`).
- Tags are case-insensitive in Obsidian but formatting is preserved.
- Avoid spaces in tags; use hyphens (`-`) or forward slashes (`/`) for nested tags.
