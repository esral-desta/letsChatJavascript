import { Link, Outlet } from "react-router-dom";


export function Navbar() {
    return (
        <div className="nav">
            <div className="title">
                <h1><Link to="/">Let'sChat</Link></h1>
            </div>
            <div className="links">
                <Link to="/">Chats</Link>
                <Link to="/login">Login</Link>
            </div>
                <Outlet />
        </div>
    )
}