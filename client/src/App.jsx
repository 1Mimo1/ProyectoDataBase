//import { useState } from 'react'
import './App.css'
import { useState, useEffect } from 'react'
import { Route,  Routes, useNavigate } from 'react-router-dom';
import Info from './Info';
import Query from './Query';

const Login = ({setVerification, username, setUsername, password, setPassword, verification}) =>{
    const navigate = useNavigate();
    const verificationButton = () => {
      if((username === 'Isabel' && password === '235689' )) {
        setVerification(true)
      }
      else{
        setVerification(false)
      }    
    }
    useEffect (() => {
      if(verification === true)
      {
        navigate('/Info')
      }
      else if (verification === false)
      {
        alert("Fail")
        setPassword('')
        setVerification(null)
      }
    }, [verification, navigate, setPassword, setVerification])
  return (
    <>
      <section className='login'>
        <div className='login_div'>
          <div>
            <h1>Log In</h1>
            <h1>Welcome!</h1>
          </div>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Enter Username . . .'/>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter Password . . .'/>
          <button className='login_button' onClick={verificationButton}> Verify </button>
        </div>
      </section>
    </>
  )
}


function App() {
  const [verification, setVerification] = useState(null)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
        <Routes>
            <Route
                path="/"
                element={
                    <Login
                        setVerification={setVerification}
                        username={username}
                        setUsername={setUsername}
                        password={password}
                        setPassword={setPassword}
                        verification={verification}
                    />
                }
            />
            <Route path="/Info" element={<Info username={username} />} />
            <Route path="/query" element={<Query/>} />
        </Routes>
    )

}

export default App
