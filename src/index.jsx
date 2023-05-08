import React from 'react'
import ReactDOM from 'react-dom/client'
import Room from './routes/Room'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import PrivateRoute from './routes/PrivateRoute'
import App from './routes/App'
import Landing from './routes/Landing'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: '/room/:id',
        element: <PrivateRoute><Room /></PrivateRoute>,
      },
    ],
  },
])

export default function Index() {
  return (
    <RouterProvider router={router} />
  )
}
