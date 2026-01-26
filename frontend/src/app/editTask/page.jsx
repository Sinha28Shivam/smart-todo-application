"use client"; // Required for handling form state and button clicks

import { useState } from "react";

export default function AddTaskPage() {
    const [taskName, setTaskName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Task "${taskName}" added successfully!`);
        setTaskName(""); // Clear the input
    };

    return (
        <main style={{ padding: "20px" }}>
            <h1>Add New Task</h1>
            <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
                <div style={{ marginBottom: "10px" }}>
                    <label htmlFor="task" style={{ display: "block" }}>Task Name:</label>
                    <input
                        id="task"
                        type="text"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        placeholder="Enter task description..."
                        required
                        style={{ padding: "8px", width: "300px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                </div>
                <button 
                    type="submit" 
                    style={{ padding: "10px 20px", background: "#0070f3", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
                >
                    Create Task
                </button>
            </form>
        </main>
    );
}