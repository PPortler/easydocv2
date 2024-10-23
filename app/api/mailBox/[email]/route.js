import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import mailBoxs from "@/models/mailBox";

export async function GET(req) {
    // เชื่อมต่อกับฐานข้อมูล
    await connectDB();

    // ดึงอีเมลจาก URL
    const email = req.nextUrl.pathname.split('/').pop();

    // ตรวจสอบว่า email เป็น undefined หรือไม่
    if (!email) {
        return NextResponse.json({ error: "Email is undefined" }, { status: 400 });
    }

    try {
        // ค้นหา Sents ที่มี email ตรงกัน
        const results = await mailBoxs.find({ email: email });

        // ตรวจสอบว่า results มีข้อมูลหรือไม่
        if (!results.length) {
            return NextResponse.json({ error: "No records found" }, { status: 404 });
        }

        // รวบรวมไฟล์ทั้งหมดในอาเรย์ใหม่
        const mailBox = results.map(box => ({
            email: box.email,
            idSent: box.idSent,
            header: box.header,
            type: box.type,
            status: box.status,
            fromSent: box.fromSent
        }));

        // ส่งผลลัพธ์กลับไป
        return NextResponse.json(mailBox);
    } catch (error) {
        console.error("Error fetching data: ", error);
        return NextResponse.json({ error: "Failed to fetch data", message: error.message }, { status: 500 });
    }
}
