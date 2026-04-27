import React, { useEffect, useRef } from 'react'
import './Discoverable.css'
import SockJS from 'sockjs-client/dist/sockjs';
import Stomp from 'stompjs';
import { useLocation, useNavigate } from 'react-router-dom'

function Discoverable() {

  const location = useLocation();
  const deviceName = location.state?.deviceName || sessionStorage.getItem("deviceName");
  const stompClientRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {

      // const socket = new SockJS("http://192.168.1.11:8080/ws");
      const socket = new SockJS("https://tempo-chat.onrender.com/ws")
      const stompClient = Stomp.over(socket);

      stompClientRef.current = stompClient;

      stompClient.connect({}, () => {

        console.log("Discoverable connected");

        // ✅ REGISTER DEVICE EVERY 3s
        const interval = setInterval(() => {
          fetch("https://tempo-chat.onrender.com/devices/register", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: deviceName })
          });
        }, 3000);

        // store interval so we can clear later
        stompClientRef.current.interval = interval;

        stompClient.subscribe("/topic/connect/" + deviceName, (msg) => {
          const data = JSON.parse(msg.body);

          if (stompClientRef.current?.connected) {
            stompClientRef.current.send("/app/connect.accept", {}, JSON.stringify({
              from: deviceName,
              to: data.from
            }));
          }
        });

        stompClient.subscribe("/topic/chat/" + deviceName, (msg) => {
          const data = JSON.parse(msg.body);

          navigate("/chat", {
            state: {
              roomId: data.roomId,
              target: data.from === deviceName ? data.to : data.from,
              deviceName: deviceName
            }
          });
        });

      });

      return () => {
        if (stompClientRef.current?.interval) {
          clearInterval(stompClientRef.current.interval);
        }

        if (stompClientRef.current?.connected) {
          stompClientRef.current.disconnect();
        }
      };

    }, [deviceName]);

      return (
    <div className='disc-container'>
      <div className='disc-secondary-container'>
        <p className='disc-title'>Make My Device Discoverable</p>
        <div className='disc-panel'>
          <div className='your-device-name'><span>Device Name: </span>{deviceName}</div>

          <div className='disc-radar'>
            <div className='radar-line1'></div>
            <div className='radar-line2'></div>
            <div className='radar-line3'></div>
            <div className='radar-line4'></div>
            <div className='radar-line5'></div>
            <div className='radar-circle1'></div>
            <div className='radar-circle2'></div>
            <div className='radar-circle3'></div>
            <div className='radar-scanner'></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Discoverable
