import {
    createTask,
    deleteTask,
    getAllTasks,
    updateTask,
} from '../controllers/task.controller.js';


export async function taskRoutes(fastify){
    fastify.addHook("preHandler", fastify.authenticate);

    fastify.post('/tasks', createTask)
    fastify.get('/tasks', getAllTasks)
    fastify.put('/tasks/:id', updateTask)
    fastify.delete('/tasks/:id', deleteTask)
}
