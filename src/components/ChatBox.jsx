import React, { useEffect, useRef, useState } from 'react'
import './ChatBox.css'
import { useLocation } from 'react-router-dom';
import SockJS from 'sockjs-client/dist/sockjs';
import Stomp from 'stompjs'

function ChatBox() {

  const location = useLocation();
    const { roomId, target } = location.state || {}; // Get data from navigate
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const deviceName = location.state?.deviceName || sessionStorage.getItem("deviceName");
    const stompClientRef = useRef(null);

    const hasConnected = useRef(false);
    const chatAreaRef = useRef(null);

  useEffect(() => {

      if (!roomId || hasConnected.current) return;

      hasConnected.current = true; // ✅ prevent double run

      const socket = new SockJS("https://tempo-chat.onrender.com/ws");
      const stompClient = Stomp.over(socket);

      stompClientRef.current = stompClient;

      stompClient.connect({}, () => {
        console.log("ChatBox connected");

        stompClient.subscribe("/topic/messages/" + roomId, (msg) => {
          const message = JSON.parse(msg.body);

          setMessages(prev => [...prev, message]);
        });
      });

      return () => {
        if (stompClientRef.current?.connected) {
          stompClientRef.current.disconnect();
        }
      };

    }, [roomId]);
    useEffect(() => {
      if (chatAreaRef.current) {
        chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
      }
    }, [messages]);

  const sendMessage = () => {
      if (!stompClientRef.current || !stompClientRef.current.connected) return;

      stompClientRef.current.send("/app/chat.send", {}, JSON.stringify({
          roomId,
          sender: deviceName,
          message: text
      }));

      setText("");
  };

  return (
    <div className='chatbox-container'>
      <div className='chatBox-secondary-container'>
        <p className='chatbox-title'>Chat With <span>{target}</span></p>
        <div className='chat-area' ref={chatAreaRef}>
          {messages.map((m, i) => {
            const isMe = m.sender?.trim() === deviceName?.trim();
            return(
            <div key={i}>
              <p className='text-style' style={{ color: isMe ? "green" : "white" }}>
                {m.sender}: {m.message}</p>
            </div>
          )})}
        </div>
        <div className='text-area'>
          <input type='text' value={text} onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
              }
            }} />
          <button onClick={sendMessage}><i className="bi bi-send-fill"></i></button>
        </div>
      </div>
    </div>
  )
}

export default ChatBox
