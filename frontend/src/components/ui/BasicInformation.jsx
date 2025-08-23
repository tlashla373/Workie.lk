import OccupationInformation from "./OccupationInformation";
import PersonalInformation from "./PersonalInformation";

const BasicInformation = ({ profileData }) => {
  // Extract data from profileData
  const user = profileData?.user;
  const profile = profileData?.profile;
  
  // Calculate years worked since account creation
  const getYearsWorked = () => {
    if (!user?.createdAt) return "N/A";
    const createdDate = new Date(user.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    return `${years} years, ${months} months`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
        <button className="text-sm text-gray-500">(Not Editable)</button>
      </div>

      {/* Top Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-blue-600 font-medium">Join Date</label>
          <div className="mt-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">
            {formatDate(user?.createdAt)}
          </div>
        </div>
        <div>
          <label className="text-sm text-blue-600 font-medium">Member for</label>
          <div className="mt-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">
            {getYearsWorked()}
          </div>
        </div>
        <div>
          <label className="text-sm text-blue-600 font-medium">User ID</label>
          <div className="mt-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">
            {user?._id?.toString().slice(-6).toUpperCase() || "N/A"}
          </div>
        </div>
        <div>
          <label className="text-sm text-blue-600 font-medium">Verification Status</label>
          <div className={`mt-1 px-3 py-2 rounded-lg text-sm ${
            user?.isVerified 
              ? 'bg-green-600 text-white' 
              : 'bg-orange-600 text-white'
          }`}>
            {user?.isVerified ? 'Verified' : 'Pending'}
          </div>
        </div>
      </div>

      {/* Personal & Occupation Info */}
      <div className="mt-6 space-y-6">
        <PersonalInformation profileData={profileData} />
        <OccupationInformation profileData={profileData} />
      </div>
    </div>
  );
};

export default BasicInformation;
