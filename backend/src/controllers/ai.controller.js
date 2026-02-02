// import fetch from 'node-fetch';

export async function getAIResponse(req, reply){
    const { description, dueDate } = req.body;

    const prompt = `You are a productivity assistant. Analyze the task description: "${description}" and due date: "${dueDate}". 
    Suggest a priority level (low, medium, high, or critical) and a one-sentence reason. 
    Respond only in JSON format: {"priority": "...", "reason": "..."}`;

    try {
        const res = await fetch("http://localhost:11434/api/generate", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "llama3.2:3b",
                prompt: prompt,
                stream: false
            })
            
        });
        
        if(!res.ok){
            throw new Error(`AI service error: ${res.status}`);
        }

        // Get text response first, then parse
        const text = await res.text();
        
        // Handle potential NDJSON or multiple JSON objects
        const lines = text.trim().split('\n');
        const lastLine = lines[lines.length - 1];
        const data = JSON.parse(lastLine);

        const match = data.response.match(/\{[\s\S]*\}/);
        if(!match){
            throw new Error('Invalid AI response format');
        }

        const aiResponse = JSON.parse(match[0]);
        reply.send({ success: true, suggestion: aiResponse });
        
    }catch (error){
        req.log.error(error);
        reply.status(500).send({ success: false, message: 'AI processing failed' });
    }
}