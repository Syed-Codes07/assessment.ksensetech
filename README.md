# Patient Risk Scoring System – Assessment Solution

This project is a solution for a real-world simulation assessment provided by **KSenseTech**, where we build a **robust and efficient patient risk scoring system** using TypeScript and Node.js.

The system retrieves patient data from a public API, handles unreliable responses (pagination, rate limiting, random failures), analyzes risk factors (blood pressure, temperature, and age), and submits risk categories as per defined criteria.

---

## Features & Highlights

-  **Robust API Fetching** with retry logic for `500`, `503`, and `429` errors
-  **Pagination Handling** (50 total patients across 10 pages)
-  **Risk Calculation**:
  - **Blood Pressure** (Normal → Stage 2)
  - **Temperature** (Normal to High Fever)
  - **Age** category scoring
-  **Error Detection** for invalid/missing fields
-  **Three Alert Categories** submitted:
  - `high_risk_patients` (total score ≥ 4)
  - `fever_patients` (temp ≥ 99.6°F)
  - `data_quality_issues` (malformed or missing fields)
-  **Low-resource, efficient, clean code** using modern TypeScript

---

## Project Structure

```
📦 assessment.ksensetech/
├── riskAssessment.ts   # Main assessment logic and submission
└── README.md           # You're reading it now!
```

---

## Setup & Installation

Follow these steps to run the code locally:

### 1. 📥 Clone the Repository

```bash
git clone https://github.com/Syed-Codes07/assessment.ksensetech.git
cd assessment.ksensetech
```

### 2. 🛠 Install Node.js & npm

Make sure you have Node.js and npm installed:

```bash
node -v
npm -v
```

> Recommended: Node.js v18+ and npm v9+

### 3. 📦 Install Dependencies

Install the required package (`axios` for HTTP requests):

```bash
npm install axios
```

If you're using TypeScript and haven't initialized a project yet:

```bash
npm init -y
npm install typescript --save-dev
npx tsc --init
```

---

## ▶️ Run the Code

### If Using TypeScript

```bash
npx tsc riskAssessment.ts
node riskAssessment.js
```

### Or, use `ts-node` (optional shortcut):

```bash
npx ts-node riskAssessment.ts
```

---

## 🔐 API Information

This solution uses the KSenseTech assessment API:

- **GET** `/api/patients` (paginated, error-prone)
- **POST** `/api/submit-assessment` (final output submission)
- Authenticated using:  
  `x-api-key: ak_628c56f5c85d072ad97d69aec2b67af697816d2ec87398c2`

---

## 📤 What Gets Submitted?

My solution automatically submits 3 critical lists:

```json
{
  "high_risk_patients": [...],
  "fever_patients": [...],
  "data_quality_issues": [...]
}
```

You can inspect this payload and the submission response directly in the console output after running the script.

---


## 🏁 Final Notes

- This solution is **plagiarism-free**, **original**, and **custom-written**.
- Designed with **real-world API chaos** in mind: retry logic, parsing edge cases, and efficient handling.
- The script is safe to rerun and re-submit, with a clear separation of logic and data.

---
