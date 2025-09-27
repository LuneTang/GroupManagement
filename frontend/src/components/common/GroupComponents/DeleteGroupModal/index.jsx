import React from "react";
import Button from "../../Button";

const DeleteGroupModal = ({
  isOpen,
  onClose,
  selectedGroupsCount,
  handleDeleteGroups,
  loading
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay delete-group">
      <div className="modal">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete {selectedGroupsCount} group(s)?</p>
        <div className="modal-actions">
          <Button 
            onClick={handleDeleteGroups}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteGroupModal;