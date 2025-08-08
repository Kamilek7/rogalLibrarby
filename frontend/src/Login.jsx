import { useState, useEffect, useRef } from 'react'

const Login = ({error, onLogin}) => {

    const [mode, setMode] = useState("login")
    const loginRef = useRef(null);
    const passRef = useRef(null);
    const register = async (e) => {
        e.preventDefault()
        const dane = {
            login: loginRef.current?.value, haslo: passRef.current?.value
        }
        const url = "https://librarby-backend.rogalrogalrogalrogal.online/register"
        const options = {
            method: "POST",
            headers:  {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(dane)
        }
        const response = await fetch(url, options);
        if (response.status==202)
        {
            onLogin({login:loginRef.current?.value, haslo:passRef.current?.value, e:e});
        }
        else
        {
            const data = await response.json();
            document.getElementById("errorCode").innerHTML = data.message;
            document.getElementById("submit").setAttribute("disabled", "");
        }
        
    }
    return <div class='contentBox'>
        <div class='divTitle'>{mode=="login"? "Zaloguj" : "Zarejestruj się"}</div>
        <p>Zaloguj się do swojego konta lub utwórz nowe, aby umożliwić sprawne korzystanie z portalu!</p>
        <span style={{color:"red", height:"3vh", textAlign:"center"}} id='errorCode'>{error}</span>
        <form class='login' onSubmit={(e) => {mode=="login"? onLogin({login:loginRef.current?.value, haslo:passRef.current?.value, e:e}):register(e)}}>
            <p>Login</p>
            <input ref={loginRef} type='text'></input>
            <p>Hasło</p>
            <input ref={passRef} type='password'></input>
            <input id='submit' type='submit' value={mode=="login"?"Zaloguj się":"Zarejestruj się"}></input>
        </form>
        <button onClick={()=>{mode=="login"? setMode("register"):setMode("login")}}>{mode=="login"?"Załóż konto":"Zaloguj się"}</button>
    </div> 
}
export default Login
