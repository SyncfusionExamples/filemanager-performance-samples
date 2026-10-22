import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// @ts-expect-error Performance.jsx has no type declarations
import App from './Performance.jsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
