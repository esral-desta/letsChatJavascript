import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuthContext } from "../hooks/useAuthContext"

export function Conversations() {
    const { user } = useAuthContext()
    const [ users, setUsers ] = useState()


    function createConversationName(username) {
        const namesAlph = [user?.username, username].sort();
        return `${namesAlph[0]}__${namesAlph[1]}`;
    }

    useEffect(()=>{
        async function fetchUsers(){

            const res = await fetch("http://127.0.0.1:8000/api/users/",{
                headers:{
                    Authorization:`Token ${user?.token}`
                }
            })

            const data = await res.json()
            setUsers(data)
        }
        fetchUsers()
    },[])

    return (
        <div>
            {users &&

                users
                    .filter(u => u !== user?.username)
                    .map(u =>
                    (
                        <Link to={`chat/${createConversationName(u.username)}`} key={u.username}>
                            <div>
                                {u.username}
                            </div>
                        </Link>
                    )
                    )
            }
        </div>
    )
}