import dbConnect from '@/lib/dbConnect';
import Attendance from '@/models/Attendance';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { mobile, date } = req.body;

  if (!mobile) {
    return res.status(400).json({ error: 'Missing required field: mobile' });
  }

  try {
    // If you want to delete by both mobile and date:
    const filter = date ? { mobile, date } : { mobile };

    const deleted = await Attendance.deleteMany(filter);

    if (deleted.deletedCount === 0) {
      return res.status(404).json({ error: 'No attendance records found for the given mobile (and date)' });
    }

    return res.status(200).json({ message: `Deleted ${deleted.deletedCount} attendance record(s)` });
  } catch (error) {
    return res.status(500).json({ error: `Failed to delete attendance: ${error.message}` });
  }
}
