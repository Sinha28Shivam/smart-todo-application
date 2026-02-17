import { importCalenderForUser } from '../services/calendar.service.js';
import { User } from '../models/user.model.js';

export async function importCalender(request, reply){
    const { calenderUrl } = request.body;

    if(!calenderUrl){
        return reply.status(400).send({ error: "calenderUrl is required" });
    }

    try{
        await User.findByIdAndUpdate(
            request.user.id,
            { calenderUrl },
            { new: true }
        );

        const created = await importCalenderForUser(
            request.user.id,
            calenderUrl
        );

        return reply.send({ message: `Calendar imported with ${created} tasks` });
    }catch(error){
        return reply.code(500).send({ error: "Failed to import calendar", details: error.message });
    }

    
}