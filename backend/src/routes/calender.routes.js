import { importCalender } from "../controllers/calender.controller.js";


export async function calenderRoutes(fastify) {
    fastify.addHook("preHandler", fastify.authenticate);
    fastify.post("/calender/import", importCalender);
}