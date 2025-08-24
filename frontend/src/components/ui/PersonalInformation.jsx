


const PersonalInformation = ({ profileData }) => {
  const user = profileData?.user;
  
  const formatBirthDate = (dateString) => {
    if (!dateString) return "Not provided";
    return new Date(dateString).toLocaleDateString('en-US');
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
        <button className="text-sm text-gray-500">(Editable)</button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-blue-600 font-medium">Birth Date</label>
          <div className="mt-1 text-sm text-gray-700">
            {formatBirthDate(user?.dateOfBirth)}
          </div>
        </div>
        <div>
          <label className="text-sm text-blue-600 font-medium">Address</label>
          <div className="mt-1 text-sm text-gray-700">
            {user?.address?.street || "Not provided"}
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 mt-4">
        <div className="flex-1">
          <label className="text-xs text-gray-500">City</label>
          <div className="px-3 py-2 border rounded-lg text-sm bg-gray-50">
            {user?.address?.city || "Not provided"}
          </div>
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-500">State</label>
          <div className="px-3 py-2 border rounded-lg text-sm bg-gray-50">
            {user?.address?.state || "Not provided"}
          </div>
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-500">Country</label>
          <div className="px-3 py-2 border rounded-lg text-sm bg-gray-50">
            {user?.address?.country || "Not provided"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;