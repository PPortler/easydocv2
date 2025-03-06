import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import Users from "@/models/users";
import bcrypt from "bcryptjs";

// POST: สร้าง user ใหม่
export async function POST(req) {
  try {
    const { firstName, lastName, phoneNumber, email, password, role } = await req.json();
    const private_password = await bcrypt.hash(password, 10);

    await connectDB();
    await Users.create({
      firstName,
      lastName,
      phoneNumber,
      email,
      password: private_password,
      role,
    });

    return NextResponse.json({ message: "Created User" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error Create User" }, { status: 500 });
  }
}

// GET: ดึงรายการ user ทั้งหมด หรือค้นหาตามชื่อ/อีเมล
export async function GET(req) {
  try {
    // เชื่อมต่อ DB
    await connectDB();

    // อ่าน query string "search" จาก URL
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    // ถ้า search มีค่า => filter ด้วย firstName, lastName, email
    // ถ้า search ว่าง => filter = {}
    let filter = {};
    if (search) {
      filter = {
        $or: [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    // ค้นหาจาก MongoDB
    const users = await Users.find(filter);

    // สร้างผลลัพธ์ที่จะส่งกลับ (ไม่ส่ง password)
    const result = users.map((u) => ({
      name: `${u.firstName} ${u.lastName}`, // รวมชื่อ+นามสกุล
      email: u.email,
      phoneNumber: u.phoneNumber,
      role: u.role,
      // profilePic: u.profilePic || null, // ถ้ามีฟิลด์นี้
    }));

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error getUsers" }, { status: 500 });
  }
}
