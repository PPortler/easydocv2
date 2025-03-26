import React from 'react'
import Image from 'next/image'

function LoginWith() {
    return (
        <div className='mt-8 grid grid-cols-2 gap-3'>
            <div className='border rounded-lg p-2 flex justify-center px-10'>
                <Image className='w-7 h-7' src="/image/Google.png" height={1000} width={1000} priority alt="google"></Image>
            </div>
            <div className='border rounded-lg p-2 flex justify-center px-10'>
                <Image className='w-7 h-7' src="/image/Facebook.png" height={1000} width={1000} priority alt="facebook"></Image>
            </div>

        </div>
    )
}

export default LoginWith
