import Application from '../models/Application.js';
import Certificate from '../models/Certificate.js';
import HourLog from '../models/HourLog.js';
import Opportunity from '../models/Opportunity.js';

export async function getOpportunityIds(organizationId) {
  return Opportunity.find({ organization: organizationId }).distinct('_id');
}

// Returns a Map:  applicationId -> total approved hours
export async function getApprovedHoursByApplication(applicationIds) {
  const groups = await HourLog.aggregate([
    { $match: { application: { $in: applicationIds }, status: 'Approved' } },
    { $group: { _id: '$application', total: { $sum: '$hours' } } }
  ]);
  const hoursMap = new Map();
  for (const group of groups) {
    hoursMap.set(String(group._id), group.total);
  }
  return hoursMap;
}

async function sumApprovedHours(filter) {
  const groups = await HourLog.aggregate([
    { $match: { ...filter, status: 'Approved' } },
    { $group: { _id: null, total: { $sum: '$hours' } } }
  ]);
  return groups.length > 0 ? groups[0].total : 0;
}

export async function getVolunteerStats(user) {
  const [totalHours, completedCount, certificateCount, applicationCount] = await Promise.all([
    sumApprovedHours({ volunteer: user._id }),
    Application.countDocuments({ volunteer: user._id, status: 'Completed' }),
    Certificate.countDocuments({ volunteer: user._id }),
    Application.countDocuments({ volunteer: user._id })
  ]);
  return { totalHours, completedCount, certificateCount, applicationCount, rating: user.rating };
}

export async function getOrganizationStats(user) {
  const opportunityIds = await getOpportunityIds(user._id);
  const [activeListings, volunteerIds, totalHours] = await Promise.all([
    Opportunity.countDocuments({ organization: user._id, status: 'open' }),
    Application.distinct('volunteer', { opportunity: { $in: opportunityIds }, status: { $in: ['Approved', 'Completed'] } }),
    sumApprovedHours({ opportunity: { $in: opportunityIds } })
  ]);
  return { activeListings, volunteerCount: volunteerIds.length, totalHours, rating: user.rating };
}
