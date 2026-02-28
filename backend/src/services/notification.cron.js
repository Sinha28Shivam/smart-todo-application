import cron from 'node-cron';
import { Task } from '../models/task.model.js';
import { User } from '../models/user.model.js';
import { sendEmail } from './mail.service.js';

export function startNotificationCron() {
    // runs every 10 minutes
    cron.schedule("*/10 * * * *", async () => {
        console.log("Running notification cron job...");

        const now = new Date();
        const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        // find task due soon and not notified yet
        const tasks = await Task.find({
            dueDate: { $gte: now, $lte: next24h },
            notificationSent: false
        });

        for (const task of tasks){
            const user = await User.findById(task.userId);

            if(!user) continue;
            await sendEmail({
                to: user.email,
                subject: "Task Reminder",
                text: `Remainder: ${task.title} is due on ${task.dueDate}`
            });
            task.notificationSent = true;
            await task.save();
        }
    });
}