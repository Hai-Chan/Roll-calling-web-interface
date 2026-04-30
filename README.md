# Smart Attendance / Schedule Generator

A small attendance + work schedule generator UI I made for quickly setting employee shifts, generating a monthly table, and exporting everything to Excel.

It has:
- Employee selections
- Shift input
- Off-days
- Random daily offset in work hours
- Excel export
- A custom draggable clock time picker UI

Just a small project to make sure i learned js and html properly

---

## Preview

Main idea of the app:

- add employees
- set shift 1 / shift 2
- choose weekly off days
- generate a monthly schedule
- export the result to `.xlsx`

The time picker is custom:
- the **digital clock on top is display only**
- the **dial clock below is the real interaction**
- supports dragging / clicking
- AM / PM toggle included

---

## Features

- Add up to **8 employees**
- Set:
  - employee name
  - shift 1 start/end
  - optional shift 2 start/end
  - weekly off days
- Generate a **31-day monthly schedule**
- Randomize time offsets so the result is not too robotic
- Handle off-days cleanly in the output
- Export each employee as a separate Excel sheet
- Custom **drag-based analog clock picker**

---

## Project Structure

```bash
.
├── index.html
├── styles.css
├── script.js
├── ava.png
└── README.md