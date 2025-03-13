const Thermostat = ({ value = 70 }) => {
    // Determine color based on temperature value
    const getColor = () => {
      if (value < 65) return '#3498db'; // Cool blue
      if (value > 75) return '#e74c3c'; // Warm red
      return '#2ecc71'; // Comfortable green
    };
    
    // Calculate the progress angle for the dial (0-180 degrees)
    const progressAngle = ((value - 50) / 40) * 180; // 50-90 range mapped to 0-180
    
    return (
      <div className="thermostat">
        <div className="dial">
          <div className="temperature">{value}°F</div>
          <div className="indicator" style={{ transform: `rotate(${progressAngle}deg)` }}></div>
        </div>
        <div className="scale">
          <span>50°</span>
          <span>70°</span>
          <span>90°</span>
        </div>
        
        <style jsx>{`
          .thermostat {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 1rem;
          }
          
          .dial {
            position: relative;
            width: 150px;
            height: 150px;
            border-radius: 50%;
            background-color: #f5f5f5;
            border: 10px solid #e0e0e0;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            margin-bottom: 1rem;
          }
          
          .temperature {
            font-size: 2rem;
            font-weight: bold;
            color: ${getColor()};
          }
          
          .indicator {
            position: absolute;
            bottom: 50%;
            left: 50%;
            width: 4px;
            height: 50px;
            background-color: ${getColor()};
            transform-origin: bottom center;
            border-radius: 4px;
          }
          
          .scale {
            display: flex;
            justify-content: space-between;
            width: 150px;
          }
          
          .scale span {
            font-size: 0.8rem;
            color: #666;
          }
        `}</style>
      </div>
    );
  };
  
  export default Thermostat;