import React from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';

const EmojiPicker = ({ onEmojiSelect, onClose }) => {
  const { isDarkMode } = useDarkMode();
  
  const emojis = ['😀', '😃', '😄', '😁', '😊', '😍', '😘', '😗', '😙', '😚', '😋', '😛', '😜', '😝', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '😤', '😠', '😡', '😶', '😐', '😑', '😯', '😦', '😧', '😮', '😲', '😵', '😳', '😱', '😨', '😰', '😢', '😥', '😭', '😓', '😪', '😴', '🙄', '🤔', '🤗', '🤓', '😎', '🤡', '🤠', '😈', '👿', '👹', '👺', '💀', '👻', '👽', '🤖', '💩', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '👋', '👌', '👍', '👎', '✊', '👊', '👏', '🙌', '👐', '🤝', '💪', '🦵', '🦶', '👂', '👃', '🧠', '🦷', '🦴', '👀', '👁️', '👅', '👄', '💋', '💘', '❤️', '💓', '💔', '💕', '💖', '💗', '💙', '💚', '💛', '🧡', '💜', '🖤', '💝', '💞', '💟', '❣️', '💌', '💤', '💢', '💣', '💥', '💦', '💨', '💫', '💬', '🗨️', '🗯️', '💭', '🕳️'];

  return (
    <div className={`p-4 rounded-lg shadow-lg border ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="grid grid-cols-8 gap-2 max-w-xs">
        {emojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => {
              onEmojiSelect(emoji);
              onClose();
            }}
            className={`p-2 rounded hover:bg-gray-100 transition-colors text-xl ${
              isDarkMode ? 'hover:bg-gray-700' : ''
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
