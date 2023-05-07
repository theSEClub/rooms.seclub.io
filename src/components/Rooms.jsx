import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import CreateRoomModal from './CreateRoomModal';
import { checkLocalStorage } from '../helpers/helper';


export default function Rooms() {

    const [rooms, setRooms] = useState([]);
    const [roomName, setRoomName] = useState('');
    const [error, setError] = useState('');

    const openRoomModalRef = useRef(null);
    const closeRoomModalRef = useRef(null);

    useEffect(() => {
        fetchRooms();
    }, [])

    async function fetchRooms() {
        const res = await fetch('http://localhost:8000/rooms');
        const data = await res.json();
        setRooms(data);
      };

    function handleSubmit(e) {
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
        addRoom(roomName);
        setRoomName('');
        closeRoomModalRef.current.click();
    }       
    
    async function addRoom(roomName) {
        const res = await fetch('http://localhost:8000/rooms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: roomName })
        });
    }



  return (
    <div className='w-1/2 min-w-[200px]'>
        <div className='flex items-center justify-between mb-6'>
            <h1 className='text-center text-2xl'>All Rooms</h1>
            {/* <Link to='/create' tabIndex={'-1'}>
                <button className="btn btn-outline btn-secondary">
                    Create Room
                </button>
            </Link> */}
            <CreateRoomModal roomName={roomName} setRoomName={setRoomName} handleSubmit={handleSubmit} openModalRef={openRoomModalRef} closeModalRef={closeRoomModalRef} error={error} />
        </div>
        {
            rooms?.map(room => {
                return (
                    <div key={room.id} className='flex justify-around items-center gap-3 mb-6 p-3 border border-base-300 max-sm:flex-col'>
                        <h2 className='capitalize text-base'>{room.name}</h2>
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
    </div>
  )
}
