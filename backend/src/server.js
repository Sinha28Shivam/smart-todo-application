import  { app }  from "./app.js";
import  { connectDB }  from "./config/db.js";
import  { authRoutes }  from "./routes/auth.routes.js";
import  { taskRoutes }  from "./routes/task.route.js";

async function startServer(){
    await connectDB();

    app.register(authRoutes, { prefix: '/api/auth' });
    app.register(taskRoutes, { prefix: '/api/'})

    await app.listen({
        port: process.env.PORT || 3000,
    })
    console.log(`Server is running at http://localhost:${process.env.PORT || 3000}`);
}
startServer();