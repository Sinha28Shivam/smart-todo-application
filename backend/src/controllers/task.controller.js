import { Task } from "../models/task.model.js";

// this is used for strict validation
const ALLOWED_STATUS = ["pending", "in-progress", "completed"];
const ALLOWED_PRIORITY = ["low", "medium", "high"];

// Create a new task
export async function createTask(request, reply){
    const { title, description, status, priority, dueDate } = request.body;
    const task = await Task.create({
        title: request.body.title,
        description: request.body.description,
        status: request.body.status,
        priority: request.body.priority,
        dueDate: request.body.dueDate,
        userId: request.user.id // this will get from jwt
    });
    reply.code(201).send(task);
}

// Get all tasks for a user
export async function getAllTasks(request){
    return await Task.find({ userId: request.user.id });
}

// Update a task
export async function updateTask(request, reply){
    const { id } = request.params;

    const task = await Task.findOneAndUpdate(
        { _id: id, userId: request.user.id },
        request.body,
        { new: true }
    );

    if(!task){
        return reply.code(404).send({ message: 'Task not found' });
    }
    reply.send(task);
}

// Delete a task
export async function deleteTask(request, reply){
    const { id } = request.params;
    const task = await Task.findOneAndDelete({ _id: id, userId: request.user.id });
    if(!task){
        return reply.code(404).send({ message: 'Task not found' });
    }
    reply.send({ message: 'Task deleted successfully' });
}

// Get task with filtering and sorting
export async function getTaskWithFilters(request){
    const { status, priority, sortBy, from, to } = request.query;
    
    const query = {
        userId: request.user.id
    };

    // filtering
    if(status && status !== "all"){
        if(!ALLOWED_STATUS.includes(status)){
            return [];
            // query.status = status;
        }
        query.status = status;
    }

    if(priority && priority !== "all"){
        if(!ALLOWED_PRIORITY.includes(priority)){
            return [];
            // query.priority = priority;
        }
        query.priority = priority;
    }

    if(from || to){
        query.dueDate = {};
        if(from)query.dueDate.$gte = new Date(from);
        if(to)query.dueDate.$lte = new Date(to);
    }

    let tasks = await Task.find(query).lean();

    // sorting
    if(sortBy === "priority"){
        const order = { high: 1, medium: 2, low: 3 };
        tasks.sort((a, b) => order[a.priority] - order[b.priority]);
    }

    if (sortBy === "dueDate"){
        tasks.sort(
            (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
        );
    }

    if (sortBy === "createdAt"){
        tasks.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
    
    }

    return tasks;
}

// task summarizer and suggestion of homepage
export async function getTaskSummary(request, reply){
    const tasks = await Task.find({ userId: request.user.id }).lean();

    if(tasks.length === 0){
        return reply.send({ summary: "No tasks found. Start by creating new one" });
    }
    const taskList = tasks.map(t => `- ${t.title} (${t.status}, Priority: ${t.priority})`).join('\n');
    const prompt = `Summarize these tasks and give 3 productivity tips based on them:\n${taskList}`;

    reply.send({ tasks, prompt });
}