/**
 * Footer Component
 */

const Footer = () => {
  return (
    <footer className="bg-primary-800 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="font-bold text-secondary-300">SanTrack</h3>
            <p className="text-sm text-primary-200">Rural Sanitation Inspection and Improvement System</p>
          </div>
          <div className="text-sm text-primary-200">
            © {new Date().getFullYear()} SanTrack. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
