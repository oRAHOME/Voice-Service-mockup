import { useState, useEffect } from 'react';

const VoiceControl = ({ onCommand, isLoading }) => {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(true);
  
  useEffect(() => {
    // Check if SpeechRecognition is supported
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      setSupported(false);
    }
  }, []);

  const startListening = () => {
    if (isLoading) return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }
    
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      onCommand(transcript);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  };

  if (!supported) {
    return (
      <div className="voice-control">
        <p>Speech recognition is not supported in your browser.</p>
      </div>
    );
  }

  return (
    <div className="voice-control">
      <button 
        onClick={startListening} 
        disabled={isListening || isLoading}
        className={isListening ? 'listening' : ''}
      >
        {isListening ? 'Listening...' : 'Start Voice Command'}
      </button>
      
      <style jsx>{`
        .voice-control {
          margin: 2rem 0;
          text-align: center;
        }
        
        button {
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 5px;
          padding: 0.8rem 1.5rem;
          font-size: 1.2rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        
        button:hover {
          background-color: #0051bb;
        }
        
        button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        
        .listening {
          background-color: #ff0000;
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default VoiceControl;