import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import Sents from "@/models/sent";

export async function POST(req) {
    try {
        const { email, files, header, type, detail, fromEmail } = await req.json();

        
        await connectDB();

        
        const newSent = new Sents({
            email,
            files,
            header,
            type,
            detail,
            from: fromEmail,
        });

        await newSent.save();

        return NextResponse.json({ message: "อีเมลถูกบันทึกสำเร็จ" }, { status: 201 });
    } catch (err) {
        console.error("Error saving email:", err);
        return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
    }

}