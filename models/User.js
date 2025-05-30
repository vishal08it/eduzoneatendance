import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  email: String,
  image: String,
  password: String,
  role: String,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
