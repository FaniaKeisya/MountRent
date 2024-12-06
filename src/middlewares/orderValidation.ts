import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { join } from "path";

//ini schema buat orderlist
const orderListSchema = Joi.object({
    idAlat: Joi.number().required(),
    jumlah: Joi.number().required()
})

// data pesanan baru 
const addDataSchema = Joi.object({
    customer: Joi.string().required(),
    payment_method: Joi.string().valid("CASH", "QRISS", "DEBIT").uppercase().required(),
    status: Joi.string().valid("LUNAS", "BELUM_LUNAS").uppercase().optional(),
    idUser: Joi.number().optional(),
    orderList: Joi.array().items(orderListSchema).min(1).required(),
    user: Joi.optional()
})

// schema untuk input new order
export const verifyAddOrder = (request: Request, response: Response, next: NextFunction) => {
    // validate a req, klo gaada ya eror
    const { error } = addDataSchema.validate(request.body, {abortEarly : false})

    if (error) {
        // untuk respon error
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}

const editDataSchema = Joi.object({
    status: Joi.string().valid("LUNAS", "BELUM_LUNAS").uppercase().required(),
    user: Joi.optional()
})

export const verifyEditStatus = (request: Request, response: Response, next: NextFunction) => {
    const { error } = editDataSchema.validate(request.body, {abortEarly : false})

    if (error) {
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}