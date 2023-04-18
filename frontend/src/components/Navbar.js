import { Link, Outlet } from "react-router-dom";


export function Navbar() {
    return (
        <div className="nav">
            <div className="title">
                <h1><Link to="/">Let'sChat</Link></h1>
            </div>
            <div className="links">
                <Link
                    to="/conversations"
                    className="block py-2 pr-4 pl-3 text-white md:p-0 dark:text-white"
                    aria-current="page">
                    Active Conversations
                </Link>
                <Link to="/">Chats</Link>
                <Link to="/login">Login</Link>
            </div>


            <Outlet />
        </div>
    )
}