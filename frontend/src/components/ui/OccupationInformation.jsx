
const OccupationInformation = ({ profileData }) => {
  const user = profileData?.user;
  const profile = profileData?.profile;

  const getWorkType = () => {
    if (profile?.availability?.status === 'available') return 'Available';
    if (profile?.availability?.status === 'busy') return 'Busy';
    return 'Full-Time';
  };

  const getMainSkill = () => {
    if (profile?.preferences?.jobTypes?.length > 0) {
      return profile.preferences.jobTypes[0].charAt(0).toUpperCase() + 
             profile.preferences.jobTypes[0].slice(1);
    }
    return profile?.skills?.[0]?.name || 'Engineering';
  };

  const getLocation = () => {
    if (user?.address?.city && user?.address?.country) {
      return `${user.address.city}, ${user.address.country}`;
    }
    return 'Location not set';
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Occupation Information</h3>
        <button className="text-sm text-gray-500">(Non-Editable)</button>
      </div>
      
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-2">
            <div className={`w-8 h-8 rounded-full ${
              profile?.availability?.status === 'available' ? 'bg-green-500' :
              profile?.availability?.status === 'busy' ? 'bg-red-500' : 'bg-teal-500'
            }`}></div>
          </div>
          <span className="text-sm font-medium">{getWorkType()}</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-2">
            <div className="w-8 h-8 bg-teal-500 rounded-full"></div>
          </div>
          <span className="text-sm font-medium">{getMainSkill()}</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-2">
            <div className="w-8 h-8 bg-teal-500 rounded-full"></div>
          </div>
          <span className="text-sm font-medium">{getLocation()}</span>
        </div>
      </div>
    </div>
  );
};

export default OccupationInformation;