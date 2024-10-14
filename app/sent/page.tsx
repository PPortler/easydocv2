"use client"

import React from 'react'
import Navbar2 from '../component/myfile/Navbar2'
import Navbar from '../component/myfile/Navbar'
import { useState,useEffect } from 'react'
import Loader from '../component/Loader'
import Icon from '@mdi/react';
import { mdiAccountCircle, mdiPlus } from '@mdi/js';
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface ColourOption {
    value: string;
    label: string;
}

function Sent() {

    const router = useRouter();
    const { data: session , status } = useSession();
    const [loader, setLoader] = useState<boolean>();

    useEffect(() => {
        if (status === 'loading') {
            return;
        }
        if (!session) {
            router.replace('/login')
            setLoader(false);
        }

        getAllUser();
    }, [session])


    const colourOptions: ColourOption[] = [
        { value: 'asd', label: 'Option 1' },
        { value: 'asdsds', label: 'Option 2' },
        { value: 'asd3', label: 'Option 3' },
    ];

    const [allUser, setAllUser] = useState<string[]>([])

    async function getAllUser() {
        try{    
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/users`);

            if(res.status === 200){
                setAllUser(res.data.users)
            }

        }catch(err){
            console.log(err);
        }
    }


    return (
        <div className="p-5 flex">
            <Navbar status="sent" />
            <form className="flex flex-col justify-between bg-white rounded-3xl p-10 min-h-screen w-full">
                <div>
                    <Navbar2 title="Sent Files" />
                    <div className=' mt-10 grid grid-cols-2 gap-x-14'>
                        <div>
                            <h1 className='font-medium'>Sent Tpye</h1>
                            <p className='text-sm text-gray-400'>Please select Sent Type to Create Sent Document Form</p>
                            <div className='mt-6 grid grid-cols-2 gap-4'>
                                <div className=' flex gap-3 px-3 py-5 border rounded-xl shadow items-center'>
                                    <div className='p-2 bg-purple-100 rounded-full'>
                                        <Icon path={mdiAccountCircle} size={1} />
                                    </div>
                                    <p>One Person</p>
                                </div>
                                <div className='flex gap-3 px-3 py-5 border rounded-xl shadow items-center'>
                                    <div className='p-2 bg-purple-100 rounded-full'>
                                        <Icon path={mdiAccountCircle} size={1} />
                                    </div>
                                    <p>Multiple Person</p>
                                </div>
                                <div className='flex gap-3 px-3 py-5 border rounded-xl shadow items-center'>
                                    <div className='p-2 bg-purple-100 rounded-full'>
                                        <Icon path={mdiAccountCircle} size={1} />
                                    </div>
                                    <p>Step Sent</p>
                                </div>
                                <div className='flex gap-3 px-3 py-5 border rounded-xl shadow items-center'>
                                    <div className='p-2 bg-purple-100 rounded-full'>
                                        <Icon path={mdiAccountCircle} size={1} />
                                    </div>
                                    <p>Custom Sent</p>
                                </div>
                            </div>
                            <div className='mt-10'>
                                <p className='text-gray-500 font-medium'>Upload your files here</p>
                                <div className='mt-2 p-5 w-full h-full bg-gray-100 flex flex-col justify-center items-center rounded-xl shadow border-4 border-dotted'>
                                    <Icon path={mdiAccountCircle} size={1} className='text-gray-400' />
                                    <h1 className='font-medium'>Click to upload</h1>
                                    <p className='text-gray-400 text-sm'>Drag and drop files here</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h1 className='font-medium'>Contact details</h1>
                            <p className='text-sm text-gray-400'>Please select Sent Type to Create Sent Document Form</p>
                            <div className='mt-6 flex flex-col gap-5'>
                                <div className=''>
                                    <label>Email</label>
                                    <div className='mt-2 flex items-center rounded-xl border border-gray-300 p-2'>
                                            <input
                                                type="text"
                                                className='w-full p-1 '
                                                placeholder='Email address'
                                            />
                                            <Icon path={mdiAccountCircle} size={1.5} className='text-gray-400 ml-2' />
                                        </div>
                                </div>
                                <div className='grid grid-cols-2 gap-5'>
                                    <div className=''>
                                        <label>หัวข้อ</label>
                                        <div className='mt-2 flex items-center rounded-xl border border-gray-300 p-2'>
                                            <input
                                                type="text"
                                                className='w-full p-1 '
                                                placeholder='Email address'
                                            />
                                            <Icon path={mdiAccountCircle} size={1.5} className='text-gray-400 ml-2' />
                                        </div>
                                    </div>
                                    <div className=''>
                                        <label>Tags</label>
                                        <div className='mt-2 flex items-center rounded-xl border border-gray-300 p-2'>
                                            <select
                                                className='w-full p-1 appearance-none text-center bg-white cursor-pointer'
                                            >
                                                <option value="0">-</option>
                                                <option value="การบ้าน">การบ้าน</option>
                                                <option value="เอกสารสำคัญ">เอกสารสำคัญ</option>
                                            </select>
                                            <Icon path={mdiAccountCircle} size={1.5} className='text-gray-400 ml-2' />
                                        </div>
                                    </div>
                                </div>

                                <div className="">
                                    <label>
                                        รายละเอียด
                                    </label>
                                    <div className="mt-2 flex items-center rounded-xl border border-gray-300 p-2 ">
                                        <textarea
                                            placeholder="Enter your details"
                                            className="focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow text-gray-700 w-full resize-none p-1 rounded-sm"
                                        />
                                        <Icon path={mdiAccountCircle} size={1.5} className="text-gray-400 ml-2 mt-1" />
                                    </div>
                                </div>
                                {/* <div className='flex justify-center mt-5'>
                                    <div className='bg-[#5955B3] opacity-50 transition-all cursor-pointer hover:opacity-100 p-2 rounded-full '>
                                        <Icon path={mdiPlus} size={1.1} className="text-white" />
                                    </div>
                                </div> */}
                            </div>
                        </div>

                    </div>

                </div>
                <div className='self-end'>
                    <button type='submit' className='bg-[#4A3AFF] px-6 py-2 rounded-2xl shadow text-white font-medium'>ส่ง</button>
                </div>
            </form>
            {loader && (
                <div>
                    <Loader />
                </div>
            )}
        </div>
    )
}

export default Sent
