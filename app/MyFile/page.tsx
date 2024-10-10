"use client"

import React from 'react'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function MyFile() {

    const { status, data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') {
            return;
        }

        if (!session) {
            router.replace('/Login')
        } else {
        };

  
    }, [session])


    console.log(session?.user);
    return (
        <div>
            <button className='border p-2' onClick={() => signOut()}>Logout </button>
            <p>email: {session?.user?.email}</p>
        </div>
    )
}

export default MyFile
