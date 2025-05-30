// pages/api/punch.js

import dbConnect from '@/lib/dbConnect';
import Attendance from '@/models/Attendance';
import dayjs from 'dayjs';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { mobile, type } = req.body;
      if (!mobile || !type) {
        return res.status(400).json({ error: 'Mobile and type are required' });
      }

      const today = dayjs().format('DD-MM-YYYY');
      const time = dayjs().format('hh:mm A');

      let record = await Attendance.findOne({ mobile, date: today });

      if (!record) {
        record = await Attendance.create({ mobile, date: today, punchIn: '', punchOut: '' });
      }

      if (type === 'in') {
        if (record.punchIn) {
          return res.status(400).json({ error: 'Already punched in today' });
        }
        record.punchIn = time;
      } else if (type === 'out') {
        if (record.punchOut) {
          return res.status(400).json({ error: 'Already punched out today' });
        }
        record.punchOut = time;
      }

      await record.save();
      res.status(200).json({ success: true });
    } catch (err) {
      console.error('Punch API Error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
