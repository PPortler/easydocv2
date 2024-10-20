"use client"

import React from 'react'
import Navbar2 from '../component/myfile/Navbar2'
import Navbar from '../component/myfile/Navbar'
import { useState, useEffect } from 'react'
import Loader from '../component/Loader'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import FormSent from './components/FormSent'

function Sent() {

    const router = useRouter();
    const { data: session, status } = useSession();
    const [loader, setLoader] = useState<boolean>(false);

    useEffect(() => {
        if (status === 'loading') {
            return;
        }
        if (!session) {
            router.replace('/login')
            setLoader(false);
        }

        setLoader(false);
    }, [session])


    return (
        <div className="p-5 flex">
            <Navbar status="sent" />
            <div className=" bg-white rounded-3xl p-10 min-h-screen w-full">
                <Navbar2 title="Sent Files" />
                <FormSent setLoader={setLoader} />
            </div>
            {loader && (
                <div>
                    <Loader />
                </div>
            )}
        </div>
    )
}

export default Sent
