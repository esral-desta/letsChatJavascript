import useWebsocket, { ReadyState } from "react-use-websocket"
import { useEffect, useState } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";
import { json, useParams } from "react-router-dom";

export function Chat() {
  const { user } = useAuthContext()
  const { conversationName } = useParams()
  const [welcomeMessage, setWelcomeMessage] = useState("")
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [messageHistory, setMessageHistory] = useState([])

  const { readyState, sendJsonMessage } = useWebsocket(`ws://127.0.0.1:8000/chat/${conversationName}`, {
    queryParams: {
      token: user ? user.token : "",
    },
    onOpen: () => {
      console.log("connected");
      sendJsonMessage({
        type: "last_10_messages",
      });
    },
    onClose: () => {
      console.log("disconected");
    },
    onMessage: (e) => {
      const data = JSON.parse(e.data)
      switch (data.type) {
        case "welcome_message":
          setWelcomeMessage(data.message);
          break;
        case "chat_message_echo":
          console.log("got new message", data);
          setMessageHistory((prev) => prev.concat(data));
          break;
        default:
          console.error("unknown message type");
          break;
      }
    }
  })

  function handleChangeMessage(e) {
    setMessage(e.target.value);
  }

  function handleChangeName(e) {
    setName(e.target.value);
  }
  function handleSubmit() {
    sendJsonMessage({
      type: "chat_message",
      message,
      name
    });
    setName("");
    setMessage("");
  }

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated"
  }[readyState];

  async function fetchMessages() {

    const apiRes = await fetch(
      `http://localhost:8000/chat/last10messages?conversation=${conversationName}`,
      
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`
        }
      }
    );
      apiRes.json().then(data=>{
        console.log(data)
        // setMessageHistory((prev) => prev.concat(data));
      })
  }

useEffect(()=>{
  fetchMessages()
},[])

return (
  <div className="App">
    <span>The WebSocket is currently {connectionStatus} {welcomeMessage}</span>
    <hr />
    <input
      name="name"
      placeholder='Name'
      onChange={handleChangeName}
      value={name}
      className="shadow-sm sm:text-sm border-gray-300 bg-gray-100 rounded-md" />
    <input
      name="message"
      placeholder='Message'
      onChange={handleChangeMessage}
      value={message}
      className="ml-2 shadow-sm sm:text-sm border-gray-300 bg-gray-100 rounded-md" />
    <button className='ml-3 bg-gray-300 px-3 py-1' onClick={handleSubmit}>
      Submit
    </button>
    <hr />
    <hr />
    <ul>
      {messageHistory.map((message, idx) => (
        <div className='border border-gray-200 py-3 px-3' key={idx}>
          {message.name}: {message.message}
        </div>
      ))}
    </ul>
    {user.username}
  </div>
);
}