"use client"

import React from 'react'
import Icon from '@mdi/react';
import { mdiFolderFile,mdiMailboxOutline,mdiCog, mdiImageMultiple, mdiNearMe, mdiInvoiceTextClockOutline, mdiListStatus, mdiMessageProcessingOutline } from '@mdi/js';
import Link from 'next/link';

function Navbar({ status }: { status: string }) {
    return (
        <div className='text-white p-5 pt-8 w-80 flex flex-col justify-between'>
            <div>
                <Link href="/myfile" className='text-5xl text-center font-medium'>
                    Easy Doc
                </Link>
                <div className='mt-10'>
                    <Link href="myfile" className={`${status === "myfile" ? "bg-[#5852a5] border-s-4 border-white":""} hover:border-white hover:bg-[#5852a5] border-s-4 border-[#5955B3] flex cursor-pointer gap-3 py-3 px-4 `}>
                        <Icon path={mdiFolderFile} size={1} />
                        <p>เอกสารของฉัน</p>
                    </Link>
                    <Link href="mailbox" className={`${status === "mailbox" ? "bg-[#5852a5] border-s-4 border-white":""} hover:border-white hover:bg-[#5852a5] border-s-4 border-[#5955B3] flex cursor-pointer gap-3 py-3 px-4 `}>
                        <Icon path={mdiMailboxOutline} size={1} />
                        <p>กล่องข้อความ</p>
                    </Link>
                    <Link href="sent" className={`${status === "sent" ? "bg-[#5852a5] border-s-4 border-white":""} hover:border-white hover:bg-[#5852a5] border-s-4 border-[#5955B3] flex cursor-pointer gap-3 py-3 px-4 `}>
                        <Icon path={mdiNearMe} size={1} />
                        <p>ส่งเอกสาร</p>
                    </Link>
                    <Link href="schedule" className={`${status === "schedule" ? "bg-[#5852a5] border-s-4 border-white":""} hover:border-white hover:bg-[#5852a5] border-s-4 border-[#5955B3] flex cursor-pointer gap-3 py-3 px-4 `}>
                        <Icon path={mdiInvoiceTextClockOutline} size={1} />
                        <p>กำหนดการ</p>
                    </Link>
                    <Link href="status" className={`${status === "status" ? "bg-[#5852a5] border-s-4 border-white":""} hover:border-white hover:bg-[#5852a5] border-s-4 border-[#5955B3] flex cursor-pointer gap-3 py-3 px-4 `}>
                        <Icon path={mdiListStatus} size={1} />
                        <p>สถานะ</p>
                    </Link>
                
                    <Link href="message" className={`${status === "message" ? "bg-[#5852a5] border-s-4 border-white":""} hover:border-white hover:bg-[#5852a5] border-s-4 border-[#5955B3] flex cursor-pointer gap-3 py-3 px-4 `}>
                        <Icon path={mdiMessageProcessingOutline} size={1} />
                        <p>ข้อความ</p>
                    </Link>
                </div>
            </div>
            <div>
                <Link href="/setting" className={`${status === "setting" ? "bg-[#5852a5] border-s-4 border-white":""} border-s-4 border-[#5955B3] hover:border-white flex cursor-pointer gap-3 py-3 px-4 hover:bg-[#5852a5]`}>
                    <Icon path={mdiCog} size={1} />
                    <p>ตั้งค่า</p>
                </Link>
            </div>
        </div>
    )
}

export default Navbar
