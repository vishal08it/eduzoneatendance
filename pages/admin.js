import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminDashboard() {
  // Modal visibility states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteEmpModal, setShowDeleteEmpModal] = useState(false);
  const [showDeleteAttModal, setShowDeleteAttModal] = useState(false);

  // Form data for adding employee
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    image: '',
    password: '',
    role: 'employee',
  });

  const [attendanceData, setAttendanceData] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Delete employee dropdown selection
  const [selectedDeleteEmpMobile, setSelectedDeleteEmpMobile] = useState('');
  // Delete attendance dropdown and date range
  const [selectedDeleteAttMobile, setSelectedDeleteAttMobile] = useState('');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  // Loading states for UX feedback
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [savingEmployee, setSavingEmployee] = useState(false);
  const [deletingEmp, setDeletingEmp] = useState(false);
  const [deletingAttendance, setDeletingAttendance] = useState(false);

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, []);

  // Fetch employees list
  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const res = await fetch('/api/getEmployees');
      const data = await res.json();
      if (data.success) setEmployees(data.employees);
      else toast.error('Failed to load employees');
    } catch (error) {
      toast.error('Failed to load employees: ' + error.message);
    } finally {
      setLoadingEmployees(false);
    }
  };

  // Fetch attendance records
  const fetchAttendance = async () => {
    setLoadingAttendance(true);
    try {
      const res = await fetch('/api/getAllAttendance');
      const data = await res.json();
      if (data.success) setAttendanceData(data.attendance);
      else toast.error('Failed to load attendance');
    } catch (error) {
      toast.error('Failed to load attendance: ' + error.message);
    } finally {
      setLoadingAttendance(false);
    }
  };

  // Validate email format (simple regex)
  const isValidEmail = (email) =>
    /^\S+@\S+\.\S+$/.test(email);

  // Validate mobile (simple 10 digit number check)
  const isValidMobile = (mobile) =>
    /^\d{10}$/.test(mobile);

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Reset add employee form
  const resetForm = () => {
    setFormData({
      name: '',
      mobile: '',
      email: '',
      image: '',
      password: '',
      role: 'employee',
    });
  };

  // Save new employee
  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!isValidMobile(formData.mobile)) {
      toast.error('Mobile must be 10 digits');
      return;
    }
    if (formData.email && !isValidEmail(formData.email)) {
      toast.error('Invalid email format');
      return;
    }
    if (!formData.password) {
      toast.error('Password is required');
      return;
    }

    setSavingEmployee(true);
    try {
      const res = await fetch('/api/addEmployee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.success) {
        toast.success('Employee added successfully');
        setShowAddModal(false);
        resetForm();
        fetchEmployees();
        fetchAttendance();
      } else {
        toast.error(result.message || 'Failed to add employee');
      }
    } catch (error) {
      toast.error('Failed to add employee: ' + error.message);
    } finally {
      setSavingEmployee(false);
    }
  };

  // Delete employee
  const handleDeleteEmployee = async () => {
    if (!selectedDeleteEmpMobile) {
      toast.error('Please select an employee to delete');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this employee?')) return;

    setDeletingEmp(true);
    try {
      const res = await fetch('/api/deleteEmployee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: selectedDeleteEmpMobile }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Employee deleted successfully');
        setShowDeleteEmpModal(false);
        setSelectedDeleteEmpMobile('');
        fetchEmployees();
        fetchAttendance();
      } else {
        toast.error('Failed to delete employee: ' + data.message);
      }
    } catch (error) {
      toast.error('Error deleting employee: ' + error.message);
    } finally {
      setDeletingEmp(false);
    }
  };

  // Delete attendance records
  const handleDeleteAttendance = async () => {
    if (!selectedDeleteAttMobile) {
      toast.error('Please select an employee');
      return;
    }
    if (!dateRange.startDate || !dateRange.endDate) {
      toast.error('Please select both start and end dates');
      return;
    }
    if (
      !window.confirm(
        `Are you sure you want to delete attendance for ${selectedDeleteAttMobile} from ${dateRange.startDate} to ${dateRange.endDate}?`
      )
    )
      return;

    setDeletingAttendance(true);
    try {
      const res = await fetch('/api/deleteAttendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: selectedDeleteAttMobile,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Deleted ${data.deletedCount} attendance records`);
        setShowDeleteAttModal(false);
        setSelectedDeleteAttMobile('');
        setDateRange({ startDate: '', endDate: '' });
        fetchAttendance();
      } else {
        toast.error('Failed to delete attendance: ' + data.message);
      }
    } catch (error) {
      toast.error('Error deleting attendance: ' + error.message);
    } finally {
      setDeletingAttendance(false);
    }
  };

  return (
    <div>
      <Header />
      <ToastContainer />
      <div style={{ padding: 20 }}>
        <h1>Admin Dashboard</h1>

        {/* Action Buttons */}
        <div style={{ marginBottom: 20 }}>
          <button onClick={() => setShowAddModal(true)} style={{ marginRight: 10 }}>
            Add Employee
          </button>
          <button
            onClick={() => setShowDeleteEmpModal(true)}
            style={{ marginRight: 10 }}
            disabled={loadingEmployees || employees.length === 0}
          >
            {loadingEmployees ? 'Loading...' : 'Delete Employee'}
          </button>
          <button
            onClick={() => setShowDeleteAttModal(true)}
            disabled={loadingEmployees || employees.length === 0}
          >
            Delete Attendance Records
          </button>
        </div>

        {/* Add Employee Modal */}
        {showAddModal && (
          <div style={modalStyle}>
            <div style={modalContentStyle}>
              <h2>Add New Employee</h2>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="mobile"
                placeholder="Mobile (10 digits)"
                value={formData.mobile}
                onChange={handleInputChange}
                maxLength={10}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="image"
                placeholder="Image URL"
                value={formData.image}
                onChange={handleInputChange}
              />
              {/* Preview image if valid URL */}
              {formData.image && (
                <div style={{ margin: '10px 0' }}>
                  <img
                    src={formData.image}
                    alt="Employee"
                    style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 5 }}
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                </div>
              )}
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <select name="role" value={formData.role} onChange={handleInputChange}>
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
              <div style={{ marginTop: 10 }}>
                <button onClick={handleSave} disabled={savingEmployee}>
                  {savingEmployee ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    resetForm();
                    setShowAddModal(false);
                  }}
                  style={{ marginLeft: 10 }}
                  disabled={savingEmployee}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Employee Modal */}
        {showDeleteEmpModal && (
          <div style={modalStyle}>
            <div style={modalContentStyle}>
              <h2>Delete Employee</h2>
              <select
                value={selectedDeleteEmpMobile}
                onChange={(e) => setSelectedDeleteEmpMobile(e.target.value)}
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.mobile} value={emp.mobile}>
                    {emp.name} ({emp.mobile})
                  </option>
                ))}
              </select>
              <div style={{ marginTop: 10 }}>
                <button onClick={handleDeleteEmployee} disabled={deletingEmp}>
                  {deletingEmp ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => {
                    setSelectedDeleteEmpMobile('');
                    setShowDeleteEmpModal(false);
                  }}
                  style={{ marginLeft: 10 }}
                  disabled={deletingEmp}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Attendance Modal */}
        {showDeleteAttModal && (
          <div style={modalStyle}>
            <div style={modalContentStyle}>
              <h2>Delete Attendance Records</h2>
              <label>
                Employee:
                <select
                  value={selectedDeleteAttMobile}
                  onChange={(e) => setSelectedDeleteAttMobile(e.target.value)}
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.mobile} value={emp.mobile}>
                      {emp.name} ({emp.mobile})
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Start Date:
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, startDate: e.target.value }))}
                />
              </label>
              <label>
                End Date:
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, endDate: e.target.value }))}
                />
              </label>
              <div style={{ marginTop: 10 }}>
                <button onClick={handleDeleteAttendance} disabled={deletingAttendance}>
                  {deletingAttendance ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => {
                    setSelectedDeleteAttMobile('');
                    setDateRange({ startDate: '', endDate: '' });
                    setShowDeleteAttModal(false);
                  }}
                  style={{ marginLeft: 10 }}
                  disabled={deletingAttendance}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Table */}
        <h2>Attendance Records</h2>
        {loadingAttendance ? (
          <p>Loading attendance...</p>
        ) : attendanceData.length === 0 ? (
          <p>No attendance records found.</p>
        ) : (
          <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((record) => (
                <tr key={record._id}>
                  <td>{record.name}</td>
                  <td>{record.mobile}</td>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>{record.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// Basic modal styles
const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: '#fff',
  padding: 20,
  borderRadius: 8,
  minWidth: 300,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};
