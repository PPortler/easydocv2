"use client"

import Link from 'next/link'
import React from 'react'

function Navbar() {
  return (
    <div className='w-60'>
      <div
        className={`px-4 py-3 cursor-pointer flex bg-sky-100 text-blue-500 rounded-lg font-bold`}
      >
        <p>
          โปรไฟล์
        </p>
      </div>
      <div
        className={`px-4 py-3 cursor-pointer flex text-gray-400 hover:text-blue-500 rounded-lg font-bold`}
      >
        <p>
          ความปลอดภัย
        </p>
      </div>
      <div
        className={`px-4 py-3 cursor-pointer flex text-gray-400 hover:text-blue-500 rounded-lg font-bold`}
      >
        <p>
          การแจ้งเตือน
        </p>
      </div>
     
      <div
        className={`px-4 py-3 cursor-pointer flex text-gray-400 hover:text-blue-500 rounded-lg font-bold`}
      >
        <p>
          ลบบัญชี
        </p>
      </div>
    </div>
  )
}

export default Navbar
