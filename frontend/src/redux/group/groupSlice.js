import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import groupService from '../../services/groupService';

// Create async thunks
export const fetchGroups = createAsyncThunk(
  'groups/fetchGroups',
  async ({ 
    searchTerm = "", 
    currentPage = 1, 
    sortField = "name", 
    sortType = "asc", 
    minMembers = 0, 
    maxMembers = 0 
  }, { rejectWithValue }) => {
    try {
      const response = await groupService.viewGroups(
        searchTerm,
        currentPage,
        sortField,
        sortType,
        minMembers ? parseInt(minMembers) : 0,
        maxMembers ? parseInt(maxMembers) : 0
      );
      
      return {
        groups: response.data.content || [],
        totalPages: response.data.totalPages || 0,
        totalItems: response.data.totalElements || 0,
      };
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : "Failed to load groups"
      );
    }
  }
);

export const createGroup = createAsyncThunk(
  'groups/createGroup',
  async (name, { dispatch, rejectWithValue }) => {
    try {
      // Validate group name
      if (!name.trim()) {
        dispatch(setNotification({ message: "Group name cannot be empty", type: "error" }));
        return rejectWithValue("Group name cannot be empty");
      }

      if (name.length > 50) {
        dispatch(setNotification({ message: "Group name must be 50 characters or less", type: "error" }));
        return rejectWithValue("Group name must be 50 characters or less");
      }

      await groupService.createGroup({ name });
      dispatch(setNotification({ message: "Group created successfully", type: "success" }));
      return true;
    } catch (error) {
      const errorMsg = error.response && error.response.data.message
        ? error.response.data.message
        : "Failed to create group";
      dispatch(setNotification({ message: errorMsg, type: "error" }));
      return rejectWithValue(errorMsg);
    }
  }
);

export const editGroup = createAsyncThunk(
  'groups/editGroup',
  async ({ id, name, totalMember }, { dispatch, rejectWithValue }) => {
    try {
      // Validate group name
      if (!name.trim()) {
        dispatch(setNotification({ message: "Group name cannot be empty", type: "error" }));
        return rejectWithValue("Group name cannot be empty");
      }

      if (name.length > 50) {
        dispatch(setNotification({ message: "Group name must be 50 characters or less", type: "error" }));
        return rejectWithValue("Group name must be 50 characters or less");
      }

      const payload = {
        name,
        totalMember: totalMember !== "" ? parseInt(totalMember) : undefined,
      };

      await groupService.editGroup(id, payload);
      dispatch(setNotification({ message: "Group updated successfully", type: "success" }));
      return true;
    } catch (error) {
      const errorMsg = error.response && error.response.data.message
        ? error.response.data.message
        : "Failed to update group";
      dispatch(setNotification({ message: errorMsg, type: "error" }));
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteGroups = createAsyncThunk(
  'groups/deleteGroups',
  async ({ selectedGroups, currentPage, groupCount }, { dispatch, rejectWithValue }) => {
    try {
      if (selectedGroups.length === 0) {
        dispatch(setNotification({ message: "No groups selected", type: "error" }));
        return rejectWithValue("No groups selected");
      }

      // Convert selected group IDs to string for API
      const groupIds = selectedGroups.join(",");
      await groupService.deleteGroup(groupIds);
      
      dispatch(setNotification({ 
        message: `${selectedGroups.length} group(s) deleted successfully`, 
        type: "success" 
      }));
      
      // Calculate new page if needed
      let newPage = currentPage;
      if (currentPage > 1 && groupCount === selectedGroups.length) {
        newPage = currentPage - 1;
      }
      
      return { newPage };
    } catch (error) {
      const errorMsg = error.response && error.response.data.message
        ? error.response.data.message
        : "Failed to delete groups";
      dispatch(setNotification({ message: errorMsg, type: "error" }));
      return rejectWithValue(errorMsg);
    }
  }
);

// Create slice
const groupSlice = createSlice({
  name: 'group',
  initialState: {
    groups: [],
    loading: false,
    error: null,
    totalPages: 0,
    totalItems: 0,
    notification: null,
    currentPage: 1,
    searchTerm: '',
    minMembers: '',
    maxMembers: '',
    sortField: 'name',
    sortType: 'asc',
    selectedGroups: []
  },
  reducers: {
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
    clearNotification: (state) => {
      state.notification = null;
    },
    setSelectedGroups: (state, action) => {
      state.selectedGroups = action.payload;
    },
    setFilters: (state, action) => {
      const { searchTerm, currentPage, sortField, sortType, minMembers, maxMembers } = action.payload;
      if (searchTerm !== undefined) state.searchTerm = searchTerm;
      if (currentPage !== undefined) state.currentPage = currentPage;
      if (sortField !== undefined) state.sortField = sortField;
      if (sortType !== undefined) state.sortType = sortType;
      if (minMembers !== undefined) state.minMembers = minMembers;
      if (maxMembers !== undefined) state.maxMembers = maxMembers;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchGroups
      .addCase(fetchGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload.groups;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle createGroup
      .addCase(createGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGroup.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle editGroup
      .addCase(editGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editGroup.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(editGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle deleteGroups
      .addCase(deleteGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGroups.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Export the notification actions
export const { setNotification, clearNotification, setSelectedGroups, setFilters } = groupSlice.actions;

// Create notification middleware
export const notificationMiddleware = () => (next) => (action) => {
  const result = next(action);
  
  if (action.type === setNotification.type) {
    setTimeout(() => {
      next(clearNotification());
    }, 3000);
  }
  
  return result;
};

export default groupSlice.reducer;