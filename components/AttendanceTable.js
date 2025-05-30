export default function AttendanceTable({ data }) {
  return (
    <table border="1" cellPadding="5" style={{ width: '100%', marginTop: '20px' }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Date</th>
          <th>Punch In</th>
          <th>Punch Out</th>
        </tr>
      </thead>
      <tbody>
        {data.map((att, i) => (
          <tr key={i}>
            <td>{att.name}</td>
            <td>{att.date}</td>
            <td>{att.punchIn || '-'}</td>
            <td>{att.punchOut || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
