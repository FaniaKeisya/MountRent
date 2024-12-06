import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { BASE_URL } from "../global";
import fs from "fs"
import { request } from "http";

const prisma = new PrismaClient ({ errorFormat: "pretty" })

export const getAllOrders = async (request: Request, response: Response) => {
    try {
        const { search } = request.query

        const allOrders = await prisma.order.findMany({
            where: {
                OR: [
                    {customer: { contains: search?.toString()|| ""}}
                ]
            },
            orderBy: { createdAt: "desc"}, 
            include: { orderList: true }
        })
        return response.json({
            status: true,
            data: allOrders,
            message: `Order is has retrived`
        }).status(200)
    }catch (error) {
        return response.json({
            status: false,
            message: `There is an error. ${error}`
        })
        .status(400)
    }
}

export const createOrder = async (request: Request, response: Response) => {
    try {
        const { customer, payment_method, statusBayar, orderList} = request.body
        const user = request.body.user
        const uuid = uuidv4()

        let totalPrice = 0
        for (let index = 0; index < orderList.length; index++) {
            const {idAlat} = orderList[index]
            const detailAlat = await prisma.alat.findFirst ({
                where: {
                    id: idAlat
                }
            })
            if (!detailAlat) return response
            .status(200).json({ status: false, message: `Alat with id ${idAlat} is not found`})
            totalPrice += (detailAlat.price * orderList[index].jumlah)
        }

        const newOrder = await prisma.order.create({
            data: { uuid, customer, totalPrice, payment_method, idUser: user.id, statusBayar}
        })

        for (let index = 0; index < orderList.length; index++) {
            const uuid = uuidv4()
            const { idAlat, jumlah} = orderList[index]
            await prisma.orderList.create({
                data: {
                    uuid, idOrder: newOrder.id, idAlat: Number(idAlat), jumlah: Number(jumlah)
                }
            })
        }
        return response.json({
            status: true,
            data: newOrder,
            message: `New order ha created`
        }).status(200)
    } catch (error) {
        return response.json({
            status: false,
            message: `There is an error. ${error}`
        })  
        .status(400)
    }
}

export const updateStatusOrder = async (request: Request, response: Response) => {
    try {
        const { id } = request.params
        const { statusBayar } = request.body
        const user = request.body.user

        const findOrder = await prisma.order.findFirst({ where: { id: Number(id)}})

        if (!findOrder) return response
            .status(200)
            .json({
                status: false,
                message: `Order is not found`
            })

        const updateStatus = await prisma.order.update({
            data: {
                statusBayar: statusBayar || findOrder.statusBayar,
                idUser: user.id ? user.id : findOrder.idUser
            },
            where: { id: Number(id)}
        })
        return response.json({
            status: true,
            data: updateStatus,
            message: `Order has updated`
        }).status(200)
    }catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}

export const upBuktiBayar = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const findOrder = await prisma.order.findFirst({ where: { id: Number(id) } })
        if(!findOrder) return res
            .status(200)
            .json({ status: true, message: "Order not found" })

        let filename = findOrder.bukti_bayar
        if (req.file) {
            filename = req.file.filename
            let path = `${BASE_URL}/../bukti_bayar${findOrder.bukti_bayar}`
            let exist = fs.existsSync(path)
            if(exist && findOrder.bukti_bayar !== '') fs.unlinkSync(path)
        }
        const updatePic = await prisma.order.update({
            data: { bukti_bayar: filename, statusBayar: "LUNAS" },
            where: { id: Number(id) }
        })
        return res.json({
            status: true,
            data: updatePic,
            message: `Update bukti bayar success`
        }).status(200)  
    }   catch (error) {
        return res.json({
            status: false,
            message: `There is an error.${error}`
        }).status(400)
    }
} 

export const deleteOrder = async (request: Request, response: Response) => {
    try {
        const { id } = request.params

        const findOrder = await prisma.order.findFirst({ where: { id: Number(id)}})
        if (!findOrder) return response
           .status(200)
           .json({ status: false, meessage: `Order is not found`})

        let deleteOrderList = await prisma.orderList.deleteMany({ where: { idOrder: Number(id)}})
        let deleteOrder = await prisma.order.delete({ where: {id: Number(id)}})

        return response.json({
            status: true,
            data: deleteOrder,
            message: `Order has deleted`
        }).status(200)
    }catch (error) {
        return response.json({
            status: false,
            message: `There is an error. ${error}`
        })
        .status(400)
    }
}