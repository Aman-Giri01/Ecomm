import Joi from "joi";

export const registerSchema=Joi.object({
    name:Joi.string().min(5).max(50).required(),
    email:Joi.string().email().min(5).max(50).required(),
    password:Joi.string().min(5).max(50).required(),
    contactNumber:Joi.string().length(10).pattern(/^[6-9]\d{9}$/).message("Invalid Mobile Number").required(),
})

export const loginSchema=Joi.object({
    email:Joi.string().email().min(5).max(50).required(),
    password:Joi.string().min(5).max(50).required(),
})

export const validateSchema=Joi.object({
    name:Joi.string().min(5).max(50).optional(),
    email:Joi.string().email().min(5).max(50).optional(),
    password:Joi.string().min(5).max(50).optional(),
    contactNumber:Joi.string().length(10).pattern(/^[6-9]\d{9}$/).message("Invalid Mobile Number").optional(),
})