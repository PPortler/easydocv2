"use client";

import React, { useState } from "react";
import Icon from "@mdi/react";
import { mdiMagnify, mdiCheckCircleOutline, mdiClockTimeFourOutline, mdiMessageReplyTextOutline, mdiReply } from "@mdi/js";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Sents } from "@/app/types/sentType";

interface TableProps {
    dataMail: Sents[];
}

const MailTable: React.FC<TableProps> = ({ dataMail }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [searchQuery, setSearchQuery] = useState("");

    // ฟิลเตอร์ข้อมูลตาม email หรือ header
    const filteredData = dataMail.filter(
        (mail) =>
            mail.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mail.header.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <div className="mt-10">
            {/* Search Bar */}
            <div className="flex w-full gap-2 items-center mb-4">
                <Icon path={mdiMagnify} size={1.5} />
                <input
                    type="text"
                    className="px-4 py-1 w-full border rounded-lg border-black"
                    placeholder="ค้นหา อีเมล, หัวข้อ"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="flex justify-end gap-3 items-center mt-7 mb-5">
                <div className="flex items-center gap-1">
                    <Icon path={mdiCheckCircleOutline} size={.6} color="green" />
                    <p className="text-xs">ส่งเอกสารสำเร็จ</p>
                </div>
                <div className="flex items-center gap-1">
                    <Icon path={mdiReply} size={.6} color="green" />
                    <p className="text-xs">ตอบกลับแล้ว</p>
                </div>
                <div className="flex items-center gap-1">
                    <Icon path={mdiClockTimeFourOutline} size={.6} color="orange" />
                    <p className="text-xs">กำลังส่ง</p>
                </div>
                <div className="flex items-center gap-1">
                    <Icon path={mdiReply} size={.6} color="orange" />
                    <p className="text-xs">ยังไม่ตอบกลับ</p>
                </div>
            </div>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ maxHeight: 1200 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">อีเมล</TableCell>
                                <TableCell align="left">หัวข้อ - รายละเอียด</TableCell>
                                <TableCell align="left">ประเภท</TableCell>
                                <TableCell align="left">วันที่</TableCell>
                                <TableCell align="left">สถานะ</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((mail, index) => (
                                    <TableRow key={index} hover>
                                        <TableCell align="left">{mail.email}</TableCell>
                                        <TableCell align="left">
                                            <span className="font-bold">{mail.header}</span> - {mail.fromSent[0]?.detail}
                                        </TableCell>
                                        <TableCell align="left">{mail.type}</TableCell>
                                        <TableCell align="left">{mail.fromSent[0]?.date}</TableCell>
                                        <TableCell align="left">
                                            {mail.status === "complete" ? (
                                                <Icon path={mdiCheckCircleOutline} size={1} color="green" />
                                            ) : mail.status === "ตอบกลับแล้ว" ? (
                                                <Icon path={mdiReply} size={1} color="green" />
                                            ) : mail.status === "ยังไม่ตอบกลับ" ? (
                                                <Icon path={mdiReply} size={1} color="orange" />
                                            ) : (
                                                <Icon path={mdiClockTimeFourOutline} size={1} color="orange" />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 20, 30]}
                    component="div"
                    count={filteredData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
};

export default MailTable;
