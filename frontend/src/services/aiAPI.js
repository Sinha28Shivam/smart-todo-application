const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getAIResponse(description, dueDate, token){
    const res = await fetch(`${BASE_URL}/ai/suggest`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({description, dueDate})
    });

    return res.json();
}