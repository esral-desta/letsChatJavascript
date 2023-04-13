import { useState } from "react"
import { useAuthContext } from "../hooks/useAuthContext";

export function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {dispatch} = useAuthContext()

    function hundleSubmit(e) {

        e.preventDefault()
        console.log("form submiting")
        console.log(JSON.stringify({ username, password }));

        fetch("http://127.0.0.1:8000/auth/login/",
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                method: "POST",
                body: JSON.stringify({ username:username ,password:password })
            }).then(res=>res.json()).then(data=>{
                // localStorage.setItem("token",data["token"])
                console.log("data",data);
                dispatch({type: 'LOGIN', payload: {"token":data["token"],"username":data["user"]["username"]}})
            })
        }
    return (
        <div>
            <form onSubmit={hundleSubmit}>
                <input type="text" name="username" id="username" value={username} onChange={e => { setUsername(e.target.value) }} />
                <input type="password" name="password" id="password" value={password} onChange={e => { setPassword(e.target.value) }} />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}
