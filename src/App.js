import { useState, useEffect, useMemo, useCallback } from "react";
import JobList from "./components/JobList";
import JobDetails from "./components/JobDetails";
import SearchBar from "./components/SearchBar";
import { Briefcase } from "lucide-react";
import "./index.css";

export default function App() {
  // State variables to manage app data and UI state
  const [jobs, setJobs] = useState([]); // Store job listings
  const [selectedJob, setSelectedJob] = useState(null); // Store the currently selected job for detailed view
  const [searchCriteria, setSearchCriteria] = useState({
    type: "location", // Default search type is location
    value: "", // Initial search value is empty
  });
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors during data fetch
  const [showWarning, setShowWarning] = useState(true); // Show a warning about loading speed

  // Fetch job data from the remote JSON file on mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/gauravKsingh25/Data/refs/heads/main/jobs.json"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Data is not an array");
        }
        // Add a unique ID to each job to make selection easier
        const uniqueJobs = data.map((job, index) => ({
          ...job,
          uniqueId: `job-${index}-${Date.now()}`,
        }));
        setJobs(uniqueJobs); // Update state with fetched jobs
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError(error.message || "An unknown error occurred");
      } finally {
        setIsLoading(false); // Set loading to false once data is fetched
        setShowWarning(false); // Hide the loading warning once data is available
      }
    };

    // Timeout to hide the warning after 5 seconds if data is still loading
    const warningTimeout = setTimeout(() => {
      setShowWarning(false);
    }, 5000);

    fetchJobs();

    return () => clearTimeout(warningTimeout); // Clean up timeout on component unmount
  }, []);

  // Filter jobs based on search criteria
  const filteredJobs = useMemo(
    () =>
      jobs.filter((job) => {
        if (searchCriteria.value === "") return true; // Show all jobs if no search value
        const searchValue = searchCriteria.value.toLowerCase();
        switch (searchCriteria.type) {
          case "location":
            return job.location.toLowerCase().includes(searchValue);
          case "company":
            return job.company.toLowerCase().includes(searchValue);
          case "jobType":
            return job.employment_type.toLowerCase().includes(searchValue);
          case "experience":
            return job.experience.toLowerCase().includes(searchValue);
          default:
            return true;
        }
      }),
    [jobs, searchCriteria] // Recalculate filtered jobs when jobs or search criteria change
  );

  // Handle search type and value change from the SearchBar component
  const handleSearch = useCallback((type, value) => {
    setSearchCriteria({ type, value });
  }, []);

  // Handle job selection from the JobList component
  const handleSelectJob = useCallback((job) => {
    setSelectedJob(job); // Update the selected job state
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Warning message about slow loading */}
      {showWarning && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-400 text-black text-center py-4">
          For the first time, loading may seem slow. Please wait, and everything
          will work great!
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      ) : error ? (
        // Error state when fetching jobs fails
        <div className="min-h-screen flex flex-col items-center justify-center text-red-500">
          <h2 className="text-2xl font-bold mb-4">Error Loading Jobs</h2>
          <p>{error}</p>
          <p className="mt-4 text-gray-600">
            Please try refreshing the page or check your internet connection.
          </p>
        </div>
      ) : (
        // Main content when jobs data is successfully loaded
        <>
          {/* Header section */}
          <header className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white py-8 px-4">
            <div className="max-w-7xl mx-auto flex items-center">
              <Briefcase className="h-8 w-8 mr-4" />
              <div>
                <h1 className="text-3xl font-bold">Job Listings</h1>
                <p className="mt-2">Find your dream job today</p>
              </div>
            </div>
          </header>

          {/* Search bar */}
          <div className="max-w-7xl mx-auto px-4 py-6">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Main job listing and details layout */}
          <main className="max-w-7xl mx-auto px-4 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job list on the left */}
              <div className="space-y-4">
                <JobList
                  jobs={filteredJobs}
                  selectedJobId={selectedJob?.uniqueId}
                  onSelectJob={handleSelectJob}
                />
              </div>

              {/* Job details on the right */}
              <div className="mt-6 md:mt-0">
                <JobDetails job={selectedJob} allJobs={jobs} />
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  );
}
