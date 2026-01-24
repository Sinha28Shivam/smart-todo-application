import { registerUser, loginUser } from "../controllers/auth.controller.js";

export async function authRoutes(fastify){
    fastify.post('/register', registerUser);
    fastify.post('/login', loginUser);
}