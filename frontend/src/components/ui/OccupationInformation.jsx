
const OccupationInformation = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Occupation Information</h3>
        <button className="text-sm text-gray-500">(Non-Editable)</button>
      </div>
      
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-2">
            <div className="w-8 h-8 bg-teal-500 rounded-full"></div>
          </div>
          <span className="text-sm font-medium">Full-Time</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-2">
            <div className="w-8 h-8 bg-teal-500 rounded-full"></div>
          </div>
          <span className="text-sm font-medium">Engineering</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-2">
            <div className="w-8 h-8 bg-teal-500 rounded-full"></div>
          </div>
          <span className="text-sm font-medium">Seattle, WA</span>
        </div>
      </div>
    </div>
  );
};

export default OccupationInformation;