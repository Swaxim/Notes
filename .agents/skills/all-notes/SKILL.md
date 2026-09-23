---
name: all-notes
description: Processes all lecture materials for a requested course by invoking the lecture-to-obsidian skill for each file, then runs rearrange-topics to ensure headings are sequential.
---

# All Notes Skill (Course Notes Compiler)

This skill provides a hierarchical, repeatable workflow to compile all lecture materials for a requested course into a single master note in the Obsidian vault. It delegates the processing of individual lectures to the `lecture-to-obsidian` skill and finalizes the document structure using the `rearrange-topics` skill.

## 1. Discovery and Planning Phase

When a course is requested (e.g. "CKS121"):

1. **Locate Course Directory**: Search the workspace (typically under `Y1S1/` or `Y1S2/`) for the target course directory.
2. **Identify Master Note**: Find the master note markdown file (e.g., `<CourseCode> <CourseName>.md`). If it doesn't exist, create it.
3. **Inventory Course Materials**: List all files (PDFs, slides, text files) in the course folder, sorted sequentially. Separate them into different types of materials:
   - **Lectures**: Theoretical content (will become `Chapter` or `Topic` headings).
   - **Labs/Tutorials/Assignments**: Practical exercises (will become `Lab`, `Tutorial`, `Assignment` headings).
4. **Present the Plan**: Create a detailed mapping table of files to chapters, labs, or sections and present it to the user.

---

## 2. Compile Course Notes (Hierarchical Process)

1. **Sequential Chapter-by-Chapter Writing (Looping)**:
   - For each course material file identified in the plan, process and write it **single chapter by single chapter** (topic by topic):
     - **One File at a Time**: Process only one lecture/material file per iteration. Do not load, summarize, or translate multiple files concurrently.
     - **Invoke the `lecture-to-obsidian` skill** to process the current file and generate its formatted notes.
     - **Write/Merge Immediately**: Immediately append or merge this single chapter/topic's content into the master markdown file on disk and save it before moving on to the next file. **Never** compile multiple chapters in memory or write them in a single bulk operation at the end.
     - **No Bulk Generation**: Do not attempt to generate or output notes for multiple chapters/topics in a single turn. Write the note, save, and proceed iteratively.
     - Ensure that no details, examples, or formulas are lost during the transition.
     - Apply appropriate prefixes for special files (e.g., `# Lab X: [Title]` for a lab document).
2. **Immediate Renumbering**:
   - **Immediately after writing each chapter** to the master note, **invoke the `rearrange-topics` skill** to clean up the heading structure and renumber topics/labs sequentially. This ensures the master note is kept up-to-date and syntactically clean at every step.
   - Run the script using the `rtk` command proxy to save tokens:
     ```bash
     rtk node "<workspace-root>/.agents/skills/rearrange-topics/scripts/rearrange.js" "<path-to-master-note>"
     ```
3. **Chapter Verification**:
   - Verify the quality of each written chapter immediately after it is saved and renumbered:
     - Check that all Mermaid diagrams conform to syntax rules:
       - **No Spaces in Node/Subgraph IDs** (e.g., use `ViewLayer` instead of `View Layer`).
       - **No Special Characters in Class Member Types/Names** (e.g., no `&`, `{`, `}`, or `*`).
       - **Stereotype Syntax** must be applied on a separate line (e.g., `<<abstract>> Sale`).
     - Ensure the appended section starts directly with its heading and does not contain YAML frontmatter/properties.
     - Verify that subtopics are correctly aligned to their parent heading's number (e.g., `## X.Y [Subtitle]`).


---

## 3. Cleanup

Automatically delete any temporary text files (such as `temp_pdf_text.txt`) or split PDFs (like `<FileName>_part_X.pdf` or `<FileName>_pages_X_to_Y.pdf`) created by the `pdf-extractor` skill during the process.

