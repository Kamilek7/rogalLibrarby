import { useState } from 'react'
import './App.css'
import SearchBar from './SearchBar.jsx'
import BookSearched from './BookSearched.jsx'
import Login from './Login.jsx'
import UserBoard from './UserBoard.jsx'
import { useCookies } from 'react-cookie'

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(['loginID']);
  const [errorState, setError] = useState("");
  const [errorStateBooks, setErrorBook] = useState("");
  const [foundBooks, setBooks] = useState([])

  const wyloguj = () => {
        setCookie("loginID", 0);
        setError("");;
        setErrorBook("");
  }

  const fetchSearchedBooks = (bookData) => {
    setErrorBook("")
    if (bookData!=0)
      setBooks(bookData);
    else
      setErrorBook("Nie znaleziono żadnej książki o danej nazwie!");
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
      {cookies.loginID ? <UserBoard setCookie={setCookie} userID={cookies.loginID} booksFromOtherPart={foundBooks} wyloguj={wyloguj} /> : <Login error={errorState} onLogin={handleLogin}/>}</div>
    )
  }

  return (
    <>
    <SearchBar callback={fetchSearchedBooks} user={cookies.loginID}></SearchBar>
    <span style={{"color":"red"}}>{errorStateBooks}</span>
    {foundBooks.length!=0 ? <BookSearched bookData={foundBooks} reset={setBooks} userID={cookies.loginID}></BookSearched> : <div>{userDivs()}</div>}
    
    </>
  )
}

export default App
