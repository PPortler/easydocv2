"use cleint"

import React from 'react'
import BeatLoader from "react-spinners/BeatLoader";

function Loader() {
    return (
        <div className='z-50 w-screen h-screen fixed top-0 left-0 flex justify-center items-center'>
            <div className='w-screen h-screen fixed top-0 left-0 bg-black opacity-30'>
            </div>
            <BeatLoader 
                size={20}
                aria-label="Loading Spinner"
                color={`#5955B3`}
                className='z-10'
            />
        </div>
    )
}

export default Loader
