import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { BASE_URL, SECRET } from "../global";
import fs from "fs";
import md5 from "md5";
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient({ errorFormat: "pretty"});

export const getAllUser = async (request: Request, response: Response) => {
    try {
        const { search } = request.query;

        const allUser = await prisma.user.findMany({
            where: { name: { contains: search?.toString() || "" } },
        })

        return response
            .json({
                status: true,
                response: allUser,
                message: `User has rettrived`
            })
            .status(200);
    } catch (error) {
        return response 
            .json({
                status: false,
                message: `There is an error. ${error}`,
            })
            .status(200)
    }
};

export const createUser = async (request: Request, response: Response) => {
    try {
        const { name, email, password, no_telp, alamat, jenis_kelamin, role } = request.body;
        const uuid = uuidv4();

        const newUser = await prisma.user.create({
            data: { uuid, name, email, pasword: md5(password), no_telp, alamat, jenis_kelamin, role },
        });

        return response 
            .json ({
                status: true,
                data: newUser,
                message: `User has created`,
            })
            .status(200);
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`,
            })
            .status(400);
    }
};

export const updateUser = async (request: Request, response: Response) => {
    try {
        const { id } = request.params;
        const { name, email, password, no_telp, alamat, jenis_kelamin, role } = request.body;

        const findUser = await prisma.user.findFirst({ where: { id: Number(id) } });
        if (!findUser)
            return response
                .status(200)
                .json({ 
                    status: false, 
                    message:  `User is not found`
                })

        const updateUser = await prisma.user.update({
            data: {
                name: name || findUser.name,
                email: email? email : findUser.pasword,
                pasword: password || findUser.pasword,
                no_telp: no_telp || findUser.no_telp,
                alamat: alamat || findUser.alamat,
                jenis_kelamin: jenis_kelamin || findUser.jenis_kelamin,
                role: role || findUser.role,
            },
            where: { id: Number(id) },
        });
        return response
            .json({
                status: true,
                data: updateUser,
                message: `User has update`,
            })
            .status(200);
    } catch (error) {
        return response
            .json ({
                status: false,
                message: `There is an error. ${error}`,
            })
            .status(400);
    }
};

export const changePicture = async (request: Request, response: Response) => {
    try {
        const { id } = request.params;

        const findUser = await prisma.user.findFirst({ where: { id: Number(id) } });
        if (!findUser)
            return response
              .status(200)
              .json({ status: false, messsage: `User is not found `});

        let filename = findUser.profile_picture;
        if (request.file) {
            filename = request.file.filename;
            let path = `${BASE_URL}/../public/profile_picture/${findUser.profile_picture}`;

            let exists = fs.existsSync(path);

            if (exists && findUser.profile_picture !== ``) {
                fs.unlinkSync(path);
            }
        }

        const updatePicture = await prisma.user.update({
            data: { profile_picture: filename },
            where: { id: Number(id) },
        })

        return response
          .json({
            status: true,
            data: updatePicture,
            message: `Picture has changed`
          })
          .status(200);
    } catch (error) {
        return response
          .json({
            status: false,
            message: `There is an error. ${error}`,
          })
        .status(400)
    }
}

export const deleteUser = async (request: Request, response: Response) => {
    try {
        const { id } = request.params;

        const findUser = await prisma.user.findFirst({ where: { id: Number(id) } });
        if (!findUser)
            return response
                .status(200)
                .json({
                    status: false,
                    message: `User is not found`
                });

        const deletedUser = await prisma.user.delete({
            where: { id: Number(id) },
        });

        return response 
            .json({
                status: true,
                data: deletedUser,
                message: `User is deleted`
            })
            .status(200);
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`,
            })
            .status(400);
    }
};

export const authentication = async (request: Request, response: Response) => {
    try {
      const { email, pasword } = request.body;
  
      const findUser = await prisma.user.findFirst({
        where: { email, pasword: md5(pasword) },
      });
  
      if (!findUser)
        return response.status(200).json({
          status: false,
          logged: false,
          message: `Email or password is invalid`,
        });
  
      let data = {
        id: findUser.id,
        name: findUser.name,
        email: findUser.email,
        role: findUser.role
      };
  
      //payload digunakan untuk menyapkan data yang dijadikan token (acak)
      let payload = JSON.stringify(data);
  
      let token = sign(payload, SECRET || "token");
  
      return response.status(200).json({
        status: true,
        logged: true,
        message: `Login Succes`,
        token,
      });
    } catch (error) {
      return response
        .json({
          status: false,
          message: `There is an error ${error}`,
        })
        .status(400);
    }
  };