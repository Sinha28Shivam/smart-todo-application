"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus, LogOut, User, ListTodo } from "lucide-react";
import { getAuthUser, logout } from "../utils/auth";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getAuthUser();
    if (currentUser) setUser(currentUser);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-40"
    role="navigation"
    aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/" aria-label="smart to-do home" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <ListTodo className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">Smart To-Do</h1>
              <p className="text-indigo-200 text-[10px] uppercase tracking-tighter opacity-70">AI-Powered Tasks</p>
            </div>
          </Link>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <Link href="/login" className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all border border-white/20 font-semibold text-sm" aria-label="Login to your account">
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link href="/signup" className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all transform hover:scale-105 font-semibold text-sm" aria-label="Sign up for a new account">
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </Link>
              </>
            ) : (
              <>
                <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left leading-tight">
                    <p className="text-white text-xs font-bold">{user.name}</p>
                    <p className="text-indigo-200 text-[10px] opacity-70">{user.email}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:shadow-xl transition-all transform hover:scale-105 font-bold text-sm" aria-label="Logout to your account">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}