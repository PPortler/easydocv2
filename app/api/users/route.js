import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import Users from "@/models/users";
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        const { firstName, lastName, phoneNumber, email, password } = await req.json();
        const private_password = await bcrypt.hash(password, 10);
        await connectDB();
        await Users.create({ firstName:firstName, lastName:lastName, phoneNumber:phoneNumber, email:email, password:private_password });
        return NextResponse.json({ message: "Created User" }, { status: 201 })
    }catch{
        return NextResponse.json({ message: "Error Create User" }, { status: 500 })
    }
}

export async function GET(){
    try{
        await connectDB();
        const users = await Users.find({})
        return NextResponse.json({ users })
    }catch(err){
        console.log(err);
        return NextResponse.json({ message: "Error getUsers" }, { status: 500 })
    }
}