import React, { useEffect, useState } from 'react'
import Rooms from './Rooms';
import Header from '../components/Header';
import { checkLocalStorage } from '../helpers/helper';

export default function App() {

  const [entered, setEntered] = useState(false);

  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (checkLocalStorage()) {
      setEntered(true);
      setUsername(localStorage.getItem("username"));
    }
  }, [])

  function handleSubmit(e) {
    e.preventDefault();
    if (username.length > 0) {
      setError("");
      setEntered(true);
      localStorage.setItem("username", username);
    } else {
      setError("Please enter a username.");
    }
  }

  return (
    <>
      <div className='h-screen main-background'>

        <Header />

        <div className={entered
          ? 'hidden'
          : 'flex items-center justify-center py-6'}>
          <div className="alert shadow-lg w-fit p-0">

            <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col items-center justify-center gap-6 w-full relative p-6">

              {checkLocalStorage() &&
                <span onClick={() => setEntered(true)} className="btn btn-sm btn-circle absolute right-2 top-2 bg-base-200 border-secondary text-secondary hover:bg-secondary hover:border-secondary hover:text-base-200">✕</span>
              }

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

              <button className="btn btn-outline btn-secondary" type='submit'>Submit</button>

            </form>

          </div>
        </div>

        {entered &&
          <div>

            <div className='flex flex-col items-center justify-center py-6 px-3'>
              <div className='text-lg mb-6'>
                Welcome to the SE Rooms, <span className='text-secondary'>{username}</span>!
              </div>
              <button onClick={() => setEntered(false)} className="btn btn-outline btn-secondary">Change username</button>
            </div>

            <div className='flex items-center justify-center py-6 border-t border-base-200'>
              <Rooms />
            </div>
            
          </div>
        }

      </div>
    </>
  )
}
