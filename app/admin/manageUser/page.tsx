"use client"

import React from 'react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NavbarAdmin from '../componants/NavbarAdmin';
import Navbar2 from '@/app/component/myfile/Navbar2';
import Icon from '@mdi/react';
import { mdiFileAccount, mdiDotsVertical, mdiArrowDown } from '@mdi/js';
import AddFile from '@/app/admin/componants/AddFile';
import axios from 'axios';
import Loader from '@/app/component/Loader'
import Head from "next/head";
import TablePage from './component/Table';
import { User} from '@/app/types/useTypes'

function MyFile() {

    const { status, data: session } = useSession();
    const router = useRouter();

    const [loader, setLoader] = useState<boolean>(false);

    useEffect(() => {
        if (status === 'loading') {
            return;
        }
        if (!session) {
            router.replace('/login')
            setLoader(false);
        }

        if (session?.user?.role === "user") {
            router.replace('/dashboard')
            setLoader(false);
        }

        if (session?.user?.idUser) {
            setLoader(false);
            getUsers();
        }
    }, [session])

    //get users
    const [users, setUsers] = useState<User[]>([])
    async function getUsers() {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/users`);
            setUsers(res.data || [])
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <Head>
                <title>MyFile</title>
            </Head>
            <div className="p-5 flex">
                <NavbarAdmin status="manageUser" />
                <div className="bg-white rounded-3xl p-10 min-h-screen w-full">
                    <Navbar2 title="จัดการผู้ใช้" />
                    <div className='my-5'>
                        <TablePage dataUser = {users} id = {session?.user?.idUser || ''}/>
                    </div>
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
