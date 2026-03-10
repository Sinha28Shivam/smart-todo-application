import { registerUser, loginUser } from "../controllers/auth.controller.js";
import fastifyPassport from "@fastify/passport";
import { googleCallback } from "../controllers/auth.controller.js";



export async function authRoutes(fastify){

    fastify.post('/register', {
        schema: {
          description: 'Register a new user',
          tags: ['Auth'],
          body: {
            type: 'object',
            required: ['name', 'email', 'password'],
            properties: {
              name: { 
                type: 'string',
                minLength: 3        
               },
              email: {
                 type: 'string',
                format: 'email'
             },
              password: { 
                type: 'string',
                minLength: 8,
                pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
        }
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

    fastify.post("/login", {
        schema: {
          description: "Login user",
          tags: ["Auth"],
          body: {
            type: "object",
            required: ["email", "password"],
            properties: {
              email: {
                type: "string",
                format: "email",
              },
              password: {
                type: "string",
                minLength: 4,
              },
            },
          },
          response: {
            200: {
              type: "object",
              properties: {
                token: { type: "string" },
              }
            }
          }
        }
      },
      loginUser
    );

      fastify.get("/google",
         {
          preValidation:fastifyPassport.authenticate("google", {
              scope: ["profile", "email"],

          }),
        },
        async function (request, reply) {
            // Passport handles the redirect, so this can stay empty.
        }
      );

      fastify.get("/google/callback",
        {
          preValidation: fastifyPassport.authenticate("google", {
            failureRedirect: "/login",
          }),
        },
        googleCallback
      );
}