
import { 
  Linkedin, 
  Facebook, 
  MessageCircle, 
  Edit
} from 'lucide-react';
import StarRating from './StarRating';
import profileImage from '../../assets/profile.jpeg';

const ProfileCard = ({ rating, setRating }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="relative">
          <img 
            src={profileImage} 
            alt="Helen Volzhicki" 
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
            <Edit size={12} className="text-white" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-semibold text-gray-900">Supun Hashintha</h2>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
          </div>
          <StarRating rating={rating} onRatingChange={setRating} />
        </div>
      </div>
      
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Role:</span>
          <span className="font-medium">Worker</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Position:</span>
          <span className="font-medium">Mason</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">E-mail:</span>
          <span className="font-medium text-blue-600">supunhashintha@gmail.com</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Phone:</span>
          <span className="font-medium">+94 77 255 58 43</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Company:</span>
          <span className="font-medium">CSM Company</span>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
          <Facebook size={16} />
        </button>
        <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
          <MessageCircle size={16} />
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;