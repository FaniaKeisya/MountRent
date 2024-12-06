import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const addDataSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).alphanum().required(),
    no_telp : Joi.string().min(10).required(),
    alamat : Joi.string().required(),
    jenis_kelamin : Joi.string().valid(`P`, `L`).required(),
    role: Joi.string().valid(`KARYAWAN`, `CUSTOMER`).required(),
    picture: Joi.allow().optional(),
    user: Joi.optional()   
})

const editDataSchema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(3).alphanum().optional(),
    no_telp : Joi.string().min(10).optional(),
    alamat : Joi.string().optional(),
    jenis_kelamin : Joi.string().valid(`P`, `L`).optional(),
    role: Joi.string().valid(`KARYAWAN`, `CUSTOMER`).optional(),
    picture: Joi.allow().optional(), 
    user: Joi.optional()  
})

const authSchema = Joi.object({
    email: Joi.string().email().required(),
    pasword: Joi.string().min(3).alphanum().required(),
})


export const verifyAuthentication = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const { error } = authSchema.validate(request.body, {abortEarly: false})

    if (error) {
        return response.status(400).json ({
            status: false,
            message: error.details.map((it) => it.message).join(),
        })
    }
    return next();
}

export const verifyAddUser = (request: Request, response: Response, next: NextFunction) => {
    const { error } = addDataSchema.validate(request.body, { abortEarly: false})

    if (error) {
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}

export const verifyEditUser = (request: Request, response: Response, next: NextFunction) => {
    const { error } = editDataSchema.validate(request.body, { abortEarly: false })

    if (error) {
        return response.status(400).json({
            status: false,
            massage: error.details.map(it => it.message).join()
        })
    }
    return next()
}