"use client"

import React, { useState, useEffect } from 'react'
import Icon from '@mdi/react';
import { mdiAccountCircle, mdiCloseCircle } from '@mdi/js';
import axios from 'axios'
import { useSession } from 'next-auth/react'
import PulseLoader from "react-spinners/PulseLoader";
import Select from 'react-select';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/app/firebaseConfig';
import Image from 'next/image';
import Swal from 'sweetalert2';

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

interface FromEmail {
    email: string;
    time: string;
    date: string;
}

interface FormSentProps {
    setLoader: React.Dispatch<React.SetStateAction<boolean>>;
}

function FormSent({ setLoader }: FormSentProps) {

    const [email, setEmail] = useState<string[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [type, setType] = useState<string>('');
    const [header, setHeader] = useState<string>('');
    const [detail, setDetail] = useState<string>('');
    const [error, setError] = useState<string>('');

    const { data: session } = useSession();

    const [fromEmailDefault, setFromEmailDefault] = useState<string>('');

    useEffect(() => {
        getAllUser();

        const email = session?.user?.email;

        if (email) {
            setFromEmailDefault(email);
        }

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
            uploadFiles(selectedFiles); // เรียกใช้งานฟังก์ชันการอัปโหลด
        }
    };

    const [uploadProgress, setUploadProgress] = useState<number>(0)
    const uploadFiles = async (selectedFiles: FileList) => {
        for (const file of Array.from(selectedFiles)) {
            // ดึงชื่อไฟล์โดยไม่รวมส่วนขยาย
            const fileNameWithoutExtension = file.name.split('.').slice(0, -1).join('.');

            // ดึงประเภทไฟล์จากส่วนขยาย
            const fileType = file.name.split('.').pop();

            // ตรวจสอบประเภทไฟล์
            if (fileType !== "pdf" && fileType !== "docx") {
                setError("อัพโหลดเฉพาะไฟล์ pdf, docx เท่านั้น!");
                return;
            }

            const fileRef = ref(storage, `Users/Sent/${session?.user?.email}/${file.name}`);

            // ใช้ uploadBytesResumable เพื่อสามารถติดตามการอัปโหลดได้
            const uploadTask = uploadBytesResumable(fileRef, file);

            // ฟังการเปลี่ยนแปลงของสถานะการอัปโหลด
            uploadTask.on("state_changed",
                (snapshot) => {
                    const progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100); // ปัดเศษลงเป็นจำนวนเต็ม
                    console.log(`Upload is ${progress}% done`);
                    setUploadProgress(progress); // อัปเดตเปอร์เซ็นต์ใน UI
                },
                (error) => {
                    console.error(`Error uploading ${file.name}: `, error);
                    setError("เกิดข้อผิดพลาดในการอัปโหลดไฟล์");
                },
                async () => {
                    // อัปโหลดเสร็จสิ้น
                    const downloadURL = await getDownloadURL(fileRef);
                    console.log(`Uploaded ${file.name} successfully. Download URL: ${downloadURL}`);

                    // อัปเดตไฟล์ในสถานะ
                    setFiles(prevFiles => [
                        ...prevFiles,
                        {
                            fileName: fileNameWithoutExtension,
                            fileType: fileType,
                            fileURL: downloadURL,
                        },
                    ]);
                    setUploadProgress(0);
                }
            );
        }
    };

    //delete file in upload
    const handleDeleteFile = (index: number) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    //submit form 
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(""); 
        setLoader(true);

        console.log("files: " + files);
        console.log("header: " + header);
        console.log("type: " + type);
        console.log("detail: " + detail);
        console.log("from: " + fromEmailDefault);

        if (email.length === 0 || files.length === 0 || !header || !type || !detail) {
            setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
            setLoader(false);
            return;
        }
        if (email.some(e => e === fromEmailDefault)) {
            setError("ไม่สามารถส่งอีเมลเดียวกันกับผู้ใช้");
            setLoader(false);
            return;
        }

        const now = new Date();
        const time = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }); // เช่น 08:30
        const date = now.toISOString().split('T')[0]; // เช่น 2024-12-19
    
        const fromEmailObject = { email: fromEmailDefault, time, date }; // สร้างอ็อบเจ็กต์

        let checkStatus = false;
        try {
            // ใช้ for...of เพื่อส่ง email ทีละค่า
            for (const e of email) {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/sent`, {
                    email: e,
                    files: files,
                    header: header,
                    type: type,
                    detail: detail,
                    status: "validate",
                    fromEmail: fromEmailObject
                }
                );

                if (res.status === 201 || res.status === 200) {
                    const sentId = res.data.id;

                    await axios.post(
                        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/mailBox`, { // ใช้ sentId
                        email: e,
                        idSent: sentId,
                        files: files,
                        header: header,
                        type: type,
                        detail: detail,
                        date: date,
                        time: time,
                        status: false,
                        fromEmail: session?.user?.email
                    }
                    ).then(() => {
                        checkStatus = true;
                    });
                }
                console.log("email " + e);
            }
        } catch (err) {
            console.error("เกิดข้อผิดพลาดในการส่งอีเมล:", err);
            Swal.fire({
                icon: 'error',
                title: 'ส่งไฟล์ล้มเหลว!',
                text: 'ลองใหม่อีกครั้งในภายหลัง!'
            }).then(() => {
                setLoader(false);
            });
            setLoader(false);
        }

        if (checkStatus) {
            Swal.fire({
                icon: 'success',
                title: 'ส่งไฟล์สำเร็จ!',
            }).then(() => {
                setLoader(false);
                window.location.reload();
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'ส่งไฟล์ล้มเหลว!',
                text: 'ลองใหม่อีกครั้งในภายหลัง!'
            }).then(() => {
                setLoader(false);
                window.location.reload();
            });
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
                                    <div className={`mt-2 p-5 w-full h-full bg-gray-100 ${files.length > 0 ? "" : "flex flex-col"} justify-center items-center rounded-xl shadow border-4 border-dotted`}>
                                        {uploadProgress > 0 ? (
                                            <div className='flex flex-col items-center opacity-50 gap-2'>
                                                <div className='flex justify-center items-center '>
                                                    <PulseLoader
                                                        size={10}
                                                        aria-label="Loading Spinner"
                                                        color={`#5955B3`}
                                                        className='z-10'
                                                        speedMultiplier={1}
                                                    />
                                                </div>
                                                <div className='text-xs'>{uploadProgress}%</div>
                                            </div>
                                        ) : (
                                            files.length > 0 ? (
                                                files.map((file, index) => (
                                                    <div key={index}>
                                                        <div className={`${index > 0 ? "mt-3" : ""} relative flex gap-3 items-center p-3 rounded-lg bg-gray-200 shadow`}>
                                                            <div
                                                                className='absolute top-0 right-0 cursor-pointer m-2'
                                                                onMouseDown={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    handleDeleteFile(index);
                                                                }}>
                                                                <Icon path={mdiCloseCircle} size={1} className='text-red-500 ' />
                                                            </div>
                                                            <Image className='w-10 h-10 ' src="/image/documents/docx.png" height={1000} width={1000} priority alt={file.fileType} />
                                                            <p className='text-ellipsis whitespace-nowrap overflow-hidden w-4/5'>{file.fileName}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <>
                                                    <Icon path={mdiAccountCircle} size={1} className='text-gray-400' />
                                                    <h1 className='font-medium'>Click to upload</h1>
                                                    <p className='text-gray-400 text-sm'>Drag and drop files here</p>
                                                </>
                                            )
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
