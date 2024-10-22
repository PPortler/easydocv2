"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import Icon from '@mdi/react';
import { mdiAccountCircle, mdiCloseCircle } from '@mdi/js';

interface MailBox {
    email: string;
    idSent: string;
    files: [{ fileName: string, fileType: string, fileURL: string }];
    header: string;
    detail: string;
    date: string;
    type: string;
    time: string;
    from: string;
    status: boolean;
}

interface MailBoxProps {
    data: MailBox | undefined;
}

function Reply({ data }: MailBoxProps) {

    const [onReplyForm, setOnReplyForm] = useState<boolean>(false);
    const [onSentForm, setOnSentForm] = useState<boolean>(false);

    // console.log(onReplyForm);
    // console.log(data);
    return (
        <div className='mt-5 border rounded-xl border-black p-5'>
            <form className='flex flex-col gap-5'>
                <div className='flex flex-col text-sm text-gray-500'>
                    <p>วันที่ส่ง: {data?.date}, {data?.time} น.</p>
                </div>
                <div className='flex gap-5'>
                    {data?.files.map((file, index) => (
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
                        <div className='mt-2 flex items-center rounded-xl border border-gray-300 p-2'>
                            <input
                                type="text"
                                className='w-full p-1 '
                                defaultValue={data?.header}
                            />
                        </div>
                    </div>
                    <div className='w-56'>
                        <label>Tags</label>
                        <div className='mt-2 flex rounded-xl border border-gray-300 p-2'>
                            <select
                                className='w-full p-1 appearance-none bg-white cursor-pointer'
                                value={data?.type}
                            >
                                <option value="0">-</option>
                                <option value="การบ้าน">การบ้าน</option>
                                <option value="เอกสารสำคัญ">เอกสารสำคัญ</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className=''>
                    <label>
                        รายละเอียด
                    </label>
                    <div className="mt-2 flex items-center rounded-xl border border-gray-300 p-2 ">
                        <textarea
                            placeholder="Enter your details"
                            className=" max-h-40 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow text-gray-700 w-full p-1 rounded-sm"
                            defaultValue={data?.detail}
                        />
                    </div>
                </div>
                {onReplyForm || onSentForm ? (
                    <div className={`mt-2 p-5 w-full h-full bg-gray-100 flex flex-col justify-center items-center rounded-xl shadow border-4 border-dotted`}>
                        <Icon path={mdiAccountCircle} size={1} className='text-gray-400' />
                        <h1 className='font-medium'>Click to upload</h1>
                        <p className='text-gray-400 text-sm'>Drag and drop files here</p>
                    </div>
                ) : null}
                <div className='flex justify-end gap-5 mt-10'>
                    {onReplyForm || onSentForm ? (
                        <>
                            <div
                                onClick={() => {
                                    setOnReplyForm(false)
                                    setOnReplyForm(false)
                                }}
                                className='cursor-pointer bg-gray-300 py-2 px-4 rounded-lg'
                            >ยกเลิก</div>
                            <div
                                className='cursor-pointer bg-gray-300 py-2 px-4 rounded-lg'
                            >ส่ง</div>
                        </>
                    ) : (
                        <>
                            <div
                                onClick={() => setOnSentForm(true)}
                                className='cursor-pointer bg-gray-300 py-2 px-4 rounded-lg'
                            >ส่งต่อ</div>
                            <div
                                onClick={() => setOnReplyForm(true)}
                                className='cursor-pointer bg-gray-300 py-2 px-4 rounded-lg'
                            >ตอบกลับ</div>
                        </>
                    )}
                </div>
            </form >

        </div >
    )
}

export default Reply
