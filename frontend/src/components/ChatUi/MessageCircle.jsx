import React from 'react'
import { DarkModeProvider } from '../../contexts/DarkModeContext';
import { Send } from 'lucide-react';

const MessageCircle = () => {

    const [ message, setMassage ] = useState([
        {id: 1 , text : 'Hello! How can i help you today? , sender , bot'}
    ]);
  return (
    <div>MessageCircle</div>
  )
}

export default MessageCircle