import { dbConnect } from '../../lib/dbConnect';
import User from '../../models/User';

export default async function handler(req, res) {
  await dbConnect();
  const user = await User.findById(req.query.id);
  res.json(user);
}
