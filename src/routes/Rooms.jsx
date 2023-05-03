import React, { useState } from 'react'
import { Link } from 'react-router-dom';

export default function Rooms() {

    const [rooms, setRooms] = useState([{name: 'room1', id: 1}, {name: 'room2', id: 2}]);

  return (
    <div className='w-1/2 min-w-[200px]'>
        <div className='flex items-center justify-between mb-6'>
            <h1 className='text-center text-2xl'>All Rooms</h1>
            <Link to='/create' tabIndex={'-1'}>
                <button className="btn btn-outline btn-secondary">
                    Create Room
                </button>
            </Link>
        </div>
        {
            rooms.map(room => {
                return (
                    <div key={room.id} className='flex justify-around items-center gap-3 mb-6 p-3 border border-base-300 rounded-lg max-sm:flex-col'>
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
