import { useState } from 'react';
import { MoreHorizontal, MessageSquare, MapPin, Heart, Share2, X, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { useDarkMode } from '../../contexts/DarkModeContext';

export default function MainFeed() {
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState({});
  const { isDarkMode } = useDarkMode();

  // Mock data - in real app, these would come from props or API
  const mockImages = [
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=800&h=600&fit=crop'
  ];

  const mockAvatars = [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?cs=srgb&dl=pexels-pixabay-220453.jpg&fm=jpg',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'
  ];

  const categories = [
    { name: "Carpenter", icon: "👷", color: "bg-orange-100" },
    { name: "Mason", icon: "🧱", color: "bg-red-100" },
    { name: "Plumber", icon: "🔧", color: "bg-blue-100" },
    { name: "Welder", icon: "⚡", color: "bg-yellow-100" },
    { name: "Painter", icon: "🎨", color: "bg-green-100" }
  ];

  const posts = [
    {
      id: 1,
      author: "Jack Brown",
      profession: "Carpenter",
      location: "Colombo 07",
      avatar: mockAvatars[0],
      images: [mockImages[0], mockImages[1], mockImages[2]],
      imageAlt: "Carpentry work",
      description: "Just finished this beautiful custom kitchen cabinet project! The client wanted a modern farmhouse style with plenty of storage.",
      likes: 24,
      timeAgo: "2 hours ago"
    },
    {
      id: 2,
      author: "Sarah Wilson",
      profession: "Plumber",
      location: "Galle 08",
      avatar: mockAvatars[1],
      images: [mockImages[1], mockImages[2]],
      imageAlt: "Plumbing work",
      description: "Emergency pipe repair completed successfully. Quick response saves the day! 💪",
      likes: 18,
      timeAgo: "4 hours ago"
    },
    {
      id: 3,
      author: "Mike Johnson",
      profession: "Painter",
      location: "Kandy 09",
      avatar: mockAvatars[2],
      images: [mockImages[2], mockImages[3], mockImages[0], mockImages[1]],
      imageAlt: "Painting work",
      description: "Exterior house painting project completed. Weather was perfect for this job. Love how the colors turned out!",
      likes: 31,
      timeAgo: "6 hours ago"
    },
    {
      id: 4,
      author: "David Lee",
      profession: "Welder",
      location: "Matara 10",
      avatar: mockAvatars[3],
      images: [mockImages[3]],
      imageAlt: "Welding work",
      description: "Custom metal gate fabrication. Strong, secure, and beautiful! 🔥",
      likes: 15,
      timeAgo: "8 hours ago"
    }
  ];

  const CategoryCard = ({ category, index }) => (
    <div
      key={index}
      className={`flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} items-center p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group`}
    >
      <div className={`w-16 h-16 ${category.color} rounded-xl flex items-center shadow-sm justify-center mb-2 group-hover:scale-110 transition-transform duration-300`}>
        <span className="text-2xl">{category.icon}</span>
      </div>
      <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} transition-colors duration-300 text-sm`}>{category.name}</span>
    </div>
  );

  const ImageGrid = ({ images, imageAlt, onClick }) => {
    const imageCount = images.length;

    if (imageCount === 1) {
      return (
        <div className="relative cursor-pointer" onClick={() => onClick(0)}>
          <img
            src={images[0]}
            alt={imageAlt}
            className="w-full h-80 object-cover hover:opacity-95 transition-opacity duration-200"
          />
        </div>
      );
    }

    if (imageCount === 2) {
      return (
        <div className="grid grid-cols-2 gap-1">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${imageAlt} ${index + 1}`}
              className="w-full h-60 object-cover cursor-pointer hover:opacity-95 transition-opacity duration-200"
              onClick={() => onClick(index)}
            />
          ))}
        </div>
      );
    }

    if (imageCount === 3) {
      return (
        <div className="grid grid-cols-2 gap-1">
          <img
            src={images[0]}
            alt={`${imageAlt} 1`}
            className="w-full h-72 object-cover cursor-pointer hover:opacity-95 transition-opacity duration-200"
            onClick={() => onClick(0)}
          />
          <div className="grid grid-rows-2 gap-1">
            <img
              src={images[1]}
              alt={`${imageAlt} 2`}
              className="w-full h-35 object-cover cursor-pointer hover:opacity-95 transition-opacity duration-200"
              onClick={() => onClick(1)}
            />
            <img
              src={images[2]}
              alt={`${imageAlt} 3`}
              className="w-full h-35 object-cover cursor-pointer hover:opacity-95 transition-opacity duration-200"
              onClick={() => onClick(2)}
            />
          </div>
        </div>
      );
    }

    if (imageCount >= 4) {
      return (
        <div className="grid grid-cols-2 gap-1">
          {images.slice(0, 3).map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${imageAlt} ${index + 1}`}
              className="w-full h-40 object-cover cursor-pointer hover:opacity-95 transition-opacity duration-200"
              onClick={() => onClick(index)}
            />
          ))}
          <div className="relative">
            <img
              src={images[3]}
              alt={`${imageAlt} 4`}
              className="w-full h-40 object-cover cursor-pointer hover:opacity-95 transition-opacity duration-200"
              onClick={() => onClick(3)}
            />
            {imageCount > 4 && (
              <div 
                className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center cursor-pointer hover:bg-opacity-50 transition-all duration-200"
                onClick={() => onClick(3)}
              >
                <span className="text-white text-2xl font-bold">+{imageCount - 4}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
  };

  const handlePostClick = (post, imageIndex = 0) => {
    setSelectedPost(post);
    setCurrentImageIndex(imageIndex);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeModal = () => {
    setSelectedPost(null);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'unset'; // Restore background scrolling
  };

  const nextImage = () => {
    if (selectedPost && currentImageIndex < selectedPost.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleAddComment = (postId) => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        author: "You",
        avatar: mockAvatars[0],
        text: newComment,
        timeAgo: "Just now"
      };
      
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), comment]
      }));
      setNewComment('');
    }
  };

  const PostCard = ({ post }) => (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-300`}>
      {/* Post Header */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <img
              src={post.avatar}
              alt={post.author}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} text-sm`}>{post.author}</h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs`}>{post.profession} • {post.location} • {post.timeAgo}</p>
            </div>
          </div>
          <button className={`p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 ${isDarkMode ? 'hover:bg-gray-700' : ''}`}>
            <MoreHorizontal className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
          </button>
        </div>
        
        {/* Post Description */}
        <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} text-sm mb-3`}>{post.description}</p>
      </div>

      {/* Post Images */}
      <div className="relative">
        <ImageGrid 
          images={post.images} 
          imageAlt={post.imageAlt}
          onClick={(imageIndex) => handlePostClick(post, imageIndex)}
        />
      </div>

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>{post.likes} likes</span>
          <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>{(comments[post.id] || []).length} comments</span>
        </div>
        
        <div className={`flex items-center justify-between pt-2 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <button className={`flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-1 justify-center ${isDarkMode ? 'hover:bg-gray-700' : ''}`}>
            <Heart className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Like</span>
          </button>
          <button 
            className={`flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-1 justify-center ${isDarkMode ? 'hover:bg-gray-700' : ''}`}
            onClick={() => handlePostClick(post)}
          >
            <MessageSquare className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Comment</span>
          </button>
          <button className={`flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-1 justify-center ${isDarkMode ? 'hover:bg-gray-700' : ''}`}>
            <Share2 className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Share</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-black'}`}>
      {/* Category Section */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 mb-5 shadow-sm border`}>
        <h2 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-4`}>Categories</h2>
        <div className="grid grid-cols-5 gap-4">
          {categories.map((category, index) => (
            <CategoryCard key={index} category={category} index={index} />
          ))}
        </div>
      </div>

      {/* Posts Feed */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-6 no-scrollbar">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Full Screen Post View */}
      {selectedPost && (
        <div className={`fixed inset-0 z-50 flex flex-col animate-in slide-in-from-bottom duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
          {/* Header Bar */}
          <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
            <div className="flex items-center space-x-3">
              <img
                src={selectedPost.avatar}
                alt={selectedPost.author}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{selectedPost.author}</h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>{selectedPost.profession} • {selectedPost.location} • {selectedPost.timeAgo}</p>
              </div>
            </div>
            <button
              onClick={closeModal}
              className={`p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 ${isDarkMode ? 'hover:bg-gray-700' : ''}`}
            >
              <X className={`w-6 h-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Side - Images */}
            <div className="flex-1 bg-black flex items-center justify-center relative">
              {selectedPost.images.length > 1 && currentImageIndex > 0 && (
                <button
                  onClick={prevImage}
                  className="absolute left-4 z-10 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              
              <img
                src={selectedPost.images[currentImageIndex]}
                alt={selectedPost.imageAlt}
                className="max-h-full max-w-full object-contain"
              />
              
              {selectedPost.images.length > 1 && currentImageIndex < selectedPost.images.length - 1 && (
                <button
                  onClick={nextImage}
                  className="absolute right-4 z-10 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

              {/* Image Counter */}
              {selectedPost.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {selectedPost.images.length}
                </div>
              )}

              {/* Image Thumbnails */}
              {selectedPost.images.length > 1 && (
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  {selectedPost.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        index === currentImageIndex ? 'border-white' : 'border-transparent opacity-60 hover:opacity-80'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side - Post Details & Comments */}
            <div className={`w-96 flex flex-col border-l ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              {/* Post Description */}
              <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{selectedPost.description}</p>
                
                {/* Post Stats */}
                <div className={`flex items-center justify-between mt-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <span>{selectedPost.likes} likes</span>
                  <span>{(comments[selectedPost.id] || []).length} comments</span>
                </div>

                {/* Action Buttons */}
                <div className={`flex items-center justify-between mt-3 pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 flex-1 justify-center ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                    <Heart className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                    <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Like</span>
                  </button>
                  <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 flex-1 justify-center ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                    <Share2 className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                    <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Share</span>
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Comments</h4>
                {(comments[selectedPost.id] || []).length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No comments yet</p>
                    <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'} text-sm`}>Be the first to comment!</p>
                  </div>
                ) : (
                  (comments[selectedPost.id] || []).map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <img
                        src={comment.avatar}
                        alt={comment.author}
                        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-2xl px-4 py-3`}>
                          <p className={`font-semibold text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{comment.author}</p>
                          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{comment.text}</p>
                        </div>
                        <div className={`flex items-center space-x-4 mt-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <span>{comment.timeAgo}</span>
                          <button className={`font-medium ${isDarkMode ? 'hover:text-gray-200' : 'hover:text-gray-700'}`}>Like</button>
                          <button className={`font-medium ${isDarkMode ? 'hover:text-gray-200' : 'hover:text-gray-700'}`}>Reply</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment */}
              <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex space-x-3">
                  <img
                    src={mockAvatars[0]}
                    alt="You"
                    className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 flex space-x-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className={`flex-1 px-4 py-3 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-black placeholder-gray-500'}`}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment(selectedPost.id)}
                    />
                    <button
                      onClick={() => handleAddComment(selectedPost.id)}
                      disabled={!newComment.trim()}
                      className={`p-3 text-blue-600 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode ? 'hover:bg-blue-900' : 'hover:bg-blue-50'}`}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}