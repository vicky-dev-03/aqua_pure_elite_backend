import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: Number,
    required: true,
  },
});

const Stock = mongoose.model("Stock", stockSchema);

export default Stock;
