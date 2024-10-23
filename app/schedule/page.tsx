"use client"

import React from 'react'
import Navbar2 from '../component/myfile/Navbar2'
import Navbar from '../component/myfile/Navbar'
import { useState,useEffect } from 'react'
import Loader from '../component/Loader'
import Icon from '@mdi/react';
import { mdiAccountCircle } from '@mdi/js';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

function Schedule() {

    const [loader, setLoader] = useState<boolean>(false);

    const { status, data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') {
            return;
        }

        if (!session) {
            router.replace('/login')
            setLoader(false);
        }

        if (!session?.user?.email){
            return
        }
    }, [session])

    return (
        <div className="p-5 flex">
            <Navbar status="schedule"/>
            <div className="bg-white rounded-3xl p-10 min-h-screen w-full">
                <Navbar2 title="กำหนดการ" />
                <div className='flex flex-col gap-5 items-center mt-10'>
                   
                </div>

            </div>
            {loader && (
                <div>
                    <Loader />
                </div>
            )}
        </div>
    )
}

export default Schedule
