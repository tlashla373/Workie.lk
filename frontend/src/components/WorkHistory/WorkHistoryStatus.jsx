// components/WorkHistoryStats.jsx
import React from 'react';
import { Briefcase, CheckCircle, DollarSign, Star } from 'lucide-react';
import StatusCard from './StatusCard';

const WorkHistoryStatus = ({ userType = 'worker', workHistory }) => {
  // Debug logging to help troubleshoot data issues
  console.log('WorkHistoryStatus - userType:', userType);
  console.log('WorkHistoryStatus - workHistory:', workHistory);
  console.log('WorkHistoryStatus - sample job structure:', workHistory[0]);

  const totalEarnings = workHistory
    .filter(job => job.status === 'reviewed' || job.status === 'completed' || job.status === 'closed' || job.status === 'payment-confirmed')
    .reduce((total, job) => {
      // Handle both old format (string with LKR) and new format (number or string)
      let amount = 0;
      
      // Check if proposedPrice exists (from the actual data structure)
      if (job.proposedPrice?.amount) {
        amount = job.proposedPrice.amount;
      } else if (typeof job.salary === 'string') {
        // Handle string format like "LKR 5000"
        amount = parseInt(job.salary.replace(/[^\d]/g, '')) || 0;
      } else if (typeof job.salary === 'number') {
        amount = job.salary;
      }
      
      console.log('Job earnings calculation:', {
        jobId: job.id,
        status: job.status,
        proposedPrice: job.proposedPrice,
        salary: job.salary,
        calculatedAmount: amount
      });
      
      return total + amount;
    }, 0);

  const jobsWithRatings = workHistory.filter(job => {
    // Check multiple possible locations for rating
    return (job.review?.rating && job.review.rating > 0) || (job.rating && job.rating > 0);
  });
  
  const averageRating = jobsWithRatings.length > 0 
    ? (jobsWithRatings.reduce((sum, job) => {
        // Get rating from either location
        const rating = job.review?.rating || job.rating || 0;
        return sum + rating;
      }, 0) / jobsWithRatings.length).toFixed(1)
    : 0;

  console.log('Calculated metrics:', {
    totalEarnings,
    jobsWithRatings: jobsWithRatings.length,
    averageRating
  });

  const getStatusCards = () => {
    if (userType === 'worker') {
      const acceptedJobs = workHistory.filter(job => 
        job.status === 'accepted' || 
        job.status === 'in-progress' || 
        job.status === 'completed' || 
        job.status === 'payment-released' || 
        job.status === 'payment-confirmed' || 
        job.status === 'reviewed' || 
        job.status === 'closed'
      );

      return [
        {
          icon: Briefcase,
          title: 'Applications Sent',
          value: workHistory.length,
          bgColor: 'bg-blue-500'
        },
        {
          icon: CheckCircle,
          title: 'Accepted',
          value: acceptedJobs.length,
          bgColor: 'bg-green-500'
        },
        {
          icon: DollarSign,
          title: 'Total Earnings',
          value: totalEarnings > 0 ? `LKR ${totalEarnings.toLocaleString()}` : 'LKR 0',
          bgColor: 'bg-purple-500'
        },
        {
          icon: Star,
          title: 'Average Rating',
          value: averageRating > 0 ? `${averageRating}/5` : 'No ratings',
          bgColor: 'bg-yellow-500'
        }
      ];
    } else {
      // Employer view cards
      const acceptedApplications = workHistory.filter(job => 
        job.status === 'accepted' || 
        job.status === 'in-progress' || 
        job.status === 'completed' || 
        job.status === 'payment-released' || 
        job.status === 'payment-confirmed' || 
        job.status === 'reviewed' || 
        job.status === 'closed'
      );

      const totalSpent = workHistory
        .filter(job => job.status === 'completed' || job.status === 'reviewed' || job.status === 'closed')
        .reduce((total, job) => {
          let amount = 0;
          if (job.proposedPrice?.amount) {
            amount = job.proposedPrice.amount;
          } else if (typeof job.salary === 'string') {
            amount = parseInt(job.salary.replace(/[^\d]/g, '')) || 0;
          } else if (typeof job.salary === 'number') {
            amount = job.salary;
          }
          return total + amount;
        }, 0);

      return [
        {
          icon: Briefcase,
          title: 'Applications Received',
          value: workHistory.length,
          bgColor: 'bg-blue-500'
        },
        {
          icon: CheckCircle,
          title: 'Accepted',
          value: acceptedApplications.length,
          bgColor: 'bg-green-500'
        },
        {
          icon: DollarSign,
          title: 'Total Spent',
          value: totalSpent > 0 ? `LKR ${totalSpent.toLocaleString()}` : 'LKR 0',
          bgColor: 'bg-purple-500'
        },
        {
          icon: Star,
          title: 'Response Rate',
          value: workHistory.length > 0 ? `${((workHistory.filter(job => job.status !== 'pending').length / workHistory.length) * 100).toFixed(0)}%` : '0%',
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