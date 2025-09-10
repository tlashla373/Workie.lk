import { 
  Eye,
  Trash2,
  Plus
} from 'lucide-react';

const Onboarding = ({ profileData }) => {
  const user = profileData?.user;
  const profile = profileData?.profile;

  // Generate dynamic tasks based on user's actual data
  const generateTasks = () => {
    const baseTasks = [
      {
        task: "Complete profile setup",
        assignee: "System",
        date: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A",
        completed: !!user,
        priority: 1
      },
      {
        task: "Add bio and description",
        assignee: "User",
        date: user?.createdAt ? new Date(new Date(user.createdAt).getTime() + 24*60*60*1000).toLocaleDateString() : "N/A",
        completed: !!(profile?.bio && profile.bio.trim()),
        priority: 2
      },
      {
        task: "Verify account",
        assignee: "Admin",
        date: user?.createdAt ? new Date(new Date(user.createdAt).getTime() + 2*24*60*60*1000).toLocaleDateString() : "N/A",
        completed: !!user?.isVerified,
        priority: 3
      },
      {
        task: "Add skills and experience",
        assignee: "User",
        date: user?.createdAt ? new Date(new Date(user.createdAt).getTime() + 3*24*60*60*1000).toLocaleDateString() : "N/A",
        completed: !!(profile?.skills && profile.skills.length > 0),
        priority: 4
      },
      {
        task: "Upload portfolio items",
        assignee: "User",
        date: user?.createdAt ? new Date(new Date(user.createdAt).getTime() + 7*24*60*60*1000).toLocaleDateString() : "N/A",
        completed: !!(profile?.portfolio && profile.portfolio.length > 0),
        priority: 5
      }
    ];

    return baseTasks.sort((a, b) => a.priority - b.priority);
  };

  const tasks = generateTasks();
  const completedCount = tasks.filter(task => task.completed).length;

  const getAssigneeAvatar = (assignee) => {
    const avatarSeed = assignee === 'System' ? '1507003211169-0a1dd7228f2d' : 
                     assignee === 'Admin' ? '1494790108755-2616b612b601' :
                     '1472099645785-5658abf4ff4e';
    return `https://images.unsplash.com/photo-${avatarSeed}?w=24&h=24&fit=crop&crop=face`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Onboarding Progress</h3>
        <span className="text-sm text-gray-500">{completedCount}/{tasks.length} completed</span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Overall Progress</span>
          <span>{Math.round((completedCount / tasks.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-teal-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedCount / tasks.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-12 gap-3 text-sm">
          <div className="col-span-4 font-medium text-gray-600">Task</div>
          <div className="col-span-3 font-medium text-gray-600">Assigned to</div>
          <div className="col-span-2 font-medium text-gray-600">Date</div>
          <div className="col-span-1 font-medium text-gray-600">Status</div>
          <div className="col-span-2 font-medium text-gray-600">Actions</div>
        </div>

        {tasks.map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-3 items-center py-2 text-sm">
            <div className="col-span-4 flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                item.completed ? 'bg-teal-500 border-teal-500' : 'border-gray-300'
              }`}>
                {item.completed && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
              <span className={item.completed ? 'line-through text-gray-400' : ''}>{item.task}</span>
            </div>
            <div className="col-span-3 flex items-center gap-2">
              <img 
                src={getAssigneeAvatar(item.assignee)} 
                alt={item.assignee} 
                className="w-6 h-6 rounded-full"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop&crop=face';
                }}
              />
              <span>{item.assignee}</span>
            </div>
            <div className="col-span-2">{item.date}</div>
            <div className="col-span-1">
              <span className={`px-2 py-1 rounded-full text-xs ${
                item.completed 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {item.completed ? 'Done' : 'Pending'}
              </span>
            </div>
            <div className="col-span-2 flex gap-1">
              <button className="p-1 hover:bg-gray-100 rounded">
                <Eye size={14} className="text-gray-600" />
              </button>
              {!item.completed && (
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Trash2 size={14} className="text-gray-600" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {completedCount < tasks.length && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Next Step:</strong> {tasks.find(t => !t.completed)?.task || "All tasks completed!"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Onboarding;