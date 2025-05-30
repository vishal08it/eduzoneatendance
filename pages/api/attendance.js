// pages/api/attendance.js

import connectMongo from '@/lib/dbConnect';
import Attendance from '@/models/Attendance';

export default async function handler(req, res) {
  await connectMongo();

  if (req.method === 'GET') {
    try {
      const { mobile } = req.query;

      if (!mobile) {
        return res.status(400).json({ error: 'Mobile number is required' });
      }

      const records = await Attendance.find({ mobile });
      res.status(200).json(records);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error while fetching attendance' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
