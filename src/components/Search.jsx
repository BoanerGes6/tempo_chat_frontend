import React, { useEffect, useRef, useState } from 'react'
import './Search.css'
import { useLocation, useNavigate } from 'react-router-dom'
import SockJS from 'sockjs-client/dist/sockjs';
import Stomp from 'stompjs'

function Search() {

    const location = useLocation();
    const deviceName = location.state?.deviceName || sessionStorage.getItem("deviceName");
    const [devices, setDevices] = useState([]);
    const stompClientRef = useRef(null);
    const navigate = useNavigate();


    useEffect(() => {
        const socket = new SockJS("https://tempo-chat.onrender.com/ws");
        const stompClient = Stomp.over(socket);

        stompClientRef.current = stompClient; // ✅ store here

        stompClient.connect({}, () => {
            console.log("Connected as:", deviceName);
<<<<<<< HEAD
            fetch("https://tempo-chat.onrender.com/devices")
              .then(res => res.json())
              .then(data => setDevices(data));
=======

            fetch("https://tempo-chat.onrender.com/devices")
                .then(res => res.json())
                .then(data => setDevices(data));

>>>>>>> f7a7bdd (added mobile UI)
            stompClient.subscribe("/topic/devices", (message) => {
                console.log("Devices list:", message.body);
                setDevices(JSON.parse(message.body));
            });

            stompClient.subscribe("/topic/connect/" + deviceName, (msg) => {
                console.log("Incoming connect request:", msg.body);

                const data = JSON.parse(msg.body);

                stompClient.send("/app/connect.accept", {}, JSON.stringify({
                    from: deviceName,
                    to: data.from
                }));
            });

            stompClient.subscribe("/topic/chat/" + deviceName, (msg) => {
                console.log("Chat created:", msg.body);

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
    }, []);

    const handleConnect = (targetDevice) => {
        if (!stompClientRef.current || !stompClientRef.current.connected) {
            console.log("Not connected yet");
            return;
        }

        stompClientRef.current.send("/app/connect.request", {}, JSON.stringify({
            from: deviceName,
            to: targetDevice
        }));
    } 

  return (
    <div className='search-container'>
        <div className='search-secondary-container'>
            <p className='search-title'>Search</p>
            <div className='search-panel'>
                <div className='your-device-name'><span>Device Name: </span>{deviceName}</div>
                <div className='others-device-name'>
                    <div className='available-device-title'>Available Devices</div>
                    {devices
                        .filter(d => d.name !== deviceName)
                        .map((d, index) => (
                            <div key={index} className="discovered-devices"
                            onClick={() => handleConnect(d.name)}>{d.name}</div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Search
