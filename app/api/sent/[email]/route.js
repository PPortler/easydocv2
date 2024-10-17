import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import Users from "@/models/users";

export async function GET(req) {
    try {
        const id = req.nextUrl.pathname.split('/').pop();
        await connectDB();

        if (!id || id === 'undefined') {
            return NextResponse.json(
                { message: 'Error: User ID is missing or invalid' },
                { status: 400 } // เปลี่ยนเป็น 400 Bad Request
            );
        }
        
        const dataUser = await Users.findOne({ _id :id });

        if (!dataUser) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }
        return NextResponse.json({ dataUser }, { status: 200 });
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}