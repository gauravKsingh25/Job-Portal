import { memo } from "react";
import {
  MapPin,
  Calendar,
  Briefcase,
  Building,
  Globe,
  Link2,
  DollarSign,
  Clock,
} from "lucide-react";

// Memoizing JobDetails component to avoid unnecessary re-renders
const JobDetails = memo(function JobDetails({ job, allJobs }) {
  if (!job) {
    // If no job is selected, show all companies and their job openings
    const companyOpenings = allJobs.reduce((acc, job) => {
      if (!acc[job.company]) {
        // Create an entry for each company with its count and logo
        acc[job.company] = { count: 0, logo: job.companyImageUrl };
      }
      // Increase the job count for the company
      acc[job.company].count++;
      return acc;
    }, {});

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">All Companies</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(companyOpenings).map(([company, { count, logo }]) => (
            <div
              key={company}
              className="flex items-center space-x-2 p-2 border rounded"
            >
              {/* Display company logo or fallback to a building icon */}
              {logo ? (
                <img
                  src={logo}
                  alt={`${company} logo`}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <Building className="w-10 h-10 text-gray-400" />
              )}
              <div>
                <p className="font-semibold">{company}</p>
                <p className="text-sm text-gray-600">
                  {count} opening{count !== 1 ? "s" : ""} available
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header with job title and company details */}
      <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{job.title}</h2>
            <div className="mt-2 flex items-center text-white/90">
              <Building className="h-5 w-5 mr-1" />
              {job.company}
            </div>
            <div className="mt-2 flex items-center text-white/90">
              <MapPin className="h-5 w-5 mr-1" />
              {job.location}
            </div>
          </div>
          {job.companyImageUrl && (
            <img
              src={job.companyImageUrl}
              alt={`${job.company} logo`}
              className="w-16 h-16 rounded-lg object-cover bg-white p-1"
            />
          )}
        </div>
      </div>

      {/* Job details section */}
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Employment Type</div>
            <div className="mt-1 flex items-center">
              <Briefcase className="h-4 w-4 mr-1 text-gray-400" />
              {job.employment_type}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Experience Required</div>
            <div className="mt-1 flex items-center">
              <Clock className="h-4 w-4 mr-1 text-gray-400" />
              {job.experience}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Posted On</div>
            <div className="mt-1 flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-gray-400" />
              {new Date(job.postedDateTime.$date).toLocaleDateString()}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Source</div>
            <div className="mt-1 flex items-center">
              <Globe className="h-4 w-4 mr-1 text-gray-400" />
              {job.source}
            </div>
          </div>
        </div>

        {/* Salary, Company website, Description, and other sections */}
        {job.salary && (
          <div>
            <div className="text-sm text-gray-500">Salary</div>
            <div className="mt-1 flex items-center">
              <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
              {job.salary}
            </div>
          </div>
        )}

        {job.company_url && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Company Website</h3>
            <a
              href={job.company_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex items-center text-indigo-600 hover:text-indigo-500"
            >
              <Link2 className="h-4 w-4 mr-1" />
              Visit the company profile
            </a>
          </div>
        )}

        {/* Job description and requirements */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Job Description</h3>
          {job.description ? (
            <p className="text-gray-700 whitespace-pre-wrap">
              {job.description}
            </p>
          ) : (
            <p className="text-gray-500 italic">No description available yet.</p>
          )}
        </div>

        {job.requirements && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Requirements</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{job.requirements}</p>
          </div>
        )}

        {job.benefits && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Benefits</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{job.benefits}</p>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold mb-2">Apply Now</h3>
          <a
            href={job.job_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Apply for this position
          </a>
        </div>

        {job.companytype && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm text-gray-500">Company Size</div>
            <div className="mt-1 capitalize">{job.companytype} company</div>
          </div>
        )}
      </div>
    </div>
  );
});

export default JobDetails;
