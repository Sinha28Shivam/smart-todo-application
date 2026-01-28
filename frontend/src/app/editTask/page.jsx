"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Sparkles, Calendar, Flag, Tag, FileText } from "lucide-react";
import { TaskService } from "../../services/task.service";

export default function AddTaskPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
        status: "pending"
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await TaskService.createTask(taskData);
            router.push("/dashboard");
        } catch (err) {
            alert("Failed to create task: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="max-w-4xl mx-auto p-6 animate-fadeIn">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl shadow-lg">
                        <Plus className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Create New Task</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Task Title */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-indigo-500" /> Task Title
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800"
                            placeholder="What needs to be done?"
                            onChange={(e) => setTaskData({...taskData, title: e.target.value})}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-indigo-500" /> Description
                        </label>
                        <textarea
                            rows={3}
                            className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800 resize-none"
                            placeholder="Add some details..."
                            onChange={(e) => setTaskData({...taskData, description: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Due Date */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-purple-500" /> Due Date
                            </label>
                            <input
                                type="date"
                                className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-800"
                                onChange={(e) => setTaskData({...taskData, dueDate: e.target.value})}
                            />
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <Flag className="w-4 h-4 text-orange-500" /> Priority
                            </label>
                            <select
                                className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-gray-800 font-medium"
                                value={taskData.priority}
                                onChange={(e) => setTaskData({...taskData, priority: e.target.value})}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
                    >
                        {isLoading ? "Saving..." : "Create Task"}
                    </button>
                </form>
            </div>
        </main>
    );
}