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
    { id: 'user', label: 'User', minWidth: 170 },
    { id: 'files', label: 'Files', minWidth: 100 },
    { id: 'date', label: 'Date', minWidth: 170 },
    { id: 'time', label: 'Time', minWidth: 170 },
    { id: 'detail', label: 'Detail', minWidth: 170 },
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
    files: [{ fileName: string, fileType: string, fileURL: string }];
    header: string;
    detail: string;
    date: string;
    type: string;
    time: string;
    from: string;
    status: boolean;
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


function TableMailbox({ email }: { email: string }) {

    //get all sent
    const [allMailbox, setAllMailbox] = useState<MailBox[]>([]);

    useEffect(() => {
        if (email) {
            getMailBox(email)
        }
    }, [email])

    async function getMailBox(email: string) {

        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/mailBox/${email}`);

            if (res.status === 200) {
                setAllMailbox(res.data);
            } else {
                console.log('Error get dataUser');
            }
        } catch (err) {
            console.log(err);
        }
    }

    const rows = allMailbox.map((mailBox) => {

        // ตรวจสอบว่า sent.files เป็นอาร์เรย์
        const fileNames: string[] = Array.isArray(mailBox.files)
            ? mailBox.files.map(file => file.fileName + "." + file.fileType) // เก็บชื่อไฟล์ในอาร์เรย์
            : []; // ใช้อาร์เรย์ว่างถ้าไม่ใช่อาร์เรย์

        return createData(
            { email: mailBox.from, description: mailBox.header },
            fileNames.join(', '),
            mailBox.date,
            mailBox.time,
            ""
        );
    });

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
        allMailbox.length > 0 ? (
            onDetail ? (
                <div>
                    <div onClick={() => setOnDetail(undefined)} className='flex gap-3 cursor-pointer'>
                        <Icon path={mdiArrowLeftCircle} size={1} />
                        <p className='text-gray-500'>ข้อความจาก: {onDetail.from}</p>
                    </div>
                    <Reply data={onDetail} />
                </div>
            ) : (
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
                                                            <div>
                                                                <h1>{teacher.email}</h1>
                                                                <p className="text-gray-400">{teacher.description}</p>
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
                                                    <TableCell key={column.id} align={column.align}>
                                                        <div
                                                            className='cursor-pointer flex justify-center items-center'
                                                            onClick={() => setOnDetail(allMailbox[rowIndex])}
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
                </Paper >
            )
        ) : (
            <div className='flex justify-center'>
                <div className='bg-gray-200 py-2 px-4 rounded-xl text-black w-fit'>
                    ไม่มีข้อความที่ถูกส่งมา!
                </div>
            </div>
        )
    )


}

export default TableMailbox
