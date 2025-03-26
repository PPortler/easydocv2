"use client"

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Head from "next/head"
import Navbar from '../component/myfile/Navbar'
import Navbar2 from '@/app/component/myfile/Navbar2'
import Loader from '@/app/component/Loader'
import TablePage from './component/Table'
import { Sents } from '../types/sentType'
import { MailBox } from '../types/mailBox'

function MyFile() {
    const { status, data: session } = useSession()
    const router = useRouter()

    const [loader, setLoader] = useState<boolean>(false)
    const [mails, setMails] = useState<Sents[]>([])
    const [mailBox, setMailBoxs] = useState<MailBox[]>([])

    useEffect(() => {
        if (status === 'loading') return

        if (!session) {
            router.replace('/login')
            setLoader(false)
            return
        }

        if (session?.user?.role === "user") {
            router.replace('/dashboard')
            setLoader(false)
            return
        }

        if (session?.user?.idUser) {
            setLoader(false)
            fetchData()
        }
    }, [session])

    async function fetchData() {
        try {
            const [sentRes, mailBoxRes] = await Promise.all([
                axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/sent/status/${session?.user?.email}`),
                axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/mailBox/${session?.user?.email}`)
            ])

            const sentMails = sentRes.data || []
            const mailBoxes = mailBoxRes.data || []

            // รวมข้อมูล mailBox เข้าไปใน mails
            const mergedData: Sents[] = [
                ...sentMails,
                ...mailBoxes.map((mail) => ({
                    id: mail.idSent, // ใช้ idSent แทน id
                    email: mail.fromSent.length > 0 ? mail.fromSent[mail.fromSent.length - 1].email : "", // ใช้ fromSent[ล่าสุด] แทน email
                    header: mail.header,
                    type: mail.type,
                    status: mail.status ? "ตอบกลับแล้ว" : "ยังไม่ตอบกลับ", // แปลง boolean เป็น string
                    fromSent: mail.fromSent || [] // ใช้จาก mailBox
                }))
            ]

            // เรียงลำดับจากวันที่และเวลาล่าสุดไปเก่าสุด
            mergedData.sort((a, b) => {
                const dateA = new Date(`${a.fromSent[0]?.date} ${a.fromSent[0]?.time}`)
                const dateB = new Date(`${b.fromSent[0]?.date} ${b.fromSent[0]?.time}`)
                return dateB - dateA // เรียงจากล่าสุด -> เก่าสุด
            })

            setMails(mergedData)
        } catch (err) {
            console.error("Error fetching data:", err)
        }
    }

    return (
        <>
            <Head>
                <title>MyFile</title>
            </Head>
            <div className="p-5 flex">
                <Navbar status="dashboard" />
                <div className="bg-white rounded-3xl p-10 min-h-screen w-full">
                    <Navbar2 title="แดชบอร์ด" />
                    <div className='my-5'>
                        <TablePage dataMail={mails} />
                    </div>
                </div>
                {loader && <Loader />}
            </div>
        </>
    )
}

export default MyFile
