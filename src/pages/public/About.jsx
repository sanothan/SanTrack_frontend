/**
 * About Page
 */

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-primary-800 mb-6">About SanTrack</h1>
      <p className="text-gray-600 mb-4">
        SanTrack is a comprehensive platform designed to improve rural sanitation through systematic
        inspection and community-driven issue reporting.
      </p>
      <p className="text-gray-600 mb-4">
        Our mission is to empower communities, inspectors, and administrators to work together
        in creating healthier environments.
      </p>
      <h2 className="text-xl font-semibold text-primary-700 mt-8 mb-4">Key Features</h2>
      <ul className="list-disc list-inside text-gray-600 space-y-2">
        <li>Real-time issue reporting by community leaders</li>
        <li>Structured inspection workflows for inspectors</li>
        <li>Centralized management for administrators</li>
        <li>Village-level tracking and progress monitoring</li>
      </ul>
    </div>
  );
};

export default About;
