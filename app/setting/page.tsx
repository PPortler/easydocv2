"use client"

import React from 'react'
import Navbar2 from '../component/myfile/Navbar2'
import Navbar from '../component/myfile/Navbar'
import { useState, useEffect } from 'react'
import Loader from '../component/Loader'
import Icon from '@mdi/react';
import { mdiAccountCircle } from '@mdi/js';
import NavbarSetting from './components/NavbarSetting'
import Container from './components/Container'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

function Setting() {

    //get session
    const { data: session, status } = useSession();
    const [loader, setLoader] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') {
            return;
        }
        if (!session) {
            router.replace('/login')
            setLoader(false);
        }

        if (session?.user?.idUser) {
            setLoader(false);
        }
    }, [session])

    return (
        <div className="p-5 flex">
            <Navbar status="setting" />
            <div className="bg-white rounded-3xl p-10 min-h-screen w-full">
                <Navbar2 title="ตั้งค่า" />
                <div className='mt-10 flex gap-10'>
                    <NavbarSetting />
                    <Container idUser={`${session?.user?.idUser}`}/>
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

export default Setting
