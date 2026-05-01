const authService = require('../services/auth.service');

const registerUser = async (req, res, next) => {
    try {
        const userData = await authService.registerUser(req.body);
        res.status(201).json(userData);
    } catch (error) {
        if (error.message === 'User already exists') {
            res.status(400);
        }
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const userData = await authService.loginUser(email, password);
        res.status(200).json(userData);
    } catch (error) {
        if (error.message === 'Invalid credentials') {
            res.status(401);
        }
        next(error);
    }
};

const getMe = async (req, res, next) => {
    try {
        const user = await authService.getMe(req.user.id);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
};
