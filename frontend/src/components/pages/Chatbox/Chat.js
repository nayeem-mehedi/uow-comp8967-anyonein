import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Replace with your backend URL

const Chat = () => {
  const [contacts, setContacts] = useState([ { name: 'Aiden Chavez', lastSeen: '2 hours ago' },
    { name: 'Vincent Porter', lastSeen: 'online' },
    { name: 'Christian Kelly', lastSeen: '10 hours ago' },
    { name: 'Monica Ward', lastSeen: 'online' },
    { name: 'Dean Henry', lastSeen: 'offline' },]);
  const [messages, setMessages] = useState([{ text: 'Hi Aiden, how are you?', time: '10:10 AM, Today', isMine: true },
    { text: 'Are we meeting today?', time: '10:12 AM, Today', isMine: false },
    { text: 'We need to work on the project due tomorrow!.', time: '10:15 AM, Today', isMine: false },]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Listening for incoming messages
    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Clean up on component unmount
    return () => {
      socket.off('chat message');
    };
  }, []);

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      const messageData = { text: newMessage, time: new Date().toLocaleTimeString(), isMine: true };
      socket.emit('chat message', messageData);
      setMessages([...messages, messageData]);
      setNewMessage('');
    }
  };

  return (
    <div className="chat-app">
      <div className="chat-container">
        <div className="chat-list">
          <input type="text" placeholder="Search..." className="search-bar" />
          <ul>
            {contacts.map((contact, index) => (
              <li key={index}>
                <div className="contact-avatar">
                  {/* <img src={contact.avatar} alt={`${contact.name}'s avatar`} /> */}
                </div>
                <div className="contact-info">
                  <p className="contact-name">{contact.name}</p>
                  <p className="last-seen">Last seen: {contact.lastSeen}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="chat-window">
          <div className="chat-header">
            <h2>Rudaba Kamor</h2>
            <p>Last seen: 2 hours ago</p>
          </div>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.isMine ? 'mine' : ''}`}>
                <p>{msg.text}</p>
                <span>{msg.time}</span>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Enter text here..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
