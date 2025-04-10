import { useState, useEffect } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#00C49F",
  "#ff6666",
  "#a29bfe",
  "#fd79a8",
  "#e17055",
];

const BASE_URL = "https://expense-tracker-mxeu.onrender.com";

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [breakdown, setBreakdown] = useState([]);
  const [history, setHistory] = useState([]);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [newUser, setNewUser] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [budget, setBudget] = useState("");
  const [month, setMonth] = useState("April");

  useEffect(() => {
    fetchUsers();
    fetchCategories();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/users`);
      setUsers(res.data);
    } catch (err) {
      console.error("Users error:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error("Categories error:", err);
    }
  };

  const createUser = async () => {
    const cleanName = newUser.trim();
    if (!cleanName) return alert("Enter a user name!");
    try {
      await axios.post(`${BASE_URL}/create_user`, {
        name: cleanName,
        email: "placeholder@email.com",
      });
      await fetchUsers();
      setNewUser("");
    } catch (err) {
      if (err.response?.status === 400) {
        alert("🚫 That user already exists!");
      } else {
        console.error("User creation error:", err);
      }
    }
  };

  const deleteUser = async () => {
    if (!userId) return alert("Please select a user to delete.");
    const confirm = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirm) return;
    try {
      await axios.delete(`${BASE_URL}/delete_user/${userId}`);
      setUserId("");
      setExpenses([]);
      setBreakdown([]);
      setHistory([]);
      fetchUsers();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const fetchExpenses = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${BASE_URL}/report/${userId}/${month}`);
      setExpenses([res.data]);
      fetchBreakdown();
      fetchHistory();
      if (res.data.budget && res.data.total_spent / res.data.budget > 0.9) {
        alert("⚠️ Warning: Only 10% of your budget is left!");
      }
    } catch (err) {
      console.error("Report error:", err);
    }
  };

  const addExpense = async () => {
    if (!userId || !categoryId || !amount) return alert("Fill all fields");
    try {
      await axios.post(`${BASE_URL}/add_expense`, {
        amount: parseFloat(amount),
        user_id: parseInt(userId),
        category_id: parseInt(categoryId),
        date: new Date().toISOString().split("T")[0],
      });
      setAmount("");
      fetchExpenses();
    } catch (err) {
      console.error("Expense error:", err);
    }
  };

  const setMonthlyBudget = async () => {
    if (!userId || !budget) return alert("Fill all fields");
    try {
      await axios.post(`${BASE_URL}/set_budget`, {
        amount: parseFloat(budget),
        user_id: parseInt(userId),
        month,
      });
      setBudget("");
      fetchExpenses();
    } catch (err) {
      console.error("Budget error:", err);
    }
  };

  const fetchBreakdown = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/breakdown/${userId}/${month}`);
      const data = Object.entries(res.data).map(([name, value]) => ({
        name,
        value,
      }));
      setBreakdown(data);
    } catch (err) {
      console.error("Breakdown error:", err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/expenses/${userId}/${month}`);
      setHistory(res.data);
    } catch (err) {
      console.error("History error:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Expense Tracker</h1>

      <div className="bg-white shadow-md rounded-xl p-4 space-y-4">
        <div className="flex gap-2">
          <input
            className="border p-2 flex-1"
            placeholder="New User Name"
            value={newUser}
            onChange={(e) => setNewUser(e.target.value)}
          />
          <button
            onClick={createUser}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Add User
          </button>
        </div>

        <div className="flex gap-2">
          <select
            className="border p-2 flex-1"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
          <button
            onClick={fetchExpenses}
            className="bg-gray-600 text-white px-4 py-2 rounded"
          >
            Load Data
          </button>
          <button
            onClick={deleteUser}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete User
          </button>
        </div>

        <div className="flex gap-2">
          <input
            className="border p-2 flex-1"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <select
            className="border p-2 flex-1"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            onClick={addExpense}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Expense
          </button>
        </div>

        <div className="flex gap-2">
          <input
            className="border p-2 flex-1"
            placeholder="Set Budget ₹"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
          <input
            className="border p-2 flex-1"
            placeholder="Month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
          <button
            onClick={setMonthlyBudget}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Set Budget
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold">Monthly Report</h2>
        {expenses.map((e, i) => (
          <div key={i} className="mt-2">
            <p>Total Spent: ₹{e.total_spent}</p>
            <p>Budget: ₹{e.budget ?? "Not Set"}</p>
          </div>
        ))}
      </div>

      {breakdown.length > 0 && (
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-2">Spending Breakdown</h2>
          <div className="w-full h-[360px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={breakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  labelLine={false}
                  dataKey="value"
                >
                  <LabelList
                    dataKey="name"
                    position="outside"
                    style={{ fontSize: 12 }}
                  />
                  {breakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-2">Expense History</h2>
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Amount</th>
                <th className="px-4 py-2 border">Category</th>
              </tr>
            </thead>
            <tbody>
              {history.map((exp, idx) => (
                <tr key={idx} className="text-center">
                  <td className="px-4 py-2 border">{exp.date}</td>
                  <td className="px-4 py-2 border">₹{exp.amount}</td>
                  <td className="px-4 py-2 border">{exp.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
