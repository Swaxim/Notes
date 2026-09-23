---
name: solve-tutorial
description: Guides processing a programming tutorial, creating the corresponding directory, implementing C++ solution files named CX.cpp, and verifying correct understanding.
---

# Solve Tutorial Skill

This skill guides the agent in locating, understanding, structuring, and solving tutorial questions for programming courses, specifically structuring files under the user's coding directory.

## 1. Core Principles

1. **Directory Naming**: Inside the coding directory (`C:\Users\User\Desktop\Coding`), create a new directory named exactly after the tutorial instruction file name (excluding the file extension, e.g., `01 Programming Lab Struct.pdf` becomes `01 Programming Lab Struct`).
2. **File Naming Format**: Use the format `CX.cpp` for each question, where `X` is the question number (e.g., `C1.cpp` for Question 1, `C2.cpp` for Question 2, etc.).
3. **Double-Check Understanding**: Before writing code, outline the understanding of each question and present a verification plan to the user. Do not write the code until the user agrees to the plan.
4. **Code Quality**: Write standard C++ code conforming to academic requirements. Implement proper input validation, clear variable names, and helpful console output as specified in the tutorial.

---

## 2. Processing Workflow

### Step 1: Locate and Read Tutorial
- Search for the tutorial PDF or text file under the subject's Obsidian notes directory (e.g., `Obsidian-notes/Y1S2/CKC112/Tutorial/`).
- Use the PDF reader or appropriate tools to view the contents of the tutorial.

### Step 2: Formulate Understanding Plan
- Read all questions in the tutorial.
- For each question, summarize:
  - What the problem asks for.
  - The structures, enums, or unions to be declared.
  - Inputs and outputs required.
  - The C++ file name (`CX.cpp`).
- Present this plan to the user and request approval.

### Step 3: Setup Directory and Implement Code
- Once the user approves the plan, create the tutorial folder in the Coding workspace:
  `C:\Users\User\Desktop\Coding\[Tutorial File Name]`
- Create each `CX.cpp` file and implement the C++ solutions.
- Ensure all comments are clean and standard headers are preserved.

### Step 4: Verification
- Compile and test the C++ code to verify correctness against the sample outputs provided in the tutorial instruction.
