"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Edit2, Save, X, Calendar, Flag, Tag, FileText } from "lucide-react";
import { TaskService } from "../../../services/task.service"; // cite: 41
import { getAIResponse } from "../../../services/aiAPI";


export default function EditTaskPage({ params }: { params: Promise<{ taskid: string }> }) {
    const router = useRouter();
    const unwrappedParams = use(params);
    const taskid = unwrappedParams.taskid; // cite: 10

    const [isLoading, setIsLoading] = useState(false);
    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
        status: "pending"
    });

    const [aiInsight, setAiInsight] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);

    const runAIAnalysis = async (newStatus: string) => {
        if(!taskData.dueDate) return;
        setAiLoading(true);
        try {
            const token = localStorage.getItem("token");
            const today = new Date();
            const due = new Date(taskData.dueDate);
            const dayLeft = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            const context = `
            Task title: ${taskData.title}
            Task status: ${newStatus}
            Days left until deadline: ${dayLeft}
            Give a short productivity suggestion based on this status and deadline.`;
            
            const res = await getAIResponse(context, taskData.dueDate, token);
            if(res.success){
                setAiInsight(res.suggestion.reason);
            }
        }catch(err){
            console.error("AI analysis failed:", err.message);
        }
        finally{
            setAiLoading(false);
        }
    }



    // 1. Fetch initial task data on mount
    useEffect(() => {
        async function loadTask() {
            try {
                const tasks = await TaskService.getTasks(); // cite: 41
                const currentTask = tasks.find(t => t._id === taskid);
                if (currentTask) {
                    setTaskData({
                        title: currentTask.title,
                        description: currentTask.description || "",
                        dueDate: currentTask.dueDate ? currentTask.dueDate.split('T')[0] : "",
                        priority: currentTask.priority,
                        status: currentTask.status
                    });
                }
            } catch (err) {
                console.error("Failed to load task:", err.message);
            }
        }
        loadTask();
    }, [taskid]);

    // 2. Handle the update request
    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Sends a PUT request to /api/tasks/:id with updated body cite: 15, 41
            await TaskService.updateTask(taskid, taskData); 
            router.push("/dashboard"); // Redirect on success
        } catch (err) {
            alert("Update failed: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="max-w-4xl mx-auto p-6 animate-fadeIn">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
                {/* Figma Styled Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3 text-gray-800">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
                            <Edit2 className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold">Edit Task</h1>
                    </div>
                </div>

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Task Title</label>
                        <input
                            type="text"
                            required
                            value={taskData.title}
                            className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                            onChange={(e) => setTaskData({...taskData, title: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <Flag className="w-4 h-4 text-orange-500" /> Priority
                            </label>
                            <select
                                className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-gray-800"
                                value={taskData.priority}
                                onChange={(e) => setTaskData({...taskData, priority: e.target.value})}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <Tag className="w-4 h-4 text-blue-500" /> Status
                            </label>
                            <select
                                className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                                value={taskData.status}
                               onChange={(e) => {
                                const newStatus = e.target.value;
                                setTaskData({ ...taskData, status: newStatus });
                                runAIAnalysis(newStatus);
                               }}

                            
                            >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                            {aiLoading && (
                                <p className="text-sm text-gray-500 mt-2">
                                    🤖 AI is analyzing your task...
                                </p>
                            )}

                            {aiInsight && (
                                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
                                    🤖 <b>AI Suggestion:</b> {aiInsight}
                                </div>
                            )}

                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {isLoading ? "Updating..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </main>
    );
}