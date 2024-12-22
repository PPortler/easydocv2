"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Loader from "../component/Loader";
import LoginWith from "../component/LoginWith";

function Register() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isAgreed, setIsAgreed] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoader(true);
    setError("");

    // ตรวจสอบข้อมูลในฟอร์ม
    if (!firstName || !lastName || !email || !phoneNumber || !password || !confirmPassword) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      setLoader(false);
      return;
    }

    if (!/^(06|08|09)\d{8}$/.test(phoneNumber)) {
      setError("เบอร์โทรศัพท์ต้องเป็นเบอร์ไทยและมี 10 หลัก");
      setLoader(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("อีเมลไม่ถูกต้อง");
      setLoader(false);
      return;
    }

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      setError("รหัสผ่านต้องมีอย่างน้อย 8 ตัว และต้องประกอบด้วยตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก ตัวเลข และสัญลักษณ์พิเศษ");
      setLoader(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      setLoader(false);
      return;
    }

    if (!isAgreed) {
      setError("กรุณายอมรับเงื่อนไขและนโยบายความเป็นส่วนตัว");
      setLoader(false);
      return;
    }

    const bodyForm = {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
    };

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/users`, bodyForm);

      if (res.status === 201) {
        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: "ลงทะเบียนสำเร็จ!",
        }).then(() => {
          router.replace("/login");
        });
      }
    } catch (err: any) {
      setLoader(false);
      if (err.response?.status === 409) {
        setError("อีเมลหรือเบอร์โทรศัพท์นี้ถูกใช้งานแล้ว");
      } else {
        Swal.fire({
          icon: "error",
          title: "ข้อผิดพลาด",
          text: err.response?.data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง.",
        });
      }
    } finally {
      setLoader(false);
    }
  }

  return (
    <>
      <div className="p-5 flex justify-between">
        <div className="w-5/12">
          <Link href="/" className="text-white font-extrabold text-4xl">Easy Doc</Link>
          <div className="flex justify-center items-center h-full p-24">
            <Image
              className="w-96 h-96"
              src="/image/LoginRegister/posterLogin.png"
              height={1000}
              width={1000}
              priority
              alt="posterLogin"
            />
          </div>
        </div>
        <div className="w-7/12 bg-white shadow-xl rounded-3xl min-h-screen flex justify-center items-center flex-col">
          <div className="w-6/12">
            <h1 className="text-[#5955B3] text-3xl font-medium">สมัครสมาชิก</h1>
            <p className="mt-2 text-[#5955B3] font-light">มาเตรียมตัวให้พร้อมเพื่อให้คุณสามารถเข้าถึงบัญชีส่วนตัวของคุณได้.</p>
            <form onSubmit={handleSubmit} className="mt-10">
              <div className="flex gap-5">
                <div className="relative w-full">
                  <input
                    className="w-full border border-black px-4 py-3 rounded-lg"
                    type="text"
                    placeholder="กรอกชื่อ"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <p className="absolute top-[-9px] left-[12px] bg-white px-1 text-xs text-gray-500">ชื่อ</p>
                </div>
                <div className="relative w-full">
                  <input
                    className="w-full border border-black px-4 py-3 rounded-lg"
                    type="text"
                    placeholder="กรอกนามสกุล"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  <p className="absolute top-[-9px] left-[12px] bg-white px-1 text-xs text-gray-500">นามสกุล</p>
                </div>
              </div>
              <div className="relative mt-5">
                <input
                  className="w-full border border-black px-4 py-3 rounded-lg"
                  type="text"
                  placeholder="example@gmail.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="absolute top-[-9px] left-[12px] bg-white px-1 text-xs text-gray-500">อีเมล</p>
              </div>
              <div className="relative mt-5">
                <input
                  className="w-full border border-black px-4 py-3 rounded-lg"
                  type="text"
                  placeholder="099-xxx-xxxx"
                  maxLength={10}
                  inputMode="numeric"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <p className="absolute top-[-9px] left-[12px] bg-white px-1 text-xs text-gray-500">เบอร์โทรศัพท์</p>
              </div>
              <div className="relative mt-5">
                <input
                  className="w-full border border-black px-4 py-3 rounded-lg"
                  type="password"
                  placeholder="สร้างรหัสผ่าน"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="absolute top-[-9px] left-[12px] bg-white px-1 text-xs text-gray-500">รหัสผ่าน</p>
              </div>
              <div className="relative mt-5">
                <input
                  className="w-full border border-black px-4 py-3 rounded-lg"
                  type="password"
                  placeholder="ใส่รหัสผ่านอีกครั้ง"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <p className="absolute top-[-9px] left-[12px] bg-white px-1 text-xs text-gray-500">ยืนยันรหัสผ่าน</p>
              </div>
              <div className="mt-5 flex justify-between text-sm">
                <div className="flex gap-2 items-center">
                  <input id="agreement" type="checkbox" onChange={(e) => setIsAgreed(e.target.checked)} />
                  <p>ฉันเห็นด้วยทุกประการ <span className="text-red-400">เงื่อนไข</span> และ <span className="text-red-400">นโยบายความเป็นส่วนตัว</span></p>
                </div>
              </div>
              {error && <div className="mt-5 text-red-500 text-sm">* {error}</div>}
              <div className="mt-5">
                <button type="submit" className="bg-[#5955B3] text-white rounded-lg w-full p-2">สมัครสมาชิก</button>
              </div>
              <div className="mt-5 text-center">
                <p>มีบัญชีอยู่แล้ว? <span><Link href="/login" className="text-red-400">เข้าสู่ระบบ</Link></span></p>
              </div>
              <div className="mt-10 text-xs relative flex flex-col items-center justify-center">
                <hr className="w-full" />
                <p className="text-gray-400 px-1 bg-white absolute top-[-8px]">เข้าสู่ระบบด้วย</p>
              </div>
              <LoginWith />
            </form>
          </div>
        </div>
        {loader && <Loader />}
      </div>
    </>
  );
}

export default Register;
