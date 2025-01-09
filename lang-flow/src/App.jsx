import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    document.querySelector('h1').style.display='none';
    if (!userMessage.trim()) return;

    const newUserMessage = { type: 'user', text: userMessage };
    setChatHistory((prev) => [...prev, newUserMessage]);
    setIsLoading(true);
    setUserMessage('');

    try {
      const { data } = await axios.post('https://social-analytics-ueun.onrender.com/api/message', {
        message: userMessage,
      });

      const botResponse = data.response.split('Final Output:')[1] || 'No response received.';
      const newBotMessage = { type: 'bot', text: botResponse.trim() };

      setChatHistory((prev) => [...prev, newBotMessage]);
    } catch (error) {
      console.error('Error fetching response:', error);
      const errorMessage = { type: 'bot', text: 'An error occurred while fetching the response.' };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="chat"
      style={{
        padding: '2rem',
        width: '70vw',
        height: '70vh',
        margin: '50px auto',
        overflow: 'hidden',
        fontFamily: 'Arial, sans-serif',
        position: 'relative',
        color: 'white',
        backgroundColor: '#1e1e1e',
        borderRadius: '10px',
      }}
    >
      
      <h1 style={{ textAlign: 'center',color:'white' }}>Chat with AI powered by LangFlow DataStax</h1>
      <div className='chatContainer' style={{
        overflow:'auto',
        height:'500px'
      }}>
         {chatHistory.map((message, index) => (
          <div
            key={index}
            style={{
              margin: '10px 0',
              textAlign: message.type === 'user' ? 'right' : 'left',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: message.type === 'user' ? '#303030' : '#444',
                color: 'white',
                maxWidth: '60%',
                wordWrap: 'break-word',
              }}
            >
              {message.text}
            </div>
          </div>
        ))}
      {isLoading && <p style={{ textAlign: 'center', marginTop: '10px' }}>Loading...</p>}
      </div>
      
      <form
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: '#1e1e1e', // Match the background color
          padding: '10px 0',
        }}
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Enter your message"
          style={{
            width: '70%',
            padding: '0.5rem',
            marginRight: '1rem',
            backgroundColor: '#2F2F2F',
            border: 'none',
            color: 'white',
            borderRadius: '5px',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          Send
        </button>
      </form>

      
    </div>
  );
}

export default App;
