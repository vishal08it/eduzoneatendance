// pages/admin.js
import { useState, useEffect } from 'react';
import Header from '../components/Header';

export default function AdminDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    image: '',
    password: '',
    role: 'employee',
  });
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    debugger
    const res = await fetch('/api/getAllAttendance');
    const data = await res.json();
    if (data.success) setAttendanceData(data.attendance);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const res = await fetch('/api/addEmployee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const result = await res.json();
    if (result.success) {
      alert('Employee added');
      setShowModal(false);
      setFormData({ name: '', mobile: '', email: '', image: '', password: '', role: 'employee' });
    } else {
      alert(result.message);
    }
  };

  return (
    <div>
      <Header />
      <div style={{ padding: 20 }}>
        <h1>Admin Dashboard</h1>
        <button onClick={() => setShowModal(true)} style={{ margin: '10px 0' }}>
          Add Employee
        </button>

        {showModal && (
          <div style={modalStyle}>
            <div style={modalContentStyle}>
              <h2>Add New Employee</h2>
              <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} />
              <input type="text" name="mobile" placeholder="Mobile" value={formData.mobile} onChange={handleInputChange} />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
              <input type="text" name="image" placeholder="Image URL" value={formData.image} onChange={handleInputChange} />
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} />
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        )}

        <h2>All Employee Attendance</h2>
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Emp ID</th>
              <th>Name</th>
              <th>Date</th>
              <th>Punch In</th>
              <th>Punch Out</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.empId}</td>
                <td>{entry.name}</td>
                <td>{entry.date}</td>
                <td>{entry.punchIn}</td>
                <td>{entry.punchOut || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const modalStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
  justifyContent: 'center', alignItems: 'center',
};

const modalContentStyle = {
  backgroundColor: 'white', padding: 20, borderRadius: 8,
  display: 'flex', flexDirection: 'column', gap: 10,
};
