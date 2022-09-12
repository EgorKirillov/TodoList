import {TaskStatuses, TaskType, UpdateTaskModelType} from "../api/00_task-api";

export const createUpdatedTask = (task: TaskType, model?:{title?: string; status?: TaskStatuses}): UpdateTaskModelType => {
    return {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        ...model
    }
}