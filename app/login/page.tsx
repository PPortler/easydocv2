"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import Loader from '../component/Loader'
import LoginWith from '../component/LoginWith'
import { useSession } from 'next-auth/react'


function Login() {

    //session check
    const { status, data: session } = useSession()
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") {
            return;
        }
        if (!session) {
            router.replace("/login");
            setLoader(false);
        }

        if (session?.user?.role === "admin") {
            router.replace('/admin')
        } else if (session?.user?.role?.toLocaleLowerCase() === "user") {
            router.replace('/dashboard')
        }
    }, [session, status]);

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<String>('')

    const [loader, setLoader] = useState<boolean>(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoader(true);
        try {
            const res = await signIn("credentials", {
                email, password, redirect: false
            })
            if (res && res.error) {
                try {
                    const resCheckUser = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/checkuser`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ email })
                    })

                    if (!resCheckUser.ok) {
                        setLoader(false);
                        throw new Error("Error fetch api checkuser.")
                    }

                    const { user } = await resCheckUser.json()

                    if (user) {
                        setError("รหัสผ่านของคุณไม่ถูกต้อง")
                        setLoader(false);
                        return;
                    } else {
                        setError("อีเมลของคุณไม่ถูกต้อง");
                        setLoader(false);
                        return;
                    }


                } catch (err) {
                    console.log("Error Fetch Api in register: ", err)
                    setLoader(false);
                }


            }

        } catch (err) {
            console.log(err);
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
                        <h1 className='text-[#5955B3] text-3xl font-medium'>เข้าสู่ระบบ</h1>
                        <p className='mt-2 text-[#5955B3] font-light'>เข้าสู่ระบบเพื่อเข้าถึงบัญชี easydoc ของคุณ</p>
                        <form onSubmit={handleSubmit} className='mt-10'>
                            <div className='relative '>
                                <input
                                    className='w-full border border-black px-4 py-3 rounded-lg'
                                    type="email"
                                    placeholder='กรอกอีเมลของคุณ'
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <p className='absolute top-[-9px] left-[12px] bg-white px-1 text-xs text-gray-500'>อีเมล</p>
                            </div>
                            <div className='relative mt-5'>
                                <input
                                    className='w-full border border-black px-4 py-3 rounded-lg'
                                    type="password"
                                    placeholder='กรอกรหัสผ่านของคุณ'
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <p className='absolute top-[-9px] left-[12px] bg-white px-1 text-xs text-gray-500'>รหัสผ่าน</p>
                            </div>
                            {error &&
                                <p className='text-red-500 mt-2'>{error}</p>
                            }

                            <div className='mt-5 flex justify-between text-sm'>
                                <div className='flex gap-2 items-center'>
                                    <input type="checkbox" />
                                    <p className=''>จดจำฉัน</p>
                                </div>
                                <Link href="/forgotAccount" className='text-red-400'>ลืมรหัสผ่าน</Link>
                            </div>
                            <div className='mt-5'>
                                <button className='bg-[#5955B3] text-white rounded-lg w-full p-2'>เข้าสู่ระบบ</button>
                            </div>
                            <div className='mt-5 text-center'>
                                <p>ไม่มีบัญชี? <span><Link href="/register" className='text-red-400'>สมัครสมาชิก</Link></span></p>
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

export default Login
