


const PersonalInformation = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
        <button className="text-sm text-gray-500">(Editable)</button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-blue-600 font-medium">Birth Date</label>
          <div className="mt-1 text-sm text-gray-700">12/2/65</div>
        </div>
        <div>
          <label className="text-sm text-blue-600 font-medium">Address</label>
          <div className="mt-1 text-sm text-gray-700">3650 Crestwater Lane</div>
        </div>
      </div>
      
      <div className="flex gap-2 mt-4">
        <select className="px-3 py-2 border rounded-lg text-sm flex-1">
          <option>Select</option>
        </select>
        <select className="px-3 py-2 border rounded-lg text-sm flex-1">
          <option>West Jordan</option>
        </select>
        <select className="px-3 py-2 border rounded-lg text-sm flex-1">
          <option>Ca</option>
        </select>
      </div>
    </div>
  );
};

export default PersonalInformation;