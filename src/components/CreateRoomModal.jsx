import React from 'react'

export default function CreateRoomModal({ roomName, setRoomName, handleSubmit, openModalRef, closeModalRef, error }) {
    return (
        <>
            <label htmlFor="my-modal-3" className="btn btn-secondary btn-outline" ref={openModalRef}>Create Room</label>
            <input type="checkbox" id="my-modal-3" className="modal-toggle" />
            <label htmlFor="my-modal-3" className="modal cursor-pointer">
                <label className="modal-box relative" htmlFor="">
                    <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col items-center justify-center gap-6 w-full relative p-6">

                        <div className='modal-action'>
                            <label ref={closeModalRef} htmlFor="my-modal-3"
                                className='btn btn-sm btn-circle absolute right-2 top-2 bg-base-100 border-secondary text-secondary hover:bg-secondary hover:border-secondary hover:text-base-200'>
                                x
                            </label>
                        </div>

                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text text-secondary">Enter room name:</span>
                            </label>
                            <input type="text" placeholder="new room" value={roomName} onChange={(e) => setRoomName(e.target.value)} className="input input-bordered input-secondary w-full max-w-xs text-secondary" />
                            {error &&
                                <label className="label">
                                    <span className="label-text-alt text-error">{error}</span>
                                </label>
                            }
                        </div>

                        <button type='submit' className='btn btn-secondary'>
                            Enter
                        </button>

                    </form>
                </label>
            </label>
        </>
    )
}
