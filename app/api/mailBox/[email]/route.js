import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import mailBoxs from "@/models/mailBox";

export async function POST(req) {
    const email = req.nextUrl.pathname.split('/').pop();
    
}