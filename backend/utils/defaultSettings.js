// What every new user has before changing anything in Settings.
export const defaultSettings = {
  notifications: {
    applicationStatus: true, hours: true, certificate: true, review: true,
    eventReminders: true, email: true, sms: false
  },
  privacy: {
    visibility: 'public',
    showEmail: false, showPhone: false, showLinkedin: true, showBirthDate: false,
    showHours: true, showRating: true, showReviews: true, showCertificates: true,
    allowSuggestions: true, allowAnalytics: true
  }
};
