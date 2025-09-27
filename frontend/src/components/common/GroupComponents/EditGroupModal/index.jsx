import React from "react";
import Button from "../../Button";
import InputField from "../../InputField";

const EditGroupModal = ({
  isOpen,
  onClose,
  editingGroup,
  editGroupName,
  setEditGroupName,
  editTotalMember,
  setEditTotalMember,
  handleEditGroup,
  loading
}) => {
  if (!isOpen || !editingGroup) return null;

  return (
    <div className="modal-overlay edit-group">
      <div className="modal">
        <h2>Edit Group</h2>
        <InputField 
          label="Group Name"
          type="text"
          value={editGroupName}
          onChange={(e) => setEditGroupName(e.target.value)}
          placeholder="Enter group name"
        />
        <InputField 
          label="Total Members"
          type="number"
          value={editTotalMember}
          onChange={(e) => setEditTotalMember(e.target.value)}
          placeholder="Enter total members"
        />
        <div className="modal-actions">
          <Button 
            onClick={handleEditGroup}
            disabled={!editGroupName.trim() || editGroupName.length > 50 || loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};

export default EditGroupModal;