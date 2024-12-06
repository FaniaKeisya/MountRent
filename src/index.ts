import express from 'express'
import cors from 'cors'
import AlatRoute from './routers/alatRouters'
import UserRoute from './routers/userRouters'
import OrderRoute from './routers/orderRouters'

const PORT: number = 4000
const app = express()
app.use(cors())

app.use('/alat', AlatRoute)
app.use('/user', UserRoute)
app.use('/order', OrderRoute)

app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`)
})