# Attendance generator

A small attendance + work schedule generator UI I made for quickly setting employee shifts, generating a monthly table, and exporting everything to Excel.

It has:
- Employee selections
- Shift input
- Off-days
- Random daily offset in work hours
- Excel export
- A custom draggable clock time picker UI

Just a small project to make sure i learned js and html properly :>>

---

## Preview

Main idea of the app:

- Add employees
- Set shift 1 / shift 2
- Choose weekly off days
- Generate a monthly schedule
- Export the result to `.xlsx`

The time picker is custom:
- Adjust **dial clock for time interaction**
- Press hold to drag the dial to chose time
- AM / PM toggle included

---

## Features

- Add up to **8 employees** (changeable depends on user's need )
- Set:
  - Employee name
  - Shifts start/end and optional second shift
  - Can chose weekly off days
- Generate a **31-day monthly schedule**
- Handle off-days cleanly in the output
- Export each employee as a separate Excel sheet
- Custom **drag-based analog clock picker**
- Huge feature: employee's time are completely randomized, offset ±10 minutes, work time never exceeds 24h or 0AM and --> **All automated**

---

## Project Structure

```bash
.
├── index.html
├── styles.css
├── script.js
├── ava.png
└── README.md
