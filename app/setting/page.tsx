"use client"

import React from 'react'
import Navbar2 from '../component/myfile/Navbar2'
import Navbar from '../component/myfile/Navbar'
import { useState } from 'react'
import Loader from '../component/Loader'
import Icon from '@mdi/react';
import { mdiAccountCircle } from '@mdi/js';
import NavbarSetting from './components/NavbarSetting'
import Container from './components/Container'

function Setting() {

    const [loader, setLoader] = useState<boolean>(false);
    return (
        <div className="p-5 flex">
            <Navbar status="setting" />
            <div className="bg-white rounded-3xl p-10 min-h-screen w-full">
                <Navbar2 title="Setting" />
                <div className='mt-10 flex gap-10'>
                    <NavbarSetting />
                    <Container title={`My Profile`}/>
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

export default Setting
