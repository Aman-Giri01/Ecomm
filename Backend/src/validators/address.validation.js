import Joi from "joi";

export const addressSchema = Joi.object({
    addressLine: Joi.string().min(5).max(50).required(),

    city: Joi.string().min(3).max(50).required(),  // fixed

    state: Joi.string().min(5).max(50).required(),

    pinCode: Joi.string()
        .pattern(/^[1-9][0-9]{5}$/)
        .message("Invalid Pin Code")
        .required(),  // fixed

    phone: Joi.string()
        .pattern(/^[6-9]\d{9}$/)
        .message("Invalid Phone Number")
        .required(), // fixed

    notes: Joi.string().optional()
});

export const updateAddressSchema = Joi.object({
    addressLine: Joi.string().min(5).max(50).optional(),

    city: Joi.string().min(3).max(50).optional(),  

    state: Joi.string().min(5).max(50).optional(),

    pinCode: Joi.string()
        .pattern(/^[1-9][0-9]{5}$/)
        .message("Invalid Pin Code")
        .optional(),  

    phone: Joi.string()
        .pattern(/^[6-9]\d{9}$/)
        .message("Invalid Phone Number")
        .optional(), 

    notes: Joi.string().optional()
});

