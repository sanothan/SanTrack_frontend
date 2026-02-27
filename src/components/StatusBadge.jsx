/**
 * Status Badge Component
 * Displays status with color coding (Pending, In Progress, Completed)
 */

const StatusBadge = ({ status }) => {
  const variants = {
    Pending: 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    Completed: 'bg-green-100 text-green-800',
  };

  const className = variants[status] || 'bg-gray-100 text-gray-800';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
    >
      {status || 'Unknown'}
    </span>
  );
};

export default StatusBadge;
