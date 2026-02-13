import { BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css'
import AppRoutes from './Routes/AppRoutes';
import { ThemeProvider } from './Context/ThemeContext';
import { ToastContainer } from 'react-toastify'
import { ModalProvider } from './Context/ModalContext';


function App() {

  return (
    <>
      <Router>
        <ThemeProvider>
          <ModalProvider>
            <ToastContainer position='top-right' />
            <AppRoutes />
          </ModalProvider>
        </ThemeProvider>
      </Router>
    </>
  )
}

export default App
