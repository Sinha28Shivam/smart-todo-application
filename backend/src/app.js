import Fastify from 'fastify';
import jwt from 'fastify-jwt';
import cors from '@fastify/cors';
import dotenv from 'dotenv';

dotenv.config();

export const app = Fastify({ logger: true });

// CORS Setup
await app.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
})


// JWT Setup
app.register(jwt, {
    secret: process.env.JWT_SECRET
});

app.decorate('authenticate', async (request, reply) => {
    console.log("Authe Header: ", request.headers.authorization);
    try{
        await request.jwtVerify();
    }catch{
        reply.code(401).send({ message: 'Unauthorized Access' });
    }

})