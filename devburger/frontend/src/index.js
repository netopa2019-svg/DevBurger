import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App'
import GlobalStyles from './styles/global'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <GlobalStyles />
    <Toaster position="top-right" toastOptions={{ style: { background: '#1e1e2e', color: '#fff', border: '1px solid #333' } }} />
    <App />
  </React.StrictMode>
)
