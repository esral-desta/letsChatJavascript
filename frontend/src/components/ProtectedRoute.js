import {Navigate} from "react-router-dom"
import { useAuthContext } from "../hooks/useAuthContext";

export function ProtectedRoute({children}){
   const {user} =  useAuthContext()
    if(!user){
        console.log("redirected by ProtectedRoute b/c no user");
        return <Navigate to="/login" replace />;
    }
    return children;
}