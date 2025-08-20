import React, { useState, useRef, useEffect } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { Send, Image, Smile, X } from 'lucide-react';
import EmojiPicker from './EmojiPicker';

const ChatInterface = ({ isOpen, onClose }) => {
  const { isDarkMode } = useDarkMode();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    },
    {
      id: 2,
      text: 'I need help with my job application',
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeReactionMenu, setActiveReactionMenu] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() || selectedImage) {
      const newMsg = {
        id: Date.now(),
        text: newMessage,
        sender: 'user',
        timestamp: new Date(),
        type: selectedImage ? 'image' : 'text',
        image: selectedImage
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
      setSelectedImage(null);
      
      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          text: 'Thanks for your message! I\'ll get back to you shortly.',
          sender: 'bot',
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleReactToMessage = (messageId, emoji) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, reaction: emoji } : msg
    ));
    setActiveReactionMenu(null);
  };

  const toggleReactionMenu = (messageId) => {
    setActiveReactionMenu(activeReactionMenu === messageId ? null : messageId);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-4 right-4 w-96 h-[500px] rounded-lg shadow-2xl flex flex-col z-50 transition-all duration-300 ${
      isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${
        isDarkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'
      } rounded-t-lg`}>
        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Chat</h3>
        <button
          onClick={onClose}
          className={`p-1 rounded-full hover:bg-gray-200 transition-colors ${
            isDarkMode ? 'hover:bg-gray-600 text-gray-300' : 'text-gray-500'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Container */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${
        isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
      }`}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] rounded-lg p-3 relative ${
              message.sender === 'user'
                ? isDarkMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-500 text-white'
                : isDarkMode
                  ? 'bg-gray-700 text-white'
                  : 'bg-white text-gray-900 border border-gray-200'
            }`}>
              {message.type === 'image' && message.image && (
                <img
                  src={message.image}
                  alt="Uploaded"
                  className="rounded-lg max-w-full h-auto mb-2"
                />
              )}
              <p className="text-sm">{message.text}</p>
              <div className="flex items-center justify-between mt-1">
                <span className={`text-xs opacity-75 ${
                  message.sender === 'user' ? 'text-white' : isDarkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </span>
                {message.sender === 'bot' && (
                  <div className="relative">
                    <button
                      onClick={() => toggleReactionMenu(message.id)}
                      className={`text-xs transition-opacity ${
                        message.reaction 
                          ? 'bg-blue-100 hover:bg-blue-200 text-blue-600 px-2 py-1 rounded-full'
                          : `opacity-75 hover:opacity-100 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`
                      }`}
                    >
                      {message.reaction || '👍'}
                    </button>
                    {activeReactionMenu === message.id && (
                      <div className={`absolute bottom-full right-0 mb-1 p-1 rounded-lg shadow-lg border flex space-x-1 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                      }`}>
                        {['👍', '❤️', '😂', '😮', '😢', '😡'].map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => handleReactToMessage(message.id, emoji)}
                            className={`p-1 hover:bg-gray-100 rounded transition-colors ${
                              isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className={`p-4 border-t ${
        isDarkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-white'
      } rounded-b-lg`}>
        {selectedImage && (
          <div className="mb-2 relative">
            <img
              src={selectedImage}
              alt="Selected"
              className="rounded-lg max-w-full h-20 object-cover"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className={`flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
              isDarkMode
                ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <button
            onClick={() => document.getElementById('image-upload').click()}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'text-gray-400 hover:text-white hover:bg-gray-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Image className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'text-gray-400 hover:text-white hover:bg-gray-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Smile className="w-5 h-5" />
          </button>
          <button
            onClick={handleSendMessage}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        {showEmojiPicker && (
          <div className="absolute bottom-16 right-0">
            <EmojiPicker onEmojiSelect={handleEmojiSelect} onClose={() => setShowEmojiPicker(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
