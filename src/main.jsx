import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './routes/App'
import Room from './routes/Room'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import PrivateRoute from './routes/PrivateRoute'
import { loader as roomLoader } from './routes/Room'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/room/:id',
    element: <PrivateRoute><Room /></PrivateRoute>,
    loader: roomLoader,
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)
