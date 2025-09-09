// components/WorkHistoryStats.jsx
import React from 'react';
import { Briefcase, CheckCircle, DollarSign, Star } from 'lucide-react';
import StatusCard from './StatusCard';

const WorkHistoryStatus = ({ viewRole, workHistory }) => {
  const totalEarnings = workHistory
    .filter(job => job.status === 'completed')
    .reduce((total, job) => {
      const salary = parseInt(job.salary.replace(/[^\d]/g, ''));
      return total + salary;
    }, 0);

  const averageRating = workHistory
    .filter(job => job.rating)
    .reduce((sum, job, _, arr) => sum + (job.rating || 0) / arr.length, 0);

  const getStatusCards = () => {
    if (viewRole === 'worker') {
      return [
        {
          icon: Briefcase,
          title: 'Total Jobs',
          value: workHistory.length,
          bgColor: 'bg-blue-500'
        },
        {
          icon: CheckCircle,
          title: 'Completed',
          value: workHistory.filter(job => job.status === 'completed').length,
          bgColor: 'bg-green-500'
        },
        {
          icon: DollarSign,
          title: 'Total Earned',
          value: `LKR ${(totalEarnings / 1).toFixed(0)}.00`,
          bgColor: 'bg-purple-500'
        },
        {
          icon: Star,
          title: 'Avg Rating',
          value: averageRating.toFixed(1),
          bgColor: 'bg-yellow-500'
        }
      ];
    } else {
      // Client view cards
      const totalSpent = workHistory
        .filter(job => job.status === 'completed')
        .reduce((total, job) => {
          const salary = parseInt(job.salary.replace(/[^\d]/g, ''));
          return total + salary;
        }, 0);

      return [
        {
          icon: Briefcase,
          title: 'Total Projects',
          value: workHistory.length,
          bgColor: 'bg-blue-500'
        },
        {
          icon: CheckCircle,
          title: 'Completed',
          value: workHistory.filter(job => job.status === 'completed').length,
          bgColor: 'bg-green-500'
        },
        {
          icon: DollarSign,
          title: 'Total Spent',
          value: `LKR ${(totalSpent / 1).toFixed(0)}.00`,
          bgColor: 'bg-purple-500'
        },
        {
          icon: Star,
          title: 'Reviews Given',
          value: workHistory.filter(job => job.rating).length,
          bgColor: 'bg-yellow-500'
        }
      ];
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4 mb-4 md:mb-6">
      {getStatusCards().map((card, index) => (
        <StatusCard
          key={index}
          icon={card.icon}
          title={card.title}
          value={card.value}
          bgColor={card.bgColor}
        />
      ))}
    </div>
  );
};

export default WorkHistoryStatus;