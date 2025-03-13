import { useState, useEffect } from 'react';
import Head from 'next/head';
import VoiceControl from '../components/VoiceControl';
import LightBulb from '../components/LightBulb';
import Thermostat from '../components/Thermostat';

export default function Home() {
  const [devices, setDevices] = useState({
    light: { state: 'off' },
    thermostat: { value: 70 }
  });
  const [commandResult, setCommandResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch initial device states
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/devices');
      const data = await response.json();
      
      // Convert array to object for easier access
      const devicesObj = {};
      data.forEach(device => {
        devicesObj[device.name] = {
          state: device.state,
          value: device.value
        };
      });
      
      setDevices(devicesObj);
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  };

  const handleVoiceCommand = async (command) => {
    setIsLoading(true);
    setCommandResult(`Processing: "${command}"`);
    
    try {
      const response = await fetch('http://localhost:5000/api/command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ command })
      });
      
      const data = await response.json();
      
      if (data.error) {
        setCommandResult(`Error: ${data.error}`);
      } else {
        // Update local state based on the response
        if (data.device === 'light') {
          setDevices(prev => ({
            ...prev,
            light: { ...prev.light, state: data.state }
          }));
          setCommandResult(`Light turned ${data.state}`);
        } else if (data.device === 'thermostat') {
          setDevices(prev => ({
            ...prev,
            thermostat: { ...prev.thermostat, value: data.value }
          }));
          setCommandResult(`Thermostat set to ${data.value}°F`);
        }
      }
    } catch (error) {
      console.error('Error processing command:', error);
      setCommandResult('Error connecting to server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <Head>
        <title>Voice Controlled IoT Dashboard</title>
        <meta name="description" content="Control IoT devices with voice commands" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
          Voice Controlled IoT Dashboard
        </h1>

        <VoiceControl onCommand={handleVoiceCommand} isLoading={isLoading} />
        
        <div className="status">
          <p>{commandResult}</p>
        </div>

        <div className="grid">
          <div className="card">
            <h2>Light Control</h2>
            <LightBulb state={devices.light?.state || 'off'} />
            <p>Say "light on" or "light off" to control</p>
          </div>

          <div className="card">
            <h2>Thermostat</h2>
            <Thermostat value={devices.thermostat?.value || 70} />
            <p>Say "increase temperature" or "decrease temperature" to adjust</p>
          </div>
        </div>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 3rem;
          text-align: center;
        }

        .status {
          margin: 1rem 0;
          min-height: 2rem;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 800px;
          margin-top: 2rem;
        }

        .card {
          margin: 1rem;
          padding: 1.5rem;
          text-align: center;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
          width: 300px;
        }

        .card h2 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 1rem 0 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}