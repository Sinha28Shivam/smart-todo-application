import cron from "node-cron";
import { User } from "../models/user.model.js";
import { importCalenderForUser } from "./calendar.service.js";

export function startCalenderSyncCron() {

    cron.schedule("0 * * * *", async () => {

        console.log("Calendar sync triggered at:", new Date());

        try {

            const users = await User.find({
                calenderUrl: { $exists: true, $ne: null }
            });

            console.log("Found", users.length, "users with calender URL");

            if (!users.length) return;

            console.time("Calendar Sync Duration");

            await Promise.all(
                users.map(user => {
                    console.log("Syncing calendar for user:", user._id);
                    return importCalenderForUser(user._id, user.calenderUrl);
                })
            );

            console.timeEnd("Calendar Sync Duration");

        } catch (error) {
            console.error("Calendar Sync Error:", error.message);
        }

    });
}
