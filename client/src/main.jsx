import { StrictMode } from 'react'
import './index.css'
import App from './App.jsx'
import ReactDom from 'react-dom/client'
import  {BrowserRouter} from 'react-router-dom'

ReactDom.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
       <App />
    </BrowserRouter>
  </StrictMode>,
)
