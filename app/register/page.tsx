"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation'
import Loader from '../component/Loader'
import LoginWith from '../component/LoginWith'
import Head from "next/head";

function Register() {

    const [firstName, setFirstName] = useState<String>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const [loader, setLoader] = useState<boolean>(false);

    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setLoader(true);
        console.log({
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
            confirmPassword,
        });

        const bodyForm = {
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
        };

        if (!firstName ||
            !lastName ||
            !email ||
            !phoneNumber ||
            !password) {
            setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
            setLoader(false)
            return;
        }
        if (password !== confirmPassword) {
            setError("รหัสผ่านไม่ตรงกัน");
            setLoader(false)
            return;
        }

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/users`, bodyForm);

            if (res.status === 201) {
                setError('ลงทะเบียนสำเร็จ')
                Swal.fire({
                    icon: 'success',
                    title: 'สำเร็จ',
                    text: 'ลงทะเบียนสำเร็จ!',
                }).then(() => {
                    router.replace('/login');
                });
            } else {
                setLoader(false)
                Swal.fire({
                    icon: 'error',
                    title: 'ข้อผิดพลาด',
                    text: res.data?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง.',
                })
                return;
            }
        } catch (err) {
            setLoader(false)
            Swal.fire({
                icon: 'error',
                title: 'ข้อผิดพลาด',
                text: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง.',
            })
            return;
        }
    }

    return (
        <>
            <div className="p-5 flex justify-between">
                <div className=' w-5/12'>
                    <Link href="/" className="text-white font-extrabold text-4xl">Easy Doc</Link>
                    <div className='flex justify-center items-center h-full p-24'>
                        <Image className='w-96 h-96' src="/image/LoginRegister/posterLogin.png" height={1000} width={1000} priority alt="posterLogin"></Image>
                    </div>
                </div>
                <div className='w-7/12 bg-white shadow-xl rounded-3xl min-h-screen flex justify-center items-center flex-col'>
                    <div className='w-6/12'>
                        <h1 className='text-[#5955B3] text-3xl font-medium'>สมัครสมาชิก</h1>
                        <p className='mt-2 text-[#5955B3] font-light'>มาเตรียมตัวให้พร้อมเพื่อให้คุณสามารถเข้าถึงบัญชีส่วนตัวของคุณได้.</p>
                        <form onSubmit={handleSubmit} className='mt-10'>
                            <div className='flex gap-5'>
                                <div className='relative w-full '>
                                    <input
                                        className='w-full border border-black px-4 py-3 rounded-lg'
                                        type="text"
                                        placeholder='กรอกชื่อ'
                                        onChange={(e) => setFirstName(e.target.value)}
                                        data-testid="firstName"
                                    />
                                    <p className='absolute top-[-9px] left-[12px] bg-white px-1 text-xs text-gray-500'>ชื่อ</p>
                                </div>
                                <div className='relative w-full '>
                                    <input
                                        className='w-full border border-black px-4 py-3 rounded-lg'
                                        type="text"
                                        placeholder='กรอกนามสกุล'
                                        onChange={(e) => setLastName(e.target.value)}
                                        data-testid="lastName"
                                    />
                                    <p className='absolute top-[-9px] left-[12px] bg-white px-1 text-xs text-gray-500'>นามสกุล</p>
                                </div>
                            </div>
                            <div className='flex gap-5 mt-5'>
                                {/* <div className='relative w-full '>
                                <select
                                    className='w-full appearance-none border bg-white border-black px-4 py-3 rounded-lg'
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="0">-</option>
                                    <option value="Student">Student</option>
                                    <option value="Teacher">Teacher</option>
                                </select>
                                <p className='absolute top-[-9px] left-[12px] bg-white px-1 text-xs text-gray-500'>Role</p>
                            </div> */}
                                <div className='relative w-full '>
                                    <input
                                        className='w-full border border-black px-4 py-3 rounded-lg'
                                        type="text"
                                        placeholder='099-xxx-xxxx'
                                        maxLength={10}
                                        inputMode="numeric"
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        data-testid="phone"
                                    />
                                    <p className='absolute top-[-9px] left-[12px] bg-white px-1 text-xs text-gray-500'>เบอร์โทรศัพท์</p>
                                </div>
                            </div>
                            <div className='relative mt-5 '>
                                <input
                                    className='w-full border border-black px-4 py-3 rounded-lg'
                                    type="text"
                                    placeholder='example@gmail.com'
                                    onChange={(e) => setEmail(e.target.value)}
                                    data-testid="email"
                                />
                                <p className='absolute top-[-9px] left-[12px] bg-white px-1 text-xs text-gray-500'>อีเมล</p>
                            </div>
                            <div className='relative mt-5'>
                                <input
                                    className='w-full border border-black px-4 py-3 rounded-lg'
                                    type="password"
                                    placeholder='สร้างรหัสผ่าน'
                                    onChange={(e) => setPassword(e.target.value)}
                                    data-testid="password"
                                />
                                <p className='absolute top-[-9px] left-[12px] bg-white px-1 text-xs text-gray-500'>รหัสผ่าน</p>
                            </div>
                            <div className='relative mt-5'>
                                <input
                                    className='w-full border border-black px-4 py-3 rounded-lg'
                                    type="password"
                                    placeholder='ใส่รหัสผ่านอีกครั้ง'
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    data-testid="confirmPassword"
                                />
                                <p className='absolute top-[-9px] left-[12px] bg-white px-1 text-xs text-gray-500'>ยืนยันรหัสผ่าน</p>
                            </div>
                            <div className='mt-5 flex justify-between text-sm'>
                                <div className='flex gap-2 items-center'>
                                    <input id='agreement' type="checkbox" />
                                    <p className=''>ฉันเห็นด้วยทุกประการ <span className='text-red-400'>เงื่อนไข</span> และ <span className='text-red-400'>นโยบายความเป็นส่วนตัว</span> </p>
                                </div>
                            </div>
                            {error && (
                                <div data-testid="error-message" className='mt-5 text-red-500 text-sm'>
                                    * {error}
                                </div>
                            )}
                            <div className='mt-5'>
                                <button data-testid="btn-submit" type='submit' className='bg-[#5955B3] text-white rounded-lg w-full p-2'>สมัครสมาชิก</button>
                            </div>
                            <div className='mt-5 text-center'>
                                <p>มีบัญชีอยู่แล้ว?  <span><Link href="/login" className='text-red-400'>เข้าสู่ระบบ</Link></span></p>
                            </div>
                            <div className='mt-10 text-xs relative flex flex-col items-center justify-center'>
                                <hr className='w-full' />
                                <p className='text-gray-400 px-1 bg-white absolute top-[-8px]'>เข้าสู่ระบบด้วย</p>
                            </div>
                            <LoginWith />
                        </form>
                    </div>
                </div>
                {loader && (
                    <div>
                        <Loader />
                    </div>
                )}
            </div>
        </>
    )
}

export default Register
