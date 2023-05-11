import React from 'react'

export default function Modal({ modalName, label, inputPrompt, inputPlaceholder, inputValue, inputOnChange, handleSubmit, openModalRef, closeModalRef, error }) {

    return (
        <>
            <label htmlFor={modalName} className="btn btn-secondary btn-outline" ref={openModalRef}>{label}</label>
            <input type="checkbox" id={modalName} className="modal-toggle" />
            <label htmlFor={modalName} className="modal cursor-pointer">
                <label className="modal-box relative" htmlFor="">
                    <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col items-center justify-center gap-6 w-full relative p-6">

                        <div className='modal-action'>
                            <label ref={closeModalRef} htmlFor={modalName}
                                className='btn btn-sm absolute right-2 top-2 bg-base-100 border-secondary text-secondary hover:bg-secondary hover:border-secondary hover:text-base-200'>
                                x
                            </label>
                        </div>

                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text text-secondary">{inputPrompt}</span>
                            </label>
                            <input 
                                type="text" 
                                placeholder={inputPlaceholder} 
                                value={inputValue} 
                                onChange={(e) => inputOnChange(e.target.value)} 
                                className="input input-bordered input-secondary w-full max-w-xs text-secondary" />

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
