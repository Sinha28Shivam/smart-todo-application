const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
import { logout } from "../utils/auth";

export async function ApiRequest(endpoint, options = {}) {
    // const token = typeof window !== "undefined"
    //     ? localStorage.getItem("token")
    //     : null;

    const headers = {};

    // Add Content-Type ONLY if body exists
    if (options.body) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: "include", // Include cookies for session management
    });

    if (!response.ok) {
        if (response.status === 401) {
            await logout();
            window.location.href = "/login";
            return;
        }

        const error = await response.json();
        throw new Error(error.message || "API request failed");
    }

    // DELETE may return no content
    if (response.status === 204) {
        return null;
    }

    return response.json();
}
