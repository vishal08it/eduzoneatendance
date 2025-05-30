// pages/api/addEmployee.js
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { name, mobile, email, image, password, role = 'employee' } = req.body;

  if (!name || !mobile || !email || !password) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    await dbConnect();

    // Check if mobile already exists
    const exists = await User.findOne({ mobile });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Mobile number already registered' });
    }

    const newUser = new User({
      name,
      mobile,
      email,
      image,
      password,
      role,
    });

    await newUser.save();
    return res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.error('Add user error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
