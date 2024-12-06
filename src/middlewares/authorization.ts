import { NextFunction, Request, Response } from "express";
// verify yang disediakan oleh jsonwebtoken digunakan untuk memastikan token benar atau salah 
import { verify } from "jsonwebtoken";
import { SECRET } from "../global";

// nama interface bisa diganti asal nnti manggilnya harus sama 
interface JwtPayload {
    id: string;
    name: string;
    email: string;
    role: string;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    //ngecek token 
    if (!token) {
        return res.status(403).json({ message: `Access denied. No token provided`});
    }

    try {
        const secretKey = SECRET || "" 
        const decoded = verify(token, secretKey);
        //nyimpen data payload
        req.body.user = decoded as JwtPayload;
        next();
    }catch (error) {
        return res.status(401).json({ message: 'Invalid token' })
    }
};

// ada array yang isinya allowedRoles, kenapa pake array? soalnya biar yg akses bisa banyak (antara 1, 2 atau 3 lebih )
export const verifyRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.body.user;

        //ngecek user 
        if (!user) {
            return res.status(403).json({ message: "No user information available"});
        }

        // allowedRoles isinya roles yang dibolehkan untuk akses trus berupa array
        if (!allowedRoles.includes(user.role)) {
            // jika ! = tidak, data alow rolenya tidak ada didalam role, maka akses ditolak, klo ada berarti lanjut 
            return res.status(403)
                .json({ message: `Access denied. Requires one of the following roles: ${allowedRoles.join(`, `)}`});
        }

        next();
    }
}