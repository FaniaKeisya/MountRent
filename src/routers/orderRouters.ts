import express from "express";
import { getAllOrders, createOrder, updateStatusOrder, deleteOrder,upBuktiBayar } from "../controllers/orderControllers";
import { verifyAddOrder, verifyEditStatus } from "../middlewares/orderValidation";
import { verifyRole, verifyToken } from "../middlewares/authorization";
import uploadFile from "../middlewares/alatUpload";

const app = express()

app.use(express.json())
app.get(`/`, [verifyToken, verifyRole(["CUSTOMER", "KARYAWAN"])], getAllOrders)
app.post(`/`, [verifyToken, verifyRole(["KARYAWAN"]), verifyAddOrder], createOrder )
app.put(`/:id`, [verifyToken, verifyRole(["KARYAWAN"]), verifyEditStatus], updateStatusOrder)
app.put(`/pic/:id`, [uploadFile.single("foto")], upBuktiBayar)
app.delete(`/:id`, [verifyToken, verifyRole(["KARYAWAN"])], deleteOrder)

export default app