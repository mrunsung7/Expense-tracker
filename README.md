# Expense-tracker: problem statement(L7 Informatics Internship Assignment)
Develop a Python Application that will help users track their expenses and savings goals. Requirements ● Users can log their daily expenses ● Expenses are categorized (e.g., "Food," "Transport," "Entertainment"). ● Users can set monthly budgets for each category. ● The system alerts users if they exceed their budget for the category.


# 💸 Expense Tracker App

A full-stack personal expense tracking tool built with **React.js** and **Flask**, allowing users to monitor monthly budgets, categorize expenses, and visualize spending with interactive pie charts.

---

## 🚀 Features

- ✅ Create & manage users
- 📊 Monthly expense reports & budget summaries
- 🥧 Pie chart for category-wise breakdown (Recharts)
- 🔔 Custom alerts when 90% of the budget is used
- 🧠 Persistent backend using Flask & SQLAlchemy
- 🗃️ Store expense history by month and category

---

## 📦 Tech Stack

| Frontend       | Backend     | Database     | Charts    |
|----------------|-------------|--------------|-----------|
| React + Tailwind CSS | Flask + SQLAlchemy | SQLite (default) | Recharts |

---

## 📸 UI Preview

> _Add screenshots or a link to a hosted demo if deployed (e.g. Netlify + Render)_

---

## 🛠️ Installation & Setup

### ⚙ Backend (Flask)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate
pip install -r requirements.txt
python app.py
