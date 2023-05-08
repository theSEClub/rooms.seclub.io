import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

export default function App() {
    return (
        <div>
            <div className='min-h-screen bg-base-100'>

                <Header />
                <Outlet />

            </div>
        </div>
    )
}
