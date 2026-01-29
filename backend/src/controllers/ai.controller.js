import ollama from 'ollama'

export async function getAIResponse(req, reply){
    const { description, dueDate } = req.body;

    const prompt = `You are a productivity assistant. Analyze the task description: "${description}" and due date: "${dueDate}". 
    Suggest a priority level (low, medium, high, or critical) and a one-sentence reason. 
    Respond only in JSON format: {"priority": "...", "reason": "..."}`;

    try {
        const response = await ollama.chat({
            model: 'llama3.2:3b',
            messages: [{ role: 'user', content: prompt }],
            format: 'json',
        });

        const suggestion = JSON.parse(response.message.content);
        reply.send({ success: true, suggestion });
    }catch (error){
        req.log.error(error);
        reply.status(500).send({ success: false, message: 'AI processing failed' });
    }
}