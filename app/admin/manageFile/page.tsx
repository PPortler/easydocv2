"use client"

import React from 'react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NavbarAdmin from '../componants/NavbarAdmin';
import Navbar2 from '@/app/component/myfile/Navbar2';
import Icon from '@mdi/react';
import { mdiFileAccount, mdiDotsVertical, mdiArrowDown, mdiPencil, mdiDelete, mdiPlus } from '@mdi/js';
import AddFile from '../componants/AddFile';
import axios from 'axios';
import Loader from '@/app/component/Loader';
import Head from "next/head";
import Swal from 'sweetalert2'

interface File {
    _id: string;
    fileName: string;
    fileType: string;
    fileURL: string;
}

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
            getFiles();
            setLoader(false);
        }
    }, [session])


    //get files
    const [files, setFiles] = useState<File[]>([])
    async function getFiles() {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/systems/defaultfile`);
            setFiles(res.data.files || [])
        } catch (err) {
            console.log(err);
        }
    }

    async function handleChangeName(id: string, name: string) {
        Swal.fire({
            title: "โปรดระบุชื่อไฟล์",
            input: "text",
            inputValue: name,
            inputAttributes: {
                autocapitalize: "off"
            },
            showCancelButton: true,
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก",
            showLoaderOnConfirm: true,
            preConfirm: (inputFileName) => {
                if (!inputFileName) {
                    Swal.showValidationMessage('กรุณาระบุชื่อไฟล์');
                    return false;
                }
                return inputFileName;
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.put(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/systems/defaultfile/${id}`
                        , { fileName: result.value }
                    );
                    if (res.status === 200 || res.status === 201) {
                        let timerInterval: NodeJS.Timeout | undefined;
                        Swal.fire({
                            title: "กำลังแก้ไขชื่อไฟล์",
                            html: "<b></b> milliseconds.",
                            timer: 2000,
                            timerProgressBar: true,
                            didOpen: () => {
                                Swal.showLoading();
                                const timer = Swal.getPopup()?.querySelector("b");
                                if (timer) {
                                    timerInterval = setInterval(() => {
                                        timer.textContent = `${Swal.getTimerLeft()}`;
                                    }, 100);
                                }
                            },
                            willClose: () => {
                                clearInterval(timerInterval);
                            }
                        }).then((result) => {
                            if (result.dismiss === Swal.DismissReason.timer) {
                                console.log("I was closed by the timer");
                                window.location.reload();
                            }
                        });
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        });
    }

    //deleteFile
    function handleDeleteFile(id: string, name: string, type: string) {
        Swal.fire({
            title: `ลบไฟล์`,
            text: `คุณต้องการลบ ${name}.${type} ?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/systems/defaultfile/${id}`);
                    
                    if (res.status === 200) {
                        let timerInterval: NodeJS.Timeout | undefined;
                        Swal.fire({
                            title: "กำลังลบไฟล์",
                            html: "<b></b> milliseconds.",
                            timer: 2000,
                            timerProgressBar: true,
                            didOpen: () => {
                                Swal.showLoading();
                                const timer = Swal.getPopup()?.querySelector("b");
                                if (timer) {
                                    timerInterval = setInterval(() => {
                                        timer.textContent = `${Swal.getTimerLeft()}`;
                                    }, 100);
                                }
                            },
                            willClose: () => {
                                clearInterval(timerInterval);
                            }
                        }).then((result) => {
                            if (result.dismiss === Swal.DismissReason.timer) {
                                console.log("I was closed by the timer");
                                window.location.reload();
                            }
                        });
                    }
                } catch (err) {
                    console.log(err)
                }
            }
        });
    }

    return (
        <>
            <Head>
                <title>ไฟล์เริ่มต้น</title>
            </Head>
            <div className="p-5 flex">
                <NavbarAdmin status="myfile" />
                <div className="bg-white rounded-3xl p-10 min-h-screen w-full">
                    <Navbar2 title="ไฟล์เริ่มต้น" />

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
                        <div className='flex justify-between'>
                            <p className='text-xl font-medium'>กำหนดไฟล์เริ่มต้น</p>
                            <AddFile setLoader={setLoader} />
                        </div>
                        <div className='my-5 flex flex-col  gap-3'>
                            {files.length === 0 ? (
                                <div>กำลังโหลด...</div>
                            ) : (
                                files?.map((file, index) => (
                                    <div key={index} className='justify-between items-center flex border rounded-xl p-4 bg-gray-100'>
                                        <div className='flex gap-3 text-ellipsis overflow-hidden whitespace-nowrap'>
                                            <Icon path={mdiFileAccount} size={1} className='flex-shrink-0' />
                                            <p className=' text-ellipsis overflow-hidden whitespace-nowrap'>{file?.fileName}.{file?.fileType}</p>
                                        </div>
                                        <div className='flex gap-2'>
                                            <div onClick={() => handleChangeName(file._id, file.fileName)} className='cursor-pointer'>
                                                <Icon path={mdiPencil} size={.9} />
                                            </div>

                                            <div onClick={() => handleDeleteFile(file._id, file.fileName, file.fileType)} className='cursor-pointer'>
                                                <Icon path={mdiDelete} size={.9} />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
                {loader && (
                    <div>
                        <Loader />
                    </div>
                )}
                {/* <AddFile email={`${session?.user?.email}`} id={`${session?.user?.idUser}`} /> */}
            </div>
        </>
    )
}

export default MyFile
