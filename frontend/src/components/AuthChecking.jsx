"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAuthUser, logout } from "../utils/auth";


export default function AuthChecking({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(null);
    const timeoutRef = useRef(null);

    const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes

    const publicPaths = ["/login", "/signup", "/"];

    const handleAutoLogout = () =>  {
        console.log("User inactive for too long. Logging out...");
        logout();
        setIsAuthorized(false);
        window.location.href = "/login";
    };

    const resetTimer = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        if(getAuthUser()) {
            timeoutRef.current = setTimeout(handleAutoLogout, INACTIVITY_LIMIT);
        }
    };

    useEffect(() => {
        const user = getAuthUser();
        const isPublicPath = publicPaths.includes(pathname);

        if(!user && !isPublicPath){
            router.push("/login");
        }else if(user && (pathname === "/login" || pathname === "/signup")){
            router.push("/dashboard");
        } else {
            setIsAuthorized(true);
        }
        if(user){
            const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];

            resetTimer();
            events.forEach(event => {
                window.addEventListener(event, resetTimer);
            });

            return () => {
                events.forEach(event => {
                    window.removeEventListener(event, resetTimer);
                });
                if(timeoutRef.current) clearTimeout(timeoutRef.current);
            };
        }

    }, [pathname, router]);

    if(!isAuthorized){
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        )
    }
    return children;
}