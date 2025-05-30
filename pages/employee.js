import { useEffect, useState } from 'react';
import Header from '../components/Header';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat); // ✅ Enables custom date format parsing

export default function EmployeeDashboard() {
  const [user, setUser] = useState({});
  const [attendance, setAttendance] = useState([]);
  const [todayEntry, setTodayEntry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) return;
    setUser(userData);
    fetchAttendance(userData.mobile);
  }, []);

  const fetchAttendance = async (mobile) => {
    setLoading(true);
    const res = await fetch(`/api/attendance?mobile=${mobile}`);
    const data = await res.json();
    setAttendance(data);

    const today = dayjs().format('DD-MM-YYYY'); // Match DB format
    const entry = data.find(item => item.date === today);
    setTodayEntry(entry || null);
    setLoading(false);
  };

  const handlePunch = async (type) => {
    const res = await fetch('/api/punch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile: user.mobile, type }),
    });

    if (res.ok) {
      fetchAttendance(user.mobile);
    } else {
      const err = await res.json();
      alert(err.error || 'Punch failed');
    }
  };

  const renderPunchButtons = () => {
    if (loading) return <p>Loading...</p>;

    if (!todayEntry) {
      return <button onClick={() => handlePunch('in')}>Punch In</button>;
    }

    if (todayEntry && todayEntry.punchIn && !todayEntry.punchOut) {
      return <button onClick={() => handlePunch('out')}>Punch Out</button>;
    }

    return <p>You have already punched in and out for today.</p>;
  };

  return (
    <div>
      <Header />
      <h2 style={{ textAlign: 'center' }}>Welcome, {user.name}</h2>

      <div style={{ textAlign: 'center', margin: '20px' }}>
        {renderPunchButtons()}
      </div>

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Date</th>
            <th>Punch In</th>
            <th>Punch Out</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((entry, index) => (
            <tr key={index}>
              <td>{dayjs(entry.date, 'DD-MM-YYYY').format('DD-MM-YYYY')}</td>
              <td>
                {entry.punchIn
                  ? dayjs(`${entry.date} ${entry.punchIn}`, 'DD-MM-YYYY hh:mm A').format('hh:mm A')
                  : '-'}
              </td>
              <td>
                {entry.punchOut
                  ? dayjs(`${entry.date} ${entry.punchOut}`, 'DD-MM-YYYY hh:mm A').format('hh:mm A')
                  : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
