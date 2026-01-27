"use client";

import { useEffect, useState } from "react";
import StateCard from "../../components/StateCard";
import { TaskService } from "../../services/task.service";

export default function DashboardPage() {
  const [taskStates, setTaskStates] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const tasks = await TaskService.getTasks();
        console.log("Tasks from backend:", tasks);

        const stats = {
          total: tasks.length,
          pending: tasks.filter(t=> t.status === "pending").length,
          inProgress: tasks.filter(t=> t.status === "in-progress").length,
          completed: tasks.filter(t=> t.status === "completed").length,
        };

        setTaskStates(stats);

      } catch (err) {
        console.error("API error:", err.message);
      }
    }

    fetchStats();
    



  }, []);

  return (
    <main className="max-w-6xl mx-auto p-6">
      <section className="text-center text-white mb-8">
        <h1 className="text-3xl font-bold">
          AI-Enhanced Smart To-Do
        </h1>
        <p className="opacity-80">
          Organize your tasks with intelligent planning
        </p>
      </section>

      {/* <section className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-6 gap-4 mb-8"> */}
        <div className="grid items-center grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StateCard title="Total Tasks" value={taskStates.total} icon="📋" />
        <StateCard title="To Do" value={taskStates.pending} icon="⏳" />
        <StateCard title="In Progress" value={taskStates.inProgress} icon="⚡" />
        <StateCard title="Completed" value={taskStates.completed} icon="✅" />
        <StateCard title="Completion Rate" value="-" icon="📊" />
        <StateCard title="AI Insights" value="→" icon="🤖" />
        </div>
      {/* </section> */}
    </main>
  );
}
