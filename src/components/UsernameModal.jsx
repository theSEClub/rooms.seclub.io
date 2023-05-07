import React from 'react'
import { checkLocalStorage } from '../helpers/helper'

export default function UsernameModal({ username, setUsername, handleSubmit, openModalRef, closeModalRef, error }) {
    return (
        <>
            <label htmlFor="my-modal-4" className="btn btn-secondary" ref={openModalRef}>Change username</label>
            <input type="checkbox" id="my-modal-4" className="modal-toggle" />
            <label htmlFor="my-modal-4" className="modal cursor-pointer">
              <label className="modal-box relative" htmlFor="">
                <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col items-center justify-center gap-6 w-full relative p-6">

                    <div className='modal-action'>
                      <label ref={closeModalRef} htmlFor="my-modal-4" 
                        className={ checkLocalStorage() 
                          ? 'btn btn-sm btn-circle absolute right-2 top-2 bg-base-100 border-secondary text-secondary hover:bg-secondary hover:border-secondary hover:text-base-200'
                          : 'hidden'
                        }>
                          x
                      </label>
                    </div>

                  <div className="form-control w-full max-w-xs">
                    <label className="label">
                      <span className="label-text text-secondary">Enter a username:</span>
                    </label>
                    <input type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} className="input input-bordered input-secondary w-full max-w-xs text-secondary" />
                    {error &&
                      <label className="label">
                        <span className="label-text-alt text-error">{error}</span>
                      </label>
                    }
                  </div>

                  <button type='submit' className='btn btn-secondary'>
                    Submit
                  </button>

                </form>
              </label>
            </label>
        </>
    )
}
