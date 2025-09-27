import React from "react";
import Button from "../../Button";

const GroupHeader = ({
  openCreateModal,
  openDeleteModal,
  selectedGroupsCount,
  refreshForm
}) => {
  return (
    <div className="manage-group-header">
      <h2>Manage Groups</h2>
      <div className="group-header-actions">
        <Button 
          className="create-group-btn" 
          onClick={openCreateModal}
        >
          ✚ Group
        </Button>
        <Button 
          className="delete-group-btn" 
          onClick={openDeleteModal}
          disabled={selectedGroupsCount === 0}
        >
          Delete ({selectedGroupsCount})
        </Button>
        <Button 
          className="refresh-form-btn" 
          onClick={refreshForm}
        >
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default GroupHeader;