export async function getAIResponse(description, dueDate, token){
    const res = await fetch("http://localhost:5000/api/ai/suggest", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({description, dueDate})
    });

    return res.json();
}