import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import mailBoxs from "@/models/mailBox";

// อัปเดตข้อมูลใน `Mailbox`
export async function PUT(request, { params }) {
    const { id } = params; // ดึง ID จาก URL (idSent)
    const { email , status, fromSent } = await request.json(); // ดึงข้อมูลจาก body ของ request

    await connectDB(); // เชื่อมต่อกับฐานข้อมูล

    try {
        // ค้นหาและอัปเดตเอกสารที่มี idSent ตรงกับ id ที่ส่งมา
        const updatedMailBox = await mailBoxs.findOneAndUpdate(
            { idSent: id }, // ค้นหาโดยใช้ idSent
            {
                email,
                status,
                $push: { fromSent: fromSent } // ใช้ $push เพื่อเพิ่ม fromSent เข้าไปใน array
            },
            { new: true } // ส่งคืนข้อมูลใหม่หลังจากอัปเดต
        );

        // ตรวจสอบว่ามีการอัปเดตหรือไม่
        if (!updatedMailBox) {
            return NextResponse.json({ error: "Mailbox not found" }, { status: 404 });
        }

        return NextResponse.json(updatedMailBox, { status: 200 });
    } catch (err) {
        console.error("Error updating mailbox:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
