"use client"

import React from 'react'
import Icon from '@mdi/react';
import { mdiBell, mdiCog, mdiAccountCircle } from '@mdi/js';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

function Navbar2({ title }: { title: String }) {

    const [isUser, setIsUser] = useState<boolean>();

    const handleToggle = () => {
        setIsUser(prev => !prev);
    };

    const handleMouseLeave = () => {
        setIsUser(false);
    };

    return (
        <div className='flex justify-between'>
            <h1 className='text-[#5955B3] text-4xl font-medium'>{title}</h1>
            <div className='flex gap-2'>
                <Link href="/notification" className='cursor-pointer'>
                    <Icon path={mdiBell} size={1} />
                </Link>
                <Link href="/setting" className='cursor-pointer'>
                    <Icon path={mdiCog} size={1} />
                </Link>
                <div className='relative cursor-pointer'
                    onClick={handleToggle}
                    onMouseLeave={handleMouseLeave}
                >
                    <Icon path={mdiAccountCircle} size={1} />
                    {isUser && (
                        <div className='shadow absolute right-0 mt-1 rounded-xl overflow-hidden bg-white z-10 p-2'>
                            <button className='py-1 px-4 hover:bg-[#5955B3] hover:text-white w-full rounded-xl'>Profile</button>
                            <button onClick={() => signOut()} className='py-1 px-4 hover:bg-red-500 hover:text-white w-full text-red-500 rounded-xl'>Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Navbar2
