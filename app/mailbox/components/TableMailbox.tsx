"use client"

import React from 'react'
import Icon from '@mdi/react';
import { mdiAccountCircle, mdiStar, mdiArrowLeftCircle } from '@mdi/js';
import { useState } from 'react';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

interface Column {
    id: 'teacher' | 'status' | 'files' | 'date' | 'detail';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}
const columns: readonly Column[] = [
    { id: 'teacher', label: 'Teacher', minWidth: 170 },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'files', label: 'Files', minWidth: 170 },
    { id: 'date', label: 'Date', minWidth: 170 },
    { id: 'detail', label: 'Detail', minWidth: 170 },
];

interface Data {
    teacher: { name: string; description: string };
    status: string;
    files: string;
    date: string;
    detail: string;
}

function createData(
    teacher: { name: string; description: string },
    status: string,
    files: string,
    date: string,
    detail: string
): Data {
    return { teacher, status, files, date, detail };
}

const rows = [
    createData(
        { name: 'Teacher1', description: 'Senior Lecturer in Physics' },
        'Agreen',
        "Document1",
        "17/06/2024",
        ""
    ),
    createData(
        { name: 'Teacher1', description: 'Senior Lecturer in Physics' },
        'Agreen',
        "Document1",
        "17/06/2024",
        ""
    ),
];

function TableStatus() {

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

                                            if (column.id === 'teacher' && typeof value === 'object' && value !== null) {
                                                const teacher = value as { name: string; description: string };
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        <div className="flex gap-2 items-center">
                                                            <Icon path={mdiAccountCircle} size={2.5} />
                                                            <div>
                                                                <h1>{teacher.name}</h1>
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
                                            if (column.id === 'detail' && typeof value === 'string') {
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        <div className='cursor-pointer flex justify-center items-center'>
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
}

export default TableStatus
