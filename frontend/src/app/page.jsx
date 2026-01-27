"use client";

import Link from "next/link";
import { ListTodo, Sparkles, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Animated Design Blobs from Figma bundle */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob [animation-delay:2s]"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob [animation-delay:4s]"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl">
        {/* Branding badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8 animate-float">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span className="text-sm font-medium text-purple-100 uppercase tracking-widest">AI-Powered Productivity</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
          Master Your Day with <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-200 to-pink-200">
            Intelligent Planning
          </span>
        </h1>

        <p className="text-lg md:text-xl text-indigo-100/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          The next generation of task management. Let our AI priority assistant help you 
          achieve your goals with seamless precision and smart insights.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href="/signup" 
            className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-2xl shadow-xl hover:shadow-indigo-500/40 transition-all flex items-center gap-2 transform hover:scale-105"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/login" 
            className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all transform hover:scale-105"
          >
            Welcome Back
          </Link>
        </div>
      </div>
    </div>
  );
}