import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  employeeId: mongoose.Schema.Types.ObjectId,
  date: String,
  status: String,
}, { timestamps: true })

AttendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true })

const Attendance = mongoose.model("Attendance", AttendanceSchema);

export default Attendance;
