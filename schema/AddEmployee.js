import mongoose from "mongoose";

const addemployeeSchema = new mongoose.Schema({
  EmployeeName: String,
  EmployeePosition: String,
  EmployeeDOB: String,
  EmployeeAddress: String,
  EmployeeMobileNumber: String,
  EmployeeDP: {
    data: Buffer,
    contentType: String,
  },
  EmployeeAccountNumber: String,
  EmployeeJoiningDate: String,
  EmployeeAadharNumber: String,
  EmployeePanNumber: String,
});

const Employee = mongoose.model("Employee", addemployeeSchema);

export default Employee;
