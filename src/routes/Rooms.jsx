import React, { useState } from 'react'

export default function Rooms() {

    const [rooms, setRooms] = useState([{name: 'room1', id: 1}, {name: 'room2', id: 2}]);

  return (
    <div className='w-1/2 min-w-[200px]'>
        <div className='flex items-center justify-between mb-6'>
        <h1 className='text-center text-2xl'>All Rooms</h1>
            <button className='btn btn-outline btn-secondary'>
                <a href='/create'>Create Room</a>
            </button>
        </div>
        {
            rooms.map(room => {
                return (
                    <div key={room.id} className='flex justify-around items-center gap-3 mb-6 p-3 border border-base-300 rounded-lg max-sm:flex-col'>
                        <h2 className='capitalize text-base'>{room.name}</h2>
                        <button className='btn btn-outline btn-secondary'>
                            <a href={`/${room.id}`}>Join Room</a>
                        </button>
                    </div>
                )
            }
            )
        }
    </div>
  )
}
