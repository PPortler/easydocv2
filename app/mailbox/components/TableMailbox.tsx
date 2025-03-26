"use client"

import React from 'react'
import Icon from '@mdi/react';
import { mdiAccountCircle, mdiStar, mdiArrowLeftCircle } from '@mdi/js';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Reply from './Reply';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';


interface Column {
    id: 'user' | 'time' | 'files' | 'date' | 'detail';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}
const columns: readonly Column[] = [
    { id: 'user', label: 'อีเมล', minWidth: 170 },
    { id: 'files', label: 'ไฟล์', minWidth: 100 },
    { id: 'date', label: 'วันที่', minWidth: 170 },
    { id: 'time', label: 'เวลา', minWidth: 170 },
    { id: 'detail', label: 'รายละเอียด', minWidth: 170 },
];

interface Data {
    user: { email: string; description: string };
    files: string;
    time: string;
    date: string;
    detail: string;
}

interface MailBox {
    email: string;
    idSent: string;
    header: string;
    status: boolean;
    type: string;
    fromSent: [{
        email: string,
        time: string,
        date: string,
        files: [{ fileName: string, fileType: string, fileURL: string }],
        detail: string;
    }];
}

function createData(
    user: { email: string; description: string },
    files: string,
    date: string,
    time: string,
    detail: string
): Data {
    return { user, files, time, date, detail };
}

function TableMailbox({ email, setLoader, loader }: { email: string, setLoader: React.Dispatch<React.SetStateAction<String>>, loader: string }) {

    //get all sent
    const [allMailbox, setAllMailbox] = useState<MailBox[]>([]);

    useEffect(() => {
        if (email) {
            getMailBox(email)
        }
    }, [email])

    async function getMailBox(email: string) {
        setLoader("wait")
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/mailBox/${email}`);

            if (res.status === 200) {
                setAllMailbox(res.data);
                setLoader("pass")

            } else {
                console.log('Error get dataUser');
                setLoader("failed")
            }
        } catch (err) {
            console.log(err);
        }
    }

    const rows = allMailbox
        .map((mailBox) => {
            // เข้าถึงตัวแรกของ fromSent หรือเปลี่ยนเป็นตัวสุดท้ายได้
            const sentTemp = mailBox.fromSent[mailBox.fromSent.length - 1]; // หรือ mailBox.fromSent[mailBox.fromSent.length - 1]

            const fileNames = sentTemp?.files?.map(file => file.fileName).join(', ') || "N/A";

            return createData(
                { email: sentTemp?.email || "N/A", description: mailBox.header },
                fileNames,
                sentTemp?.date || "N/A",
                sentTemp?.time || "N/A",
                ""
            );
        }).reverse();


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

    //open detail
    const [onDetail, setOnDetail] = useState<MailBox | undefined>(undefined);

    return (
        loader === "failed" ? (
            <div className='flex justify-center'>
                <div className='bg-gray-200 py-2 px-4 rounded-xl text-black w-fit'>
                    ไม่มีข้อความที่ถูกส่งมา!
                </div>
            </div>
        ) : (
            onDetail ? (
                <div>
                    <div onClick={() => setOnDetail(undefined)} className='flex gap-3 cursor-pointer'>
                        <Icon path={mdiArrowLeftCircle} size={1} />
                        <p className='text-gray-500'>
                            ข้อความจาก: {onDetail.fromSent[onDetail?.fromSent?.length - 1]?.email}
                        </p>
                    </div>
                    <Reply data={onDetail} emailSession={email} />
                </div>
            ) : (
                <div>
                    <div className='mb-5 flex gap-3 justify-end text-gray-600 text-xs'>
                        <div className='flex gap-2 items-center'>
                            <div className='w-3 h-3 rounded-full bg-green-300'></div>
                            <p className=''>ได้รับการตอบกลับแล้ว</p>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <div className='w-3 h-3 rounded-full bg-red-500'></div>
                            <p className=''>ข้อความที่ยังไม่ได้ตอบกลับ</p>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <div className='w-3 h-3 rounded-full bg-yellow-500'></div>
                            <p className=''>ข้อความที่ถูกส่งต่อมา</p>
                        </div>
                    </div>
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
                                    {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => {
                                        const reverseIndex = rows.length - 1 - (page * rowsPerPage + rowIndex);
                                        return (
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
                                                                    <div>
                                                                        <p className='font-bold text-md'>{teacher.description}</p>
                                                                        <p className="text-gray-400 text-xs">{teacher.email}</p>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                        );
                                                    }

                                                    // แสดงค่า status
                                                    if (column.id === 'time' && typeof value === 'string') {
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                <div className="flex justify-center items-center">
                                                                    {value} น.
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
                                                                        <h1>{value.join(', ')}</h1> {/* แสดงชื่อไฟล์ที่แปลงเป็นสตริง */}
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                        );
                                                    }

                                                    // แสดงค่า detail และตั้งค่าฟังก์ชัน onClick
                                                    if (column.id === 'detail' && typeof value === 'string') {
                                                        return (
                                                            <TableCell key={column.id} align={column.align} className='relative'>
                                                                <div
                                                                    className='cursor-pointer flex justify-center items-center'
                                                                    onClick={() => setOnDetail(allMailbox[reverseIndex])}
                                                                >
                                                                    <div className="py-1 px-3 rounded-md bg-[#FFF0BB]">
                                                                        <Icon path={mdiStar} size={1} className="text-[#FFAC33]" />
                                                                    </div>
                                                                </div>
                                                                {!allMailbox[reverseIndex]?.status ? (
                                                                    allMailbox[reverseIndex].fromSent?.length > 1 ? (
                                                                        <div className='w-3 h-3 rounded-full bg-yellow-400 absolute top-0 right-0 m-4'></div>
                                                                    ) : (
                                                                        <div className='w-3 h-3 rounded-full bg-red-500 absolute top-0 right-0 m-4'></div>
                                                                    )
                                                                ) : (
                                                                    <div className='w-3 h-3 rounded-full bg-green-300 absolute top-0 right-0 m-4'></div>
                                                                )}
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
                                        )
                                    })}
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
                    </Paper >

                </div>
            )
        )
    )


}

export default TableMailbox
