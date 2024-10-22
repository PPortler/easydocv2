"use client"

import React from 'react'
import Navbar2 from '../component/myfile/Navbar2'
import Navbar from '../component/myfile/Navbar'
import { useState, useEffect } from 'react'
import Loader from '../component/Loader'
import Icon from '@mdi/react';
import { mdiAccountCircle } from '@mdi/js';
import TableMailbox from './components/TableMailbox'
import { useSession } from 'next-auth/react'

function MailBox() {

    const [loader, setLoader] = useState<boolean>(false);

    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'loading') {
            return;
        }

        if (!session?.user?.email){
            return
        }
    }, [session])


    return (
        <div className="p-5 flex">
            <Navbar status="mailbox" />
            <div className="bg-white rounded-3xl p-10 min-h-screen w-full">
                <Navbar2 title="MailBox" />
                <div className='mt-10'>
                    <TableMailbox email={`${session?.user?.email}`} />
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
