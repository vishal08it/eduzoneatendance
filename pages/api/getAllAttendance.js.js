// pages/api/getAllAttendance.js
import { dbConnect } from '@/lib/dbConnect';
import Attendance from '@/models/Attendance';

export default async function handler(req, res) {
  await dbConnect();

  try {
    const attendance = await Attendance.find().sort({ date: -1 });
    res.json({ success: true, attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching attendance' });
  }
}
