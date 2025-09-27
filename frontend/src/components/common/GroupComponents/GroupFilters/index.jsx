import React from "react";
import InputField from "../../InputField";

const GroupFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  minMembers, 
  setMinMembers, 
  maxMembers, 
  setMaxMembers, 
  setLocalCurrentPage 
}) => {
  return (
    <div className="filter-container">
      <InputField 
        type="text" 
        placeholder="Search groups..." 
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setLocalCurrentPage(1);
        }}
        className="search-input"
      />
      <div className="member-filter">
        <InputField 
          type="number" 
          placeholder="Min Members" 
          value={minMembers}
          onChange={(e) => {
            setMinMembers(e.target.value);
            setLocalCurrentPage(1);
          }}
          className="member-input"
        />
        <InputField 
          type="number" 
          placeholder="Max Members" 
          value={maxMembers}
          onChange={(e) => {
            setMaxMembers(e.target.value);
            setLocalCurrentPage(1);
          }}
          className="member-input"
        />
      </div>
    </div>
  );
};

export default GroupFilters;