"use cleint"

import React from 'react'
import DotLoader from "react-spinners/DotLoader";

function Loader() {
    return (
        <div className='w-screen h-screen fixed top-0 left-0 flex justify-center items-center'>
            <div className='w-screen h-screen fixed top-0 left-0 bg-black opacity-30'>
                
            </div>
            <DotLoader 
                size={70}
                aria-label="Loading Spinner"
                color={`#5955B3`}
                className='z-10'
            />
        </div>
    )
}

export default Loader
