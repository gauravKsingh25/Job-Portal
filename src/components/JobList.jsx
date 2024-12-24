import { memo } from "react";
import { MapPin, Clock, Building } from "lucide-react";

// Component to display each individual job listing
const JobItem = memo(({ job, isSelected, onSelect }) => (
  <button
    onClick={() => onSelect(job)} // When clicked, select the job
    className={`w-full text-left p-4 rounded-lg shadow transition-colors ${
      isSelected
        ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white" // Highlight selected job
        : "bg-white hover:bg-gray-50" // Default style for non-selected jobs
    }`}
  >
    <div className="flex items-start justify-between">
      <h3
        className={`font-semibold ${
          isSelected ? "text-white" : "text-gray-900"
        }`}
      >
        {job.title}
      </h3>
      {job.companyImageUrl && (
        <img
          src={job.companyImageUrl}
          alt={`${job.company} logo`} // Display company logo
          className="w-10 h-10 rounded-full object-cover"
          loading="lazy"
        />
      )}
    </div>

    {/* Job's company and location */}
    <div
      className={`mt-2 flex items-center text-sm ${
        isSelected ? "text-white/90" : "text-gray-500"
      }`}
    >
      <Building className="h-4 w-4 mr-1" />
      {job.company}
    </div>
    <div
      className={`mt-2 flex items-center text-sm ${
        isSelected ? "text-white/90" : "text-gray-500"
      }`}
    >
      <MapPin className="h-4 w-4 mr-1" />
      {job.location}
    </div>

    {/* Job's employment type and experience requirements */}
    <div className="mt-3 flex items-center gap-3">
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isSelected
            ? "bg-white/20 text-white"
            : "bg-indigo-100 text-indigo-800"
        }`}
      >
        {job.employment_type}
      </span>
      <span
        className={`flex items-center text-xs ${
          isSelected ? "text-white/90" : "text-gray-500"
        }`}
      >
        <Clock className="h-3 w-3 mr-1" />
        {job.experience}
      </span>
    </div>
  </button>
));

// Component to display a list of job items
function JobList({ jobs, selectedJobId, onSelectJob }) {
  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobItem
          key={job.uniqueId} // Use unique ID for each job item
          job={job}
          isSelected={selectedJobId === job.uniqueId} // Check if job is selected
          onSelect={onSelectJob} // Pass the selection handler
        />
      ))}
    </div>
  );
}

export default memo(JobList);
