"use client"

import React from 'react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NavbarAdmin from './componants/NavbarAdmin';
import Navbar2 from '@/app/component/myfile/Navbar2';
import Icon from '@mdi/react';
import { mdiFileAccount, mdiDotsVertical, mdiArrowDown } from '@mdi/js';
import AddFile from '@/app/admin/componants/AddFile';
import axios from 'axios';
import Loader from '@/app/component/Loader'
import Head from "next/head";

function MyFile() {

    const { status, data: session } = useSession();
    const router = useRouter();

    const [loader, setLoader] = useState<boolean>(true);

    useEffect(() => {
        if (status === 'loading') {
            return;
        }
        if (!session) {
            router.replace('/login')
            setLoader(false);
        }

        if (session?.user?.role === "user") {
            router.replace('/myfile')
            setLoader(false);
        }

        if (session?.user?.idUser) {
            setLoader(false);
        }
    }, [session])

    return (
        <>
            <Head>
                <title>แดชบอร์ด</title>
            </Head>
            <div className="p-5 flex">
                <NavbarAdmin status="dashboard" />
                <div className="bg-white rounded-3xl p-10 min-h-screen w-full">
                    <Navbar2 title="แดชบอร์ด" />
                </div>
                {loader && (
                    <div>
                        <Loader />
                    </div>
                )}

            </div>
        </>
    )
}

export default MyFile
