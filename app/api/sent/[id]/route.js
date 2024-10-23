import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import Sents from "@/models/sent";

// อัปเดตข้อมูล `Sent` ตาม ID
export async function PUT(request, { params }) {
    const { id } = params; // ดึง ID จาก URL
    const { email, status, fromSent } = await request.json(); // ดึงข้อมูลจาก body ของ request

    await connectDB(); // เชื่อมต่อกับฐานข้อมูล

    try {
        // ค้นหาและอัปเดตข้อมูลใน sent
        const updatedSent = await Sents.findByIdAndUpdate(
            id,
            {
                email,
                status,
                $push: { fromSent: fromSent } // เพิ่มข้อมูลจาก fromSent เข้าไปใน array
            },
            { new: true }
        );

        if (!updatedSent) {
            return NextResponse.json({ error: "Sent not found" }, { status: 404 });
        }

        return NextResponse.json(updatedSent, { status: 200 });
    } catch (err) {
        console.error("Error updating sent:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}