import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import Files from "@/models/files";
import Users from "@/models/users";

export async function POST(req) {
    const id = req.nextUrl.pathname.split('/').pop();
    const { fileName, fileType, fileURL } = await req.json();


    await connectDB();

    const user = await Users.findOne({ _id: id })
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // ค้นหาไฟล์ใน Files โดยใช้ user id
    const existingFile = await Files.findOne({ id: id });
    if (!existingFile) {
        // ถ้าไม่มีไฟล์ ให้สร้างใหม่
        const newFile = new Files({
            id: id,
            email: user.email,
            files: [{ fileName, fileURL, fileType }],
        });

        await newFile.save();
        return NextResponse.json({ message: "Created new file entry", data: newFile }, { status: 201 });
    } else {
        // ถ้ามีไฟล์แล้ว ให้เพิ่มข้อมูลเข้าไปใน array
        existingFile.files.push({ fileName, fileURL, fileType });

        await existingFile.save();
        return NextResponse.json({ message: "Updated existing file entry", data: existingFile }, { status: 200 });
    }
}

export async function GET(req) {
    const idUser = req.nextUrl.pathname.split('/').pop();

    await connectDB();

    // เปลี่ยน id เป็น ObjectId
    const user = await Files.findOne({ id:idUser }); 

    if (!user) {
        return NextResponse.json({ message: 'File not found' }, { status: 404 });
    }

    const files = user.files
    return NextResponse.json({ files });
}