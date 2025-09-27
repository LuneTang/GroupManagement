import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as yup from 'yup';
import { 
  toggleEditMode, 
  updateProfileField,
  setProfileErrors,
  updateUserProfile 
} from "../../../../redux/profile/profileSlice";
import InputField from "../../InputField";
import Button from "../../Button";

const ProfileEditForm = () => {
  const dispatch = useDispatch();
  const { user, profileForm, profileErrors, isProfileUpdating } = useSelector((state) => state.profile);

  // Initialize form when component mounts
  useEffect(() => {
    if (user) {
      dispatch(updateProfileField({ field: 'firstName', value: user.firstName }));
      dispatch(updateProfileField({ field: 'lastName', value: user.lastName }));
      dispatch(updateProfileField({ field: 'userName', value: user.userName }));
      dispatch(updateProfileField({ field: 'email', value: user.email }));
    }
  }, [user, dispatch]);

  const handleInputChange = (field) => (e) => {
    dispatch(updateProfileField({ field, value: e.target.value }));
  };

  const handleCancelClick = () => {
    dispatch(toggleEditMode(false));
  };

  const validateProfile = async () => {
    const schema = yup.object().shape({
      userName: yup.string()
          .required("Username is required")
          .min(6, "Username must be at least 6 characters")
          .max(50, "Username must be at most 50 characters"),
        email: yup.string()
          .email("Invalid email")
          .min(6, "Email must be at least 6 characters")
          .max(50, "Email must be at most 50 characters")
          .required("Email is required"),
        firstName: yup.string()
          .required("First name is required")
          .max(50, "First name must be at most 50 characters"),
        lastName: yup.string()
          .required("Last name is required")
          .max(50, "Last name must be at most 50 characters"),
    });

    try {
      await schema.validate({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        userName: profileForm.userName,
        email: profileForm.email
      }, { abortEarly: false });
      return true;
    } catch (err) {
      const errorMessages = err.inner.reduce((acc, currentErr) => {
        acc[currentErr.path] = currentErr.message;
        return acc;
      }, {});

      dispatch(setProfileErrors({
        firstNameError: errorMessages.firstName || "",
        lastNameError: errorMessages.lastName || "",
        userNameError: errorMessages.userName || "",
        emailError: errorMessages.email || ""
      }));

      return false;
    }
  };

  const handleSubmit = async () => {
    const isValid = await validateProfile();
    if (!isValid) return;

    dispatch(updateUserProfile({
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      username: profileForm.userName,
      email: profileForm.email
    }));
  };

  return (
    <div className="profile-edit-form">
      <div className="input-container">
        <InputField
          label="First Name"
          type="text"
          value={profileForm.firstName}
          onChange={handleInputChange("firstName")}
          error={profileErrors.firstNameError}
        />
        <InputField
          label="Last Name"
          type="text"
          value={profileForm.lastName}
          onChange={handleInputChange("lastName")}
          error={profileErrors.lastNameError}
        />
      </div>
      <div className="input-container">
        <InputField
          label="Username"
          type="text"
          value={profileForm.userName}
          onChange={handleInputChange("userName")}
          error={profileErrors.userNameError}
        />
        <InputField
          label="Email"
          type="email"
          value={profileForm.email}
          onChange={handleInputChange("email")}
          error={profileErrors.emailError}
        />
      </div>

      <div className="edit-actions">
        <Button
          className="save-profile-btn"
          onClick={handleSubmit}
          disabled={isProfileUpdating}
        >
          {isProfileUpdating ? (
            <span className="loading-indicator">
              <span className="loading-spinner"></span> Saving...
            </span>
          ) : (
            <>
              Save
            </>
          )}
        </Button>
        <Button
          className="cancel-edit-btn"
          onClick={handleCancelClick}
          disabled={isProfileUpdating}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ProfileEditForm;