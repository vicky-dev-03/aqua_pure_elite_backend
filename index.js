import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import multer from "multer";
import Employee from "./schema/AddEmployee.js";
import InvoiceData from "./schema/InvoiceData.js";
import Payslip from "./schema/PaySlip.js";
import productData from "./schema/ProductData.js";
import Attendance from "./schema/Attendance.js";
import OrdersList from "./schema/OrdersList.js";
import Stock from "./schema/Stock.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

const app = express();
app.use(cors());
app.use(express.json());

try {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Connected to MongoDB");
} catch (err) {
  console.error("MongoDB connection error:", err);
}

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.post("/api/employees", upload.single("EmployeeDP"), async (req, res) => {
  try {
    const employee = await Employee.create({
      ...req.body,
      EmployeeDP: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });
    await employee.save();
    res.json({ message: "Employee saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving employee" });
  }
});

app.post("/invoice_collection", async (req, res) => {
  try {
    const invoiceData = req.body.map((invoice) => ({
      ...invoice,
      InvoiceDate: new Date(invoice.InvoiceDate),
      Table: invoice.Table.map((item) => ({
        ...item,
        Quantity: Number(item.Quantity),
        Amount: Number(item.Amount),
      })),
    }));
    await InvoiceData.insertMany(invoiceData);
    res.status(200).json({ message: "Invoice saved successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to save invoice", error: error.message });
  }
});

app.post("/attendance/add", async (req, res) => {
  try {
    const data = req.body;

    const operations = data.map((item) => ({
      updateOne: {
        filter: {
          employeeId: item.employeeId,
          date: item.date,
        },
        update: {
          $set: { status: item.status },
        },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(operations);

    res.status(200).json({ message: "Attendance saved/updated" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.post("/Create_Orders", async (req, res) => {
  try {
    const OrdersData = new OrdersList(req.body);
    await OrdersData.save();
    res.status(201).json({
      message: "Order Created Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error saving product data",
      error: error.message,
    });
  }
});

app.get("/Orders_data/list", async (req, res) => {
  try {
    const OrderData_list = await OrdersList.find();
    res.send(OrderData_list);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching Orders Data" });
  }
});

app.put("/Order_Update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedOrder = await OrdersList.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
    });

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Order updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating order" });
  }
});

app.get("/attendance", async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: "Date is required" });

    const attendance = await Attendance.find({ date });

    const result = attendance.map((item) => ({
      employeeId: item.employeeId,
      status: item.status,
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.get("/Invoice_list", async (req, res) => {
  try {
    const InvoiceList = await InvoiceData.find();
    res.send(InvoiceList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching Invoice Data" });
  }
});

app.get("/Payslip_list", async (req, res) => {
  try {
    const PayslipList = await Payslip.find();
    res.send(PayslipList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching Payslip Data" });
  }
});

app.post("/Product_Data", async (req, res) => {
  try {
    const Product_Data = new productData(req.body);
    await Product_Data.save();
    res.status(201).json({
      message: "Product Data Saved Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error saving product data",
      error: error.message,
    });
  }
});

app.post("/Payslip_data", async (req, res) => {
  try {
    const newPayslip = new Payslip(req.body);
    await newPayslip.save();
    res.status(201).json({ message: "Pay Slip Data Saved Successsfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/Product/Data", async (req, res) => {
  try {
    const ProductDataDB = await productData.find();
    res.json(ProductDataDB);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching Product Data" });
  }
});

app.get("/Members_Details", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching employees Data" });
  }
});

app.post("/api/stock/update", async (req, res) => {
  try {
    let { name, value } = req.body;

    name = name.toLowerCase();

    await Stock.findOneAndUpdate(
      { name: name },
      { value: value },
      { upsert: true, new: true },
    );

    res.json({ message: "Stock saved/updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/Stock_remaining_value", async (req, res) => {
  try {
    const StockRemainingData = await Stock.find();
    res.send(StockRemainingData);
  } catch (error) {
    console.log(error);
  }
});

app.put("/Product_Data/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await productData.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
    });
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating product" });
  }
});

app.put("/Member_update/:id", upload.single("EmployeeDP"), async (req, res) => {
  try {
    const updateData = {
      EmployeeName: req.body.EmployeeName,
      EmployeePosition: req.body.EmployeePosition,
      EmployeeDOB: req.body.EmployeeDOB,
      EmployeeMobileNumber: req.body.EmployeeMobileNumber,
      EmployeeAccountNumber: req.body.EmployeeAccountNumber,
      EmployeeJoiningDate: req.body.EmployeeJoiningDate,
      EmployeeAadharNumber: req.body.EmployeeAadharNumber,
      EmployeePanNumber: req.body.EmployeePanNumber,
      EmployeeAddress: req.body.EmployeeAddress,
    };

    if (req.file) {
      updateData.EmployeeDP = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: "after" },
    );

    res.json({
      message: "Employee updated successfully",
      data: updatedEmployee,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed" });
  }
});

app.delete("/Member_delete/:id", async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});

app.delete("/api/Product/Data/:id", async (req, res) => {
  try {
    await productData.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
