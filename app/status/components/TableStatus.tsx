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
    { id: 'user', label: 'อีเมล', minWidth: 170 },
    { id: 'status', label: 'สถานะ', minWidth: 100 },
    { id: 'files', label: 'ไฟล์', minWidth: 170 },
    { id: 'date', label: 'วันที่ส่ง', minWidth: 170 },
    { id: 'detail', label: 'รายละเอียด', minWidth: 170 },
];

interface Data {
    user: { description: string; email: string; },
    status: string;
    files: string,
    date: string;
    detail: string;
}

interface Sents {
    files: [{ fileName: string, fileType: string, fileURL: string }];
    email: string;
    header: string;
    status: string;
    fromSent: [{
        email: string,
        time: string,
        date: string,
        files: [{ fileName: string, fileType: string, fileURL: string }],
        detail: string;
    }];
}

function createData(
    user: { description: string; email: string; },
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

        const matchedSent = sent.fromSent.find((from) => from.email === email);

        const fileNames = matchedSent?.files?.map(file => file.fileName).join(', ') || "N/A";

        return createData(
            { description: sent.header, email: sent.email },
            sent.status,
            fileNames,
            matchedSent?.date || "N/A",
            ""
        );
    });


    const [timeLine, setTimeLine] = useState<Sents | undefined>(undefined);

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
                <div onClick={() => setTimeLine(undefined)} className='flex gap-3 cursor-pointer'>
                    <Icon path={mdiArrowLeftCircle} size={1} />
                    <p className='text-gray-500'>ส่งถึง: {timeLine.email}</p>
                </div>
                <div className='mt-10'>
                    <Timeline timeLine={timeLine} />
                </div>
                <div className='flex justify-start mt-5'>
                    <div className='flex flex-col gap-2'>
                        <div className='flex gap-3 items-center'>
                            <div
                                className='w-5 h-5 bg-green-700 rounded-full shadow'
                            >
                            </div>
                            <p>ตอบกลับแล้ว</p>
                        </div>
                        <div className='flex gap-3 items-center'>
                            <div
                                className='w-5 h-5 bg-gray-400 rounded-full shadow'
                            >
                            </div>
                            <p>รอการตอบกลับ</p>
                        </div>
                        <div className='flex gap-3 items-center'>
                            <div
                                className='w-5 h-5 bg-red-500 rounded-full shadow'
                            >
                            </div>
                            <p>ล้มเหลว</p>
                        </div>

                    </div>
                </div>
            </div>
        ) : (
            <div className=''>
                {allSent.length > 0 ? (
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
                                    {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
                                            {columns.map((column) => {
                                                const value = row[column.id as keyof Data];

                                                // แสดงค่า user
                                                if (column.id === 'user' && typeof value === 'object' && value !== null) {
                                                    const teacher = value as { email: string; description: string };
                                                    return (
                                                        <TableCell key={column.id} align={column.align}>
                                                            <div className="flex gap-2 items-center">
                                                                <Icon path={mdiAccountCircle} size={2.5} />
                                                                <div className='flex flex-col'>
                                                                    <p className='font-bold text-md'>{teacher.description}</p>
                                                                    <p className="text-gray-400 text-xs">{teacher.email}</p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                    );
                                                }

                                                // แสดงค่า status
                                                if (column.id === 'status' && typeof value === 'string') {
                                                    return (
                                                        <TableCell key={column.id} align={column.align}>
                                                            <div className="flex justify-center items-center">
                                                                {value === "validate" || value === "wait" ? (
                                                                    <div className='py-1 px-4 rounded-2xl bg-gray-200'>
                                                                        <h1 className='text-ellipsis whitespace-nowrap ove'>รอการตอบกลับ</h1>
                                                                    </div>
                                                                ) : (value === "faild") ? (
                                                                    <div className='py-1 px-4 rounded-2xl bg-red-400'>
                                                                        <h1 className='text-ellipsis whitespace-nowrap ove'>ล้มเหลว</h1>
                                                                    </div>
                                                                ) : (
                                                                    <div className='py-1 px-4 rounded-2xl bg-[#D4F8D3]'>
                                                                        <h1 className='text-ellipsis whitespace-nowrap ove'>สำเร็จ</h1>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                    );
                                                }

                                                // แสดงค่า files
                                                if (column.id === 'files' && Array.isArray(value)) {
                                                    return (
                                                        <TableCell key={column.id} align={column.align}>
                                                            <div className="flex justify-center items-center">
                                                                <div className='py-1 px-4 rounded-2xl flex text-center'>
                                                                    {value.map((f) => (
                                                                        <h1>{value}</h1>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                    );
                                                }

                                                // แสดงค่า detail และตั้งค่าฟังก์ชัน onClick
                                                if (column.id === 'detail' && typeof value === 'string') {
                                                    return (
                                                        <TableCell key={column.id} align={column.align}>
                                                            <div
                                                                onClick={() => setTimeLine(allSent[rowIndex])}
                                                                className='cursor-pointer flex justify-center items-center'
                                                            >
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
                ) : (
                    <div className='flex justify-center'>
                        <div className='bg-gray-200 py-2 px-4 rounded-xl text-black w-fit'>
                            ยังไม่มีไฟล์ที่ถูกส่ง!
                        </div>
                    </div>
                )}
            </div>
        )

    )
}

export default TableStatus
