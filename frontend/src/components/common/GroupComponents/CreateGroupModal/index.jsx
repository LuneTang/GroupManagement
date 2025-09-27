import React from "react";
import Button from "../../Button";
import InputField from "../../InputField";

const CreateGroupModal = ({
  isOpen,
  onClose,
  newGroupName,
  setNewGroupName,
  handleCreateGroup,
  loading
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay create-group">
      <div className="modal">
        <h2>Create New Group</h2>
        <InputField 
          label=""
          type="text"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="Enter group name"
        />
        <div className="modal-actions">
          <Button 
            onClick={handleCreateGroup}
            disabled={!newGroupName.trim() || newGroupName.length > 50 || loading}
          >
            {loading ? 'Creating...' : 'Create'}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;