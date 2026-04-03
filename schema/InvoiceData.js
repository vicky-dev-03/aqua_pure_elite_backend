import mongoose from 'mongoose';

const TableSchema = new mongoose.Schema({
  ProductName: { type: String, required: true },
  Quantity: { type: Number, required: true },
  Amount: { type: Number, required: true },
  PaymentMethod: { type: String, required: true },
  BranchAddress: { type: String, required: true }
});

const InvoiceSchema = new mongoose.Schema({
  CustomerName: { type: String, required: true },
  CustomerAddress: { type: String, required: true },
  CustomerEmailID: { type: String, required: true },
  CustomerMobileNumber: { type: String, required: true },
  InvoiceDate: { type: Date, required: true },
  PuchaseMethod: { type: String, required: true },
  Table: { type: [TableSchema], default: [] },
  createdAt: { type: Date, default: Date.now }
});

const InvoiceData = mongoose.model('Invoice', InvoiceSchema);

export default InvoiceData;