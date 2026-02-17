import { Task } from "../models/task.model.js";

function parseICSDate(value) {
    if (!value) return null;

    if (value.includes("T")) {
        return new Date(
            value.replace("Z", "")
                .replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/,
                    "$1-$2-$3T$4:$5:$6")
        );
    }

    return new Date(
        value.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")
    );
}

function calculatePriority(dueDate) {
    if (!dueDate) return "medium";

    const dayLeft = (new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24);

    if (dayLeft <= 1) return "high";
    if (dayLeft <= 3) return "medium";
    return "low";
}

export async function importCalenderForUser(userId, calendarUrl) {
    try {
        // console.time("Calendar Import");

        const res = await fetch(calendarUrl);
        if (!res.ok) {
            throw new Error("Failed to fetch ICS");
        }

        const icsData = await res.text();

        const events = icsData
            .split("BEGIN:VEVENT")
            .slice(1)
            .map(block => block.split("END:VEVENT")[0]);

        if (!events.length) {
            console.log("No events found in ICS");
            return 0;
        }

        // Parse all events first
        const parsedEvents = events.map(event => {
            const getValue = (key) => {
                const line = event
                    .split(/\r?\n/)
                    .find(l => l.startsWith(key));
                return line ? line.split(":").slice(1).join(":").trim() : null;
            };

            return {
                uid: getValue("UID"),
                title: getValue("SUMMARY"),
                description: getValue("DESCRIPTION"),
                dueDate: parseICSDate(
                    getValue("DTEND") || getValue("DTSTART")
                )
            };
        }).filter(e => e.uid && e.title);

        const eventUIDs = parsedEvents.map(e => e.uid);

        // 🔥 Single DB query for duplicates
        const existingTasks = await Task.find({
            userId,
            externalEventId: { $in: eventUIDs }
        }).select("externalEventId");

        const existingUIDs = new Set(
            existingTasks.map(t => t.externalEventId)
        );

        const newTasks = parsedEvents
            .filter(e => !existingUIDs.has(e.uid))
            .map(e => ({
                title: e.title,
                description: e.description,
                dueDate: e.dueDate,
                priority: calculatePriority(e.dueDate),
                status: "pending",
                externalEventId: e.uid,
                userId
            }));

        if (newTasks.length > 0) {
            await Task.insertMany(newTasks);
        }

        // console.timeEnd("Calendar Import");

        return newTasks.length;

    } catch (error) {
        console.error("Calendar Import Failed:", error.message);
        return 0;
    }
}
