import Fastify from 'fastify';
import jwt from '@fastify/jwt';
import cors from '@fastify/cors';
import fastifyPassport from "@fastify/passport"
import fastifySecureSession from '@fastify/secure-session'; 
import dotenv from 'dotenv';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';


dotenv.config();

export const app = Fastify({ logger: true });

// Global error handler implmentation

app.setErrorHandler(( error, request, reply ) => {
  request.log.error(error);

  const statusCode = error.statusCode || 500;

  const response = {
    success: false,
    error: {
      message: statusCode === 500 ? 'Internal Server Error' : error.message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
        details: error.validation
      })
    }
  };
  reply.status(statusCode).send(response);
})

await app.register(fastifySecureSession, {
  key: Buffer.from("a" .repeat(32)), 
});

await app.register(fastifyPassport.initialize());
await app.register(fastifyPassport.secureSession());

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
app.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
})




// JWT Setup
app.register(jwt, {
    secret: process.env.JWT_SECRET,
    decoratorName: 'jwtUser',
    cookie: {
      cookieName: 'token',
      signed: false,
    }
});

app.decorate('authenticate', async (request, reply) => {
    console.log("Auth Header: ", request.headers.authorization);
    try{
        await request.jwtVerify();
    }catch(error){
        error.statusCode = 401;
        error.message = 'Unauthorized';
        throw error;
    }

})