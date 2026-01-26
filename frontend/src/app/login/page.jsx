"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAuthData } from "../../utils/auth";
import Link from "next/link";

export default function LoginPage() {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });

            const data = await res.json(); // Backend returns { name, email, token }
            
            if (res.ok) {
                setAuthData(data); // Stores user details and JWT in localStorage
                // Using window.location to force a full refresh so Navbar detects the new user
                window.location.href = "/dashboard"; 
            } else {
                setError(data.message || "Invalid credentials");
            }
        } catch (err) {
            setError("Connection to server failed.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/20">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Welcome Back</h2>
                
                {error && (
                    <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-4 text-sm border border-red-500/50">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <input 
                        type="email" placeholder="Email Address" required 
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 outline-none"
                        onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                    />
                    <input 
                        type="password" placeholder="Password" required 
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 outline-none"
                        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    />
                    <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95">
                        Login
                    </button>
                </div>

                <p className="text-white/70 text-center mt-6 text-sm">
                    Don't have an account? <Link href="/signup" className="text-purple-300 hover:underline font-medium">Create one</Link>
                </p>
            </form>
        </div>
    );
}