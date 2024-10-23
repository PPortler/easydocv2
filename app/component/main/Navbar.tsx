"use client"

import React from 'react'
import Link from 'next/link'

function Navbar() {
    return (
        <nav className="flex bg-[#F5F7FA] p-3 px-10 justify-between items-center rounded-xl">
            <h1 className="font-extrabold text-xl">Easy Doc</h1>
            <ul className="flex gap-5">
                <li>
                    <Link href="#">หน้าหลัก</Link>
                </li>
                <li>
                    <Link href="#">บริการของเรา</Link>
                </li>
                <li>
                    <Link href="#">เกี่ยวกับเรา</Link>
                </li>
                <li>
                    <Link href="#">ติดต่อเรา</Link>
                </li>
                <li>
                    <Link href="#">คำถามที่พบบ่อย</Link>
                </li>
            </ul>
            <div className="gap-5 flex items-center">
                <Link href="/login" className="">เข้าสู่ระบบ</Link>
                <Link href="/register" className="bg-[#5955B3] text-white py-2 px-4 rounded-lg">สมัครสมาชิก</Link>
            </div>
        </nav>
    )
}

export default Navbar
