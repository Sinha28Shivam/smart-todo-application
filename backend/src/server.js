import  { app }  from "./app.js";
import  { connectDB }  from "./config/db.js";
import  { authRoutes }  from "./routes/auth.routes.js";
import  { taskRoutes }  from "./routes/task.route.js";
import  { aiRoutes } from "./routes/ai.route.js";
import { calenderRoutes } from "./routes/calender.routes.js";
import { startNotificationCron } from "./services/notification.cron.js";
import { startCalenderSyncCron } from "./services/calenderSync.cron.js";
import passportConfig from "./config/passport.js";



async function startServer(){
    await connectDB();

    await app.register(passportConfig);

    app.register(authRoutes, { prefix: '/api/auth' });
    app.register(taskRoutes, { prefix: '/api/'})
    app.register(aiRoutes, { prefix: '/api'});
    app.register(calenderRoutes, { prefix: '/api' });

    

    await app.listen({
        port: process.env.PORT || 5000,
    })
    // start cron jobs
    startCalenderSyncCron();
    startNotificationCron();
    console.log(`Server is running at http://localhost:${process.env.PORT || 5000}`);
}
startServer();