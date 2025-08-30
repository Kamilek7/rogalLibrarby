import { useState } from 'react'
import './App.css'
import Login from './Login.jsx'
import UserBoard from './UserBoard.jsx'
import { useCookies } from 'react-cookie'

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(['loginID']);
  const [errorState, setError] = useState("");
  

  const wyloguj = () => {
        setCookie("loginID", 0);
        setError("");;
  }

  const handleLogin = async (data) => {
    data.e.preventDefault()
    const dane = {
      login: data.login, haslo: data.haslo
    }
    const url = "https://librarby-backend.rogalrogalrogalrogal.online/login"
    const options = {
      method: "POST",
      headers:  {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(dane)
    }
    const response = await fetch(url, options);
    const loginData = await response.json();
    if (response.status==203){
      setError("");
      setCookie('loginID', loginData.dane);
    }
    else
    {
      setError(loginData.message);
    }

  }


  const userDivs = () => {
    return (<div>
      {}</div>
    )
  }

  return (
    <>
      {cookies.loginID ? <UserBoard setCookie={setCookie} userID={cookies.loginID} wyloguj={wyloguj} /> : <Login error={errorState} onLogin={handleLogin}/>}
    
    </>
  )
}

export default App
