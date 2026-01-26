"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthUser, logout } from "../utils/auth";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Sync state with localStorage on mount
  useEffect(() => {
    const currentUser = getAuthUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push("/login");
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-transparent text-white">
      {/* Brand Section */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-purple-400/80 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg backdrop-blur-sm">
          S
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight">Smart To-Do</span>
          <span className="text-[10px] uppercase tracking-widest opacity-70 font-medium">AI-Powered Tasks</span>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link 
              href="/login" 
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 transition-all font-medium"
            >
              <span>login</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
            </Link>
            <Link 
              href="/signup" 
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
              <span>Sign Up</span>
            </Link>
          </>
        ) : (
          <>
            {/* User Profile Info Card */}
            <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-white/10">
              <div className="w-9 h-9 bg-gradient-to-tr from-pink-400 to-purple-400 rounded-xl flex items-center justify-center shadow-inner">
                <span className="text-sm">👤</span>
              </div>
              <div className="flex flex-col pr-2">
                <span className="text-sm font-semibold leading-tight">{user.name}</span>
                <span className="text-[10px] opacity-60 leading-tight">{user.email}</span>
              </div>
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/30 font-medium"
            >
              <svg className="w-4 h-4 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              <span>Logout</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
}