import Fastify from 'fastify';
import jwt from '@fastify/jwt';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';

dotenv.config();

export const app = Fastify({ logger: true });
await app.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Smart To-Do API',
        description: 'API documentation for Smart To-Do Application',
        version: '1.0.0'
      },
      servers: [
        {
  url: 'http://localhost:5000',
          description: 'Development server'
        }
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http' ,
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      }
    }
  });

  await app.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false
    }
  });

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
    }catch(error){
        return reply.code(401).send({ message: 'Unauthorized Access' });
    }

})