import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import mailBoxs from "@/models/mailBox";

export async function POST(req) {
    try {
        // เชื่อมต่อกับฐานข้อมูล
        await connectDB();

        // ดึงข้อมูลจากคำขอ
        const { email, idSent, header, type, status, fromSent } = await req.json();

        // ตรวจสอบว่ามี email และ idSent หรือไม่
        if (!email || !idSent) {
            return NextResponse.json({ message: "กรุณาระบุ email และ idSent" }, { status: 400 });
        }

        // สร้างบันทึกใหม่ใน mailBoxs
        const newMailBox = new mailBoxs({
            email: email,
            idSent: idSent,
            header: header,
            type: type,
            status: status,
            fromSent: fromSent
        });

        // บันทึกลงฐานข้อมูล
        await newMailBox.save();

        // ส่งคำตอบกลับว่าเพิ่มสำเร็จ
        return NextResponse.json({ message: "บันทึกอีเมลและ idSent สำเร็จ" }, { status: 201 });
    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
        return NextResponse.json({ message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" }, { status: 500 });
    }
}
