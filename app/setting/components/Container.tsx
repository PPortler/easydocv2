"use client"

import React from 'react'
import Image from 'next/image'
import Icon from '@mdi/react';
import { mdiAccountCircle, mdiPencilOutline } from '@mdi/js';
import { useState } from 'react';

function Container({ title }: { title: string }) {

    const [isHoverProfile, setIsHoverProfile] = useState<boolean>(false);

    return (
        <div className='w-full'>
            <div className='flex flex-col gap-5'>
                <div className='border p-5 rounded-xl flex justify-between'>
                    <div className='flex items-center gap-3'>
                        <div
                            className='border rounded-full relative cursor-pointer transition-all'
                            onMouseEnter={() => setIsHoverProfile(true)}
                            onMouseLeave={() => setIsHoverProfile(false)}
                        >
                            <Image
                                src="/image/profile.png"
                                height={1000}
                                width={1000}
                                priority alt="profil"
                                className='w-20 h-20'
                            />
                            <div
                                className={`${isHoverProfile ? " opacity-50":"opacity-0 "} bg-black transition-all duration-100  absolute top-0 w-20 h-20 rounded-full flex justify-center items-center  `}
                            >
                            </div>
                            <div className={`${isHoverProfile ? "":"opacity-0"} transition-all duration-100 absolute top-0 w-20 h-20 rounded-full flex justify-center items-center text-white`}>
                                <p>Edit</p>
                            </div>

                        </div>
                        <div>
                            <input type='text' value="Phitakpong Supapphet" className='font-medium text-md' />
                        </div>
                    </div>
                    <button className='font-medium border rounded-lg flex items-center text-gray-400 py-1 px-3 gap-2 self-start'>
                        <Icon path={mdiPencilOutline} size={.8} />
                        <p>Edit</p>
                    </button>
                </div>
                <div className='text-gray-400 border p-5 rounded-xl flex justify-between'>
                    <div className=''>
                        <h1 className='font-bold text-[#5955B3]'>Personal infomation</h1>
                        <div className='mt-5 grid grid-cols-2 gap-x-20 gap-y-5'>
                            <div className='flex flex-col gap-1'>
                                <label className='font-medium'>First Name</label>
                                <input className='font-bold' type="text" value="Phitakpong" />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label className='font-medium'>Last Name</label>
                                <input className='font-bold' type="text" value="Supapphet" />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label className='font-medium'>Email address</label>
                                <input className='font-bold' type="text" value="admin123@gmail.com" />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label className='font-medium'>Phone</label>
                                <input className='font-bold' type="text" value="0992538834" />
                            </div>
                        </div>
                    </div>
                    <button className='font-medium border rounded-lg flex items-center text-gray-400 py-1 px-3 gap-2 self-start'>
                        <Icon path={mdiPencilOutline} size={.8} />
                        <p>Edit</p>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Container
