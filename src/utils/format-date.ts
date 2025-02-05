export function formatDate(
  date?: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
) {
  if (!date) return '--';
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-US', options);
}
