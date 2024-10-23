"use client"

import React from 'react'
import Navbar2 from '../component/myfile/Navbar2'
import Navbar from '../component/myfile/Navbar'
import { useState } from 'react'
import Loader from '../component/Loader'
import Icon from '@mdi/react';
import { mdiAccountCircle } from '@mdi/js';

function Schedule() {

    const [loader, setLoader] = useState<boolean>(false);
    return (
        <div className="p-5 flex">
            <Navbar status="schedule"/>
            <div className="bg-white rounded-3xl p-10 min-h-screen w-full">
                <Navbar2 title="กำหนดการ" />
                <div className='flex flex-col gap-5 items-center mt-10'>
                   
                </div>

            </div>
            {loader && (
                <div>
                    <Loader />
                </div>
            )}
        </div>
    )
}

export default Schedule
