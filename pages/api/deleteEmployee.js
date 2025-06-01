// /pages/api/deleteAttendance.js
import { connectToDatabase } from '@/lib/dbConnect';

function formatDate(d) {
  const dt = new Date(d);
  const day = String(dt.getDate()).padStart(2, '0');
  const month = String(dt.getMonth() + 1).padStart(2, '0');
  const year = dt.getFullYear();
  return `${day}-${month}-${year}`; // matches your db date format "dd-mm-yyyy"
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  try {
    const { mobile, startDate, endDate } = req.body;
    if (!mobile || !startDate || !endDate) return res.status(400).json({ success: false, message: 'Missing fields' });

    const { db } = await connectToDatabase();

    // Because your date format in DB is "dd-mm-yyyy", we must filter attendance by date string
    // So fetch all attendance for user and filter dates manually
    const allAttendance = await db.collection('attendance').find({ mobile }).toArray();

    // Convert startDate, endDate to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Filter attendance to delete
    const toDeleteIds = allAttendance
      .filter((att) => {
        const [day, month, year] = att.date.split('-');
        const attDate = new Date(`${year}-${month}-${day}`);
        return attDate >= start && attDate <= end;
      })
      .map((att) => att._id);

    // Delete attendance with those ids
    const { ObjectId } = require('mongodb');
    const objectIds = toDeleteIds.map((id) => new ObjectId(id));

    const deleteResult = await db.collection('attendance').deleteMany({ _id: { $in: objectIds } });

    res.status(200).json({ success: true, deletedCount: deleteResult.deletedCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
