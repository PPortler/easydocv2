"use client"

import React from 'react'
import Link from 'next/link'

function Navbar() {
    return (
        <nav className="flex bg-[#F5F7FA] p-3 px-10 justify-between items-center">
            <h1 className="font-extrabold text-xl">Easy Doc</h1>
            <ul className="flex gap-5">
                <li>
                    <Link href="#">Home</Link>
                </li>
                <li>
                    <Link href="#">Home</Link>
                </li>
                <li>
                    <Link href="#">Home</Link>
                </li>
                <li>
                    <Link href="#">Home</Link>
                </li>
                <li>
                    <Link href="#">Home</Link>
                </li>
                <li>
                    <Link href="#">Home</Link>
                </li>
            </ul>
            <div className="gap-5 flex items-center">
                <Link href="/Login" className="">Login</Link>
                <Link href="/Register" className="bg-[#5955B3] text-white py-2 px-4 rounded-lg">Sign up</Link>
            </div>
        </nav>
    )
}

export default Navbar
