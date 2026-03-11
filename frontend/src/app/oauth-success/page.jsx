// src/app/oauth-success/page.jsx
"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setAuthData } from "../../utils/auth";

function OAuthHandler() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            try {
                // Decode the JWT payload (the middle part of the token)
                const payloadBase64 = token.split('.')[1];
                const decodedPayload = JSON.parse(atob(payloadBase64));

                // Save it using your existing auth utility
                setAuthData({
                    token: token,
                    name: decodedPayload.name || "Google User", // Fallback name
                    email: decodedPayload.email
                });

                // Redirect to the dashboard
                router.push("/dashboard");
            } catch (error) {
                console.error("Failed to parse token:", error);
                router.push("/login?error=invalid_token");
            }
        } else {
            router.push("/login");
        }
    }, [searchParams, router]);

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
            <h2 className="text-xl font-bold animate-pulse">Authenticating with Google... 🚀</h2>
        </div>
    );
}

// Next.js requires useSearchParams to be wrapped in a Suspense boundary
export default function OAuthSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[80vh] flex items-center justify-center text-white">
                Loading...
            </div>
        }>
            <OAuthHandler />
        </Suspense>
    );
}