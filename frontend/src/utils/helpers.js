const severityColors = {
  Low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  High: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  Critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const statusColors = {
  Submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  'Under Review': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  'In Progress': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  Resolved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  Acknowledged: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  Dispatched: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  Completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  Cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
};

export const getSeverityColor = (severity) => severityColors[severity] || severityColors.Low;
export const getStatusColor = (status) => statusColors[status] || statusColors.Submitted;

export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const disasterTypes = [
  'Fire',
  'Flood',
  'Earthquake',
  'Medical Emergency',
  'Electrical Hazard',
  'Other',
];

export const severityLevels = ['Low', 'Medium', 'High', 'Critical'];
export const reportStatuses = ['Submitted', 'Under Review', 'In Progress', 'Resolved'];
