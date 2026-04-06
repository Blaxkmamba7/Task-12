

> A sleek, academic-grade GPA calculator built for Nigerian university students using the 5-point grading scale.

![SAFRecords GPA Calculator](./Screenshots/screenshot-main.png)



[View Live Project →](https://safgpa-calculator.netlify.app/)



**SAFRecords GPA Calculator** is a fully client-side web application that helps students calculate their Grade Point Average (GPA) instantly. It uses the Nigerian 5-point grading scale and provides real-time performance classification, a detailed course breakdown, and a smart Performance Advisor.


- **Dynamic Course Entry** — Add/remove courses with auto-numbered rows
- **GPA Calculation** — Accurate GPA using the formula: `GPA = Σ(Grade × Credit) / Σ(Credit)`
- **Classification Engine** — Automatically classifies results (First Class, Second Class Upper/Lower, Third Class, Pass, Fail)
- **Course Breakdown Table** — Displays letter grades and quality points per course
- **Performance Advisor** — Enter a target GPA and get tailored improvement advice
- **Animated Results** — Smooth counter animation on GPA display
- **Input Validation** — Highlights invalid fields with error states
- **LocalStorage Persistence** — Data saved between browser sessions
- **Print-Ready** — Clean print layout that hides non-essential UI
- **Responsive Design** — Works on desktop and mobile



| Grade | Points | Classification |
|-------|--------|----------------|
| A     | 4.5 – 5.0 | First Class Honours |
| B     | 3.5 – 4.4 | Second Class Upper |
| C     | 2.4 – 3.4 | Second Class Lower |
| D     | 1.5 – 2.3 | Third Class |
| E     | 1.0 – 1.4 | Pass |
| F     | 0.0 – 0.9 | Fail |



- **HTML5** — Semantic markup and structure
- **CSS3** — Custom properties, grid/flexbox layout, animations, responsive design
- **Vanilla JavaScript** — DOM manipulation, local storage, event handling
- **Google Fonts** — Syne (display) + DM Mono (monospace)
- **No frameworks, no dependencies**



[View Colour Palette →](https://coolors.co/0a0a0f-111118-1a1a24-c8f04a-4af0c8-f04a6a-e8e8f0)

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg` | `#0a0a0f` | Page background |
| `--surface` | `#111118` | Card background |
| `--surface2` | `#1a1a24` | Input background |
| `--accent` | `#c8f04a` | Primary accent (lime) |
| `--accent2` | `#4af0c8` | Secondary accent (teal) |
| `--danger` | `#f04a6a` | Error / danger states |
| `--text` | `#e8e8f0` | Primary text |



gpa-calculator/
├── index.html          # Main HTML structure
├── style.css           # All styles and animations
├── script.js           # Application logic
├── README.md           # This file
└── Screenshots/
    ├── screenshot-main.png
    ├── screenshot-result.png
    └── screenshot-mobile.png

Presentation Slides

[View Presentation (PDF) →](./presentation.pdf)

 How to Run Locally

 Clone the repository
git clone  https://blaxkmamba7.github.io/gpa-calculator/

 Navigate into the project
cd gpa-calculator

 Open in browser (no build step needed)
open index.html




AbdulSamad bashir — Frontend Pathway  
FIP Project · T1 2026



This project was built as part of the FIP (Foundational Industry Project) programme.
