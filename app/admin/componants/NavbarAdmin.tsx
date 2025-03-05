"use client"

import React from 'react'
import Icon from '@mdi/react';
import { mdiFolderFile,mdiMailboxOutline,mdiCog, mdiImageMultiple, mdiNearMe, mdiInvoiceTextClockOutline, mdiListStatus, mdiMessageProcessingOutline } from '@mdi/js';
import Link from 'next/link';

function NavbarAdmin({ status }: { status: string }) {
    return (
        <div className='text-white p-5 pt-8 w-64 flex flex-col justify-between  flex-shrink-0'>
            <div>
                <Link href="/admin" className='text-5xl text-center font-medium'>
                    Easy Doc
                </Link>
                <div className='mt-10'>
                    <Link href="/admin" className={`${status === "myfile" ? "bg-[#5852a5] border-s-4 border-white":""} hover:border-white hover:bg-[#5852a5] border-s-4 border-[#5955B3] flex cursor-pointer gap-3 py-3 px-4 `}>
                        <Icon path={mdiFolderFile} size={1} />
                        <p>ไฟล์เริ่มต้น</p>
                    </Link>
                    <Link href="/admin/manageUser" className={`${status === "manageUser" ? "bg-[#5852a5] border-s-4 border-white":""} hover:border-white hover:bg-[#5852a5] border-s-4 border-[#5955B3] flex cursor-pointer gap-3 py-3 px-4 `}>
                        <Icon path={mdiMailboxOutline} size={1} />
                        <p>จัดการผู้ใช้</p>
                    </Link>
                    <Link href="" className={`${status === "sent" ? "bg-[#5852a5] border-s-4 border-white":""} hover:border-white hover:bg-[#5852a5] border-s-4 border-[#5955B3] flex cursor-pointer gap-3 py-3 px-4 `}>
                        <Icon path={mdiNearMe} size={1} />
                        <p>จัดการเอกสาร</p>
                    </Link>
                    <Link href="" className={`${status === "schedule" ? "bg-[#5852a5] border-s-4 border-white":""} hover:border-white hover:bg-[#5852a5] border-s-4 border-[#5955B3] flex cursor-pointer gap-3 py-3 px-4 `}>
                        <Icon path={mdiInvoiceTextClockOutline} size={1} />
                        <p>สถานะ</p>
                    </Link>
                    <Link href="" className={`${status === "status" ? "bg-[#5852a5] border-s-4 border-white":""} hover:border-white hover:bg-[#5852a5] border-s-4 border-[#5955B3] flex cursor-pointer gap-3 py-3 px-4 `}>
                        <Icon path={mdiListStatus} size={1} />
                        <p>ขั้นตอนการทำงาน</p>
                    </Link>
                
                </div>
            </div>
            <div>
                <Link href="" className={`${status === "setting" ? "bg-[#5852a5] border-s-4 border-white":""} border-s-4 border-[#5955B3] hover:border-white flex cursor-pointer gap-3 py-3 px-4 hover:bg-[#5852a5]`}>
                    <Icon path={mdiCog} size={1} />
                    <p>ตั้งค่า</p>
                </Link>
            </div>
        </div>
    )
}

export default NavbarAdmin
