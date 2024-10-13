"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation'
import Loader from '../component/Loader'

function Register() {

    const [firstName, setFirstName] = useState<String>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [role, setRole] = useState<string>('');

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
            role,
        });

        const bodyForm = {
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
            role,
        };

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/users`, bodyForm);

            if (res.status === 201) {
                Swal.fire({
                    icon: 'success',
                    title: 'สำเร็จ',
                    text: 'ลงทะเบียนสำเร็จ!',
                }).then(() => {
                    router.replace('/login'); // ไปยังหน้า login
                });
            } else {
                setLoader(false)
                Swal.fire({
                    icon: 'error',
                    title: 'ข้อผิดพลาด',
                    text: res.data?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง.',
                })
            }
        } catch (err) {
            console.error("มีข้อผิดพลาดเกิดขึ้น:", err);
            setLoader(false)
            Swal.fire({
                icon: 'error',
                title: 'ข้อผิดพลาด',
                text: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง.',
            })
        }
    }

    return (
        <div className="p-5 flex justify-between">
            <div className=' w-5/12'>
                <Link href="/" className="text-white font-extrabold text-4xl">Easy Doc</Link>
                <div className='flex justify-center items-center h-full p-24'>
                    <Image className='w-96 h-96' src="/image/LoginRegister/posterLogin.png" height={1000} width={1000} priority alt="posterLogin"></Image>
                </div>
            </div>
            <div className='w-7/12 bg-white shadow-xl rounded-3xl min-h-screen flex justify-center items-center flex-col'>
                <div className='w-6/12'>
                    <h1 className='text-[#5955B3] text-3xl font-medium'>Register</h1>
                    <p className='mt-2 text-[#5955B3] font-light'>Let’s get you all st up so you can access your personal account.</p>
                    <form onSubmit={handleSubmit} className='mt-10'>
                        <div className='flex gap-5'>
                            <div className='relative w-full '>
                                <input
                                    className='w-full border border-black px-4 py-3 rounded-lg'
                                    type="text"
                                    placeholder='Enter your email'
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                                <p className='absolute top-[-9px] left-[12px] bg-white px-1 text-xs text-gray-500'>First Name</p>
                            </div>
                            <div className='relative w-full '>
                                <input
                                    className='w-full border border-black px-4 py-3 rounded-lg'
                                    type="text"
                                    placeholder='Enter your email'
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                                <p className='absolute top-[-9px] left-[12px] bg-white px-1 text-xs text-gray-500'>Last Name</p>
                            </div>
                        </div>
                        <div className='flex gap-5 mt-5'>
                            <div className='relative w-full '>
                                <select
                                    className='w-full appearance-none border border-black px-4 py-3 rounded-lg'
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="0">-</option>
                                    <option value="Student">Student</option>
                                    <option value="Teacher">Teacher</option>
                                </select>
                                <p className='absolute top-[-9px] left-[12px] bg-white px-1 text-xs text-gray-500'>Role</p>
                            </div>
                            <div className='relative w-full '>
                                <input
                                    className='w-full border border-black px-4 py-3 rounded-lg'
                                    type="text"
                                    placeholder='Enter your email'
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                                <p className='absolute top-[-9px] left-[12px] bg-white px-1 text-xs text-gray-500'>Phone Number</p>
                            </div>
                        </div>
                        <div className='relative mt-5 '>
                            <input
                                className='w-full border border-black px-4 py-3 rounded-lg'
                                type="text"
                                placeholder='Enter your email'
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <p className='absolute top-[-9px] left-[12px] bg-white px-1 text-xs text-gray-500'>Email</p>
                        </div>
                        <div className='relative mt-5'>
                            <input
                                className='w-full border border-black px-4 py-3 rounded-lg'
                                type="password"
                                placeholder='Enter your password'
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <p className='absolute top-[-9px] left-[12px] bg-white px-1 text-xs text-gray-500'>Password</p>
                        </div>
                        <div className='relative mt-5'>
                            <input
                                className='w-full border border-black px-4 py-3 rounded-lg'
                                type="password"
                                placeholder='Enter your password'
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <p className='absolute top-[-9px] left-[12px] bg-white px-1 text-xs text-gray-500'>Confirm Password</p>
                        </div>
                        <div className='mt-5 flex justify-between text-sm'>
                            <div className='flex gap-2 items-center'>
                                <input id='agreement' type="checkbox" />
                                <p className=''>I agree to all the <span className='text-red-400'>Terms</span> and <span className='text-red-400'>Privacy Policies</span> </p>
                            </div>
                        </div>
                        <div className='mt-5'>
                            <button type='submit' className='bg-[#5955B3] text-white rounded-lg w-full p-2'>Login</button>
                        </div>
                        <div className='mt-5 text-center'>
                            <p>Already have an account?  <span><Link href="/login" className='text-red-400'>Login</Link></span></p>
                        </div>
                        <div className='mt-10 text-xs relative flex flex-col items-center justify-center'>
                            <hr className='w-full' />
                            <p className='text-gray-400 px-1 bg-white absolute top-[-8px]'>Or login with</p>
                        </div>
                        <div className='mt-8 grid grid-cols-3 gap-3'>
                            <div className='border rounded-lg p-2 flex justify-center px-10'>
                                <Image className='w-7 h-7' src="/image/LoginRegister/posterLogin.png" height={1000} width={1000} priority alt="posterLogin"></Image>
                            </div>
                            <div className='border rounded-lg p-2 flex justify-center px-10'>
                                <Image className='w-7 h-7' src="/image/LoginRegister/posterLogin.png" height={1000} width={1000} priority alt="posterLogin"></Image>
                            </div>
                            <div className='border rounded-lg p-2 flex justify-center px-10'>
                                <Image className='w-7 h-7' src="/image/LoginRegister/posterLogin.png" height={1000} width={1000} priority alt="posterLogin"></Image>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {loader && (
                <div>
                    <Loader />
                </div>
            )}
        </div>
    )
}

export default Register
