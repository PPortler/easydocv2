import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import Sents from "@/models/sent";

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
        let results = await Sents.find({ "fromSent.0.email": email });

        // ตรวจสอบว่า results มีข้อมูลหรือไม่
        if (!results.length) {
            return NextResponse.json({ error: "No records found" }, { status: 404 });
        }

        // เรียงลำดับจากวันที่และเวลา (`fromSent[0].date` และ `fromSent[0].time`) ล่าสุดก่อน
        results.sort((a, b) => {
            const dateA = new Date(`${a.fromSent[0]?.date} ${a.fromSent[0]?.time}`);
            const dateB = new Date(`${b.fromSent[0]?.date} ${b.fromSent[0]?.time}`);
            return dateB - dateA; // เรียงจากล่าสุด -> เก่าสุด
        });

        // จัดรูปแบบข้อมูลก่อนส่งกลับ
        const sents = results.map(sent => ({
            id: sent._id,
            email: sent.email,
            header: sent.header,
            type: sent.type,
            status: sent.status,
            fromSent: sent.fromSent,
        }));

        // ส่งผลลัพธ์กลับไป
        return NextResponse.json(sents);
    } catch (error) {
        console.error("Error fetching data: ", error);
        return NextResponse.json({ error: "Failed to fetch data", message: error.message }, { status: 500 });
    }
}
