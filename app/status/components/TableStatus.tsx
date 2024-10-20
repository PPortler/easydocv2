"use client"

import React from 'react'
import Icon from '@mdi/react';
import { mdiAccountCircle, mdiStar, mdiArrowLeftCircle } from '@mdi/js';
import { useState, useEffect } from 'react';
import Timeline from './Timeline';
import axios from 'axios';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

interface Column {
    id: 'user' | 'status' | 'files' | 'date' | 'detail';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}
const columns: readonly Column[] = [
    { id: 'user', label: 'User', minWidth: 170 },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'files', label: 'Files', minWidth: 170 },
    { id: 'date', label: 'Date', minWidth: 170 },
    { id: 'detail', label: 'Detail', minWidth: 170 },
];

interface Data {
    user: { email: string; description: string },
    status: string;
    files: string,  
    date: string;
    detail: string;
}

interface Sents {
    files: [{ fileName: string, fileType: string, fileURL: string }];
    email: string;
    header: string;
    detail: string;
    from: [string];
}

function createData(
    user: { email: string; description: string },
    status: string,
    files: string, 
    date: string,
    detail: string
): Data {
    return { user, status, files, date, detail };
}


function TableStatus({ email }: { email: string }) {

    //get all sent
    const [allSent, setAllsent] = useState<Sents[]>([]);

    useEffect(() => {
        if (email) {
            getSents(email)
        }
    }, [email])

    console.log(allSent);
    async function getSents(email: string) {

        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/sent/status/${email}`);

            if (res.status === 200) {
                setAllsent(res.data);
            } else {
                console.log('Error get dataUser');
            }
        } catch (err) {
            console.log(err);
        }
    }

    const rows = allSent.map((sent) => {
        // ตรวจสอบว่า sent.files เป็นอาร์เรย์
        const fileNames: string[] = Array.isArray(sent.files) 
            ? sent.files.map(file => file.fileName) // เก็บชื่อไฟล์ในอาร์เรย์
            : []; // ใช้อาร์เรย์ว่างถ้าไม่ใช่อาร์เรย์
    
        return createData(
            { email: sent.email, description: sent.header },
            'Agreen',
            fileNames.join(', '), // เข้าร่วมชื่อไฟล์เป็น string
            "17/06/2024",
            ""
        );
    });


    const [timeLine, setTimeLine] = useState<String>();

    //table
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

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
            <div className=''>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 440 }} >
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align="center"
                                            style={{ minWidth: column.minWidth }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                        {columns.map((column) => {
                                            const value = row[column.id as keyof Data];

                                            if (column.id === 'user' && typeof value === 'object' && value !== null) {
                                                const teacher = value as { email: string; description: string };
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        <div className="flex gap-2 items-center">
                                                            <Icon path={mdiAccountCircle} size={2.5} />
                                                            <div>
                                                                <h1>{teacher.email}</h1>
                                                                <p className="text-gray-400">{teacher.description}</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                );
                                            }

                                            if (column.id === 'status' && typeof value === 'string') {
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        <div className="  flex justify-center items-center ">
                                                            <div className='py-1 px-4 rounded-2xl bg-[#D4F8D3]'>
                                                                <h1>{value}</h1>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                );
                                            }

                                            if (column.id === 'files' && typeof value === 'string') {
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        <div className="  flex justify-center items-center">
                                                            <div className='py-1 px-4 rounded-2xl flex text-center'>
                                                                <h1>{value}</h1>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                );
                                            }

                                            if (column.id === 'detail' && typeof value === 'string') {
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        <div onClick={() => setTimeLine('test')} className='cursor-pointer flex justify-center items-center'>
                                                            <div className="py-1 px-3 rounded-md bg-[#FFF0BB]">
                                                                <Icon path={mdiStar} size={1} className="text-[#FFAC33]" />
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                );
                                            }

                                            return (
                                                <TableCell key={column.id} align='center'>
                                                    {typeof value === 'string' ? value : ''}
                                                </TableCell>
                                            );
                                        })}

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </div>
        )

    )
}

export default TableStatus
