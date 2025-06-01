// /pages/api/getEmployees.js

import dbConnect from '@/lib/dbConnect';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  if (req.method !== 'GET') 
    return res.status(405).json({ success: false, message: 'Method not allowed' });

  try {
    await dbConnect();

    // Get the Mongoose connection
    const db = mongoose.connection;

    // Query the users collection
    const employees = await db.collection('users')
      .find({ role: 'employee' }, { projection: { name: 1, mobile: 1, _id: 1 } })
      .toArray();

    res.status(200).json({ success: true, employees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
