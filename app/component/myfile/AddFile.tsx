"use client"

import React, { useRef } from 'react';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '@/app/firebaseConfig';
import axios from 'axios';
import Swal from 'sweetalert2'
import Loader from '../Loader';
import { useState } from 'react';

  const AddFile = ({ email, id }:{email:String, id:String}) => {

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [loader, setLoader] = useState<boolean>(false);

    // ฟังก์ชันเปิด file dialog
    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // ฟังก์ชันจัดการไฟล์อัปโหลด
    const handleFileUpload = async () => {
        setLoader(true);
        const file = fileInputRef.current?.files?.[0];
        if (file) {
            // แยกชื่อไฟล์และสกุลไฟล์
            const fileName = file.name.substring(0, file.name.lastIndexOf('.')); 
            const fileType = file.name.split('.').pop(); 

            const storageRef = ref(storage, `Users/Files/${email}/${file.name}`); // ระบุ path ใน storage
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
                            const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/upload/${id}`, {
                                fileName: fileName,
                                fileType: fileType,
                                fileURL: fileURL
                            });

                            if(res.status === 200 || res.status === 201){
                                Swal.fire({
                                    icon: 'success',
                                    title: 'สำเร็จ',
                                    text: `อัพโหลดไฟล์ ${fileName} สำเร็จ` ,
                                }).then(() => {
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
            className='cursor-pointer bg-[#5955B3] p-2 rounded-xl fixed right-0 bottom-0 m-10 text-white'
            onClick={handleClick}
        >
            <Icon path={mdiPlus} size={1.5} />
            <input
                ref={fileInputRef}
                id='upload'
                type="file"
                hidden
                onChange={handleFileUpload}  // เรียก handleFileUpload เมื่อเลือกไฟล์
            />
            {loader && (
                <div>
                    <Loader/>
                </div>
            )}
        </div>
    );
}

export default AddFile;
