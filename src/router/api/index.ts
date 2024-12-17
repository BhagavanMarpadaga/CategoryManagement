import express from 'express'
import router from './v1'
const v1router = express.Router()

v1router.use("/v1",router)

export default v1router
