import mongoose from 'mongoose';

const TableSchema = new mongoose.Schema({
  ProductName: { type: String, required: true },
  Quantity: { type: Number, required: true },
  Amount: { type: Number, required: true },
  PaymentMethod: { type: String, required: true },
  BranchAddress: { type: String, required: true }
});

const InvoiceSchema = new mongoose.Schema(
  {
    InvoiceNumber: { type: String, unique: true, required: true },

    CustomerName: { type: String, required: true },
    CustomerAddress: { type: String, required: true },
    CustomerEmailID: { type: String, required: true },
    CustomerMobileNumber: { type: String, required: true },

    InvoiceDate: { type: Date, required: true },
    PurchaseMethod: { type: String, required: true },

    GSTNumber: { type: String },
    CGST: { type: Number, default: 0 },
    SGST: { type: Number, default: 0 },

    Table: { type: [TableSchema], default: [] },

    TotalAmount: { type: Number, required: true },
    CGSTAmount: { type: Number, default: 0 },
    SGSTAmount: { type: Number, default: 0 },
    GrandTotal: { type: Number, required: true }
  },
  { timestamps: true }
);

const InvoiceData = mongoose.model('Invoice', InvoiceSchema);

export default InvoiceData;