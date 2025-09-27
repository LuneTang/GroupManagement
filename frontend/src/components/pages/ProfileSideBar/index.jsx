import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../common/Button";
import Toast from "../../common/Toast";
import "../../../assets/ProfileSidebar.css";
import ProfileDetails from "../../common/ProfileComponents/ProfileDetails";
import ProfileEditForm from "../../common/ProfileComponents/ProfileEditForm";
import PasswordChangeModal from "../../common/ProfileComponents/PasswordChangeModal";

import { 
  fetchUserProfile,
  uploadAvatar,
  togglePasswordModal,
  clearToast,
  toggleEditMode
} from "../../../redux/profile/profileSlice";

const ProfileSidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { 
    user, 
    isProfileLoading,
    isAvatarUploading,
    isChangePasswordModalOpen,
    toast,
    isEditMode
  } = useSelector((state) => state.profile);

  const [isClosing, setIsClosing] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchUserProfile());
    } else {
      dispatch(togglePasswordModal(false));
      if (isEditMode) {
        dispatch(toggleEditMode(false));
      }
    }
  }, [isOpen, dispatch]);

  // Modify the close handler to add closing animation
  const handleClose = () => {
    setIsClosing(true);
    
    // Close the password modal first if it's open
    if (isChangePasswordModalOpen) {
      dispatch(togglePasswordModal(false));
    }
    
    // Cancel edit mode if active
    if (isEditMode) {
      dispatch(toggleEditMode(false));
    }
    
    // Delay the actual closing to allow animation to complete
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 500); // Should match the CSS animation duration
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(uploadAvatar({ file }));
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const openChangePasswordModal = () => {
    dispatch(togglePasswordModal(true));
  };

  if (isProfileLoading) return null;

  return (
    <div 
      className={`profile-sidebar 
        ${isOpen ? 'open' : ''} 
        ${isClosing ? 'closing' : ''}`}
    >
      <button className="close-sidebar-btn" onClick={handleClose}>
        &times;
      </button>
      
      <div className="profile-sidebar-content">
        <div className="profile-avatar-section">
          <img 
            src={`/Avatars/${user.avatarUrl}`} 
            alt="Profile Avatar" 
            className="profile-avatar" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/Avatars/Default/hearts.jpg';
            }}
          />
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleAvatarChange}
            hidden
          />
          <Button 
            className="change-avatar-btn" 
            onClick={triggerFileInput}
            disabled={isAvatarUploading}
          >
            {isAvatarUploading ? "Uploading..." : "Change Avatar"}
          </Button>
        </div>

        {isEditMode ? (
          <ProfileEditForm />
        ) : (
          <>
            <ProfileDetails user={user} />
            <Button 
              className="change-password-btn"
              onClick={openChangePasswordModal}
            >
              Change Password
            </Button>
          </>
        )}

        {/* Password Change Modal */}
        {isChangePasswordModalOpen && <PasswordChangeModal />}
      </div>
      
      {toast.isVisible && (
        <Toast 
          message={toast.message}
          type={toast.type}
          onClose={() => dispatch(clearToast())}
        />
      )}
    </div>
  );
};

export default ProfileSidebar;