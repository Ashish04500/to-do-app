import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");

  // Editing
  const [editingIndex, setEditingIndex] = useState(null);

  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Save tasks
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Save theme
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Add or Save
  const handleAddOrSave = () => {
    if (input.trim() === "") return;

    if (editingIndex !== null) {
      // Save changes
      const updatedTasks = [...tasks];
      updatedTasks[editingIndex].text = input;
      setTasks(updatedTasks);
      setEditingIndex(null);
    } else {
      // Add new
      setTasks([...tasks, { text: input, completed: false }]);
    }
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

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <motion.div
      initial={false}
      animate={{
        backgroundColor: darkMode ? "#000000" : "#f9fafb",
      }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen p-6 ${
        darkMode ? "text-white" : "text-gray-900"
      }`}
    >
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
            ✅ To-Do App
          </h1>
          <motion.button
            onClick={() => setDarkMode(!darkMode)}
            whileTap={{ scale: 0.9, rotate: 360 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="px-3 py-1 rounded-lg bg-gray-300 dark:bg-gray-600 hover:scale-105 transition"
          >
            {darkMode ? "🌞 Light" : "🌙 Dark"}
          </motion.button>
        </div>

        {/* Input */}
        <div className="flex mb-6">
          <input
            type="text"
            placeholder="Add a new task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-3 border rounded-l-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleAddOrSave}
            className="px-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-r-lg hover:opacity-90 transition"
          >
            {editingIndex !== null ? "Save" : "Add"}
          </button>
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-3 mb-6">
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                filter === f
                  ? "bg-blue-500 text-white shadow"
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Task List */}
        <ul className="space-y-3">
          <AnimatePresence>
            {filteredTasks.map((task, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 100, damping: 12 }}
                className="flex items-center justify-between bg-gray-200 dark:bg-gray-700 p-3 rounded-lg shadow-sm hover:shadow-md transition"
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(index)}
                  className="mr-3 h-5 w-5"
                />

                {/* Task Text */}
                <span
                  className="flex-1"
                  style={{
                    textDecoration: task.completed ? "line-through" : "none",
                  }}
                >
                  {task.text}
                </span>

                {/* Edit Button */}
                <button
                  onClick={() => {
                    if (editingIndex === index) {
                      // cancel editing
                      setEditingIndex(null);
                      setInput("");
                    } else {
                      // start editing
                      setEditingIndex(index);
                      setInput(task.text);
                    }
                  }}
                  className="ml-2 px-2 py-1 rounded bg-yellow-400 text-black hover:bg-yellow-500 transition"
                >
                  ✏️
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => deleteTask(index)}
                  className="ml-2 px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
                >
                  ❌
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </motion.div>
  );
}

export default App;
