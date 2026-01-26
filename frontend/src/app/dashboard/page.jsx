"use client";

import { useEffect } from "react";
import StateCard from "../../components/StateCard";
import { TaskService } from "../../services/task.service";

export default function DashboardPage() {
  useEffect(() => {
    async function testBackend() {
      try {
        const tasks = await TaskService.getTasks();
        console.log("✅ Tasks from backend:", tasks);
      } catch (err) {
        console.error("❌ API error:", err.message);
      }
    }

    testBackend();
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

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <StateCard title="Total Tasks" value="-" icon="📋" />
        <StateCard title="To Do" value="-" icon="⏳" />
        <StateCard title="In Progress" value="-" icon="⚡" />
        <StateCard title="Completed" value="-" icon="✅" />
        <StateCard title="Completion Rate" value="-" icon="📊" />
        <StateCard title="AI Insights" value="→" icon="🤖" />
      </section>

      <section className="bg-white rounded-2xl shadow-xl p-6">
        Backend service test (check console)
      </section>
    </main>
  );
}
