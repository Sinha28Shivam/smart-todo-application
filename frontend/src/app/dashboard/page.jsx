"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, ListTodo, Edit2, Trash2, Calendar, Flag, Sparkles } from "lucide-react";
import StateCard from "../../components/StateCard";
import { TaskService } from "../../services/task.service"; // cite: 41

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0, rate: 0 });

  const fetchAllData = async () => {
    try {
      const data = await TaskService.getTasks(); // cite: 41
      setTasks(data);
      
      const total = data.length;
      const completed = data.filter(t => t.status === "completed").length;
      setStats({
        total,
        pending: data.filter(t => t.status === "pending").length,
        inProgress: data.filter(t => t.status === "in-progress").length,
        completed,
        rate: total > 0 ? Math.round((completed / total) * 100) : 0
      });
    } catch (err) {
      console.error("Dashboard load error:", err.message);
    }
  };

  useEffect(() => { fetchAllData(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await TaskService.deleteTask(id); // cite: 41
      fetchAllData();
    }
  };

  return (
    <main className="max-w-7xl mx-auto p-6 space-y-8 animate-fadeIn">
      {/* 1. Header & Stats Section */}
      <header className="text-center text-white space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Productivity Dashboard</h1>
        <p className="opacity-80">Intelligent management for your daily goals</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 text-gray-800">
        <StateCard title="Total Tasks" value={stats.total} icon="📋" />
        <StateCard title="Pending" value={stats.pending} icon="⏳" />
        <StateCard title="Active" value={stats.inProgress} icon="⚡" />
        <StateCard title="Done" value={stats.completed} icon="✅" />
        <StateCard title="Rate" value={`${stats.rate}%`} icon="📊" bg="bg-gradient-to-br from-purple-500 to-pink-500" text="text-white" />
        
        {/* Create Task Button Card */}
        <Link href="/editTask" className="group bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 shadow-xl hover:scale-105 transition-all flex flex-col justify-between items-center text-white">
          <Plus className="w-8 h-8 mb-2 group-hover:rotate-90 transition-transform" />
          <span className="font-bold text-sm">New Task</span>
        </Link>
      </section>

      {/* 2. Task List Section */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
        <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg text-white">
            <ListTodo className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Your Tasks</h2>
        </div>

        <div className="space-y-4">
          {tasks.length === 0 ? (
            <p className="text-center py-10 text-gray-400">No tasks found. Create one to get started!</p>
          ) : (
            tasks.map((task) => (
              <div key={task._id} className="group flex items-center justify-between p-5 rounded-2xl border-2 border-gray-50 bg-white hover:border-indigo-200 hover:shadow-lg transition-all">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' : 'bg-green-500'}`} />
                    <h3 className={`font-bold text-lg ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                      {task.title}
                    </h3>
                  </div>

                  {/* Task Description Display */}
        {task.description && (
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-sm text-gray-600 leading-relaxed">
              {task.description}
            </p>
          </div>
        )}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
                    <span className="uppercase font-semibold px-2 py-0.5 bg-gray-100 rounded-md text-[10px]">{task.status}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link 
                    href={`/editTask/${task._id}`} 
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                    aria-label="Edit task"
                  >
                    <Edit2 className="w-5 h-5" />
                  </Link>
                  <button 
                    onClick={() => handleDelete(task._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    aria-label="Delete task"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}