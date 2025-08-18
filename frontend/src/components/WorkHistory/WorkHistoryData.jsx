// data/workHistoryData.js
export const workHistoryData = [
  {
    id: 1,
    title: 'Carpenter',
    company: 'HomeFix Interior Solutions',
    location: 'Colombo, Sri Lanka',
    duration: 'Jan 2024 - Apr 2024',
    salary: 'LKR 9,500/day',
    status: 'completed',
    stage: 8, // Job Closed
    rating: 3,
    description: 'Installed custom-built wardrobes and kitchen cabinets for a modern apartment in Colombo.',
    skills: ['Furniture Assembly', 'Wood Finishing', 'Measurement Accuracy', 'Power Tools'],
    type: 'Freelance'
  },
  {
    id: 2,
    title: 'Carpenter',
    company: 'UrbanWood Designs',
    location: 'Negombo, Sri Lanka',
    duration: 'May 2024 - Jun 2024',
    salary: 'LKR 6,200/day',
    status: 'completed',
    stage: 7, // Review & Feedback stage
    rating: 4,
    description: 'Designed and built an outdoor wooden patio and decking for a residential project.',
    skills: ['Deck Building', 'Wood Treatment', 'Blueprint Reading', 'Outdoor Furniture'],
    type: 'Contract'
  },
  {
    id: 3,
    title: 'Carpenter',
    company: 'CraftLine Interiors',
    location: 'Kandy, Sri Lanka',
    duration: 'Jul 2024 - Present',
    salary: 'LKR 7,500/day',
    status: 'accepted',
    stage: 2, // Application Accepted
    rating: null,
    description: 'Restaurant interior project, focusing on wooden ceilings and wall panels.',
    skills: ['Interior Carpentry', 'Precision Cutting', 'On-Site Installation'],
    type: 'Full-time'
  },
  {
    id: 4,
    title: 'Carpenter',
    company: 'Modern Wood Craft',
    location: 'Galle, Sri Lanka',
    duration: 'Aug 2024 - Present',
    salary: 'LKR 8,000/day',
    status: 'in-progress',
    stage: 3, // In Progress
    rating: null,
    description: 'Currently working on custom furniture for a luxury hotel project.',
    skills: ['Custom Furniture', 'Hotel Interiors', 'Quality Finishing'],
    type: 'Contract'
  },
  {
    id: 5,
    title: 'Carpenter',
    company: 'Elite Constructions',
    location: 'Matara, Sri Lanka',
    duration: 'Sep 2024 - Present',
    salary: 'LKR 7,200/day',
    status: 'pending-payment',
    stage: 5, // Payment Pending
    rating: null,
    description: 'Completed wooden flooring installation, waiting for client payment confirmation.',
    skills: ['Floor Installation', 'Wood Treatment', 'Precision Work'],
    type: 'Freelance'
  },
  {
    id: 6,
    title: 'Carpenter',
    company: 'Elite Constructions',
    location: 'Matara, Sri Lanka',
    duration: 'Sep 2024 - Present',
    salary: 'LKR 7,200/day',
    status: 'Application Pending',
    stage: 1, // Payment Pending
    rating: null,
    description: 'Completed wooden flooring installation, waiting for client payment confirmation.',
    skills: ['Floor Installation', 'Wood Treatment', 'Precision Work'],
    type: 'Freelance'
  }
];

// Job stages mapping for reference
export const jobStages = [
  { id: 1, name: 'Application Pending' },
  { id: 2, name: 'Application Accepted' },
  { id: 3, name: 'In Progress' },
  { id: 4, name: 'Work Completed' },
  { id: 5, name: 'Payment Pending' },
  { id: 6, name: 'Payment Successful' },
  { id: 7, name: 'Review & Feedback' },
  { id: 8, name: 'Job Closed' }
];

// Job status types for filtering
export const jobStatuses = [
  'all',
  'completed',
  'in-progress',
  'accepted',
  'pending-payment',
  'cancelled'
];

// Helper functions for data manipulation
export const getJobById = (id) => {
  return workHistoryData.find(job => job.id === id);
};

export const getJobsByStatus = (status) => {
  if (status === 'all') return workHistoryData;
  return workHistoryData.filter(job => job.status === status);
};

export const getCompletedJobs = () => {
  return workHistoryData.filter(job => job.status === 'completed');
};

export const getTotalEarnings = () => {
  return getCompletedJobs().reduce((total, job) => {
    const salary = parseInt(job.salary.replace(/[^\d]/g, ''));
    return total + salary;
  }, 0);
};

export const getAverageRating = () => {
  const ratedJobs = workHistoryData.filter(job => job.rating);
  if (ratedJobs.length === 0) return 0;
  
  const totalRating = ratedJobs.reduce((sum, job) => sum + job.rating, 0);
  return totalRating / ratedJobs.length;
};