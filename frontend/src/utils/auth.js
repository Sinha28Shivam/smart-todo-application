export const setAuthData = (data) => {
    if(typeof window !== "undefined") {
        // localStorage.setItem("token", data.token);
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

export const logout = async () => {
    if(typeof window !== "undefined"){
        localStorage.removeItem("user");

        try{
            await fetch("http://localhost:5000/api/logout", {
                method: "POST",
                credentials: "include",
            });
        }catch(error){
            console.error("Logout API call failed:", error);
        }
    }

}
