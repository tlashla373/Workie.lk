
import { 
  Linkedin, 
  Facebook, 
  MessageCircle, 
  Edit
} from 'lucide-react';
import StarRating from './StarRating';
import profileImage from '../../assets/profile.jpeg';

const ProfileCard = ({ rating, setRating, profileData }) => {
  // Use real data if available, otherwise fall back to defaults
  const user = profileData?.user;
  const profile = profileData?.profile;
  
  const displayData = {
    name: user ? `${user.firstName} ${user.lastName}` : 'Supun Hashintha',
    email: user?.email || 'supunhashintha@gmail.com',
    phone: user?.phone || '+94 77 255 58 43',
    profileImage: user?.profilePicture || profileImage,
    role: user?.userType || 'Worker',
    position: profile?.preferences?.jobTypes?.[0] || 'Mason',
    company: profile?.experience?.[0]?.company || 'CSM Company',
    isActive: user?.isActive || false,
    isVerified: user?.isVerified || false
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="relative">
          <img 
            src={displayData.profileImage} 
            alt={displayData.name} 
            className="w-20 h-20 rounded-full object-cover"
            onError={(e) => {
              e.target.src = profileImage; // Fallback to default image
            }}
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
            <Edit size={12} className="text-white" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-semibold text-gray-900">{displayData.name}</h2>
            <span className={`px-2 py-1 text-xs rounded-full ${
              displayData.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {displayData.isActive ? 'Active' : 'Inactive'}
            </span>
            {displayData.isVerified && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Verified
              </span>
            )}
          </div>
          <StarRating rating={rating} onRatingChange={setRating} />
        </div>
      </div>
      
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Role:</span>
          <span className="font-medium capitalize">{displayData.role}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Position:</span>
          <span className="font-medium capitalize">{displayData.position}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">E-mail:</span>
          <span className="font-medium text-blue-600">{displayData.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Phone:</span>
          <span className="font-medium">{displayData.phone}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Company:</span>
          <span className="font-medium">{displayData.company}</span>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        {profile?.socialLinks?.facebook && (
          <a 
            href={profile.socialLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
          >
            <Facebook size={16} />
          </a>
        )}
        {profile?.socialLinks?.linkedin && (
          <a 
            href={profile.socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
          >
            <Linkedin size={16} />
          </a>
        )}
        <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
          <MessageCircle size={16} />
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;