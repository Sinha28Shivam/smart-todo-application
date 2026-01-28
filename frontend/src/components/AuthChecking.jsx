"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAuthUser } from "../utils/auth";


export default function AuthChecking({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(null);

    const publicPaths = ["/login", "/signup", "/"];

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