"use client"

import React from 'react'
import Icon from '@mdi/react';
import { mdiImageMultiple } from '@mdi/js';

function Navbar() {
    return (
        <div className='text-white p-5 pt-8 w-80 flex flex-col justify-between'>
            <div>
                <h1 className='text-5xl text-center font-medium'>
                    Easy Doc
                </h1>
                <div className='mt-10'>
                    <div className='border-s-4 flex cursor-pointer gap-3 py-3 px-4 bg-[#5852a5]'>
                        <Icon path={mdiImageMultiple} size={1} />
                        <p>My File</p>
                    </div>
                    <div className='border-s-4 border-[#5955B3] hover:border-white flex cursor-pointer gap-3 py-3 px-4 hover:bg-[#5852a5]'>
                        <Icon path={mdiImageMultiple} size={1} />
                        <p>Sent</p>
                    </div>
                    <div className='border-s-4 border-[#5955B3] hover:border-white flex cursor-pointer gap-3 py-3 px-4 hover:bg-[#5852a5]'>
                        <Icon path={mdiImageMultiple} size={1} />
                        <p>Schedule</p>
                    </div>
                    <div className='border-s-4 border-[#5955B3] hover:border-white flex cursor-pointer gap-3 py-3 px-4 hover:bg-[#5852a5]'>
                        <Icon path={mdiImageMultiple} size={1} />
                        <p>Status</p>
                    </div>
                    <div className='border-s-4 border-[#5955B3] hover:border-white flex cursor-pointer gap-3 py-3 px-4 hover:bg-[#5852a5]'>
                        <Icon path={mdiImageMultiple} size={1} />
                        <p>Message</p>
                    </div>
                </div>
            </div>
            <div>
                <div className='border-s-4 border-[#5955B3] hover:border-white flex cursor-pointer gap-3 py-3 px-4 hover:bg-[#5852a5]'>
                    <Icon path={mdiImageMultiple} size={1} />
                    <p>Setting</p>
                </div>
            </div>
        </div>
    )
}

export default Navbar
