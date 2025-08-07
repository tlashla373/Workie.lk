import { 
  Heart, 
  Share
} from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

// Mock dark mode context for demo
const useDarkMode = () => ({ isDarkMode: false });

// Photos Tab Component
const PhotosTab = ({ profileData, isDarkMode }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {profileData.portfolio.map((photo, index) => (
      <div key={index} className="relative group overflow-hidden rounded-lg aspect-square">
        <img
          src={photo}
          alt={`Portfolio ${index + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
            <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors">
              <Share className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default PhotosTab;