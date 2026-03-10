import Groq from "groq-sdk";
 
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

console.log("KEY:", process.env.GROQ_API_KEY);
 
export async function getAIResponse(req, reply){
 
    const { description, dueDate } = req.body;
 
    const prompt = `You are a productivity assistant. Analyze the task description: "${description}" and due date: "${dueDate}".
Suggest a priority level (low, medium, high, or critical) and a one-sentence reason.
Respond only in JSON format: {"priority": "...", "reason": "..."}`;
 
    try{
 
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.2
        });
 
        const text = completion.choices[0].message.content;
 
        const match = text.match(/\{[\s\S]*\}/);
 
        if(!match){
            throw new Error("Invalid AI response");
        }
 
        const aiResponse = JSON.parse(match[0]);
 
        reply.send({
            success: true,
            suggestion: aiResponse
        });
 
    }
    catch(error){
 
        req.log.error(error);
 
        reply.status(500).send({
            success:false,
            message:"AI processing failed"
        });
 
    }
}