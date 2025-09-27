// Import necessary functions and services
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ProfileService from "../../services/profileService";
import authService from "../../services/authService";

// Async thunks for fetching user profile, uploading avatar, changing password, and resetting password
export const fetchUserProfile = createAsyncThunk(
  "profile/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      // Fetch user profile data
      const response = await ProfileService.getProfile();
      let userData = response.data;

      // Set default avatar if user has no avatar
      if (userData.avatarUrl === null) {
        userData = { ...userData, avatarUrl: "Default/hearts.jpg" };
      }

      return userData;
    } catch (err) {
      console.error("Failed to load user profile");
      return rejectWithValue(err.response?.data || "Failed to load profile");
    }
  }
);

// Async thunk for uploading avatar image
export const uploadAvatar = createAsyncThunk(
  "profile/uploadAvatar",
  async ({ file }, { rejectWithValue }) => {
    try {
      // Upload avatar image
      const response = await ProfileService.uploadAvatar(file);
      return response.data;
    } catch (err) {
      return rejectWithValue("Failed to update avatar");
    }
  }
);

// Async thunk for changing user password
export const changePassword = createAsyncThunk(
  "profile/changePassword",
  async ({ email, oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      // Change user password
      const response = await ProfileService.changePassword({
        email,
        oldPassword,
        newPassword,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to change password");
    }
  }
);

// Async thunk for requesting password reset
export const requestResetPassword = createAsyncThunk(
  "profile/requestResetPassword",
  async (email, { rejectWithValue }) => {
    try {
      // Request password reset
      await authService.requestResetPassword(email);
      return true;
    } catch (err) {
      return rejectWithValue("Failed to send reset password link");
    }
  }
);

// New async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  "profile/updateUserProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      // Update user profile
      const response = await ProfileService.updateProfile(profileData);
      return profileData; // Return the data we sent to update state
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update profile");
    }
  }
);

// Define the initial state of the profile slice
const initialState = {
  user: {
    avatarUrl: "",
    userName: "",
    email: "",
    firstName: "",
    lastName: "",
    role: "",
  },
  isProfileLoading: true,
  isAvatarUploading: false,
  isChangePasswordModalOpen: false,
  isResetPasswordLoading: false,
  isForgotPasswordLoading: false,
  isEditMode: false,
  isProfileUpdating: false,
  passwordForm: {
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    oldPasswordError: "",
    newPasswordError: "",
    confirmNewPasswordError: "",
  },
  profileForm: {
    firstName: "",
    lastName: "",
    userName: "",
    email: ""
  },
  profileErrors: {
    firstNameError: "",
    lastNameError: "",
    userNameError: "",
    emailError: ""
  },
  toast: {
    message: "",
    type: "",
    isVisible: false,
  },
};

// Create a profile slice using createSlice
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    // Reducers for toggling password modal, updating form fields, setting password errors, and managing toast messages
    togglePasswordModal: (state, action) => {
      state.isChangePasswordModalOpen = action.payload;
      // Reset form fields when closing modal
      if (!action.payload) {
        state.passwordForm = {
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
          oldPasswordError: "",
          newPasswordError: "",
          confirmNewPasswordError: "",
        };
      }
    },
    updatePasswordField: (state, action) => {
      const { field, value } = action.payload;
      state.passwordForm[field] = value;
    },
    setPasswordErrors: (state, action) => {
      const { oldPasswordError, newPasswordError, confirmNewPasswordError } =
        action.payload;
      state.passwordForm.oldPasswordError = oldPasswordError || "";
      state.passwordForm.newPasswordError = newPasswordError || "";
      state.passwordForm.confirmNewPasswordError =
        confirmNewPasswordError || "";
    },
    setToast: (state, action) => {
      state.toast = action.payload;
    },
    clearToast: (state) => {
      state.toast.isVisible = false;
    },
    // New reducers for profile editing
    toggleEditMode: (state, action) => {
      state.isEditMode = action.payload;
      // Reset errors when exiting edit mode
      if (!action.payload) {
        state.profileErrors = {
          firstNameError: "",
          lastNameError: "",
          userNameError: "",
          emailError: ""
        };
      }
    },
    updateProfileField: (state, action) => {
      const { field, value } = action.payload;
      state.profileForm[field] = value;
      // Clear error when field is updated
      state.profileErrors[`${field}Error`] = "";
    },
    setProfileErrors: (state, action) => {
      state.profileErrors = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handling actions for fetching user profile, uploading avatar, changing password, and requesting reset password
      .addCase(fetchUserProfile.pending, (state) => {
        state.isProfileLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isProfileLoading = false;
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.isProfileLoading = false;
      })

      .addCase(uploadAvatar.pending, (state) => {
        state.isAvatarUploading = true;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.user.avatarUrl = action.payload;
        state.isAvatarUploading = false;
        state.toast = {
          message: "Avatar updated successfully!",
          type: "success",
          isVisible: true,
        };
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.isAvatarUploading = false;
        state.toast = {
          message: action.payload,
          type: "error",
          isVisible: true,
        };
      })

      .addCase(changePassword.pending, (state) => {
        state.isResetPasswordLoading = true;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isResetPasswordLoading = false;
        state.toast = {
          message: "Password changed successfully!",
          type: "success",
          isVisible: true,
        };
        state.isChangePasswordModalOpen = false;

        state.passwordForm = {
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
          oldPasswordError: "",
          newPasswordError: "",
          confirmNewPasswordError: "",
        };
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isResetPasswordLoading = false;
        state.toast = {
          message: action.payload,
          type: "error",
          isVisible: true,
        };
      })

      .addCase(requestResetPassword.pending, (state) => {
        state.isForgotPasswordLoading = true;
      })
      .addCase(requestResetPassword.fulfilled, (state) => {
        state.isForgotPasswordLoading = false;
        state.toast = {
          message:
            "Reset password link has been sent to email. Please check email or spam!",
          type: "success",
          isVisible: true,
        };
      })
      .addCase(requestResetPassword.rejected, (state, action) => {
        state.isForgotPasswordLoading = false;
        state.toast = {
          message: action.payload,
          type: "error",
          isVisible: true,
        };
      })
      
      // New handlers for update profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isProfileUpdating = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        // Update the user object with the new profile data
        state.user = {
          ...state.user,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          userName: action.payload.username, // Note the different property name
          email: action.payload.email
        };
        state.isProfileUpdating = false;
        state.isEditMode = false; // Exit edit mode
        state.toast = {
          message: "Profile updated successfully!",
          type: "success",
          isVisible: true,
        };
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isProfileUpdating = false;
        state.toast = {
          message: action.payload,
          type: "error",
          isVisible: true,
        };
      });
  },
});

// Export actions and reducer from the profile slice
export const {
  togglePasswordModal,
  updatePasswordField,
  setPasswordErrors,
  setToast,
  clearToast,
  toggleEditMode,
  updateProfileField,
  setProfileErrors
} = profileSlice.actions;

export default profileSlice.reducer; // Export the reducer function