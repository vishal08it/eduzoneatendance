import dbConnect from '@/lib/dbConnect';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  if (req.method !== 'GET')
    return res.status(405).json({ success: false, message: 'Method not allowed' });

  try {
    await dbConnect();

    const db = mongoose.connection;

    const attendance = await db.collection('attendance')
      .find({})
      .toArray();

    res.status(200).json({ success: true, attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
