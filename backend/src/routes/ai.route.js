import { getAIResponse } from "../controllers/ai.controller.js";

export async function aiRoutes(fastify){
    fastify.addHook('preHandler', fastify.authenticate);
    fastify.post('/ai/suggest', getAIResponse);
}