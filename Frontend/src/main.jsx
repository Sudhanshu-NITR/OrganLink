import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layout.jsx'
import Home from './components/Home/Home.jsx'
import Register from './components/Register/Register.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'
import Login from './components/Login/Login.jsx'
import Admin from './components/Admin/Admin.jsx'
import AuthLayout from './AuthLayout.jsx'
import Container from './Container.jsx'

const router = createBrowserRouter([  
  {
    path: "/",
    element: (
      <Container>
        <Layout/>
      </Container>
    ),
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "/register",
        element: <Register/>
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        )
      },
      {
        path: "/admin",
        element: (
          <AuthLayout authentication={true}>
            <Admin />
          </AuthLayout>
        )
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
)
