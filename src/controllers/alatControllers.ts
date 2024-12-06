import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid"
import { BASE_URL } from "../global";
import fs from "fs"

const prisma = new PrismaClient ({ errorFormat: "pretty" })

export const getAllAlat = async (reuest: Request, response: Response) => {
    try {
        //input
        const { search } = reuest.query
        //main
        const allAlat = await prisma.alat.findMany({
            where: {name: {contains: search?.toString() || ""}}
        })
        //output
        return response.json({
            status: true,
            data: allAlat,
            massage: `Alat has rettrived`
        }).status(200)
    } catch (error) {
         return response
            .json({
                status: false,
                massage: `There is an error. ${error}`
            })
            .status(400)   
    }
}

export const createAlat = async (request: Request, response: Response) => {
    try {
        const { name, color, stock, price, merk } = request.body
        const uuid = uuidv4()

        //proses untuk menyimpan menu baru 
        const newAlat = await prisma.alat.create({
            data: { uuid, name, color, stock, price: Number(price), merk}
        })

        return response.json({
            status: true,
            data: newAlat,
            massage: `New Alat has created`
        }).status(200)
    } catch (error) {
        return response 
            .json({
                status: false,
                massage: `There is an error. ${error}`
            })
            .status(400)
    }
}

export const updateAlat = async (request: Request, response: Response) => {
    try{
        const {id} = request.params
        const {name, color, stock, price, merk} = request.body

        const findAlat = await prisma.alat.findFirst({where: {id: Number(id)}})
        if (!findAlat) return response
            .status(200)
            .json({status: false, massage: `Alat is not found`})

        const updateAlat = await prisma.alat.update({
                data: {
                    name: name || findAlat.name,
                    color: color || findAlat.color,
                    stock: stock ? Number(stock) : findAlat.stock,
                    price: price ? Number(price) : findAlat.price,
                    merk: merk || findAlat.merk
                },
                where: {id: Number(id)}
        })
        return response.json({
            status: true,
            data: updateAlat,
            massage: `Alat has updated`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                massage: `there is an error. ${error}`
            })
            .status(400)
    }
}

export const changePicture = async (request: Request, response: Response) => {
    try{
        const { id } = request.params

        const findAlat = await prisma.alat.findFirst({ where: { id: Number(id) }})
        if (!findAlat) return response
        .status(200)
        .json({ status: false, message: `Alat is not found` })

        let filename = findAlat.pict
        if (request.file) {
            filename = request.file.filename
            let path = `${BASE_URL}/../public/alat_picture/${findAlat.pict}`
            let exists = fs.existsSync(path)

            if (exists && findAlat.pict !== ``) fs.unlinkSync(path)
        }

        const updatePicture = await prisma.alat.update({
            data: {pict: filename},
            where: {id: Number(id)}
        })

        return response .json({
            status: true,
            data: updatePicture,
            message: `Picture gas changed`
        }).status(200)
    }catch (error) {
        return response.json ({
            status: false,
            message: `There is an error ${error}`
        }).status(400)
    }
}

export const deleteAlat = async (request: Request, response: Response) => {
    try {
        const { id } = request.params

        const findAlat = await prisma.alat.findFirst({ where: {id: Number(id)}})
        if (!findAlat) return response
            .status(200)
            .json ({ status: false, message: `Alat is not found`})

        let path = `${BASE_URL}/..public/alat_picture/${findAlat.pict}`
        let exists = fs.existsSync(path)

        if (exists && findAlat.pict !== ``) fs.unlinkSync(path)

        const deletedAlat = await prisma.alat.delete({
            where: { id: Number(id) }
        })

        return response.json({
            status: true,
            data: deletedAlat,
            message: `Alat has deleted`
        }).status(200)
    }catch (error){
        return response
        .json ({
            status: false,
            message: `There is an error. ${error}`
        })
        .status(400)
    }
}