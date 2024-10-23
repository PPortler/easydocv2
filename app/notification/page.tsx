"use client"

import React from 'react'
import Navbar2 from '../component/myfile/Navbar2'
import Navbar from '../component/myfile/Navbar'
import { useState, useEffect } from 'react'
import Loader from '../component/Loader'
import Icon from '@mdi/react';
import { mdiAccountCircle } from '@mdi/js';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

function Notification() {
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
            <Navbar status="none"/>
            <div className="bg-white rounded-3xl p-10 min-h-screen w-full">
                <Navbar2 title="Notificatiion" />
                <div className='flex flex-col gap-2 items-center mt-10'>
                    <div className='bg-[#F6FAFC] flex p-3 justify-between items-center w-8/12'>
                        <div className='flex gap-5'>
                            <Icon path={mdiAccountCircle} size={2} />
                            <div>
                                <h1 className='font-medium'>Matk Webber</h1>
                                <p className='text-xs text-gray-400'>5m ago</p>
                            </div>
                            <div>
                                New Blog for You
                            </div>
                        </div>
                        <div className='self-start rounded-full w-3 h-3 bg-red-500'></div>
                    </div>
                    <div className='bg-[#F6FAFC] flex p-3 justify-between items-center w-8/12'>
                        <div className='flex gap-5'>
                            <Icon path={mdiAccountCircle} size={2} />
                            <div>
                                <h1 className='font-medium'>Matk Webber</h1>
                                <p className='text-xs text-gray-400'>5m ago</p>
                            </div>
                            <div>
                                New Blog for You
                            </div>
                        </div>
                        <div className='self-start rounded-full w-3 h-3 bg-red-500'></div>
                    </div>
                    <div className='bg-[#F6FAFC] flex p-3 justify-between items-center w-8/12'>
                        <div className='flex gap-5'>
                            <Icon path={mdiAccountCircle} size={2} />
                            <div>
                                <h1 className='font-medium'>Matk Webber</h1>
                                <p className='text-xs text-gray-400'>5m ago</p>
                            </div>
                            <div>
                                New Blog for You
                            </div>
                        </div>
                        <div className='self-start rounded-full w-3 h-3 bg-gray-400'></div>
                    </div>
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

export default Notification
