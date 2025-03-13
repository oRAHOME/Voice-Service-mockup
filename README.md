Project Structure
voice-iot/
├── backend/
│   ├── app.py                 # Flask API 
│   ├── requirements.txt       # Python dependencies
│   └── models.py              # Database models
├── frontend/
│   ├── package.json           # Next.js configuration
│   ├── pages/
│   │   └── index.js           # Main UI page
│   └── components/
│       ├── VoiceControl.js    # Voice recognition component
│       ├── LightBulb.js       # Light control component
│       └── Thermostat.js      # Temperature control component
└── README.md                  # Project documentation

Set Up the Backend

Create a virtual environment:
cd voice-iot/backend

# On Windows:
venv\Scripts\activate

Install dependencies:
pip install Flask Flask-CORS Flask-SQLAlchemy psycopg2-binary
pip freeze > requirements.txt

Install dependencies:
Set Up the Frontend

cd frontend

npm i

npm run dev

Step 4: Run the Application

Terminal 1 - Run the Flask backend:
cd voice-iot/backend
# venv\Scripts\activate 
python app.py

Terminal 2 - Run the Next.js frontend:
cd voice-iot/frontend
npm run dev

Open browser at http://localhost:3000
