import { registerUser, loginUser } from "../controllers/auth.controller.js";

export async function authRoutes(fastify){
    fastify.post('/register', {
        schema: {
          description: 'Register a new user',
          tags: ['Auth'],
          body: {
            type: 'object',
            required: ['name', 'email', 'password'],
            properties: {
              name: { type: 'string' },
              email: { type: 'string' },
              password: { type: 'string' }
            }
          },
          response: {
            201: {
              type: 'object',
              properties: {
                message: { type: 'string' },
                token: { type: 'string' }
              }
            }
          }
        }
      }, registerUser);
      
    fastify.post('/login', {
        schema: {
          description: 'Login user',
          tags: ['Auth'],
          body: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: { type: 'string' },
              password: { type: 'string' }
            }
          },
          response: {
            200: {
              type: 'object',
              properties: {
                token: { type: 'string' }
              }
            }
          }
        }
      }, loginUser);
}