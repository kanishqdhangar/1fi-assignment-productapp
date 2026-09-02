import mongoose from "mongoose";

const emiPlanSchema = new mongoose.Schema(
  {
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variant",
      required: true,
      index: true,
    },
    tenureMonths: {
      type: Number,
      required: true,
      min: 1,
    },
    monthlyAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    interestRate: {
      type: Number,
      required: true,
      min: 0,
    },
    cashback: {
      type: Number,
      default: 0,
      min: 0,
    },
    fundedBy: {
      type: String,
      default: "Mutual Fund",
      trim: true,
    },
  },
  { timestamps: true }
);

emiPlanSchema.index({ variantId: 1, tenureMonths: 1 }, { unique: true });

export default mongoose.model("EmiPlan", emiPlanSchema);
