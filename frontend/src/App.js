import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Chat } from "./components/Chat";
import { Conversations } from "./components/Conversations";
import { Login } from "./components/Login";
import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthContextProvider } from "./context/AuthContext";
import { ActiveConversations } from "./components/ActiveConversations";

export default function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>

          <Route path="/" element={<Navbar />}>
            <Route path="" element={<ProtectedRoute><Conversations /></ProtectedRoute>} />
            <Route path="conversations/" element={<ProtectedRoute><ActiveConversations /></ProtectedRoute>} />
            <Route path="chat/:conversationName" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="login" element={<Login />} />
          </Route>
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
}