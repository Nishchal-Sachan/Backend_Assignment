const taskService = require('../services/task.service');

const getTasks = async (req, res, next) => {
    try {
        const tasks = await taskService.getTasks(req.user, req.query);
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
};

const createTask = async (req, res, next) => {
    try {
        if (!req.body.title || !req.body.description) {
            res.status(400);
            throw new Error('Please add a text and description');
        }
        const task = await taskService.createTask(req.user, req.body);
        res.status(201).json(task);
    } catch (error) {
        next(error);
    }
};

const updateTask = async (req, res, next) => {
    try {
        const updatedTask = await taskService.updateTask(req.params.id, req.user, req.body);
        res.status(200).json(updatedTask);
    } catch (error) {
        if (error.message === 'Task not found') res.status(404);
        if (error.message === 'User not authorized') res.status(401);
        next(error);
    }
};

const deleteTask = async (req, res, next) => {
    try {
        const result = await taskService.deleteTask(req.params.id, req.user);
        res.status(200).json(result);
    } catch (error) {
        if (error.message === 'Task not found') res.status(404);
        if (error.message === 'User not authorized') res.status(401);
        next(error);
    }
};

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
};
