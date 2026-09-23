---
name: rearrange-topics
description: Rearranges and renumbers headings like 'Chapter X' or 'Topic Y' sequentially in a markdown file, auto-detecting the most common prefix. Use to maintain clean, sequential, and consistent headers.
---

# Rearrange Topics Skill

This skill renumbers topic and chapter headings in a markdown file so they are sequential, without gaps. It automatically handles multiple content types (e.g., lectures, labs, tutorials, assignments, appendices) by grouping them into independent numbering sequences and formatting subheadings hierarchically.

## How to use

Run the bundled script on the target markdown file using the `rtk` command proxy to optimize tokens:

```bash
rtk node "C:\Users\User\Desktop\Obsidian-notes\.agents\skills\rearrange-topics\scripts\rearrange.js" <path-to-markdown-file>
```

### Advanced Multi-Sequence Prefix System

The script categorizes prefixes into two groups:

1. **Lecture Topic Synonyms** (standardized automatically to the most common prefix in the file, e.g., `Chapter` or `Topic`):
   - `Chapter`
   - `Topic`
   - `Week`
   - `Lecture`
   - `Part`
   - `Section`
   - `Module`
   - `Unit`

2. **Special Section Prefixes** (retain their original prefix name and are numbered in their own independent, separate sequence):
   - `Lab`
   - `Tutorial`
   - `Assignment`
   - `Appendix`
   - `Project`
   - `Step`

### Hierarchy Alignment for Subtopics

When any level 1 heading is processed (lecture topic or special section), it sets the baseline for all level > 1 subtopics beneath it.
- **Example**:
  - `# Chapter 1: Structured Data` (Lecture 1)
    - `## 1.1 Abstract Data Types`
  - `# Lab 1: Pointer Practice` (Lab 1 - starts a new independent sequence!)
    - `## 1.1 Syntax` (Subtopics under Lab 1 align automatically to Lab 1's number)
  - `# Chapter 2: Object Basics` (Lecture 2)
    - `## 2.1 Constructors` (Subtopics align to Chapter 2's number)

---

## Agent Instructions
1. **Trigger Frequency**: You must run this skill script **immediately after writing or updating each topic** in the master markdown note. Do not wait until the entire note is completed.
2. **Execution**: Run the command using `rtk` command proxy and passing the absolute path to the file.
3. **Consistency Check**: After running the script, read the updated file sections to ensure that all heading prefixes match (e.g., all main headings are `Chapter X: [Title]` or `Topic X: [Title]`) and all subheadings are hierarchically consistent (e.g., `## X.Y [Subtitle]`).
4. **Verification**: Confirm that the script logs indicate a successful run with the correct number of renumbered headings.

