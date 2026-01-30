"use client";
import { useState } from "react";
import { Sparkles, X, BrainCircuit, Loader2 } from "lucide-react";
import { getAIResponse } from "../services/aiAPI";
import { ApiRequest } from "../services/api";

export default function AIFloatingPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (!isOpen && !summary) {
      setLoading(true);
      setIsOpen(true);
      try {
        // 1. Get the prompt from the backend
        const data = await ApiRequest("/tasks/summary");
        const token = localStorage.getItem("token");
        
        // 2. Send the prompt to your AI suggest endpoint
        const res = await getAIResponse(data.prompt, "N/A", token);
        if (res.success) {
          setSummary(res.suggestion.reason);
        }
      } catch (err) {
        setSummary("Failed to load AI insights. Make sure you are logged in.");
      } finally {
        setLoading(false);
      }
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {!isOpen ? (
        <button
          onClick={handleToggle}
          className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-2xl animate-float hover:scale-110 transition-all text-white border-2 border-white/20"
        >
          <Sparkles className="w-8 h-8" />
        </button>
      ) : (
        <div className="w-80 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-indigo-100 p-6 animate-scaleIn relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-indigo-600">
              <BrainCircuit className="w-6 h-6" />
              <h3 className="font-bold">AI Assistant</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="text-sm text-gray-700 leading-relaxed max-h-60 overflow-y-auto pr-2">
            {loading ? (
              <div className="flex flex-col items-center py-4 gap-2">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                <p className="animate-pulse text-indigo-400">Analyzing your day...</p>
              </div>
            ) : (
              <div className="whitespace-pre-line">
                {summary || "Your summary will appear here."}
              </div>
            )}
          </div>
          
          {/* Decorative background blob */}
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>
        </div>
      )}
    </div>
  );
}