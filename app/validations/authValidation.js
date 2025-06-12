const joi = require('joi');

const registerSchema = joi.object({
    username: joi.string().min(3).required(),
    password: joi.string().min(6).required(),
    email: joi.string().email().required(),
});

const loginSchema = joi.object({
    username: joi.string().required(),
    password: joi.string().required(),
});

const tokenSchema = joi.object({
    token: joi.string().required(),
});

module.exports = {
    registerSchema,
    loginSchema,
    tokenSchema,
};