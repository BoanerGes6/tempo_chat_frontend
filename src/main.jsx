import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Search from './components/Search.jsx'
import Discoverable from './components/Discoverable.jsx'
import ChatBox from './components/ChatBox.jsx'

const routes = createBrowserRouter([{
  path: "/",
  element: <App />
}, {
  path: "search",
  element: <Search />
},{
  path: "/disc",
  element: <Discoverable />
}, {
  path: "/chat",
  element: <ChatBox />
}])

window.global = window;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>,
)
