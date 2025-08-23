import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";


function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");

  // 🔹 For editing
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");

  // 🔹 Theme state
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const addTask = () => {
    if (input.trim() === "") return;
    setTasks([...tasks, { text: input, completed: false }]);
    setInput("");
  };

  const toggleTask = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const saveTask = (index) => {
    if (editingText.trim() === "") return;
    const newTasks = [...tasks];
    newTasks[index].text = editingText;
    setTasks(newTasks);
    setEditingIndex(null);
    setEditingText("");
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div
  className={`min-h-screen p-6 transition-colors duration-500
    ${darkMode
      ? "bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white"
      : "bg-gradient-to-br from-indigo-50 via-white to-pink-50 text-gray-900"
    }`}
>
      <div className="max-w-md mx-auto bg-white dark:bg-gray-600 shadow-lg rounded-lg p-4">
        
        {/* 🔹 Header with Toggle */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">✅ To-Do App</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 rounded bg-gray-300 dark:gray-600"
          >
            {darkMode ? "🌞 Light" : "🌙 Dark"}
          </button>
        </div>

        {/* Input */}
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Add a new task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 border rounded-l bg-gray-50 dark:bg-gray-700"
          />
          <button
            onClick={addTask}
            className="px-4 bg-blue-500 text-white rounded-r"
          >
            Add
          </button>
        </div>

        {/* Filters */}
        <div className="flex justify-around mb-4">
          <button
            onClick={() => setFilter("all")}
            className={filter === "all" ? "font-bold text-blue-500" : ""}
          >
            All
          </button>
          <button
            onClick={() => setFilter("active")}
            className={filter === "active" ? "font-bold text-blue-500" : ""}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={filter === "completed" ? "font-bold text-blue-500" : ""}
          >
            Completed
          </button>
        </div>

        {/* Task List */}
        <ul className="space-y-2">
  <AnimatePresence>
    {filteredTasks.map((task, index) => (
      <motion.li
        key={index}
        initial={{ opacity: 0, y: 20 }}   // when entering
        animate={{ opacity: 1, y: 0 }}    // after mounted
        exit={{ opacity: 0, y: -20 }}     // when removed
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between bg-gray-200 dark:bg-gray-700 p-2 rounded"
      >
        {/* ✅ keep all your li content here */}
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleTask(index)}
          className="mr-2"
        />

        {editingIndex === index ? (
          <input
            type="text"
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            onBlur={() => saveTask(index)}
            onKeyDown={(e) => e.key === "Enter" && saveTask(index)}
            className="flex-1 p-1 border rounded"
            autoFocus
          />
        ) : (
          <span
            className="flex-1"
            style={{
              textDecoration: task.completed ? "line-through" : "none",
            }}
          >
            {task.text}
          </span>
        )}

        <button
          onClick={() => {
            setEditingIndex(index);
            setEditingText(task.text);
          }}
          className="ml-2 text-blue-500 hover:text-blue-700"
        >
          ✏️
        </button>

        <button
          onClick={() => deleteTask(index)}
          className="ml-2 text-red-500 hover:text-red-700"
        >
          ❌
        </button>
      </motion.li>
    ))}
  </AnimatePresence>
</ul>

      </div>
    </div>
  );
}

export default App;
