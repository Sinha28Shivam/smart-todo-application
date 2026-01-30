import {
    createTask,
    deleteTask,
    getAllTasks,
    updateTask,
    getTaskWithFilters,
    getTaskSummary,
    
} from '../controllers/task.controller.js';


export async function taskRoutes(fastify){
    fastify.addHook("preHandler", fastify.authenticate);

    fastify.post('/tasks', createTask)
    fastify.get('/tasks', getAllTasks)
    fastify.put('/tasks/:id', updateTask)
    fastify.delete('/tasks/:id', deleteTask)
    fastify.get('/tasks/filter', getTaskWithFilters)
    fastify.get('/tasks/summary', getTaskSummary)
}
