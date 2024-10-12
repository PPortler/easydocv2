"use client"

import React from 'react'
import Navbar2 from '../component/myfile/Navbar2'
import Navbar from '../component/myfile/Navbar'
import { useState } from 'react'
import Loader from '../component/Loader'
import Icon from '@mdi/react';
import { mdiAccountCircle, mdiStar } from '@mdi/js';
import TableStatus from './components/TableStatus'

function Status() {

    const [loader, setLoader] = useState<boolean>(false);
    return (
        <div className="p-5 flex">
            <Navbar status="status" />
            <div className="bg-white rounded-3xl p-10 min-h-screen w-full">
                <Navbar2 title="Status" />
                <div className='mt-10'>
                    <TableStatus />
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

export default Status
