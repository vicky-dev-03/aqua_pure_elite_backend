import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    OrderDate: {
      type: Date,
      required: true,
    },
    CustomerName: {
      type: String,
      required: true,
      trim: true,
    },
    CustomerNumber: {
      type: String,
      required: true,
    },
    MachineModel: {
      type: String,
      required: true,
    },
    Price: {
      type: Number,
      required: true,
    },
    CurrentStatus: {
      type: String,
      enum: ["Order Placed", "Processing", "Completed", "Cancelled"],
      default: "Order Placed",
    },
    PurchaseMethod: {
      type: String,
      enum: ["Online", "Offline"],
      required: true,
    },
    PaymentMethod: {
      type: String,
      enum: ["UPI", "Cash", "Card", "Net Banking", "Gpay", "PhonePay"],
      required: true,
    },
    Address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const OrdersList = mongoose.model("Order", orderSchema);

export default OrdersList;
