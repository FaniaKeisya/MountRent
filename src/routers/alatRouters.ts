import express from "express";
import { createAlat, getAllAlat, updateAlat, deleteAlat, changePicture } from "../controllers/alatControllers";
import { verifyAddAlat, verifyEditAlat } from "../middlewares/verifyAlat";
import { verifyRole, verifyToken } from "../middlewares/authorization";
import uploadFile from "../middlewares/alatUpload";

const app = express();
app.use(express.json());

app.get(`/`, [verifyToken, verifyRole(['KARYAWAN', 'CUSTOMER'])], getAllAlat);
app.post(`/`, [verifyToken, verifyRole(['KARYAWAN'])], [verifyAddAlat], createAlat);
app.put(`/:id`, [verifyToken, verifyRole(['KARYAWAN'])], [verifyEditAlat], updateAlat)
app.put(`/pic/:id`, [verifyToken, verifyRole(['KARYAWAN'])], [uploadFile.single("picture")], changePicture)
app.delete(`/:id`, [verifyToken, verifyRole(['KARYAWAN'])], deleteAlat)

export default app;