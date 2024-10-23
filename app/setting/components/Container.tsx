"use client"

import React from 'react'
import Image from 'next/image'
import Icon from '@mdi/react';
import { mdiPencilOutline } from '@mdi/js';
import { useState, useEffect } from 'react';
import axios from 'axios';
import PulseLoader from "react-spinners/PulseLoader";

interface dataUser {
    firstName: string;
    lastName: string;
    email: string;
    profile: string;
    phoneNumber: string;
}

function Container({ idUser }: { idUser: string }) {

    const [isHoverProfile, setIsHoverProfile] = useState<boolean>(false);

    const [loader, setLoader] = useState<boolean>(true);

    //get dataUser
    const [dataUser, setDataUser] = useState<dataUser>()

    useEffect(() => {
        if (idUser) {
            getDataUser(idUser);
        } else {
            return;
        }

    }, [idUser])

    async function getDataUser(id: string) {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/users/${id}`);

            if (res.status === 200) {
                setDataUser(res.data.dataUser)
            } else {
                console.log('Error get dataUser');
            }
        } catch (err) {
            console.log(err);
        }
    }

    console.log(dataUser);
    return (
        <div className='w-full relative'>
            {dataUser ? (
                <div className='flex flex-col gap-5'>
                    <div className='border p-5 rounded-xl flex justify-between'>
                        <div className='flex items-center gap-3'>
                            <div
                                className='border rounded-full relative cursor-pointer transition-all'
                                onMouseEnter={() => setIsHoverProfile(true)}
                                onMouseLeave={() => setIsHoverProfile(false)}
                            >
                                <Image
                                    src={`${dataUser.profile || "/image/profile.png"} `}
                                    height={1000}
                                    width={1000}
                                    priority alt="profil"
                                    className='w-20 h-20'
                                />
                                <div
                                    className={`${isHoverProfile ? " opacity-50" : "opacity-0 "} bg-black transition-all duration-100  absolute top-0 w-20 h-20 rounded-full flex justify-center items-center  `}
                                >
                                </div>
                                <div className={`${isHoverProfile ? "" : "opacity-0"} transition-all duration-100 absolute top-0 w-20 h-20 rounded-full flex justify-center items-center text-white`}>
                                    <p>แก้ไข</p>
                                </div>

                            </div>
                            <div>
                                <input type='text'
                                    value={`${dataUser.firstName + " " + dataUser.lastName}`}
                                    className='font-medium text-md'
                                />
                            </div>
                        </div>
                        <button className='font-medium border rounded-lg flex items-center text-gray-400 py-1 px-3 gap-2 self-start'>
                            <Icon path={mdiPencilOutline} size={.8} />
                            <p>แก้ไข</p>
                        </button>
                    </div>
                    <div className='text-gray-400 border p-5 rounded-xl flex justify-between'>
                        <div className=''>
                            <h1 className='font-bold text-[#5955B3]'>ข้อมูลส่วนบุคคล</h1>
                            <div className='mt-5 grid grid-cols-2 gap-x-20 gap-y-5'>
                                <div className='flex flex-col gap-1'>
                                    <label className='font-medium'>ชื่อ:</label>
                                    <input
                                        className='font-bold'
                                        type="text"
                                        value={`${dataUser.firstName}`}
                                    />
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label className='font-medium'>นามสกุล:</label>
                                    <input
                                        className='font-bold'
                                        type="text"
                                        value={`${dataUser.lastName}`}
                                    />                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label className='font-medium'>อีเมล:</label>
                                    <input
                                        className='font-bold'
                                        type="text"
                                        value={`${dataUser.email}`}
                                    />                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label className='font-medium'>เบอร์โทรศัพท์:</label>
                                    <input
                                        className='font-bold'
                                        type="text"
                                        value={`${dataUser.phoneNumber}`}
                                    />                                </div>
                            </div>
                        </div>
                        <button className='font-medium border rounded-lg flex items-center text-gray-400 py-1 px-3 gap-2 self-start'>
                            <Icon path={mdiPencilOutline} size={.8} />
                            <p>Edit</p>
                        </button>
                    </div>
                </div>
            ) : (
            <div className='w-full h-full absolute top-0 left-0 flex justify-center items-center opacity-50'>
                <PulseLoader
                    size={10}
                    aria-label="Loading Spinner"
                    color={`#5955B3`}
                    className='z-10' 
                    speedMultiplier={1}
                />
            </div>
            )}
        </div >
    )
}

export default Container
