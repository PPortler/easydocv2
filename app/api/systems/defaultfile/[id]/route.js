import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import DefaultFiles from "@/models/defaultFile";

export async function PUT(req) {
    try {
        const id = req.nextUrl.pathname.split('/').pop();
        const { fileName } = await req.json();
        await connectDB();

        const file = await DefaultFiles.findOne({ _id: id })
        if (!file) {
            return NextResponse.json({ message: "file not found" }, { status: 404 });
        }

        file.fileName = fileName;
        await file.save();
        return NextResponse.json({ message: "File updated successfully", file }, { status: 200 });
    } catch (error) {
        console.log("API Error: ", error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const id = req.nextUrl.pathname.split('/').pop();
        await connectDB();

        const file = await DefaultFiles.findByIdAndDelete({ _id: id })
        if (!file) {
            return NextResponse.json({ message: "file not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "deleted successfully" }, { status: 200 });
    } catch (error) {
        console.log("API Error: ", error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}