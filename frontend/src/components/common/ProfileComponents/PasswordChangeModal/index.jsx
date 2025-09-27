import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from 'yup';
import { 
  togglePasswordModal,
  updatePasswordField,
  setPasswordErrors,
  changePassword,
  requestResetPassword
} from "../../../../redux/profile/profileSlice";
import InputField from "../../InputField";
import Button from "../../Button";

const PasswordChangeModal = () => {
  const dispatch = useDispatch();
  const { 
    user, 
    passwordForm, 
    isResetPasswordLoading,
    isForgotPasswordLoading
  } = useSelector((state) => state.profile);

  const handleInputChange = (field) => (e) => {
    dispatch(updatePasswordField({ field, value: e.target.value }));
  };

  const closeModal = () => {
    dispatch(togglePasswordModal(false));
  };

  const validatePassword = async () => {
    const schema = Yup.object().shape({
      oldPassword: Yup.string().required('Current password is required.'),
      newPassword: Yup.string()
        .required('New password is required.')
        .min(6, 'Password must be at least 6 characters'),
      confirmNewPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], "Passwords do not match!")
        .required('Confirm new password is required.')
    });

    try {
      await schema.validate({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
        confirmNewPassword: passwordForm.confirmNewPassword
      }, { abortEarly: false });
      return true;
    } catch (err) {
      const errorMessages = err.inner.reduce((acc, currentErr) => {
        acc[currentErr.path] = currentErr.message;
        return acc;
      }, {});

      dispatch(setPasswordErrors({
        oldPasswordError: errorMessages.oldPassword || "",
        newPasswordError: errorMessages.newPassword || "",
        confirmNewPasswordError: errorMessages.confirmNewPassword || ""
      }));

      return false;
    }
  };

  const handleSubmit = async () => {
    const isValid = await validatePassword();
    if (!isValid) return;

    dispatch(changePassword({
      email: user.email,
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    }));
  };

  const handleForgotPassword = () => {
    dispatch(requestResetPassword(user.email));
  };

  return (
    <div className="password-change-modal">
      <div className="modal-content">
        <h2>Change Password</h2>
        <div className="input-container">
          <InputField
            label="Current Password"
            type="password"
            value={passwordForm.oldPassword}
            onChange={handleInputChange("oldPassword")}
            error={passwordForm.oldPasswordError}
          />
        </div>
        <div className="input-container">
          <InputField
            label="New Password"
            type="password"
            value={passwordForm.newPassword}
            onChange={handleInputChange("newPassword")}
            error={passwordForm.newPasswordError}
          />
        </div>
        <div className="input-container">
          <InputField
            label="Confirm New Password"
            type="password"
            value={passwordForm.confirmNewPassword}
            onChange={handleInputChange("confirmNewPassword")}
            error={passwordForm.confirmNewPasswordError}
          />
        </div>

        <Button
          className="forgot-password-btn"
          onClick={handleForgotPassword}
          disabled={isForgotPasswordLoading}
        >
          {isForgotPasswordLoading ? (
            <span className="loading-indicator">
              <span className="loading-spinner"></span> Processing...
            </span>
          ) : (
            "Forgot Password"
          )}
        </Button>

        <div className="modal-buttons">
          <Button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={isResetPasswordLoading}
          >
            {isResetPasswordLoading ? (
              <span className="loading-indicator">
                <span className="loading-spinner"></span> Processing...
              </span>
            ) : (
              "Reset"
            )}
          </Button>
          {!isResetPasswordLoading && (
            <Button className="cancel-btn" onClick={closeModal}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordChangeModal;