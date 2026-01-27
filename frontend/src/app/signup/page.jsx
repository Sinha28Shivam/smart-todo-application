"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, Mail, Lock, User, X, Sparkles } from "lucide-react";

export default function SignupPage() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                router.push("/login");
            } else {
                setError(data.message || "Registration failed");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[85vh] p-4 animate-fadeIn">
            <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-2xl max-w-md w-full border-2 border-white/50 overflow-hidden transform animate-scaleIn">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 px-8 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl text-white">
                            <UserPlus className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-white text-2xl font-bold">Create Account</h2>
                            <p className="text-purple-100 text-sm">Join us today</p>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    {error && (
                        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm font-medium animate-pulse">
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative">
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <User className="w-4 h-4 text-purple-500" /> Full Name
                            </label>
                            <input 
                                type="text" placeholder="Enter your full name" required 
                                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all bg-white"
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-purple-500" /> Email Address
                            </label>
                            <input 
                                type="email" placeholder="Enter your email" required 
                                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all bg-white"
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <Lock className="w-4 h-4 text-purple-500" /> Password
                            </label>
                            <input 
                                type="password" placeholder="Create a password" required 
                                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all bg-white"
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" disabled={isLoading}
                        className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white rounded-xl hover:shadow-xl transition-all transform hover:scale-105 font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        <UserPlus className="w-5 h-5" />
                        {isLoading ? "Creating Account..." : "Sign Up"}
                    </button>

                    <div className="text-center mt-4">
                        <p className="text-gray-600 text-sm">
                            Already have an account? <Link href="/login" className="text-purple-600 font-bold hover:underline">Login here</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}