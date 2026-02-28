import { getAIResponse } from "../controllers/ai.controller.js";

// export async function aiRoutes(fastify){
//     fastify.addHook('preHandler', fastify.authenticate);
//     fastify.post('/ai/suggest', getAIResponse);
// }

export async function aiRoutes(fastify){
 
fastify.post('/ai/suggest', {
    preHandler: [fastify.authenticate],
    schema: {
      tags: ['AI'],
      security: [{ BearerAuth: [] }],
      body: {
        type: 'object',
        required: ['description', 'dueDate'],
        properties: {
          description: { type: 'string' },
          dueDate: { type: 'string' }
        }
      }
    }
  }, getAIResponse);
 
}