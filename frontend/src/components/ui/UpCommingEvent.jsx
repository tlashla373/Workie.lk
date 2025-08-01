const UpcomingEvents = () => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
        <button className="px-3 py-1 bg-orange-400 text-white text-sm rounded-lg">View All</button>
      </div>
      <p className="text-xs text-gray-500 mb-4">JULY 24, 2020</p>
      
      <div className="space-y-3">
        <div className="bg-slate-800 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Design review</h4>
            <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          <p className="text-sm text-gray-300 mb-3">9:00 AM — 10:00 AM</p>
          <div className="flex -space-x-2">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=24&h=24&fit=crop&crop=face" alt="" className="w-6 h-6 rounded-full border-2 border-white" />
            <img src="https://images.unsplash.com/photo-1494790108755-2616b612b601?w=24&h=24&fit=crop&crop=face" alt="" className="w-6 h-6 rounded-full border-2 border-white" />
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop&crop=face" alt="" className="w-6 h-6 rounded-full border-2 border-white" />
          </div>
        </div>
        
        <div className="bg-pink-500 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Design review</h4>
            <div className="w-8 h-8 bg-pink-300 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          <p className="text-sm text-pink-100">9:00 AM — 10:00 AM</p>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvents;