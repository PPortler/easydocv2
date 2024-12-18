"use client"

import React, { useRef } from 'react';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '@/app/firebaseConfig';
import axios from 'axios';
import Swal from 'sweetalert2'
import { useState } from 'react';

const AddFile = ({ setLoader }: { setLoader: React.Dispatch<React.SetStateAction<boolean>> }) => {

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [fileName, setFileName] = useState<String>('');
    // ฟังก์ชันเปิด file dialog
    const handleClick = () => {
        Swal.fire({
            title: "โปรดระบุชื่อไฟล์",
            input: "text",
            inputAttributes: {
                autocapitalize: "off"
            },
            showCancelButton: true,
            confirmButtonText: "ยืนยัน",
            showLoaderOnConfirm: true,
            preConfirm: (inputFileName) => {
                if (!inputFileName) {
                    Swal.showValidationMessage('กรุณาระบุชื่อไฟล์');
                    return false;
                }
                return inputFileName;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                setFileName(result.value)
                if (fileInputRef.current) {
                    fileInputRef.current.click();
                    Swal.close();
                }
            }
        });
        
    };

    // ฟังก์ชันจัดการไฟล์อัปโหลด
    const handleFileUpload = async () => {
        setLoader(true);
        const file = fileInputRef.current?.files?.[0];
        if (file) {
            // แยกสกุลไฟล์
            const fileType = file.name.split('.').pop();

            const storageRef = ref(storage, `Systems/DefaultFile/${file.name}`); // ระบุ path ใน storage
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    // สถานะการอัปโหลด
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    // จัดการ error
                    console.error('Upload failed:', error);
                    setLoader(false);
                },
                async () => {
                    // อัปโหลดเสร็จสมบูรณ์
                    try {
                        const fileURL = await getDownloadURL(uploadTask.snapshot.ref);

                        // ส่งข้อมูลไปยัง API
                        if (fileURL) {
                            const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/systems/defaultfile`, {
                                fileName, fileType, fileURL
                            });

                            if (res.status === 200 || res.status === 201) {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'สำเร็จ',
                                    text: `อัพโหลดไฟล์ ${fileName} สำเร็จ`,
                                }).then(() => {
                                    setLoader(false);
                                    window.location.reload();
                                });
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'เกิดข้อผิดพลาด',
                                    text: `กรุณาลองใหม่ในภายหลัง`,
                                }).then(() => {
                                    setLoader(false);
                                    window.location.reload();
                                });
                            }

                            console.log('File data uploaded to server:', res.data);
                        }
                    } catch (err) {
                        setLoader(false);
                        console.error('Error uploading file or sending data to server:', err);
                    }
                }
            );
        }
    };

    return (
        <div
            className='bg-[#5955B3] text-white px-2 py-1 rounded-lg cursor-pointer '
            onClick={handleClick}
        >
            <Icon path={mdiPlus} size={.9} className='' />
            <input
                ref={fileInputRef}
                id='upload'
                type="file"
                hidden
                onChange={handleFileUpload}  // เรียก handleFileUpload เมื่อเลือกไฟล์
            />
        </div>

    );
}

export default AddFile;
