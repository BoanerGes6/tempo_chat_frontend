import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { useNavigate } from 'react-router-dom'
import { deivceNamesPrefix } from './components/DeviceNames'
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {

  const navigate = useNavigate();

  const [deviceName, setDeviceName] = useState("");
  const options = [{id: 1, name: "Search"}, {id: 2, name: "Discoverable"}]

  const handlePage = (name) => {
    if (name === "Search") {
      navigate("/search", { state: { deviceName } });
    } else if (name === "Discoverable") {
      navigate("/disc", { state: { deviceName } });
    }
  }

    useEffect(() => {

      let storedName = sessionStorage.getItem("deviceName");

      if (!storedName) {
        
        const randomPrefix = Math.floor(Math.random() * (deivceNamesPrefix.length));
        const randomSufix = Math.floor(Math.random() * (99 - 10 + 1) + 10);
        storedName= deivceNamesPrefix[randomPrefix] + "_" + randomSufix;
        sessionStorage.setItem("deviceName", storedName);
      } 
      setDeviceName(storedName);
    }, []);
    useEffect(() => {
    const interval = setInterval(() => {
      fetch("https://tempo-chat.onrender.com/devices/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: deviceName })
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [deviceName]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("https://tempo-chat.onrender.com/devices/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: deviceName })
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [deviceName]);

  return (
    <>
      <div className='container'>
        <div className='secondary-container'>
          <p className='logo-title'>Tempo <span>Messanger</span></p>
          <p className='app-discription'>Connect NearBy via Wi-Fi</p>
          <div className='options'>
            {options.map((option) => (
              <div key={option.id} onClick={() => handlePage(option.name)}><p>{option.name}</p></div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
