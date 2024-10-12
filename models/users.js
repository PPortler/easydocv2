import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
    {
        profile:{
            type: String,
        },
        firstName:{
            type: String,
        },
        lastName:{
            type: String,
        },
        phoneNumber:{
            type: String,
        },
        email:{
            type: String,
            required: true
        },
        password:{
            type: String,
        },
        role:{
            type: String,
            require: true,
            default: "User"
        }
    },
    {
        timestamps: true
    }
)

const Users = mongoose.models.Users || mongoose.model("Users",UserSchema);
export default Users