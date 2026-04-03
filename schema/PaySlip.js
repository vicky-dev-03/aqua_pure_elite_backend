import mongoose from "mongoose";

const payslipSchema = new mongoose.Schema({
  name: String,
  designation: String,
  department: String,
  doj: String,
  payPeriod: Number,
  days: Number,
  basic: Number,
  incentive: Number,
  hra: Number,
  meal: Number,
  pf: Number,
  tax: Number,
  loan: Number,
  totalEarnings: Number,
  totalDeductions: Number,
  netPay: Number,
  createdAt: { type: Date, default: Date.now },
});

const Payslip = mongoose.model("Payslip", payslipSchema);

export default Payslip;
