//prop
const LightBulb = ({ state }) => {
    const isOn = state === 'on';
    
    return (
      <div className="lightbulb-container">
        <div className={`lightbulb ${isOn ? 'on' : 'off'}`}>
          <div className="bulb">
            <div className="filament"></div>
          </div>
          <div className="base"></div>
        </div>
        <p className="status">Status: {isOn ? 'ON' : 'OFF'}</p>
        
        <style jsx>{`
          .lightbulb-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 1rem 0;
          }
          
          .lightbulb {
            position: relative;
            height: 100px;
            width: 60px;
            margin-bottom: 1rem;
          }
          
          .bulb {
            position: absolute;
            top: 0;
            width: 60px;
            height: 60px;
            background-color: ${isOn ? '#ffdd55' : '#e0e0e0'};
            border-radius: 50%;
            box-shadow: ${isOn ? '0 0 20px 5px rgba(255, 221, 85, 0.6)' : 'none'};
            transition: all 0.3s ease;
          }
          
          .filament {
            position: absolute;
            top: 15px;
            left: 15px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: ${isOn ? '2px solid #ff8800' : '2px solid #999'};
            transition: all 0.3s ease;
          }
          
          .base {
            position: absolute;
            bottom: 0;
            left: 20px;
            width: 20px;
            height: 40px;
            background-color: #b3b3b3;
            border-radius: 5px 5px 3px 3px;
          }
          
          .status {
            font-weight: bold;
            color: ${isOn ? '#008800' : '#333'};
          }
        `}</style>
      </div>
    );
  };
  
  export default LightBulb;