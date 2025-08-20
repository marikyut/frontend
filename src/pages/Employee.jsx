import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import { fetchEmployees } from "../features/employees/employeeSlice";

const Employee = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { list: employees, loading, error } = useSelector((state) => state.employees);

  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);


  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);


  // Sorting function
  const sortedData = useMemo(() => {
    let sortableData = [...employees];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableData;
  }, [employees, sortConfig]);

  // Filtering function
  const filteredData = useMemo(() => {
    return sortedData.filter((row) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [sortedData, search]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Handle sort
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/"); // Redirect to login page
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
    <div className="container mx-auto p-10 bg-white rounded-lg shadow-lg" >
      {/* Header */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded-md w-1/3"
        />
        <div className="space-x-2">
          <button onClick={handleLogout} className="px-4 py-2 bg-gray-800 text-white rounded-md">Logout</button>
          <button onClick={() => navigate("/add-employee")} className="px-4 py-2 bg-blue-600 text-white rounded-md">Add</button>
        </div>
      </div>

      {/* Loading/Error State */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      

      {/* Table */}
      {!loading && !error && (
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              {["id", "firstname", "lastname", "division", "class", "birthday"].map((col) => (
                <th
                  key={col}
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort(col)}
                >
                  {col.charAt(0).toUpperCase() + col.slice(1)}
                  {sortConfig.key === col ? (sortConfig.direction === "asc" ? " ▲" : " ▼") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr key={row.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{row.id}</td>
                <td className="px-4 py-2">{row.firstname}</td>
                <td className="px-4 py-2">{row.lastname}</td>
                <td className="px-4 py-2">{row.division}</td>
                <td className="px-4 py-2">{row.class}</td>
                <td className="px-4 py-2">{row.birthday}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <label className="mr-2">Number of items:</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border px-2 py-1 rounded"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>
        <div className="space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Employee;
