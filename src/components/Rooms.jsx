import React, { useEffect, useRef, useState } from 'react'
import { Link, redirect, useNavigate } from 'react-router-dom';
import { checkLocalStorage } from '../helpers/helper';
import Modal from './Modal';


export default function Rooms() {

    const navigate = useNavigate();

    const [rooms, setRooms] = useState([]);
    const [roomName, setRoomName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const openRoomModalRef = useRef(null);
    const closeRoomModalRef = useRef(null);

    useEffect(() => {
        fetchRooms();
    }, [])

    async function fetchRooms() {
        setLoading(true);
        const res = await fetch('https://api.room.seclub.io:3000/api/v1/rooms');
        const data = await res.json();
        setLoading(false);
        setRooms(data);
    };

    async function handleSubmit(e) {
        e.preventDefault();
        if (roomName.length < 3) {
            setError('Room name must be at least 3 characters long.');
            return;
        }
        if (!checkLocalStorage()) {
            setError('Please enter a username first');
            return;
        }

        setError('');
        navigate(`/room/${roomName}`);
        setRoomName('');
        closeRoomModalRef.current.click();
    };


    return (
        <div className='w-1/2 min-w-[200px]'>
            <div className='flex items-center justify-between mb-6'>
                <h1 className='text-center text-2xl'>All Rooms</h1>
                <Modal
                    modalName={'create-room'}
                    label={'Create Room'}
                    inputPrompt={'Enter room name:'}
                    inputPlaceholder={'new room'}
                    inputValue={roomName}
                    inputOnChange={setRoomName}
                    handleSubmit={handleSubmit}
                    openModalRef={openRoomModalRef}
                    closeModalRef={closeRoomModalRef}
                    error={error}
                />
            </div>
            {
                loading && <p className='text-center text-info text-2xl'>Loading rooms...</p>
            }
            {
                rooms?.map((room, index) => {
                    return (
                        <div key={`${index}468`} className='flex justify-between items-center gap-3 mb-6 py-3 px-8 border border-base-300 max-sm:flex-col'>
                            <h2 className='text-base'>{room.id}</h2>
                            <Link to={`/room/${room.id}`} tabIndex={'-1'}>
                                <button className="btn btn-outline btn-secondary">
                                    Join Room
                                </button>
                            </Link>
                        </div>
                    )
                }
                )
            }
            {
                rooms?.length === 0 && !loading && <p className='text-center text-secondary text-2xl'>No rooms found</p>
            }
        </div>
    )
}
