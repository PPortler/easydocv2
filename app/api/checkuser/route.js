import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import Users from "@/models/users";

export async function POST(req){
    const { email } = await req.json();
    await connectDB()
    const user = await Users.findOne({ email }).select("_id")
    return NextResponse.json({ user })
}