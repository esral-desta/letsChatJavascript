import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


import { useAuthContext } from "../hooks/useAuthContext";

export function ActiveConversations() {
    const { user } = useAuthContext()

  const [conversations, setActiveConversations] = useState([]);


  async function fetchCoversations() {
    const res = await fetch("http://10.240.69.155:8000/api/conversations/", {
      headers: {
        Authorization: `Token ${user.token}`
      }
    });
    const data = await res.json();
    setActiveConversations(data);
  }

  useEffect(() => {
    fetchCoversations();
  }, [user]);

  function createConversationName(username) {
    const namesAlph = [user?.username, username].sort();
    return `${namesAlph[0]}__${namesAlph[1]}`;
  }

  function formatMessageTimestamp(timestamp) {
    if (!timestamp) return;
    const date = new Date(timestamp);
    return date.toLocaleTimeString().slice(0, 5);
  }

  return (
    <div>
      {conversations.map((c) => (
        <Link
          to={`/chat/${createConversationName(c.other_user.username)}`}
          key={c.other_user.username}
        >
          <div className="border border-gray-200 w-full p-3">
            <h3 className="text-xl font-semibold text-gray-800">{c.other_user.username}</h3>
            <div className="flex justify-between">
              <p className="text-gray-700">{c.last_message?.content}</p>
              <p className="text-gray-700">{formatMessageTimestamp(c.last_message?.timestamp)}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}