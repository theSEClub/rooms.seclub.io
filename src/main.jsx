import React from 'react'
import ReactDOM from 'react-dom/client'
import Room from './routes/Room'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import PrivateRoute from './routes/PrivateRoute'
import { loader as roomLoader } from './routes/Room'
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
        loader: roomLoader,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
