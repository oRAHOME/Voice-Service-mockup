from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
import re

app = Flask(__name__)
CORS(app)
# Configure database with the provided Neon PostgreSQL connection string
db_url = os.environ.get('DATABASE_URL', 'postgresql://neondb_owner:npg_SWUg7ubs6hJK@ep-proud-sunset-aaup75g7-pooler.westus3.azure.neon.tech/neondb?sslmode=require')
app.config['SQLALCHEMY_DATABASE_URI'] = db_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Define models directly in app.py for simplicity
class Device(db.Model):
    __tablename__ = 'devices'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    state = db.Column(db.String(10), default='off')
    value = db.Column(db.Integer, default=0)
    
    def __repr__(self):
        return f'<Device {self.name}>'

# For newer Flask versions, we need to create tables differently
with app.app_context():
    db.create_all()

@app.route('/api/command', methods=['POST'])
def process_command():
    data = request.json
    command = data.get('command', '').lower()
    
    # Process light commands
    if 'light' in command:
        light = Device.query.filter_by(name='light').first()
        
        if not light:
            # Create light device if it doesn't exist
            light = Device(name='light', state='off', value=0)
            db.session.add(light)
        
        if 'on' in command:
            light.state = 'on'
        elif 'off' in command:
            light.state = 'off'
        
        db.session.commit()
        return jsonify({'device': 'light', 'state': light.state})
    
    # Process thermostat commands
    elif any(word in command for word in ['temperature', 'thermostat']):
        thermostat = Device.query.filter_by(name='thermostat').first()
        
        if not thermostat:
            # Create thermostat device if it doesn't exist
            thermostat = Device(name='thermostat', state='on', value=70)
            db.session.add(thermostat)
        
        # Handle reset temperature command - resets to 60 degrees
        if 'reset' in command:
            thermostat.value = 60
            db.session.commit()
            return jsonify({
                'device': 'thermostat', 
                'value': thermostat.value, 
                'message': 'Temperature reset to 60°F'
            })
        
        # Handle "make temperature to [value]" command
        elif 'make temperature to' in command:
            # Extract the temperature value using regex
            temp_match = re.search(r'make temperature to\s+(\d+)', command)
            if temp_match:
                temp_value = int(temp_match.group(1))
                # Apply temperature limits
                temp_value = max(50, min(temp_value, 90))  # Between 50 and 90
                thermostat.value = temp_value
                db.session.commit()
                return jsonify({'device': 'thermostat', 'value': thermostat.value, 'message': f'Temperature set to {temp_value}°F'})
            else:
                return jsonify({'error': 'Temperature value not provided or invalid'})
        
        # Handle temperature adjustment commands with specific amounts
        elif any(word in command for word in ['increase', 'up', 'higher', 'raise']):
            # Check for specific amount patterns like "increase by 5 degrees" or "up 3 degrees"
            amount_match = re.search(r'(?:by|to)?\s*(\d+)\s*(?:degrees?|°)?', command)
            
            if amount_match:
                # Extract the specific amount to increase
                increase_amount = int(amount_match.group(1))
                # Apply the increase with upper limit of 90
                thermostat.value = min(thermostat.value + increase_amount, 90)
                message = f"Temperature increased by {increase_amount} degrees to {thermostat.value}°F"
            else:
                # Default to increasing by 1 degree if no specific amount
                thermostat.value = min(thermostat.value + 1, 90)
                message = f"Temperature increased by 1 degree to {thermostat.value}°F"
        
        elif any(word in command for word in ['decrease', 'down', 'lower', 'reduce']):
            # Check for specific amount patterns like "decrease by 5 degrees" or "down 3 degrees"
            amount_match = re.search(r'(?:by|to)?\s*(\d+)\s*(?:degrees?|°)?', command)
            
            if amount_match:
                # Extract the specific amount to decrease
                decrease_amount = int(amount_match.group(1))
                # Apply the decrease with lower limit of 50
                thermostat.value = max(thermostat.value - decrease_amount, 50)
                message = f"Temperature decreased by {decrease_amount} degrees to {thermostat.value}°F"
            else:
                # Default to decreasing by 1 degree if no specific amount
                thermostat.value = max(thermostat.value - 1, 50)
                message = f"Temperature decreased by 1 degree to {thermostat.value}°F"
        
            db.session.commit()
            return jsonify({'device': 'thermostat', 'value': thermostat.value, 'message': message})
        
        db.session.commit()
        return jsonify({'device': 'thermostat', 'value': thermostat.value})
    
    return jsonify({'error': 'Command not recognized'})

@app.route('/api/devices', methods=['GET'])
def get_devices():
    devices = Device.query.all()
    result = []
    
    for device in devices:
        device_data = {
            'name': device.name,
            'state': device.state,
            'value': device.value
        }
        result.append(device_data)
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
