import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [userMessage, setUserMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userMessage.trim()) return;

    setIsLoading(true);
    setResponseMessage('');

    try {
      const { data } = await axios.post('https://social-analytics-ueun.onrender.com/api/message', {
        message: userMessage,
      });

      setResponseMessage(data.response);
    } catch (error) {
      console.error('Error fetching response:', error);
      setResponseMessage('An error occurred while fetching the response.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Chat with AI powered by LangFlow DataStax</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Enter your message"
          style={{ width: '300px', padding: '0.5rem', marginRight: '1rem' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          Send
        </button>
      </form>
      {isLoading && <p>Loading...</p>}
      {responseMessage && (
        <div style={{ marginTop: '1rem', border: '1px solid #ddd', padding: '1rem', borderRadius:'20px'}}>
          <strong>Response:</strong>
          <p>{responseMessage.split("Final Output:")[1]}</p>
        </div>
      )}
    </div>
  );
}

export default App;
