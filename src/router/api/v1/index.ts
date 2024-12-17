import express from 'express'
import categoryRouter from './catergory'
const router = express.Router()

router.use("/category",categoryRouter)

export default router
