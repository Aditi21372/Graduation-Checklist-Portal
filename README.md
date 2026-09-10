# Graduation Checklist Portal

> An in-house academic tool that **automates graduation eligibility checks** — recalculation of CGPA, degree requirements, and honors rules straight from ERP data, replacing a manual Excel-and-macros workflow.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-DD0031?style=flat&logo=angular&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Jest](https://img.shields.io/badge/Tested%20with-Jest-C21325?style=flat&logo=jest&logoColor=white)

## The problem it solves

Provisional degrees must be declared by early July, but the window between May and June is short. Course replacements and ERP-side limitations make CGPA verification error-prone, so the academic team recalculated everything by hand, repeatedly, in Excel with macros.

This portal does it automatically: pull the student's record, apply the degree rules, recompute the CGPA, and flag anything that blocks graduation — with an admin view for the academic team and a student view for self-service.

## Features

- 🎓 **Automated CGPA recalculation** with course-replacement handling
- 📋 **Rule engine** for degree, honors, and minor requirements (`rule.ts`, `honors.ts`, `degree.ts`)
- 👩‍💼 **Admin login** for the academic team, student view for self-checks
- 🧪 **Jest unit tests** covering CGPA math, graduation rules, and the server

## Architecture

```
Angular SPA (frontend/)          Node + TypeScript API (backend/)
  student view  ─┐               degree.ts      — degree requirements
  admin login   ─┼── REST ──►    cgpa.ts        — CGPA computation
  minors view   ─┘               rule.ts        — eligibility rules
                                 honors.ts      — honors criteria
                                 database.ts    — persistence (MongoDB)
```

## Quick start

```bash
git clone https://github.com/Aditi21372/Graduation-Checklist-Portal.git
cd Graduation-Checklist-Portal

# backend
cd backend && npm install && npm test && npm run start

# frontend
cd ../frontend && npm install && npm start
```

## Impact

Replaced a recurring manual, multi-person Excel workflow with an automated check — cutting hours of error-prone recalculation out of a hard two-month deadline window.

---

Built by [@Aditi21372](https://github.com/Aditi21372) · [More projects](https://github.com/Aditi21372?tab=repositories)
