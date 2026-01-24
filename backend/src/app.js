import Fastify from 'fastify';
import jwt from 'fastify-jwt';
import dotenv from 'dotenv';

dotenv.config();

export const app = Fastify({ logger: true });
app.register(jwt, {
    secret: process.env.JWT_SECRET
});

app.decorate('authenticate', async (request, reply) => {
    try{
        await request.jwtVerify();
    }catch{
        reply.code(401).send({ message: 'Unauthorized Access' });
    }

})