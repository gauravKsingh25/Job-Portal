import { memo, useState } from "react";
import { MapPin, Briefcase, Building, Clock, Search } from "lucide-react";

// Define the options for the search filter
const searchOptions = [
  { value: "location", label: "Location", icon: MapPin },
  { value: "company", label: "Company", icon: Building },
  { value: "jobType", label: "Job Type", icon: Briefcase },
  { value: "experience", label: "Experience", icon: Clock },
];

const SearchBar = memo(function SearchBar({ onSearch }) {
  // State to keep track of the selected search type and the search input value
  const [searchType, setSearchType] = useState("location");
  const [searchValue, setSearchValue] = useState("");

  // Handle the form submission and trigger the search action
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    onSearch(searchType, searchValue); // Trigger the search with selected type and value
  };

  // Find the icon for the selected search type
  const SelectedIcon =
    searchOptions.find((option) => option.value === searchType)?.icon || Search;

  return (
    <form onSubmit={handleSearch} className="flex items-center space-x-2">
      {/* Search input field with an icon */}
      <div className="relative flex-grow">
        <SelectedIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder={`Search by ${
            searchOptions.find((option) => option.value === searchType)?.label
          }`} // Show placeholder based on selected search type
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)} // Update the search value as the user types
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      {/* Dropdown to select search type (Location, Company, etc.) */}
      <select
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)} // Update the search type
        className="pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        {searchOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label} {/* Render each search option */}
          </option>
        ))}
      </select>
      {/* Submit button to trigger the search */}
      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Search
      </button>
    </form>
  );
});

export default SearchBar;
