import express from 'express'
import v1router from './api'
const apiRouter = express.Router()

apiRouter.use("/api",v1router)
apiRouter.get("/",(req,res)=>{
    res.json({message:"Please see the githib read me and hit it accordingly",link:"https://github.com/BhagavanMarpadaga/CategoryManagement/blob/master/Readme.md"})
})


export default apiRouter
