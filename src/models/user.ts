import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
        mandatory:true
    }
})

const User = mongoose.model("User",userSchema)
export default User