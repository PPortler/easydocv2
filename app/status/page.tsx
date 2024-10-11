"use client"

import React from 'react'
import Navbar2 from '../component/myfile/Navbar2'
import Navbar from '../component/myfile/Navbar'
import { useState } from 'react'
import Loader from '../component/Loader'
import Icon from '@mdi/react';
import { mdiAccountCircle, mdiStar } from '@mdi/js';

function Status() {

    const [loader, setLoader] = useState<boolean>(false);
    return (
        <div className="p-5 flex">
            <Navbar status="status" />
            <div className="bg-white rounded-3xl p-10 min-h-screen w-full">
                <Navbar2 title="Status" />
                <div className='mt-10'>
                    <table className=" w-full table-fixed">
                        <thead className="">
                            <tr className='border-b-2 border-gray-400'>
                                <th className="p-3">
                                    <div className="flex gap-5 items-center">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded-xl border border-gray-300"
                                        />
                                        <p>Teacher</p>
                                    </div>
                                </th>
                                <th className="">Status</th>
                                <th className="">Files</th>
                                <th className="">Date</th>
                                <th className="">Detail</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className='border-b-2 border-gray-400'>
                                <td className="p-3  ">
                                    <div className="flex gap-5 items-center ">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 flex-shrink-0 rounded-xl border border-gray-300"
                                        />
                                        <div className="flex gap-2 items-center ">
                                            <Icon path={mdiAccountCircle} size={2.5} />
                                            <div className=' '>
                                                <h1>Teacher1</h1>
                                                <p className="text-gray-400 ">I neglected to mention that</p>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="">
                                    <div className="  flex justify-center items-center">
                                        <div className='py-1 px-4 rounded-2xl bg-[#D4F8D3]'>
                                            <h1>Agree</h1>
                                        </div>
                                    </div>
                                </td>
                                <td className="">
                                    <div className='text-center'>
                                        <p>Document 1</p>
                                    </div>
                                </td>
                                <td className="">
                                    <div className='text-center'>
                                        <p>17/06/2024</p>
                                    </div>
                                </td>
                                <td className="">
                                    <div className='flex justify-center items-center'>
                                        <div className="py-1 px-3 rounded-md bg-[#FFF0BB]">
                                            <Icon path={mdiStar} size={1} className="text-[#FFAC33]" />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr className='border-b-2 border-gray-400'>
                                <td className="p-3  ">
                                    <div className="flex gap-5 items-center ">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 flex-shrink-0 rounded-xl border border-gray-300"
                                        />
                                        <div className="flex gap-2 items-center ">
                                            <Icon path={mdiAccountCircle} size={2.5} />
                                            <div className=' '>
                                                <h1>Teacher1</h1>
                                                <p className="text-gray-400 ">I neglected to mention that</p>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="">
                                    <div className="  flex justify-center items-center">
                                        <div className='py-1 px-4 rounded-2xl bg-[#D4F8D3]'>
                                            <h1>Agree</h1>
                                        </div>
                                    </div>
                                </td>
                                <td className="">
                                    <div className='text-center'>
                                        <p>Document 1</p>
                                    </div>
                                </td>
                                <td className="">
                                    <div className='text-center'>
                                        <p>17/06/2024</p>
                                    </div>
                                </td>
                                <td className="">
                                    <div className='flex justify-center items-center'>
                                        <div className="py-1 px-3 rounded-md bg-[#FFF0BB]">
                                            <Icon path={mdiStar} size={1} className="text-[#FFAC33]" />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr className='border-b-2 border-gray-400'>
                                <td className="p-3  ">
                                    <div className="flex gap-5 items-center ">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 flex-shrink-0 rounded-xl border border-gray-300"
                                        />
                                        <div className="flex gap-2 items-center ">
                                            <Icon path={mdiAccountCircle} size={2.5} />
                                            <div className=' '>
                                                <h1>Teacher1</h1>
                                                <p className="text-gray-400 ">I neglected to mention that</p>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="">
                                    <div className="  flex justify-center items-center">
                                        <div className='py-1 px-4 rounded-2xl bg-[#D4F8D3]'>
                                            <h1>Agree</h1>
                                        </div>
                                    </div>
                                </td>
                                <td className="">
                                    <div className='text-center'>
                                        <p>Document 1</p>
                                    </div>
                                </td>
                                <td className="">
                                    <div className='text-center'>
                                        <p>17/06/2024</p>
                                    </div>
                                </td>
                                <td className="">
                                    <div className='flex justify-center items-center'>
                                        <div className="py-1 px-3 rounded-md bg-[#FFF0BB]">
                                            <Icon path={mdiStar} size={1} className="text-[#FFAC33]" />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

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
