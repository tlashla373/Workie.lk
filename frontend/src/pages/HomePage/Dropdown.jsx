import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Flag, Share, Copy } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useAuth } from '../../hooks/useAuth';

const PostDropdown = ({ post, onReportPost, onSharePost }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { isDarkMode } = useDarkMode();
  const { user } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown when pressing Escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => {
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [isOpen]);

  // Check if the post belongs to the current user
  const isCurrentUserPost = user && post && (
    // Check if post.userId matches current user
    (post.userId?._id || post.userId) === user._id ||
    // Check if post.userInfo matches current user  
    (post.userInfo?._id || post.userInfo?.userId) === user._id ||
    // Check if original post data matches current user
    (post.originalPost?.userId?._id || post.originalPost?.userId) === user._id
  );

  // Don't render dropdown for current user's posts
  if (isCurrentUserPost) {
    return null;
  }

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleMenuAction = (action, e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
    
    switch (action) {
      case 'report':
        onReportPost && onReportPost(post);
        break;
      case 'share':
        onSharePost && onSharePost(post);
        break;
      case 'copyLink': {
        // Copy post link to clipboard
        const postUrl = `${window.location.origin}/post/${post.id}`;
        navigator.clipboard.writeText(postUrl).then(() => {
          console.log('Post link copied to clipboard');
          // You can add a toast notification here
        }).catch(err => {
          console.error('Failed to copy link:', err);
        });
        break;
      }
      default:
        break;
    }
  };

  const menuItems = [
    {
      id: 'copyLink',
      label: 'Copy link',
      icon: Copy,
      action: 'copyLink',
      className: 'hover:bg-gray-50 dark:hover:bg-gray-700'
    },
    {
      id: 'share',
      label: 'Share post',
      icon: Share,
      action: 'share',
      className: 'hover:bg-gray-50 dark:hover:bg-gray-700'
    },
    {
      id: 'divider2',
      type: 'divider'
    },
    {
      id: 'report',
      label: 'Report post',
      icon: Flag,
      action: 'report',
      className: 'hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400'
    }
  ];

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <button
        onClick={handleToggle}
        className={`p-1 md:p-2 rounded-full transition-colors duration-200 ${
          isDarkMode 
            ? 'hover:bg-gray-700 text-gray-300' 
            : 'hover:bg-gray-100 text-gray-600'
        } ${isOpen ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-100') : ''}`}
        aria-label="Post options"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Menu Content */}
          <div
            className={`absolute right-0 top-full mt-2 w-48 py-2 z-20 shadow-lg border rounded-lg transform transition-all duration-200 ease-out ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 shadow-gray-900/20'
                : 'bg-white border-gray-200 shadow-gray-900/10'
            }`}
            role="menu"
            aria-orientation="vertical"
          >
            {menuItems.map((item) => {
              if (item.type === 'divider') {
                return (
                  <div
                    key={item.id}
                    className={`my-1 h-px ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}
                    role="separator"
                  />
                );
              }

              const Icon = item.icon;
              
              return (
                <button
                  key={item.id}
                  onClick={(e) => handleMenuAction(item.action, e)}
                  className={`w-full flex items-center px-4 py-2 text-sm text-left transition-colors duration-150 ${
                    item.className
                  } ${
                    isDarkMode 
                      ? 'text-gray-200 hover:text-gray-100' 
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                  role="menuitem"
                >
                  <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default PostDropdown;
