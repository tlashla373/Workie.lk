import React from 'react'
import { DarkModeProvider } from '../../contexts/DarkModeContext';
import { Send } from 'lucide-react';

const MessageCircle = () => {

    const [ message, setMassage ] = useState([
        {id: 1 , text : 'Hello! How can i help you today? , sender , bot'}
    ]);
  return (
    <div>
      <div className="message-circle">
        <div className="message-circle__header">
          <div className="message-circle__header__title">Chat</div>
        </div>
      </div>
    </div>
  )
}

export default MessageCircle