"use client"

import React, { useState, useEffect } from 'react'
import Icon from '@mdi/react';
import { mdiAccountCircle, mdiCloseCircle } from '@mdi/js';
import axios from 'axios'
import { useSession } from 'next-auth/react'
import PulseLoader from "react-spinners/PulseLoader";
import Select from 'react-select';
import { ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/app/firebaseConfig';
import Image from 'next/image';

interface AllEmail {
    value: string;
    label: string;
}

interface User {
    email: string;
}

interface File {
    fileName: string;
    fileType: string;
    fileURL: string;
}

function FormSent() {

    const [email, setEmail] = useState<string[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [type, setType] = useState<string>('');
    const [header, setHeader] = useState<string>('');
    const [detail, setDetail] = useState<string>('');
    const [error, setError] = useState<string>('');

    const { data: session } = useSession();

    useEffect(() => {
        getAllUser();
    }, [session])

    const [allUser, setAllUser] = useState<User[]>([]);
    const [allEmail, setAllEmail] = useState<AllEmail[]>([]);

    useEffect(() => {
        const options: AllEmail[] = allUser.map(user => ({
            value: user.email,
            label: user.email,
        }));
        setAllEmail(options);
    }, [allUser]);

    async function getAllUser() {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/users`);
            if (res.status === 200) {
                setAllUser(res.data.users);
            }
        } catch (err) {
            console.log(err);
        }
    }

    //upload files
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (selectedFiles) {
            const newFilesArray = Array.from(selectedFiles).map(file => ({
                fileName: file.name,
                fileType: file.type,
                fileURL: '', // คุณสามารถอัปเดต URL นี้หลังจากที่การอัปโหลดเสร็จสิ้น
            }));

            // อัปเดตสถานะให้รวมไฟล์ที่มีอยู่และไฟล์ใหม่
            setFiles(prevFiles => [...prevFiles, ...newFilesArray]);
            uploadFiles(selectedFiles); // เรียกใช้งานฟังก์ชันการอัปโหลด
        }
    };

    const uploadFiles = async (selectedFiles: FileList) => {
        for (const file of Array.from(selectedFiles)) {
            const fileRef = ref(storage, `Users/Sent/${session?.user?.email}/${file.name}`); // Specify the path in Firebase Storage
            try {
                await uploadBytes(fileRef, file);
                console.log(`Uploaded ${file.name} successfully.`);
            } catch (error) {
                console.error(`Error uploading ${file.name}: `, error);
            }
        }
    };

    //delete file in upload
    const handleDeleteFile = (index: number) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    //submit form 
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        console.log("email: "+ email);
        console.log("files: "+ files);
        console.log("header: "+ header);
        console.log("type: "+ type);
        console.log("detail: "+ detail);

        if(email.length === 0 || files.length === 0 || !header || !type || !detail){
            setError("กรุณากรอกข้อมูลให้ครบทุกช่อง")
            return;
        }

    }

    return (
        <div>
            {allEmail.length > 0 ? (
                <form onSubmit={handleSubmit} className='lg:grid-cols-2 mt-10 grid grid-cols-1 gap-x-14'>
                    <div>
                        <h1 className='font-medium'>Sent Type</h1>
                        <p className='text-sm text-gray-400'>Please select Sent Type to Create Sent Document Form</p>
                        <div className='mt-6 grid grid-cols-2 gap-4'>
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
                            <div>
                                <input id="upload" type="file" hidden multiple onChange={handleFileChange} />
                                <label htmlFor="upload" className='cursor-pointer'>
                                    <p className='text-gray-500 font-medium'>Upload your files here</p>
                                    <div className={`mt-2 p-5 w-full h-full bg-gray-100 ${files.length > 0 ? "grid grid-cols-5 gap-3" : "flex flex-col"} justify-center items-center rounded-xl shadow border-4 border-dotted`}>
                                        {files.length > 0 ? (
                                            files.map((file, index) => (
                                                <div key={index} className='text-center relative'>
                                                    <div
                                                        className='absolute top-0 right-0 cursor-pointer'
                                                        onMouseDown={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleDeleteFile(index);
                                                        }}>
                                                        <Icon path={mdiCloseCircle} size={1} className='text-red-500 ' />
                                                    </div>
                                                    <Image className='w-full h-full' src="/image/documents/docx.png" height={1000} width={1000} priority alt={file.fileType} />
                                                    <p className='text-ellipsis whitespace-nowrap overflow-hidden'>{file.fileName}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <>
                                                <Icon path={mdiAccountCircle} size={1} className='text-gray-400' />
                                                <h1 className='font-medium'>Click to upload</h1>
                                                <p className='text-gray-400 text-sm'>Drag and drop files here</p>
                                            </>
                                        )}
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className='mt-10 lg:mt-0'>
                        <h1 className='font-medium'>Contact details</h1>
                        <p className='text-sm text-gray-400'>Please select Sent Type to Create Sent Document Form</p>
                        <div className='mt-6 flex flex-col gap-5'>
                            <div className=''>
                                <label>Email</label>
                                <div className='mt-2 flex items-center rounded-xl border border-gray-300 p-2'>
                                    <div className='w-full'>
                                        <Select
                                            isMulti
                                            name="colors"
                                            options={allEmail}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            styles={{
                                                control: (provided) => ({
                                                    ...provided,
                                                    border: 'none',
                                                    boxShadow: 'none',
                                                    width: '100%',
                                                }),
                                            }}
                                            onChange={(selectedOptions) => {
                                                const selectedEmails = selectedOptions.map(option => option.value);
                                                setEmail(selectedEmails);
                                            }}
                                        />
                                    </div>
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
                                            onChange={(e) => setHeader(e.target.value)}
                                        />
                                        <Icon path={mdiAccountCircle} size={1.5} className='text-gray-400 ml-2' />
                                    </div>
                                </div>
                                <div className=''>
                                    <label>Tags</label>
                                    <div className='mt-2 flex items-center rounded-xl border border-gray-300 p-2'>
                                        <select
                                            className='w-full p-1 appearance-none text-center bg-white cursor-pointer'
                                            onChange={(e) => setType(e.target.value)}
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
                                        onChange={(e) => setDetail(e.target.value)}
                                    />
                                    <Icon path={mdiAccountCircle} size={1.5} className="text-gray-400 ml-2 mt-1" />
                                </div>
                            </div>
                            {error && (
                                <div className='text-red-500 '>
                                    *{error}
                                </div>
                            )}
                            <div className='self-end'>
                                <button type='submit' className='bg-[#4A3AFF] px-6 py-2 rounded-2xl shadow text-white font-medium'>ส่ง</button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className='mt-10 flex justify-center items-center opacity-50'>
                    <PulseLoader
                        size={10}
                        aria-label="Loading Spinner"
                        color={`#5955B3`}
                        className='z-10'
                        speedMultiplier={1}
                    />
                </div>
            )}
        </div>
    )
}

export default FormSent;
