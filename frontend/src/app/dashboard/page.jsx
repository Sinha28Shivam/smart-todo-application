"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, ListTodo, Edit2, Trash2, Calendar } from "lucide-react";
import StateCard from "../../components/StateCard";
import FilterBar from "../../components/FilterBar"; // Import the new component
import { TaskService } from "../../services/task.service";

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0, rate: 0 });
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [announcement, setAnnouncement] = useState("");

  const fetchAllData = async () => {
    try {
      // Create query string for backend filtering
      const query = `?status=${filter}&sortBy=${sortBy}`;
      const data = await TaskService.getTasksWithFilters(query);
      
      setTasks(data);
      
      // Keep stats based on the full fetched set or separate call
      const total = data.length;
      const completed = data.filter(t => t.status === "completed").length;
      setStats({
        total,
        pending: data.filter(t => t.status === "pending").length,
        inProgress: data.filter(t => t.status === "in-progress").length,
        completed,
        rate: total > 0 ? Math.round((completed / total) * 100) : 0
      });
      
      // Announce to screen readers
      setAnnouncement(`Tasks loaded. Showing ${total} task${total !== 1 ? 's' : ''}`);
    } catch (err) {
      console.error("Dashboard load error:", err.message);
      setAnnouncement("Error loading tasks. Please try again.");
    }
  };

  // Re-fetch data whenever filter or sort options change
  useEffect(() => { 
    fetchAllData(); 
  }, [filter, sortBy]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await TaskService.deleteTask(id);
      fetchAllData();
      setAnnouncement("Task deleted successfully");
    }
  };

  return (
    <main className="max-w-7xl mx-auto p-6 space-y-8 animate-fadeIn" role="main" aria-label="Dashboard">
      {/* Live region for screen reader announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        role="status"
      >
        {announcement}
      </div>

      {/* 1. Header & Stats Section */}
      <header className="text-center text-white space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Productivity Dashboard</h1>
        <p className="opacity-80">Intelligent management for your daily goals</p>
      </header>

      {/* Stats Cards Section */}
      <section 
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 text-gray-800"
        aria-label="Task Statistics"
        role="region"
      >
        <StateCard 
          title="Total Tasks" 
          value={stats.total} 
          icon="📋"
          ariaLabel={`Total Tasks: ${stats.total}`}
        />
        <StateCard 
          title="Pending" 
          value={stats.pending} 
          icon="⏳"
          ariaLabel={`Pending Tasks: ${stats.pending}`}
        />
        <StateCard 
          title="Active" 
          value={stats.inProgress} 
          icon="⚡"
          ariaLabel={`Active Tasks: ${stats.inProgress}`}
        />
        <StateCard 
          title="Done" 
          value={stats.completed} 
          icon="✅"
          ariaLabel={`Completed Tasks: ${stats.completed}`}
        />
        <StateCard 
          title="Rate" 
          value={`${stats.rate}%`} 
          icon="📊" 
          text="text-black"
          ariaLabel={`Completion Rate: ${stats.rate} percent`}
        />
        
        <Link 
          href="/editTask" 
          className="group rounded-xl shadow-md flex align-center justify-between bg-white shadow-xl hover:scale-105 transition-all flex flex-col justify-between items-center text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Create a new task"
          role="button"
          tabIndex="0"
        >
          <Plus className="w-8 h-8 mb-2 group-hover:rotate-90 transition-transform" aria-hidden="true" />
          <span className="font-bold text-sm">New Task</span>
        </Link>
      </section>

      {/* 2. Filter Bar Component Call */}
      <FilterBar 
        filter={filter} 
        setFilter={setFilter} 
        sortBy={sortBy} 
        setSortBy={setSortBy} 
        tasks={tasks}
        ariaLabel="Filter and sort options for tasks"
      />

      {/* 3. Task List Section */}
      <section 
        className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8"
        aria-label="Tasks List"
        aria-describedby="tasks-description"
      >
        <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
          <div 
            className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg text-white"
            aria-hidden="true"
          >
            <ListTodo className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Your Tasks</h2>
        </div>

        <p id="tasks-description" className="sr-only">
          {tasks.length === 0 
            ? "No tasks found. Adjust your filters or create a new one." 
            : `${tasks.length} task${tasks.length !== 1 ? 's' : ''} displayed`}
        </p>

        <div className="space-y-4">
          {tasks.length === 0 ? (
            <p className="text-center py-10 text-gray-400" role="status">
              No tasks found. Adjust your filters or create a new one!
            </p>
          ) : (
            <ul className="space-y-4" role="list">
              {tasks.map((task) => (
                <li key={task._id} role="listitem">
                  <div 
                    className="group flex items-center justify-between p-5 rounded-2xl border-2 border-gray-50 bg-white hover:border-indigo-200 hover:shadow-lg transition-all"
                    role="article"
                    aria-label={`Task: ${task.title}`}
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span 
                          className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' : 'bg-green-500'}`}
                          aria-hidden="true"
                        />
                        <h3 
                          className={`font-bold text-lg ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}
                          aria-current={task.status === 'completed' ? 'false' : undefined}
                        >
                          {task.title}
                          {task.priority === 'high' && <span className="sr-only">, High Priority</span>}
                          {task.status === 'completed' && <span className="sr-only">, Completed</span>}
                        </h3>
                      </div>
                      {task.description && (
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                          <p className="text-sm text-gray-600 leading-relaxed">{task.description}</p>
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1" aria-label="Due date">
                          <Calendar className="w-3 h-3" aria-hidden="true" /> 
                          <time>
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date set'}
                          </time>
                        </span>
                        <span 
                          className="uppercase font-semibold px-2 py-0.5 bg-gray-100 rounded-md text-[10px]"
                          role="status"
                          aria-label={`Status: ${task.status}`}
                        >
                          {task.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                      <Link 
                        href={`/editTask/${task._id}`} 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label={`Edit task: ${task.title}`}
                      >
                        <Edit2 className="w-5 h-5" aria-hidden="true" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(task._id)} 
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label={`Delete task: ${task.title}`}
                        type="button"
                      >
                        <Trash2 className="w-5 h-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}