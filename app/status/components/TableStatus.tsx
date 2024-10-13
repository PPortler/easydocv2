"use client"

import React from 'react'
import Icon from '@mdi/react';
import { mdiAccountCircle, mdiStar, mdiArrowLeftCircle } from '@mdi/js';
import { useState } from 'react';
import Timeline from './Timeline';

function TableStatus() {

    const [timeLine, setTimeLine] = useState<String>();
    return (

        timeLine ? (
            <div>
                <div onClick={() => setTimeLine('')} className='flex gap-3 cursor-pointer'>
                    <Icon path={mdiArrowLeftCircle} size={1} />
                    <p className='text-gray-500'>status: sent to teacher somchai</p>
                </div>
                <div className='mt-3'>
                    <Timeline />
                </div>
                <div className='flex justify-start mt-5'>
                    <div className='flex flex-col gap-2'>
                        <div className='flex gap-3 items-center'>
                            <div
                                className='w-5 h-5 bg-green-700 rounded-full shadow'
                            >
                            </div>
                            <p>Success</p>
                        </div>
                        <div className='flex gap-3 items-center'>
                            <div
                                className='w-5 h-5 bg-gray-400 rounded-full shadow'
                            >
                            </div>
                            <p>Wait</p>
                        </div>
                        <div className='flex gap-3 items-center'>
                            <div
                                className='w-5 h-5 bg-red-500 rounded-full shadow'
                            >
                            </div>
                            <p>Failed</p>
                        </div>
                      
                    </div>
                </div>
            </div>
        ) : (
            <table className=" w-full table-fixed">
                <thead className="">
                    <tr className='border-b-2 border-gray-400'>
                        <th className="p-3">
                            <div className="">
                                <p>Teacher</p>
                            </div >
                        </th >
                        <th className="">Status</th>
                        <th className="">Files</th>
                        <th className="">Date</th>
                        <th className="">Detail</th>
                    </tr >
                </thead >
                <tbody>
                    <tr className=' border-b-2 border-gray-400'>
                        <td className="p-3">
                            <div className="flex gap-2 items-center ">
                                <Icon path={mdiAccountCircle} size={2.5} />
                                <div className=' '>
                                    <h1>Teacher1</h1>
                                    <p className="text-gray-400 ">I neglected to mention that</p>
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
                        <td onClick={() => setTimeLine('test')} className="cursor-pointer">
                            <div className='flex justify-center items-center'>
                                <div className="py-1 px-3 rounded-md bg-[#FFF0BB]">
                                    <Icon path={mdiStar} size={1} className="text-[#FFAC33]" />
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr className='border-b-2 border-gray-400'>
                        <td className="p-3">
                            <div className="flex gap-2 items-center ">
                                <Icon path={mdiAccountCircle} size={2.5} />
                                <div className=' '>
                                    <h1>Teacher1</h1>
                                    <p className="text-gray-400 ">I neglected to mention that</p>
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
            </table >
        )

    )
}

export default TableStatus
