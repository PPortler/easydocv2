"use client"

import React from 'react'
import Icon from '@mdi/react';
import { mdiFileAccount, mdiDotsVertical, mdiMagnify } from '@mdi/js';

//table
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

function TablePage() {
    interface Column {
        id: 'name' | 'code' | 'population' | 'size' | 'density';
        label: string;
        minWidth?: number;
        align?: 'right';
        format?: (value: number) => string;
    }

    const columns: readonly Column[] = [
        { id: 'name', label: 'ชื่อ-นามสกุล', minWidth: 170 },
        { id: 'code', label: 'ประเภทผู้ใช้', minWidth: 100 },
        {
            id: 'population',
            label: 'อีเมล์',
            minWidth: 170,
            align: 'right',
            format: (value: number) => value.toLocaleString('en-US'),
        },
        {
            id: 'size',
            label: 'ตำแหน่ง',
            minWidth: 170,
            align: 'right',
            format: (value: number) => value.toLocaleString('en-US'),
        },
        {
            id: 'density',
            label: 'รายละเอียด',
            minWidth: 170,
            align: 'right',
            format: (value: number) => value.toFixed(2),
        },
    ];

    interface Data {
        name: string;
        code: string;
        population: number;
        size: number;
        density: number;
    }

    function createData(
        name: string,
        code: string,
        population: number,
        size: number,
    ): Data {
        const density = population / size;
        return { name, code, population, size, density };
    }

    const rows = [
        createData('India', 'IN', 1324171354, 3287263),
        createData('China', 'CN', 1403500365, 9596961),
        createData('Italy', 'IT', 60483973, 301340),
        createData('United States', 'US', 327167434, 9833520),
        createData('Canada', 'CA', 37602103, 9984670),
        createData('Australia', 'AU', 25475400, 7692024),
        createData('Germany', 'DE', 83019200, 357578),
        createData('Ireland', 'IE', 4857000, 70273),
        createData('Mexico', 'MX', 126577691, 1972550),
        createData('Japan', 'JP', 126317000, 377973),
        createData('France', 'FR', 67022000, 640679),
        createData('United Kingdom', 'GB', 67545757, 242495),
        createData('Russia', 'RU', 146793744, 17098246),
        createData('Nigeria', 'NG', 200962417, 923768),
        createData('Brazil', 'BR', 210147125, 8515767),
    ];

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
            <form className='flex gap-5'>
                <div className='flex flex-col gap-1'>
                    <label>ค้นหา</label>
                    <input
                        type="text"
                        className='px-2 h-7 rounded-lg border-black border w-56'
                        placeholder='ชื่อ-นามสกุล'
                    />
                </div>
                <div className='flex flex-col gap-1'>
                    <label>เลือกประเภท</label>
                    <div>
                        <select
                            className='border-black px-2 h-7 rounded-lg  border w-40'
                        >
                            <option value="0">ทั้งหมด</option>
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                        </select>
                    </div>
                </div>
                <div className='self-end'>
                    <button type='submit' className='px-4 h-7 text-white bg-[#5955b3] rounded-lg flex gap-2 items-center'>
                        <Icon path={mdiMagnify} size={.7} />
                        <p>ค้นหา</p>
                    </button>
                </div>
            </form>
            <hr className='border-black mt-8 mb-5'/>
            <div>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                                {columns.map((column) => {
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell key={column.id} align={column.align}>
                                                            {column.format && typeof value === 'number'
                                                                ? column.format(value)
                                                                : value}
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
                        count={rows.length}
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
