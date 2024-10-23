"use client"

import React from 'react'
import Navbar2 from '../component/myfile/Navbar2'
import Navbar from '../component/myfile/Navbar'
import { useState, useEffect } from 'react'
import Loader from '../component/Loader'
import TableMailbox from './components/TableMailbox'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

function MailBox() {

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
            <Navbar status="mailbox" />
            <div className="bg-white rounded-3xl p-10 min-h-screen w-full">
                <Navbar2 title="กล่องข้อความ" />
                <div className='mt-10'>
                    <TableMailbox email={`${session?.user?.email}`}/>
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

export default MailBox
