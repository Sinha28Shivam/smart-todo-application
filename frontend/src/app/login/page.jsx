"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAuthData } from "../../utils/auth";
import Link from "next/link";
import { LogIn, Mail, Lock, Sparkles } from "lucide-react";

export default function LoginPage() {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleGoogleLogin = () => {
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        
        console.log("clicked");
        
        
        window.location.href = `${BASE_URL}/auth/google`; // Redirect to backend for Google OAuth
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await fetch(`${BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(credentials),
            });

            const data = await res.json();
            
            if (res.ok) {
                setAuthData(data); // Stores name, email, and token
                // localStorage.setItem("token", data.token);
                window.location.href = "/dashboard"; 
            } else {
                setError(data.message || "Invalid credentials");
            }
        } catch (err) {
            setError("Connection to server failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[85vh] p-4 animate-fadeIn">
            <div className="bg-gradient-to-br from-white to-indigo-50 rounded-3xl shadow-2xl max-w-md w-full border-2 border-white/50 overflow-hidden transform animate-scaleIn">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl text-white">
                            <LogIn className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-white text-2xl font-bold">Welcome Back</h2>
                            <p className="text-indigo-100 text-sm">Login to your account</p>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm font-medium animate-pulse">
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative">
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-indigo-500" /> Email Address
                            </label>
                            <input 
                                type="email" placeholder="Enter your email" required 
                                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white
                                text-gray-800"
                                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                            />
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <Lock className="w-4 h-4 text-indigo-500" /> Password
                            </label>
                            <input 
                                type="password" placeholder="Enter your password" required 
                                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white
                                text-gray-800"
                                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                            />
                        </div>
                    </div>

                    <button
                       type="button"
                       onClick={handleGoogleLogin}
                       className="w-full px-6 py-4 border border-gray-300 rounded-xl mb-4 bg-white text-black font-medium transition all 
                       duration-200 hover:bg-gray-50 hover:scale-[1.02] hover:shadow-md active:scale-[0.98] font-medium"
                    >
                       Continue with Google
                    </button>

                    <button 
                        type="submit" disabled={isLoading}
                        className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl hover:shadow-xl transition-all transform hover:scale-105 font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        <LogIn className="w-5 h-5" />
                        {isLoading ? "Logging in..." : "Login"}
                    </button>

                    <div className="text-center mt-4">
                        <p className="text-gray-600 text-sm">
                            Don't have an account? <Link href="/signup" className="text-indigo-600 font-bold hover:underline">Sign up here</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}