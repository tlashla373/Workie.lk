const UpcomingEvents = ({ profileData }) => {
  const user = profileData?.user;
  const profile = profileData?.profile;

  // Generate upcoming events based on user's data
  const generateUpcomingEvents = () => {
    const events = [];
    const today = new Date();
    
    // If user has applications, show interview/meeting events
    if (profile?.applications && profile.applications.length > 0) {
      profile.applications.forEach((app, index) => {
        const eventDate = new Date(today.getTime() + (index + 1) * 24 * 60 * 60 * 1000);
        events.push({
          id: index + 1,
          title: `Interview for ${app.jobTitle || 'Position'}`,
          time: "9:00 AM — 10:00 AM",
          date: eventDate.toLocaleDateString(),
          color: index % 2 === 0 ? 'slate-800' : 'pink-500',
          dotColor: index % 2 === 0 ? 'teal-500' : 'pink-300',
          participants: [
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=24&h=24&fit=crop&crop=face",
            "https://images.unsplash.com/photo-1494790108755-2616b612b601?w=24&h=24&fit=crop&crop=face"
          ]
        });
      });
    }

    // If no applications, show default upcoming work events
    if (events.length === 0) {
      const defaultEvents = [
        {
          id: 1,
          title: user?.userType === 'worker' ? 'Next Available Work Day' : 'Project Review',
          time: "9:00 AM — 5:00 PM",
          date: new Date(today.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString(),
          color: 'slate-800',
          dotColor: 'teal-500',
          participants: [
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=24&h=24&fit=crop&crop=face",
            "https://images.unsplash.com/photo-1494790108755-2616b612b601?w=24&h=24&fit=crop&crop=face"
          ]
        },
        {
          id: 2,
          title: user?.userType === 'worker' ? 'Skills Assessment' : 'Client Meeting',
          time: "2:00 PM — 3:00 PM", 
          date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          color: 'pink-500',
          dotColor: 'pink-300',
          participants: []
        }
      ];
      events.push(...defaultEvents);
    }

    return events.slice(0, 3); // Show only first 3 events
  };

  const events = generateUpcomingEvents();
  const today = new Date();

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
        <button className="px-3 py-1 bg-orange-400 text-white text-sm rounded-lg">View All</button>
      </div>
      <p className="text-xs text-gray-500 mb-4">{today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}</p>
      
      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className={`bg-${event.color} rounded-xl p-4 text-white`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{event.title}</h4>
              <div className={`w-8 h-8 bg-${event.dotColor} rounded-full flex items-center justify-center`}>
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <p className={`text-sm ${event.color === 'slate-800' ? 'text-gray-300' : 'text-pink-100'} mb-3`}>
              {event.time}
            </p>
            {event.participants.length > 0 && (
              <div className="flex -space-x-2">
                {event.participants.map((participant, index) => (
                  <img 
                    key={index}
                    src={participant} 
                    alt="" 
                    className="w-6 h-6 rounded-full border-2 border-white"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop&crop=face';
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
        
        {events.length === 0 && (
          <div className="text-center py-4">
            <p className="text-gray-500">No upcoming events</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingEvents;