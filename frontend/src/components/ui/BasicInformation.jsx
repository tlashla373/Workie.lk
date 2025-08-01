import OccupationInformation from "./OccupationInformation";
import PersonalInformation from "./PersonalInformation";

const BasicInformation = () => {
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
          <label className="text-sm text-blue-600 font-medium">Hire Date</label>
          <div className="mt-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">
            August, 28, 2019
          </div>
        </div>
        <div>
          <label className="text-sm text-blue-600 font-medium">Worked for</label>
          <div className="mt-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">
            9 years, 1 month
          </div>
        </div>
        <div>
          <label className="text-sm text-blue-600 font-medium">Employee ID</label>
          <div className="mt-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">
            356
          </div>
        </div>
        <div>
          <label className="text-sm text-blue-600 font-medium">SSN</label>
          <div className="mt-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">
            XXX-XX-3540
          </div>
        </div>
      </div>

      {/* Personal & Occupation Info */}
      <div className="mt-6 space-y-6">
        <PersonalInformation />
        <OccupationInformation />
      </div>
    </div>
  );
};

export default BasicInformation;
