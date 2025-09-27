import React from "react";
import { useDispatch } from "react-redux";
import { 
  UserIcon, 
  BriefcaseIcon, 
  MailIcon,
  EditIcon
} from 'lucide-react';
import { toggleEditMode } from "../../../../redux/profile/profileSlice";
import Button from "../../Button";

const ProfileDetails = ({ user }) => {
  const dispatch = useDispatch();

  const handleEditClick = () => {
    dispatch(toggleEditMode(true));
  };

  return (
    <div className="profile-details">
      <div className="profile-header">
        <h3>{`${user.firstName} ${user.lastName}`}</h3>
        <Button 
          className="edit-profile-btn"
          onClick={handleEditClick}
        >
          <EditIcon size={16} /> Edit
        </Button>
      </div>
      
      <div className="profile-detail-item">
        <div className="profile-detail-icon">
          <BriefcaseIcon size={20} />
        </div>
        <div className="profile-detail-label">Role</div>
        <div className="profile-detail-value">{user.role}</div>
      </div>
      
      <div className="profile-detail-item">
        <div className="profile-detail-icon">
          <UserIcon size={20} />
        </div>
        <div className="profile-detail-label">Username</div>
        <div className="profile-detail-value">{user.userName}</div>
      </div>
      
      <div className="profile-detail-item">
        <div className="profile-detail-icon">
          <MailIcon size={20} />
        </div>
        <div className="profile-detail-label">Email</div>
        <div className="profile-detail-value">{user.email}</div>
      </div>
    </div>
  );
};

export default ProfileDetails;