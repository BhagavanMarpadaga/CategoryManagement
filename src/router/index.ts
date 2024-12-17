import express from 'express'
import v1router from './api'
const apiRouter = express.Router()

apiRouter.use("/api",v1router)

export default apiRouter
