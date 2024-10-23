"use client"

import React from 'react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../component/myfile/Navbar';
import Navbar2 from '../component/myfile/Navbar2';
import Icon from '@mdi/react';
import { mdiFileAccount, mdiDotsVertical, mdiArrowDown } from '@mdi/js';
import AddFile from '../component/myfile/AddFile';
import axios from 'axios';
import Loader from '../component/Loader';

interface File {
    fileName: string;
    fileType: string;
    fileURL: string;
}

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

        if (session?.user?.idUser) {
            getFiles(session?.user?.idUser);
            setLoader(false);
        }
    }, [session])

    //get files
    const [files, setFiles] = useState<File[]>([])
    async function getFiles(id: String) {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/upload/${id}`);
            setFiles(res.data.files || [])
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="p-5 flex">
            <Navbar status="myfile" />
            <div className="bg-white rounded-3xl p-10 min-h-screen w-full">
                <Navbar2 title="เอกสารของฉัน" />

                <form className='flex gap-3 items-center justify-center mt-10'>
                    <p className='text-[#585858] text-xl'>ค้นหา</p>
                    <input
                        type="text"
                        className='border border-black py-1 px-4 rounded-lg w-96'
                        placeholder='File....'
                    />
                </form>

                <div className='mt-20 flex justify-end gap-5 items-center'>
                    <Icon path={mdiArrowDown} size={.7} />
                    <select>
                        <option value="lastmodified">เรียงจากล่าสุด</option>
                    </select>
                    <Icon path={mdiDotsVertical} size={.7} />
                </div>
                <div className='mt-10 border p-10  rounded-3xl'>
                    <p className='text-xl font-medium'>ไฟล์เริ่มต้น</p>
                    <div className='my-5 grid grid-cols-4  gap-5'>
                        <div className='justify-between items-center flex border rounded-xl p-4 bg-gray-100'>
                            <div className='flex gap-3 text-ellipsis overflow-hidden whitespace-nowrap'>
                                <Icon path={mdiFileAccount} size={1} className='flex-shrink-0' />
                                <p className=' text-ellipsis overflow-hidden whitespace-nowrap'>แบบฟอร์มการลงทะเบียน</p>
                            </div>
                            <Icon path={mdiDotsVertical} size={1} className='flex-shrink-0' />
                        </div>
                        <div className='justify-between items-center flex border rounded-xl p-4 bg-gray-100'>
                            <div className='flex gap-3 text-ellipsis overflow-hidden whitespace-nowrap'>
                                <Icon path={mdiFileAccount} size={1} className='flex-shrink-0' />
                                <p className=' text-ellipsis overflow-hidden whitespace-nowrap'>แบบฟอร์มขอรับทุน ก</p>
                            </div>
                            <Icon path={mdiDotsVertical} size={1} className='flex-shrink-0' />
                        </div>
                        <div className='justify-between items-center flex border rounded-xl p-4 bg-gray-100'>
                            <div className='flex gap-3 text-ellipsis overflow-hidden whitespace-nowrap'>
                                <Icon path={mdiFileAccount} size={1} className='flex-shrink-0' />
                                <p className=' text-ellipsis overflow-hidden whitespace-nowrap'>แบบฟอร์มขอรับทุน ข</p>
                            </div>
                            <Icon path={mdiDotsVertical} size={1} className='flex-shrink-0' />
                        </div>
                        <div className='justify-between items-center flex border rounded-xl p-4 bg-gray-100'>
                            <div className='flex gap-3 text-ellipsis overflow-hidden whitespace-nowrap'>
                                <Icon path={mdiFileAccount} size={1} className='flex-shrink-0' />
                                <p className=' text-ellipsis overflow-hidden whitespace-nowrap'>แบบฟอร์มสมัครงาน</p>
                            </div>
                            <Icon path={mdiDotsVertical} size={1} className='flex-shrink-0' />
                        </div>
                    </div>
                    <hr />
                    <div className='mt-5 grid grid-cols-4  gap-5'>
                        {files ? (
                            files.map((file, index) => (
                                <div key={index} className='justify-between items-center flex border rounded-xl p-4 bg-gray-100'>
                                    <div className='flex gap-3 text-ellipsis overflow-hidden whitespace-nowrap'>
                                        <Icon path={mdiFileAccount} size={1} className='flex-shrink-0' />
                                        <p className=' text-ellipsis overflow-hidden whitespace-nowrap'>{file.fileName}</p>
                                    </div>
                                    <Icon path={mdiDotsVertical} size={1} className='flex-shrink-0' />
                                </div>
                            ))
                        ) : (
                            <p>ยังไม่มีไฟล์ที่อัพโหลด</p>
                        )}

                    </div>
                </div>
            </div>
            {loader && (
                <div>
                    <Loader />
                </div>
            )}
            <AddFile email={`${session?.user?.email}`} id={`${session?.user?.idUser}`} />
        </div>
    )
}

export default MyFile
