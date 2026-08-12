import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Auto-hiding scrollbar event listener
let scrollTimer = null
window.addEventListener(
  'scroll',
  () => {
    document.body.classList.add('is-scrolling')
    if (scrollTimer) clearTimeout(scrollTimer)
    scrollTimer = setTimeout(() => {
      document.body.classList.remove('is-scrolling')
    }, 1000)
  },
  { capture: true, passive: true }
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
