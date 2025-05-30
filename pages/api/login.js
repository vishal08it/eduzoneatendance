// pages/api/login.js
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { mobile, password } = req.body;

  await dbConnect();

  const user = await User.findOne({ mobile, password });
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      mobile: user.mobile,
      role: user.role,
    },
  });
}
