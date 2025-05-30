// models/Attendance.js

import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
  mobile: String,
  date: String,
  punchIn: String,
  punchOut: String,
});

export default mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);
