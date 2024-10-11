"use client"

import React from 'react'
import Icon from '@mdi/react';
import { mdiCog, mdiImageMultiple, mdiNearMe, mdiInvoiceTextClockOutline, mdiListStatus, mdiMessageProcessingOutline } from '@mdi/js';
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
                        <Icon path={mdiImageMultiple} size={1} />
                        <p>My File</p>
                    </Link>
                    <div className='border-s-4 border-[#5955B3] hover:border-white flex cursor-pointer gap-3 py-3 px-4 hover:bg-[#5852a5]'>
                        <Icon path={mdiNearMe} size={1} />
                        <p>Sent</p>
                    </div>
                    <div className='border-s-4 border-[#5955B3] hover:border-white flex cursor-pointer gap-3 py-3 px-4 hover:bg-[#5852a5]'>
                        <Icon path={mdiInvoiceTextClockOutline} size={1} />
                        <p>Schedule</p>
                    </div>
                    <div className='border-s-4 border-[#5955B3] hover:border-white flex cursor-pointer gap-3 py-3 px-4 hover:bg-[#5852a5]'>
                        <Icon path={mdiListStatus} size={1} />
                        <p>Status</p>
                    </div>
                    <div className='border-s-4 border-[#5955B3] hover:border-white flex cursor-pointer gap-3 py-3 px-4 hover:bg-[#5852a5]'>
                        <Icon path={mdiMessageProcessingOutline} size={1} />
                        <p>Message</p>
                    </div>
                </div>
            </div>
            <div>
                <div className='border-s-4 border-[#5955B3] hover:border-white flex cursor-pointer gap-3 py-3 px-4 hover:bg-[#5852a5]'>
                    <Icon path={mdiCog} size={1} />
                    <p>Setting</p>
                </div>
            </div>
        </div>
    )
}

export default Navbar
