import React from "react";

const SearchBar = ({ placeholder, onSearch }) => {
  const handleInputChange = (event) => {
    onSearch(event.target.value);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder={placeholder}
        onChange={handleInputChange}
        className="w-full px-4 py-2 border rounded-md bg-white"
      />
    </div>
  );
};

export default SearchBar;
