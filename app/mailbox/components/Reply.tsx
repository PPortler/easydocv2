"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import Icon from '@mdi/react';
import { mdiUploadCircle,mdiAccountCircle, mdiCloseCircle } from '@mdi/js';
import axios from 'axios';
import Select from 'react-select';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/app/firebaseConfig';
import PulseLoader from "react-spinners/PulseLoader";
import Swal from 'sweetalert2';
import Loader from '@/app/component/Loader';

interface MailBox {
    email: string;
    idSent: string;
    header: string;
    status: boolean;
    type: string;
    fromSent: [{
        email: string,
        time: string,
        date: string,
        files: [{ fileName: string, fileType: string, fileURL: string }],
        detail: string;
    }];
}

interface MailBoxProps {
    data: MailBox | undefined;
    emailSession: string;
}

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

function Reply({ data, emailSession }: MailBoxProps) {

    const [loader, setLoader] = useState<boolean>(false);

    const [onReplyForm, setOnReplyForm] = useState<boolean>(false);
    const [onSentForm, setOnSentForm] = useState<boolean>(false);

    const [error, setError] = useState<string>('');

    const [email, setEmail] = useState<string>('');
    const [reply, setReply] = useState<string>('');
    const [allEmail, setAllEmail] = useState<AllEmail[]>([]);
    const [allUser, setAllUser] = useState<User[]>([]);

    useEffect(() => {
        getAllUser();
    }, [])
    //getEmail
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

    //add files
    const [files, setFiles] = useState<File[]>([]);

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

            const fileRef = ref(storage, `Users/MailBox/${data?.fromSent[0]?.email}/${file.name}`);

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

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setLoader(true);

        console.log(files);
        console.log(reply);
        console.log(email);

        if (!email || !reply) {
            setError("ยังไม่ระบบข้อความตอบกลับหรือ อีเมล");
            setLoader(false);
            return;
        }
        if (!onReplyForm) {
            if (email.toLowerCase() === emailSession.toLowerCase() || data?.fromSent.some(e => e.email.toLowerCase() === email.toLowerCase())) {
                setError("ไม่สามารถส่งอีเมลเดียวกันกับผู้ใช้");
                setLoader(false);
                return;
            }
        }

        const now = new Date();
        const time = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }); // เช่น 08:30
        const date = now.toISOString().split('T')[0]; // เช่น 2024-12-19

        const fromSent = {
            email: emailSession,
            time,
            date,
            files: files.length === 0 ? data?.fromSent[0]?.files : files,
            detail: reply
        };

        let checkStatus = false;
        try {
            const res = await axios.put(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/sent/${data?.idSent}`, {
                email: onReplyForm ? emailSession : email,
                status: onReplyForm ? "complete" : "validate",
                fromSent: fromSent
            });

            if (res.status === 200 || res.status === 201) {
                await axios.put(
                    `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/mailBox/sent/${data?.idSent}`, {
                    email: email,
                    status: onReplyForm ? true : false,
                    fromSent: fromSent
                }
                ).then(() => {
                    checkStatus = true;
                });

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
        }

        if (checkStatus) {
            Swal.fire({
                icon: 'success',
                title: 'ส่งสำเร็จ!',
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

    console.log(files);
    console.log(data?.fromSent[0]?.files);
    return (
        <div className='mt-5 border rounded-xl border-black p-5'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
                <div className='flex flex-col text-sm text-gray-500'>
                    <p>วันที่ส่ง: {data?.fromSent[0]?.date}, {data?.fromSent[0]?.time} น.</p>
                </div>
                <div className='flex gap-5'>
                    {data?.fromSent[0]?.files.map((file, index) => (
                        <div key={index}>
                            <div className='cursor-pointer p-3 bg-gray-100 rounded-xl flex gap-3 items-center w-fit'>
                                <Image className='w-5 h-5 ' src="/image/documents/docx.png" height={1000} width={1000} priority alt={file.fileType} />
                                <p className='text-xs'>{file.fileName}.{file.fileType}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='flex gap-5 items-center flex-wrap'>
                    <div className='w-96'>
                        <label>หัวข้อ</label>
                        <div className=' mt-2 flex items-center rounded-xl border border-gray-500 p-2 bg-gray-200'>
                            <input
                                type="text"
                                className='w-full p-1 focus:outline-none cursor-default bg-gray-200'
                                defaultValue={data?.header}
                                readOnly
                            />
                        </div>
                    </div>
                    <div className='w-56'>
                        <label>Tags</label>
                        <div className='mt-2 flex rounded-xl border border-gray-500 p-2 bg-gray-200'>
                            <input
                                type="text"
                                className='w-full p-1 focus:outline-none cursor-default bg-gray-200'
                                defaultValue={data?.type}
                                readOnly
                            />
                        </div>
                    </div>
                </div>
                <div className=''>
                    <label>
                        รายละเอียด
                    </label>
                    <div className="mt-2 flex items-center rounded-xl border border-gray-500 p-2 bg-gray-200">
                        <textarea
                            placeholder="Enter your details"
                            className="min-h-24 max-h-40 focus:outline-none  cursor-default bg-gray-200 text-gray-700 w-full p-1 rounded-sm"
                            defaultValue={data?.fromSent[0]?.detail}
                            readOnly
                        />
                    </div>
                </div>
                {data?.status ? (
                    <div>
                        <label className='font-bold'>การตอบกลับ</label>
                        {data?.fromSent?.map((e, index) => (
                            index !== 0 && (
                                <div>
                                    <div className='mt-5 flex items-center gap-2'>
                                        <Icon path={mdiAccountCircle} size={1.5} />
                                        {e.email}
                                    </div>
                                    {e.files?.map((file, index) => (
                                        <div key={index} className='mt-5 cursor-pointer p-3 bg-gray-100 rounded-xl flex gap-3 items-center w-fit'>
                                            <Image className='w-5 h-5 ' src="/image/documents/docx.png" height={1000} width={1000} priority alt={file.fileType} />
                                            <p className='text-xs'>{file.fileName}.{file.fileType}</p>
                                        </div>
                                    ))}
                                    <div className="mt-5 flex items-center rounded-xl border border-gray-500 bg-gray-200 p-2 ">
                                        <textarea
                                            className="min-h-24 max-h-40 focus:outline-none  cursor-default bg-gray-200 text-gray-700 w-full p-1 rounded-sm"
                                            defaultValue={data?.fromSent?.find((f) => f.email === e.email)?.detail}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                ) : (
                    onReplyForm || onSentForm ? (
                        <>
                            <div className='flex flex-col items-center relative my-5'>
                                <hr className='border-gray-400 w-full' />
                                <p className='bg-white text-gray-400 w-fit absolute top-[-14px] text-sm py-1 px-2'>{onReplyForm ? "ตอบกลับ" : "ส่งต่อ"}</p>
                            </div>
                            <div>
                                <label>
                                    ส่งที่ อีเมล: <span className='text-red-500'> *</span>
                                </label>
                                {onReplyForm ? (
                                    <div className='mt-2 flex items-center rounded-xl border border-gray-300 p-2 w-96'>
                                        <input
                                            type="text"
                                            className='w-full p-1 '
                                            defaultValue={data?.fromSent[0]?.email}
                                            readOnly
                                        />
                                    </div>
                                ) : (
                                    <div className='mt-2 w-96 flex items-center rounded-xl border border-gray-300 p-1'>
                                        <div className='w-full'>
                                            <Select
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
                                                    const selectedEmail = selectedOptions ? selectedOptions.value : '';
                                                    setEmail(selectedEmail); // เนื่องจากเลือกได้เพียงตัวเดียว จะตั้งค่า selectedEmail แทนที่จะเป็น array
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className=''>
                                <label>
                                    ข้อความ: <span className='text-red-500'> *</span>
                                </label>
                                <div className="mt-2 flex items-center rounded-xl border border-gray-300 p-2 ">
                                    <textarea
                                        placeholder="ข้อความ..."
                                        className="min-h-24 max-h-40 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow text-gray-700 w-full p-1 rounded-sm"
                                        onChange={(e) => setReply(e.target.value)}
                                    />
                                </div>
                            </div>
                            {onReplyForm ? (
                                <div>
                                    <input id="upload" type="file" hidden multiple onChange={handleFileChange} />
                                    <label htmlFor="upload" className='cursor-pointer'>
                                        <p className=' font-medium'>แนบไฟล์เพิ่มเติม:</p>
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
                                                        <Icon path={mdiUploadCircle} size={1} className='text-gray-400' />
                                                        <h1 className='font-medium'>Click to upload</h1>
                                                        <p className='text-gray-400 text-sm'>Drag and drop files here</p>
                                                    </>
                                                )
                                            )}
                                        </div>
                                    </label>
                                </div>
                            ) : (
                                <div className=''>
                                    <label>
                                        ไฟล์ที่ส่งต่อ:
                                    </label>
                                    <div className='mt-2 flex gap-5'>
                                        {data?.fromSent[0]?.files.map((file, index) => (
                                            <div key={index}>
                                                <div className='cursor-pointer p-3 bg-gray-100 rounded-xl flex gap-3 items-center w-fit'>
                                                    <Image className='w-5 h-5 ' src="/image/documents/docx.png" height={1000} width={1000} priority alt={file.fileType} />
                                                    <p className='text-xs'>{file.fileName}.{file.fileType}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : null
                )}
                {error ? (
                    <div className='text-red-500'>
                        * {error}
                    </div>
                ) : null}
                {!data?.status && (
                    <div className='flex justify-end gap-5 mt-10'>
                        {onReplyForm || onSentForm ? (
                            <>
                                <div
                                    onClick={() => {
                                        setOnReplyForm(false)
                                        setOnSentForm(false)
                                        setEmail('')
                                    }}
                                    className='cursor-pointer bg-gray-300 py-2 px-4 rounded-lg'
                                >ยกเลิก
                                </div>
                                <button
                                    type='submit'
                                    className='cursor-pointer bg-gray-300 py-2 px-4 rounded-lg'
                                >ส่ง
                                </button>
                            </>
                        ) : (
                            <>
                                <div
                                    onClick={() => setOnSentForm(true)}
                                    className='cursor-pointer bg-gray-300 py-2 px-4 rounded-lg'
                                >ส่งต่อ</div>
                                <div
                                    onClick={() => {
                                        setOnReplyForm(true)
                                        setEmail(data?.fromSent[0]?.email || '')
                                    }}
                                    className='cursor-pointer bg-gray-300 py-2 px-4 rounded-lg'
                                >ตอบกลับ</div>
                            </>
                        )}
                    </div>
                )}
            </form >
            {loader && (
                <div>
                    <Loader />
                </div>
            )}
        </div >
    )
}

export default Reply
