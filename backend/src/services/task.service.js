const Task = require('../models/task.model');

const getTasks = async (user, filters = {}) => {
    let query = {};
    if (user.role !== 'admin') {
        query.user = user._id; // Regular users only see their own tasks
    }
    
    // allow filtering by status
    if (filters.status) {
        query.status = filters.status;
    }

    const tasks = await Task.find(query).populate('user', 'name email');
    return tasks;
};

const createTask = async (user, taskData) => {
    const { title, description, status } = taskData;
    
    const task = await Task.create({
        title,
        description,
        status: status || 'pending',
        user: user._id
    });
    
    return task;
};

const updateTask = async (taskId, user, taskData) => {
    const task = await Task.findById(taskId);

    if (!task) {
        throw new Error('Task not found');
    }

    // Check for user authority
    if (task.user.toString() !== user.id && user.role !== 'admin') {
        throw new Error('User not authorized');
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, taskData, { new: true });
    return updatedTask;
};

const deleteTask = async (taskId, user) => {
    const task = await Task.findById(taskId);

    if (!task) {
        throw new Error('Task not found');
    }

    // Check for user authority
    if (task.user.toString() !== user.id && user.role !== 'admin') {
        throw new Error('User not authorized');
    }

    await Task.findByIdAndDelete(taskId);
    return { id: taskId };
};

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
};
