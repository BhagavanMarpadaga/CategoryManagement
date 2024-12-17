import express from "express";
import {createCategory,updateCategory,deleteCategory,getCategoryChildren,getCategoryById} from '../../../controller/categoryController'

const categoryRouter = express.Router();

categoryRouter.post("/",createCategory);

categoryRouter.get("/byId",getCategoryById);

categoryRouter.get("/children",getCategoryChildren);
categoryRouter.patch("/",updateCategory);

categoryRouter.delete("/",deleteCategory);

export default categoryRouter;
