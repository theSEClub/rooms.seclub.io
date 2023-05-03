import React from 'react'
import { checkLocalStorage } from '../helpers/helper'
import { Navigate } from 'react-router-dom'

export default function PrivateRoute({children}) {
  return (
    <>
        {
            checkLocalStorage() 
            ? children 
            : <Navigate to='/' />
        }
    </>
  )
}
