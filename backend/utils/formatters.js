// These functions decide exactly what data is sent to the website.
// Passwords and other private fields are never included.
import { formatDate, formatDateRange, toInputDate } from './dateUtils.js';
import { defaultSettings } from './defaultSettings.js';

export function getDisplayName(user) {
  if (!user) return 'Unknown';
  if (user.role === 'organization') return user.organizationName;
  return user.firstName + ' ' + user.lastName;
}

export function formatUser(user) {
  const savedSettings = user.settings || {};
  return {
    id: user._id,
    role: user.role,
    name: getDisplayName(user),
    firstName: user.firstName,
    lastName: user.lastName,
    organizationName: user.organizationName,
    jobTitle: user.jobTitle,
    foundedYear: user.foundedYear,
    website: user.website,
    description: user.description,
    email: user.email,
    phone: user.phone,
    city: user.city,
    dateOfBirth: toInputDate(user.dateOfBirth),
    bio: user.bio,
    linkedinUrl: user.linkedinUrl,
    skills: user.skills,
    interests: user.interests,
    availability: user.availability,
    rating: user.rating,
    ratingCount: user.ratingCount,
    memberSince: formatDate(user.createdAt),
    settings: {
      notifications: { ...defaultSettings.notifications, ...savedSettings.notifications },
      privacy: { ...defaultSettings.privacy, ...savedSettings.privacy }
    }
  };
}

export function formatOpportunity(opportunity) {
  return {
    id: opportunity._id,
    title: opportunity.title,
    category: opportunity.category,
    city: opportunity.city,
    description: opportunity.description,
    organizationId: opportunity.organization,
    organizationName: opportunity.organizationName,
    startDate: toInputDate(opportunity.startDate),
    endDate: toInputDate(opportunity.endDate || opportunity.startDate),
    dates: formatDateRange(opportunity.startDate, opportunity.endDate),
    maxVolunteers: opportunity.maxVolunteers,
    status: opportunity.status
  };
}

// application must have "opportunity" and "volunteer" filled in (populate)
export function formatApplication(application, extra = {}) {
  return {
    id: application._id,
    status: application.status,
    appliedAt: formatDate(application.createdAt),
    opportunityId: application.opportunity._id,
    opportunityTitle: application.opportunity.title,
    organizationName: application.opportunity.organizationName,
    volunteerId: application.volunteer._id,
    volunteerName: getDisplayName(application.volunteer),
    approvedHours: extra.approvedHours || 0,
    reviewedByMe: extra.reviewedByMe || false
  };
}

export function formatHourLog(hourLog) {
  return {
    id: hourLog._id,
    activity: hourLog.opportunity.title,
    volunteerName: getDisplayName(hourLog.volunteer),
    date: formatDate(hourLog.workDate),
    hours: hourLog.hours,
    status: hourLog.status
  };
}

export function formatCertificate(certificate) {
  return {
    id: certificate._id,
    number: certificate.number,
    title: certificate.title,
    organizationName: certificate.organizationName,
    volunteerName: certificate.volunteerName,
    hours: certificate.hours,
    issuedAt: formatDate(certificate.createdAt)
  };
}

export function formatReview(review) {
  return {
    id: review._id,
    fromName: review.fromName,
    opportunityTitle: review.opportunityTitle,
    rating: review.rating,
    comment: review.comment,
    date: formatDate(review.createdAt)
  };
}

export function formatNotification(notification) {
  return {
    id: notification._id,
    title: notification.title,
    text: notification.text,
    isRead: notification.isRead,
    date: formatDate(notification.createdAt)
  };
}
