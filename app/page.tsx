"use client"

import Link from "next/link";
import React from "react";
import Image from "next/image";
import Navbar from "./component/main/Navbar";
import Icon from '@mdi/react';
import { mdiAccountSupervisor } from '@mdi/js';

export default function Home() {
  return (
    <div className="p-5 ">
      <div className="bg-white rounded-3xl p-3 min-h-screen">
        <Navbar />
        <div className="mt-10 flex justify-center items-center gap-72">
          <div className="flex flex-col gap-5 h-fit">
            <h1 className="text-5xl font-bold">ระบบ </h1>
            <h1 className="text-5xl font-bold">จัดการเอกสาร </h1>
            <Link href="register" className="bg-[#5955B3] w-fit text-white py-3 px-6 rounded-lg">สมัครสมาชิก</Link>
          </div>
          <Image className="w-96 h-96" src="/image/main/poster.png" height={1000} width={1000} priority alt="poster"></Image>
        </div>

        <div className="mt-20 grid grid-cols-3 mx-40 gap-2">
          <div className="gap-2 p-5 shadow-md flex justify-center flex-col items-center">
            <Icon path={mdiAccountSupervisor} size={1.5} />
            <div>
              <h1 className="text-xl font-bold">Membership </h1>
              <h1 className="text-xl font-bold">Organisations </h1>
            </div>
            <p className="text-xs text-center">
              Our membership management software provides full automation of membership renewals and payments
            </p>
          </div>
          <div className="gap-2 p-5 shadow-md flex justify-center flex-col items-center">
            <Icon path={mdiAccountSupervisor} size={1.5} />
            <div>
              <h1 className="text-xl font-bold">Membership </h1>
              <h1 className="text-xl font-bold">Organisations </h1>
            </div>
            <p className="text-xs text-center">
              Our membership management software provides full automation of membership renewals and payments
            </p>
          </div>
          <div className="gap-2 p-5 shadow-md flex justify-center flex-col items-center">
            <Icon path={mdiAccountSupervisor} size={1.5} />
            <div>
              <h1 className="text-xl font-bold">Membership </h1>
              <h1 className="text-xl font-bold">Organisations </h1>
            </div>
            <p className="text-xs text-center">
              Our membership management software provides full automation of membership renewals and payments
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
