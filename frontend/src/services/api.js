const BASE_URL = "http://localhost:5000/api";
import { logout } from "../utils/auth";

export async function ApiRequest(endpoint, options = {}) {
    const token = typeof window !== "undefined"
    ? localStorage.getItem("token")
    : null;

    const config = {
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        ...options,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if(!response.ok){
        if(response.status === 401){
            logout();
            window.location.href = "/login";
        }
        const error = await response.json();
        throw new Error(error.message || "API request failed");
    }

    return response.json();
}