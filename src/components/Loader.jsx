/**
 * Loader Component
 */

const Loader = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div
        className={`animate-spin rounded-full border-4 border-primary-200 border-t-primary-600 ${sizeClasses[size]}`}
      />
    </div>
  );
};

export default Loader;
