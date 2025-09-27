import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Toast from "../../common/Toast";
import "../../../assets/ManageGroup.css";

// Import actions from the Redux Toolkit slice
import {
  fetchGroups,
  createGroup,
  editGroup,
  deleteGroups,
  setFilters,
  setSelectedGroups
} from "../../../redux/group/groupSlice";

// Import components
import GroupHeader from "../../common/GroupComponents/GroupHeader";
import GroupFilters from "../../common/GroupComponents/GroupFilters";
import GroupTable from "../../common/GroupComponents/GroupTable";
import GroupPagination from "../../common/GroupComponents/GroupPagination";
import CreateGroupModal from "../../common/GroupComponents/CreateGroupModal";
import EditGroupModal from "../../common/GroupComponents/EditGroupModal";
import DeleteGroupModal from "../../common/GroupComponents/DeleteGroupModal";

const ManageGroupPage = () => {
  const dispatch = useDispatch();
  
  // Get state from Redux
  const {
    groups,
    loading,
    error,
    totalPages,
    notification,
    searchTerm,
    minMembers,
    maxMembers,
    sortField,
    sortType,
    currentPage,
    selectedGroups
  } = useSelector(state => state.group);
  
  // Local UI state only
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [editingGroup, setEditingGroup] = useState(null);
  const [editGroupName, setEditGroupName] = useState("");
  const [editTotalMember, setEditTotalMember] = useState("");
  const [selectionsPerPage, setSelectionsPerPage] = useState({});
  const [currentPageSelectAll, setCurrentPageSelectAll] = useState(false);

  // Fetch groups when filters change
  useEffect(() => {
    dispatch(fetchGroups({
      searchTerm,
      currentPage,
      sortField,
      sortType,
      minMembers,
      maxMembers
    }));
  }, [dispatch, searchTerm, currentPage, sortField, sortType, minMembers, maxMembers]);

  // Reset selections when filter criteria change
  useEffect(() => {
    setSelectionsPerPage({});
    setCurrentPageSelectAll(false);
    dispatch(setSelectedGroups([]));
  }, [searchTerm, minMembers, maxMembers, dispatch]);

  // Update current page select all state when groups change
  useEffect(() => {
    if (groups.length > 0) {
      const pageSelections = selectionsPerPage[currentPage] || [];
      const allSelected = pageSelections.length === groups.length && 
        groups.every(group => pageSelections.includes(group.id));
      
      setCurrentPageSelectAll(allSelected);
    } else {
      setCurrentPageSelectAll(false);
    }
  }, [groups, currentPage, selectionsPerPage]);

  // Update Redux selected groups when page selections change
  useEffect(() => {
    const allSelections = Object.values(selectionsPerPage).flat();
    dispatch(setSelectedGroups(allSelections));
  }, [selectionsPerPage, dispatch]);

  // Handle setting search term
  const handleSearchChange = (value) => {
    dispatch(setFilters({ searchTerm: value, currentPage: 1 }));
  };

  // Handle min members change
  const handleMinMembersChange = (value) => {
    dispatch(setFilters({ minMembers: value, currentPage: 1 }));
  };

  // Handle max members change
  const handleMaxMembersChange = (value) => {
    dispatch(setFilters({ maxMembers: value, currentPage: 1 }));
  };

  // Handle sorting
  const handleSort = (field) => {
    const newSortType = field === sortField ? (sortType === 'asc' ? 'desc' : 'asc') : 'asc';
    dispatch(setFilters({ sortField: field, sortType: newSortType }));
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    dispatch(setFilters({ currentPage: newPage }));
  };

  // Create group handler
  const handleCreateGroup = () => {
    dispatch(createGroup(newGroupName))
      .unwrap()
      .then(() => {
        setIsCreateModalOpen(false);
        setNewGroupName("");
        refreshForm();
      })
      .catch(() => {
        // Error is handled by the createGroup thunk
      });
  };

  // Edit group handler
  const handleEditGroup = () => {
    dispatch(editGroup({
      id: editingGroup.id, 
      name: editGroupName, 
      totalMember: editTotalMember
    }))
      .unwrap()
      .then(() => {
        closeEditModal();
      })
      .catch(() => {
        // Error is handled by the editGroup thunk
      });
  };

  // Open edit modal
  const openEditModal = (group) => {
    setEditingGroup(group);
    setEditGroupName(group.name);
    setEditTotalMember(group.totalMember?.toString() || "");
    setIsEditModalOpen(true);
  };

  // Close edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingGroup(null);
    setEditGroupName("");
    setEditTotalMember("");
  };

  // Delete group handler
  const handleDeleteGroups = () => {
    dispatch(deleteGroups({
      selectedGroups, 
      currentPage, 
      groupCount: groups.length
    }))
      .unwrap()
      .then(() => {
        setSelectionsPerPage({});
        setCurrentPageSelectAll(false);
        setIsDeleteModalOpen(false);

        dispatch(fetchGroups({
          searchTerm,
          currentPage,
          sortField,
          sortType,
          minMembers,
          maxMembers
        }));
      })
      .catch(() => {
        // Error is handled by the deleteGroups thunk
      });
  };

  // Reset all filters and selections
  const refreshForm = () => {
    dispatch(setFilters({
      searchTerm: "",
      minMembers: "",
      maxMembers: "",
      currentPage: 1,
      sortField: "name",
      sortType: "asc"
    }));
    
    setSelectionsPerPage({});
    setCurrentPageSelectAll(false);
    dispatch(setSelectedGroups([]));
    dispatch(fetchGroups({}));
  };

  // Toggle group selection
  const toggleGroupSelection = (groupId) => {
    const currentSelections = selectionsPerPage[currentPage] || [];
    
    let updatedPageSelections;
    if (currentSelections.includes(groupId)) {
      updatedPageSelections = currentSelections.filter(id => id !== groupId);
    } else {
      updatedPageSelections = [...currentSelections, groupId];
    }
    
    setSelectionsPerPage({
      ...selectionsPerPage,
      [currentPage]: updatedPageSelections
    });
    
    setCurrentPageSelectAll(
      updatedPageSelections.length === groups.length && 
      groups.every(group => updatedPageSelections.includes(group.id))
    );
  };

  // Toggle select all for current page
  const toggleSelectAllCurrentPage = () => {
    if (currentPageSelectAll) {
      const updatedSelections = { ...selectionsPerPage };
      delete updatedSelections[currentPage];
      setSelectionsPerPage(updatedSelections);
      setCurrentPageSelectAll(false);
    } else {
      setSelectionsPerPage({
        ...selectionsPerPage,
        [currentPage]: groups.map(group => group.id)
      });
      setCurrentPageSelectAll(true);
    }
  };

  // Check if a group is selected
  const isGroupSelected = (groupId) => {
    const pageSelections = selectionsPerPage[currentPage] || [];
    return pageSelections.includes(groupId);
  };

  return (
    <div className="manage-group-container">
      {/* Notification */}
      {notification && (
        <Toast 
          message={notification.message} 
          type={notification.type}
        />
      )}
      
      <div className="manage-group-content">
        <div className="table-container">
          {/* Group Header with Actions */}
          <GroupHeader 
            openCreateModal={() => setIsCreateModalOpen(true)}
            openDeleteModal={() => setIsDeleteModalOpen(true)}
            selectedGroupsCount={selectedGroups.length}
            refreshForm={refreshForm}
          />
          
          {/* Filters and Search */}
          <GroupFilters 
            searchTerm={searchTerm}
            setSearchTerm={handleSearchChange}
            minMembers={minMembers}
            setMinMembers={handleMinMembersChange}
            maxMembers={maxMembers}
            setMaxMembers={handleMaxMembersChange}
          />

          {/* Group Table */}
          <GroupTable 
            groups={groups}
            loading={loading}
            error={error}
            sortField={sortField}
            sortType={sortType}
            handleSort={handleSort}
            openEditModal={openEditModal}
            isGroupSelected={isGroupSelected}
            toggleGroupSelection={toggleGroupSelection}
            currentPageSelectAll={currentPageSelectAll}
            toggleSelectAllCurrentPage={toggleSelectAllCurrentPage}
          />

          {/* Pagination */}
          <GroupPagination 
            localCurrentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Modals */}
      <CreateGroupModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        newGroupName={newGroupName}
        setNewGroupName={setNewGroupName}
        handleCreateGroup={handleCreateGroup}
        loading={loading}
      />

      <EditGroupModal 
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        editingGroup={editingGroup}
        editGroupName={editGroupName}
        setEditGroupName={setEditGroupName}
        editTotalMember={editTotalMember}
        setEditTotalMember={setEditTotalMember}
        handleEditGroup={handleEditGroup}
        loading={loading}
      />

      <DeleteGroupModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        selectedGroupsCount={selectedGroups.length}
        handleDeleteGroups={handleDeleteGroups}
        loading={loading}
      />
    </div>
  );
};

export default ManageGroupPage;