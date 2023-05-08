"use client"
// import { Moon, Rank, Sun1 } from "iconsax-react";
// import Link from "react-router-dom";
import { Link } from 'react-router-dom';
import { useState } from "react";
import { CiDark, CiLight } from 'react-icons/ci';
import { useEffect } from 'react';

export default function Header() {

    const [theme, setTheme] = useState('dark');

    const switchTheme = () => {
        const theme = document.body.dataset.theme
        if (theme === 'dark') {
            document.body.dataset.theme = 'white'
            setTheme('white')
        } else {
            document.body.dataset.theme = 'dark'
            setTheme('dark')
        }
    }

    // Set theme based on user's OS theme
    useEffect(() => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.dataset.theme = 'dark'
            setTheme('dark')
        } else {
            document.body.dataset.theme = 'white'
            setTheme('white')
        }
    }, [])


    return (
        <header className="border-b border-primary">
            <div className="navbar bg-base-100 py-3">
                <div className="w-full max-w-6xl mx-auto">
                    <div className="flex-1">
                        <Link to="/" className="btn btn-ghost normal-case text-2xl">
                            SE Club
                            <small className="font-thin italic text-sm pl-1.5 -bottom-px relative">rooms</small>
                        </Link>
                    </div>
                    <div className="flex-none">
                        <label className="swap swap-rotate">
                            <input onClick={switchTheme} type="checkbox" />
                            <div className="swap-on p-3 rounded-full shadow-md">
                                {theme === 'dark'
                                    ? <CiLight className='fill-secondary' size='2rem' />
                                    : <CiDark className='fill-secondary' size='2rem' />}
                            </div>
                            <div className="swap-off p-3 rounded-full shadow-md">
                                {theme === 'dark'
                                    ? <CiLight className='fill-secondary' size='2rem' />
                                    : <CiDark className='fill-secondary' size='2rem' />}
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        </header>
    );
}