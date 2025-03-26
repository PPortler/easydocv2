"use client"

import React, { useState } from 'react'
import Icon from '@mdi/react';
import { mdiAccountEye, mdiAccountEdit, mdiMagnify, mdiDeleteForever } from '@mdi/js';

//table
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { User } from "@/app/types/useTypes";


interface TablePageProps {
    dataUser: User[];
    id: string | undefined;
}

interface Column {
    id: 'name' | 'role' | 'email' | 'createOn' | 'id';
    label: string;
    minWidth?: number;
    align?: 'center' | 'left' | 'right';
    format?: (value: number) => string;
}

const TablePage: React.FC<TablePageProps> = ({ dataUser, id }) => {


    const columns: readonly Column[] = [
        { id: 'name', align: 'left', label: 'ชื่อ-นามสกุล', minWidth: 170 },
        { id: 'role', align: 'center', label: 'ประเภทผู้ใช้', minWidth: 100 },
        {
            id: 'email',
            label: 'อีเมล์',
            minWidth: 170,
            align: 'center',
            format: (value: number) => value.toLocaleString('en-US'),
        },
        {
            id: 'createOn',
            label: 'วันที่สร้าง',
            minWidth: 170,
            align: 'center',
            format: (value: number) => value.toLocaleString('en-US'),
        },
        {
            id: 'id',
            label: 'รายละเอียด',
            minWidth: 170,
            align: 'center',
            format: (value: number) => value.toFixed(2),
        },
    ];

    interface Data {
        name: string;
        role: string;
        email: string;
        createOn: string;
        id: string;
    }

    function createData(
        name: string,
        role: string,
        email: string,
        createOn: string,
        id: string,
    ): Data {
        return { name, role, email, createOn, id };
    }

    // สร้าง state สำหรับ input และ select
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<string>('0'); // 0 สำหรับ 'ทั้งหมด'

    // ฟังก์ชันที่ใช้ในการกรองข้อมูล
    const filteredRows = dataUser
        ?.filter((user) => user?._id !== id) // กรอง user ที่ _id ตรงกับ id
        .filter((user) => {
            // กรองตามชื่อ-นามสกุล
            const name = `${user?.firstName} ${user?.lastName}`;
            return name.toLowerCase().includes(searchTerm.toLowerCase());
        })
        .filter((user) => {
            // กรองตามประเภทที่เลือก
            if (selectedRole === '0') return true; // 'ทั้งหมด'
            return user?.role === selectedRole;
        })
        .map((user) => {
            const name = `${user?.firstName} ${user?.lastName}`;
            const createOn = user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString('th-TH') + ' ' + new Date(user.createdAt).toLocaleTimeString('th-TH')
                : '';
            const id = user?._id;
            return createData(name, user?.role, user?.email, createOn, id);
        }) || [];

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
        <div className=''>
            <form className='flex gap-3 justify-end items-center'>
                {/* ฟอร์มค้นหา */}
                <div className='flex flex-col gap-1'>
                    <label>ค้นหา</label>
                    <input
                        type="text"
                        className='px-2 h-7 rounded-lg border-black border w-56'
                        placeholder='ชื่อ-นามสกุล'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // อัปเดตค่า searchTerm
                    />
                </div>

                {/* ฟอร์มเลือกประเภท */}
                <div className='flex flex-col gap-1'>
                    <label>เลือกประเภท</label>
                    <div>
                        <select
                            className='border-black px-2 h-7 rounded-lg  border w-40'
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)} // อัปเดตค่า selectedRole
                        >
                            <option value="0">ทั้งหมด</option>
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                        </select>
                    </div>
                </div>

                {/* ปุ่มค้นหา
                <div className='self-end'>
                    <button type='submit' className='px-4 h-7 text-white bg-[#5955b3] rounded-lg flex gap-2 items-center'>
                        <Icon path={mdiMagnify} size={.7} />
                        <p>ค้นหา</p>
                    </button>
                </div> */}
            </form>

            <hr className='border-black my-2 mt-5' />
            <div className='mt-5'>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 1200 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column, index) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align || 'center'}
                                            style={{ minWidth: column.minWidth }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredRows
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, rowIndex) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={`${row.id}-${rowIndex}`}>
                                                {columns.map((column, colIndex) => {
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell key={`${row.id}-${column.id}-${colIndex}`} align={column.align || "center"}>
                                                            {column.id === "id" ? (
                                                                <div className="flex gap-1 text-white justify-center">
                                                                    {/* View Icon */}
                                                                    <div className="py-1 px-3 border rounded-lg bg-blue-400 cursor-pointer">
                                                                        <Icon path={mdiAccountEye} size={0.7} />
                                                                    </div>

                                                                    {/* Edit Icon */}
                                                                    <div className="py-1 px-3 border rounded-lg bg-yellow-400 cursor-pointer">
                                                                        <Icon path={mdiAccountEdit} size={0.7} />
                                                                    </div>

                                                                    {/* Delete Icon */}
                                                                    <div className="py-1 px-3 border rounded-lg bg-red-400 cursor-pointer">
                                                                        <Icon path={mdiDeleteForever} size={0.7} />
                                                                    </div>
                                                                </div>
                                                            ) : column.format && typeof value === "number" ? (
                                                                column.format(value)
                                                            ) : (
                                                                value
                                                            )}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>

                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={filteredRows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </div>
        </div>
    )
}

export default TablePage
