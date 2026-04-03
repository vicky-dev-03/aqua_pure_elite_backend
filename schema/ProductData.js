import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    ProductName: {
      type: String,
      required: true,
      trim: true,
    },
    ProductPrice: {
      type: Number,
      required: true,
    },
    ProductEntryDate: {
      type: Date,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    Branch: {
      type: String,
      required: true,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

const productData = mongoose.model("Product", productSchema);

export default productData;
