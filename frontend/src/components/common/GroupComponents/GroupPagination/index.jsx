import React from "react";
import Button from "../../Button";

const GroupPagination = ({ 
  localCurrentPage, 
  totalPages, 
  handlePageChange 
}) => {
  return (
    <div className="pagination">
      <Button 
        onClick={() => handlePageChange(localCurrentPage - 1)}
        disabled={localCurrentPage === 1}
      >
        Previous
      </Button>
      <span>{`Page ${localCurrentPage} of ${totalPages}`}</span>
      <Button 
        onClick={() => handlePageChange(localCurrentPage + 1)}
        disabled={localCurrentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default GroupPagination;