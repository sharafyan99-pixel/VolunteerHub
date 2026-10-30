export function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateRange(startDate, endDate) {
  if (!endDate || formatDate(startDate) === formatDate(endDate)) {
    return formatDate(startDate);
  }
  return formatDate(startDate) + ' – ' + formatDate(endDate);
}

// "2026-09-15" - the format used by <input type="date">
export function toInputDate(date) {
  return date ? new Date(date).toISOString().slice(0, 10) : '';
}
