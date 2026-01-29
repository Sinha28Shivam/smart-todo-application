import  { app }  from "./app.js";
import  { connectDB }  from "./config/db.js";
import  { authRoutes }  from "./routes/auth.routes.js";
import  { taskRoutes }  from "./routes/task.route.js";
import  { aiRoutes } from "./routes/ai.route.js";

async function startServer(){
    await connectDB();

    app.register(authRoutes, { prefix: '/api/auth' });
    app.register(taskRoutes, { prefix: '/api/'})
    app.register(aiRoutes, { prefix: '/api'});
    await app.listen({
        port: process.env.PORT || 5000,
    })
    console.log(`Server is running at http://localhost:${process.env.PORT || 5000}`);
}
startServer();