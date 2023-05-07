import React, { useEffect, useRef, useState } from 'react'
import Rooms from '../components/Rooms';
import Header from '../components/Header';
import { checkLocalStorage } from '../helpers/helper';
import UsernameModal from '../components/UsernameModal';

export default function App() {


  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const openModalRef = useRef(null);
  const closeModalRef = useRef(null);

  useEffect(() => {
    if (checkLocalStorage()) {
      setUsername(localStorage.getItem("username"));
    } else {
      openModalRef.current.click();
    }
  }, [])

  function handleSubmit(e) {
    e.preventDefault();
    if (username.length > 0) {
      setError("");
      localStorage.setItem("username", username);
      closeModalRef.current.click();
    } else {
      setError("Please enter a username.");
    }
  }

  return (
    <>
      <div className='h-screen main-background'>

        <Header />

        <div>

          <div className='flex flex-col items-center justify-center py-6 px-3'>
            <div className='text-lg mb-6'>
              Welcome to the SE Rooms <span className='text-secondary'>{username}</span>!
            </div>
            <UsernameModal username={username} setUsername={setUsername} handleSubmit={handleSubmit} openModalRef={openModalRef} closeModalRef={closeModalRef} error={error} setError={setError} />
          </div>

          <div className='flex items-center justify-center py-6 border-t border-base-200'>
            <Rooms />
          </div>

        </div>

      </div>
    </>
  )
}
