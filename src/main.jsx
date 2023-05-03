import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './routes/App'
import Room from './routes/Room'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { checkLocalStorage } from './helpers/helper'
import PrivateRoute from './routes/PrivateRoute'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/create',
    element: checkLocalStorage() ? <App /> : <App />,
  },
  {
    path: '/room/:id',
    element: <PrivateRoute><Room /></PrivateRoute>,
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
