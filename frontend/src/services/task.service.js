import { ApiRequest } from "./api.js";

export const TaskService = {
    getTasks(query = ""){
        return ApiRequest(`/tasks${query}`);
    },

    createTask(data) {
        return ApiRequest("/tasks", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    updateTask(id, data){
        return ApiRequest(`/tasks/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    deleteTask(id){
        return ApiRequest(`/tasks/${id}`, {
            method: "DELETE",
        });
    },

    getTasksWithFilters(query = ""){
        const endpoint = query ? `/tasks/filter${query}` : '/tasks';
        return ApiRequest(endpoint);
    }
}