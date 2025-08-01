import { 
  Eye,
  Trash2,
  Plus
} from 'lucide-react';

const Onboarding = () => {
  const tasks = [
    { task: "Complete profile", assignee: "Jim Jones", date: "07/25/2020", completed: true },
    { task: "Prepare workspace, software, access", assignee: "Jim Jones", date: "07/25/2020", completed: false },
    { task: "Meeting with HR manager", assignee: "Jim Jones", date: "07/26/2020", completed: false, attachment: "meeting.zip" },
    { task: "Office tour for employee", assignee: "Sara Smith", date: "07/26/2020", completed: false },
    { task: "Company vision", assignee: "Sara Smith", date: "07/28/2020", completed: false, attachment: "company.zip" }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Onboarding</h3>
        <span className="text-sm text-gray-500">1/5 completed</span>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-12 gap-3 text-sm">
          <div className="col-span-3 font-medium text-gray-600">Task</div>
          <div className="col-span-3 font-medium text-gray-600">Assigned to</div>
          <div className="col-span-2 font-medium text-gray-600">Due Date</div>
          <div className="col-span-2 font-medium text-gray-600">Attachments</div>
          <div className="col-span-2 font-medium text-gray-600">Actions</div>
        </div>

        {tasks.map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-3 items-center py-2 text-sm">
            <div className="col-span-3 flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                item.completed ? 'bg-teal-500 border-teal-500' : 'border-gray-300'
              }`}>
                {item.completed && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
              <span className={item.completed ? 'line-through text-gray-400' : ''}>{item.task}</span>
            </div>
            <div className="col-span-3 flex items-center gap-2">
              <img src={`https://images.unsplash.com/photo-${item.assignee === 'Jim Jones' ? '1507003211169-0a1dd7228f2d' : '1494790108755-2616b612b601'}?w=24&h=24&fit=crop&crop=face`} alt={item.assignee} className="w-6 h-6 rounded-full" />
              <span>{item.assignee}</span>
            </div>
            <div className="col-span-2">{item.date}</div>
            <div className="col-span-2">
              {item.attachment && <span className="text-blue-600 underline">{item.attachment}</span>}
            </div>
            <div className="col-span-2 flex gap-1">
              <button className="p-1 hover:bg-gray-100 rounded">
                <Eye size={14} className="text-gray-600" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <Trash2 size={14} className="text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 bg-orange-400 text-white rounded-lg flex items-center justify-center gap-2">
        <Plus size={16} />
        Add New Task
      </button>
    </div>
  );
};

export default Onboarding;