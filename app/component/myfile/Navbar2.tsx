"use client"

import React from 'react'
import Icon from '@mdi/react';
import { mdiCog } from '@mdi/js';

function Navbar2({ title }: { title:String }) {
    return (
        <div className='flex justify-between'>
            <h1 className='text-[#5955B3] text-4xl font-medium'>{title}</h1>
            <div className='flex gap-2'>
                <Icon path={mdiCog} size={1} />
                <Icon path={mdiCog} size={1} />
                <Icon path={mdiCog} size={1} />
            </div>
        </div>
    )
}

export default Navbar2
