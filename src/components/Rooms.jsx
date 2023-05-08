import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { checkLocalStorage } from '../helpers/helper';
import Modal from './Modal';


export default function Rooms() {

    const [rooms, setRooms] = useState([]);
    const [newRoom, setNewRoom] = useState();
    const [roomName, setRoomName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const openRoomModalRef = useRef(null);
    const closeRoomModalRef = useRef(null);

    useEffect(() => {
        fetchRooms();
    }, [newRoom])

    async function fetchRooms() {
        const res = await fetch('http://localhost:3000/api/v1/rooms');
        const data = await res.json();
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
        setLoading(true);
        const res = await addRoom(roomName);
        console.log(res);
        if (!res.ok) {
                setError('Error adding room')
                return; 
        }          
        setError('');
        setLoading(false);
        setNewRoom(roomName);
        setRoomName('');
        closeRoomModalRef.current.click();
    };    
    
    async function addRoom(roomName) {
        const res = await fetch('http://localhost:3000/api/v1/rooms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: roomName })
        });
        return res;
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
                loading={loading}
            />
        </div>
        {
            rooms?.map(room => {
                return (
                    <div key={room.id} className='flex justify-between items-center gap-3 mb-6 py-3 px-8 border border-base-300 max-sm:flex-col'>
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
    </div>
  )
}
