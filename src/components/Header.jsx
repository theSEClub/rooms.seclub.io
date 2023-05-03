import React from 'react'
import logo from '../assets/se-club-logo.svg'


export default function Header() {
    return (
        <div className="flex items-center justify-around bg-base-200 py-6">
            <div>
                <img src={logo} alt="SE logo" className="h-14 lg:h-20 w-auto" />
            </div>
            <div className="uppercase">
                SE Rooms
            </div>
        </div>
    )
}
