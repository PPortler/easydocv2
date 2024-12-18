import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import Systems from "@/models/systems";
import DefaultFiles from "@/models/defaultFile";

export async function POST(req) {
    try {
        const { fileName, fileType, fileURL } = await req.json();
        await connectDB();

        const systemFile = await DefaultFiles.create({ fileName: fileName, fileType:fileType, fileURL: fileURL });

        return NextResponse.json({ message: "File data saved successfully", data: systemFile }, { status: 200 });
    }catch(error){
        console.error("API Error:", error);
        return NextResponse.json({ message: "Failed to save data", error: error.message }, { status: 500 });
    }
}

export async function GET(req) {

    await connectDB();

    // เปลี่ยน id เป็น ObjectId
    const files = await DefaultFiles.find({  }); 

    if (!files) {
        return NextResponse.json({ message: 'File not found' }, { status: 404 });
    }

    return NextResponse.json({ files });
}