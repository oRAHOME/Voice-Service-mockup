from app import db

class Device(db.Model):
    __tablename__ = 'devices'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    state = db.Column(db.String(10), default='off')
    value = db.Column(db.Integer, default=0)
    
    def __repr__(self):
        return f'<Device {self.name}>'