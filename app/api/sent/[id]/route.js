import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import Sents from "@/models/sent";

export async function POST(req) {
    const email = req.nextUrl.pathname.split('/').pop();

}