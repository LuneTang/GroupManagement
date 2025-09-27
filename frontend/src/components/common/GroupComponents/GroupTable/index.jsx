import React from "react";
import Button from "../../Button";

const GroupTable = ({ 
  groups, 
  loading, 
  error, 
  sortField, 
  sortType, 
  handleSort, 
  openEditModal, 
  isGroupSelected,
  toggleGroupSelection,
  currentPageSelectAll,
  toggleSelectAllCurrentPage
}) => {
  if (loading) {
    return (
      <span className="loading-indicator">
        <span className="loading-spinner"></span> Processing...
      </span>
    );
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (groups.length === 0) {
    return <p>No groups found.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th className="selection-column">
            <input 
              type="checkbox"
              checked={currentPageSelectAll}
              onChange={toggleSelectAllCurrentPage}
            />
          </th>
          <th 
            onClick={() => handleSort('name')}
            className="sortable-header"
          >
            Name 
            {sortField === 'name' && (sortType === 'asc' ? ' ▲' : ' ▼')}
          </th>
          <th 
            onClick={() => handleSort('totalMember')}
            className="sortable-header"
          >
            Total Members 
            {sortField === 'totalMember' && (sortType === 'asc' ? ' ▲' : ' ▼')}
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {groups.map((group) => (
          <tr key={group.id}>
            <td>
              <input 
                type="checkbox"
                checked={isGroupSelected(group.id)}
                onChange={() => toggleGroupSelection(group.id)}
              />
            </td>
            <td>{group.name}</td>
            <td>{group.totalMember || 0}</td>
            <td>
              <Button onClick={() => openEditModal(group)}>Edit</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default GroupTable;