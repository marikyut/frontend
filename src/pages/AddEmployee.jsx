import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createEmployee, fetchEmployees } from "../features/employees/employeeSlice";
import { toast } from "react-toastify";
import api from "../utils/axiosInstance"; // your axios setup
import { useNavigate } from "react-router-dom"; // for navigation

const AddEmployee = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    division: "",
    class: "",
    birthday: "",
  });

  const [divisions, setDivisions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [saving, setSaving] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // Fetch divisions and classes from backend on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const divRes = await api.get("/divisions");
        const clsRes = await api.get("/classes");
        setDivisions(divRes.data);
        setClasses(clsRes.data);
      } catch (err) {
        console.error("Failed to fetch divisions or classes", err);
      }
    };
    fetchData();
  }, []);

  // Filter classes when division changes
  useEffect(() => {
    if (form.division) {
      const relatedClasses = classes.filter(
        (cls) => cls.div_id === parseInt(form.division)
      );
      setFilteredClasses(relatedClasses);
      setForm((prev) => ({ ...prev, class: "" })); // reset class
    } else {
      setFilteredClasses([]);
    }
  }, [form.division, classes]);

  const isFormValid =
    form.firstname.trim() &&
    form.lastname.trim() &&
    form.division &&
    form.class &&
    form.birthday;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setSaving(true);

    try {
      await dispatch(createEmployee(form)).unwrap();
      dispatch(fetchEmployees()); // refresh list
      toast.success("Employee added successfully!");
      setForm({ firstname: "", lastname: "", division: "", class: "", birthday: "" });
      navigate("/employee"); // navigate back to Employee page
    } catch (err) {
      console.error(err);
      toast.error("Failed to add employee.");
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/employee");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-40">
      <div className="bg-white p-10 rounded-lg shadow-lg w-200 max-w-md">
        <h2 className="text-lg font-semibold mb-4">Employee Info</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
          <div>
            <label className="block mb-1 text-md font-medium">First Name:</label>
            <input
              type="text"
              name="firstname"
              value={form.firstname}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block mb-1 text-md font-medium">Last Name:</label>
            <input
              type="text"
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Division */}
          <div>
            <label className="block mb-1 text-md font-medium">Division:</label>
            <select
              name="division"
              value={form.division}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md focus:ring focus:ring-blue-300"
            >
              <option value="">Select Division</option>
              {divisions.map((div) => (
                <option key={div.div_id} value={div.div_id}>
                  {div.division_name}
                </option>
              ))}
            </select>
          </div>

          {/* Class */}
          <div>
            <label className="block mb-1 text-md font-medium">Class:</label>
            <select
              name="class"
              value={form.class}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md focus:ring focus:ring-blue-300"
              disabled={!form.division}
            >
              <option value="">Select Class</option>
              {filteredClasses.map((cls) => (
                <option key={cls.class_id} value={cls.class_id}>
                  {cls.class_name}
                </option>
              ))}
            </select>
          </div>

          {/* Birthday */}
          <div>
            <label className="block mb-1 text-md font-medium">Birthday:</label>
            <input
              type="date"
              name="birthday"
              value={form.birthday}
              onChange={handleChange}
              max={today}
              className="w-full border px-3 py-2 rounded-md focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || saving}
              className={`px-4 py-2 rounded-md text-white ${
                isFormValid && !saving
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
