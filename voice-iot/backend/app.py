from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

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
        
        if 'increase' in command or 'up' in command or 'higher' in command:
            thermostat.value = min(thermostat.value + 1, 90)  # Max temp 90
        elif 'decrease' in command or 'down' in command or 'lower' in command:
            thermostat.value = max(thermostat.value - 1, 50)  # Min temp 50
        
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