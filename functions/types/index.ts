import mongoose, { Document } from "mongoose";

export interface ICategory extends Document {
    name: string;
    parent: mongoose.Types.ObjectId | null;
    isRoot?:boolean
}

export interface CategoryCreateBody{
  categoryName: string,
  categoryParentId: string
}
export interface CategoryUpdateBody{
  categoryName: string,
  categoryParentId: string
}
 


  
  