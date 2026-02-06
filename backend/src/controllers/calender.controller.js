import { Task } from '../models/task.model.js';

// ---------------- Helpers ----------------

function parseICSDate(value){
    if(!value) return null;

    if(value.includes("T")) {
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
    if(!dueDate) return "medium";

    const daysLeft = (new Date(dueDate) - new Date()) / (1000 * 60 * 60 *24);

    if(daysLeft <= 1) return "high";
    if(daysLeft <= 3) return "medium";
    return "low";
}

//  -------------- Main Controller ----------------

export async function importCalender(request, reply) {
    const { calenderUrl } = request.body;

    if(!calenderUrl){
        return reply.code(400).send({
            Error: "calenderUrl is required"
        })
    }

    // fetch the ics data
    // const res = await fetch(calenderUrl);
    console.log("fetch is:", typeof fetch);
    const res = await fetch(calenderUrl);

    const icsData = await res.text();

    // extract vEvents blocks
    const events = icsData
        .split("BEGIN:VEVENT")
        .slice(1)
        .map(block => block.split("END:VEVENT")[0]);

        let created = 0;
        for(const event of events){
            const getValue = (key) => {
                const line = event
                    .split("\n")
                    .find(l => l.startsWith(key));
                    return line ? line.split(":").slice(1).join(":").trim() : null;
            };
       

            const uid = getValue("UID");
            const title = getValue("SUMMARY");
            const description = getValue("DESCRIPTION");
            const dueDate = parseICSDate(getValue("DTEND") || getValue("DTSTART"));

            if(!uid || !title) continue;

                //  avoid duplicates
                const exists = await Task.findOne({
                    externalEventId: uid,
                    userId: request.user.id
                });
            if (exists) continue;

            const priority = calculatePriority(dueDate);

            await Task.create({
                title,
                description,
                dueDate,
                priority,
                status: "pending",
                externalEventId: uid,
                userId: request.user.id
            });

            created++;
        }

        reply.send({
            message: `Imported ${created} events from calender.`,
            taskCreated: created
        })
        
}