import  {app}  from "./app.js";
import  {connectDB}  from "./config/db.js";
import  {authRoutes}  from "./routes/auth.routes.js";

async function startServer(){
    await connectDB();

    app.register(authRoutes, { prefix: '/api/auth' });

    await app.listen({
        port: process.env.PORT || 3000,
    })
    console.log(`Server is running at http://localhost:${process.env.PORT || 3000}`);
}
startServer();