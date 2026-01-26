export const setAuthData = (data) => {
    if(typeof window !== "undefined") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({ 
            name: data.name,
            email: data.email
        }));
    }
};

export const getAuthUser = () => {
    if(typeof window !== "undefined"){
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    }
    return null;
}

export const logout = () => {
    if(typeof window !== "undefined"){
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }
}
