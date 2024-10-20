import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import Sents from "@/models/sent"; // ตรวจสอบให้แน่ใจว่าคุณนำเข้าโมเดล Sents

export async function POST(req) {
    try {
        // ดึงข้อมูลจากคำขอ
        const { email, files, header, type, detail, status, fromEmail } = await req.json();

        // เชื่อมต่อกับฐานข้อมูล
        await connectDB();

        // สร้างเอกสารใหม่ใน Sents
        const newSent = new Sents({
            email,
            files,
            header,
            type,
            detail,
            status,
            from: fromEmail,
        });

        // บันทึกเอกสารและรับ id ที่สร้างขึ้น
        const savedSent = await newSent.save();

        // ส่ง id กลับในคำตอบ
        return NextResponse.json({ 
            message: "อีเมลถูกบันทึกสำเร็จ", 
            id: savedSent._id // ส่ง id ที่สร้างขึ้นกลับไป
        }, { status: 201 });
    } catch (err) {
        console.error("Error saving email:", err);
        return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
    }
}
