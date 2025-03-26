"use client"

import React from 'react'
import Navbar2 from '../component/myfile/Navbar2'
import Navbar from '../component/myfile/Navbar'
import { useState,useEffect } from 'react'
import Loader from '../component/Loader'
import TableStatus from './components/TableStatus'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

function Status() {

    const [loader, setLoader] = useState<string>('wait');

    const { status, data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') {
            return;
        }

        if (!session) {
            router.replace('/login')
            setLoader("pass");
        }

        if (!session?.user?.email){
            return
        }
    }, [session])

    return (
        <div className="p-5 flex">
            <Navbar status="status" />
            <div className="bg-white rounded-3xl p-10 min-h-screen w-full">
                <Navbar2 title="สถานะ" />
                <div className='mt-10'>
                <TableStatus email={session?.user?.email || ""} setLoader={setLoader} loader={loader} />
                </div>

            </div>
            {loader === 'wait' && (
                <div>
                    <Loader />
                </div>
            )}
        </div>
    )
}

export default Status
