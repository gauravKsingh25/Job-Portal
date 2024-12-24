import { useState, useEffect, useMemo, useCallback } from "react";
import JobList from "./components/JobList";
import JobDetails from "./components/JobDetails";
import SearchBar from "./components/SearchBar";
import { Briefcase } from "lucide-react";
import "./index.css";

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState({
    type: "location",
    value: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showWarning, setShowWarning] = useState(true); // Track warning visibility

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
        const uniqueJobs = data.map((job, index) => ({
          ...job,
          uniqueId: `job-${index}-${Date.now()}`,
        }));
        setJobs(uniqueJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError(error.message || "An unknown error occurred");
      } finally {
        setIsLoading(false);
        setShowWarning(false); // Hide warning when data is loaded
      }
    };

    // Hide warning after 5 seconds even if data is still loading
    const warningTimeout = setTimeout(() => {
      setShowWarning(false);
    }, 5000);

    fetchJobs();

    return () => clearTimeout(warningTimeout); // Clean up timeout
  }, []);

  const filteredJobs = useMemo(
    () =>
      jobs.filter((job) => {
        if (searchCriteria.value === "") return true;
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
    [jobs, searchCriteria]
  );

  const handleSearch = useCallback((type, value) => {
    setSearchCriteria({ type, value });
  }, []);

  const handleSelectJob = useCallback((job) => {
    setSelectedJob(job);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {showWarning && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-400 text-black text-center py-4">
          For the first time, loading may seem slow. Please wait, and everything
          will work great!
        </div>
      )}

      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      ) : error ? (
        <div className="min-h-screen flex flex-col items-center justify-center text-red-500">
          <h2 className="text-2xl font-bold mb-4">Error Loading Jobs</h2>
          <p>{error}</p>
          <p className="mt-4 text-gray-600">
            Please try refreshing the page or check your internet connection.
          </p>
        </div>
      ) : (
        <>
          <header className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white py-8 px-4">
            <div className="max-w-7xl mx-auto flex items-center">
              <Briefcase className="h-8 w-8 mr-4" />
              <div>
                <h1 className="text-3xl font-bold">Job Listings</h1>
                <p className="mt-2">Find your dream job today</p>
              </div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto px-4 py-6">
            <SearchBar onSearch={handleSearch} />
          </div>

          <main className="max-w-7xl mx-auto px-4 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <JobList
                  jobs={filteredJobs}
                  selectedJobId={selectedJob?.uniqueId}
                  onSelectJob={handleSelectJob}
                />
              </div>

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
