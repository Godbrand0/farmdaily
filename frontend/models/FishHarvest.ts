import mongoose, { Schema, Document } from "mongoose";

export interface IFishHarvest extends Document {
  fishUnitId: mongoose.Types.ObjectId;
  harvestDate: Date;
  quantityHarvested: number;
  totalWeightKg: number;
  averageWeightKg: number;
  pricePerKg: number;
  totalIncome: number;
  harvestType: "Live" | "Smoked";
  smokedQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const FishHarvestSchema: Schema = new Schema(
  {
    fishUnitId: {
      type: Schema.Types.ObjectId,
      ref: "FishUnit",
      required: [true, "Fish unit ID is required"],
    },
    harvestDate: {
      type: Date,
      required: [true, "Harvest date is required"],
      validate: {
        validator: function (value: Date) {
          return value <= new Date();
        },
        message: "Harvest date cannot be in the future",
      },
    },
    quantityHarvested: {
      type: Number,
      required: [true, "Quantity harvested is required"],
      min: [1, "Quantity harvested must be at least 1"],
    },
    totalWeightKg: {
      type: Number,
      required: [true, "Total weight is required"],
      min: [0.1, "Total weight must be at least 0.1kg"],
    },
    averageWeightKg: {
      type: Number,
      required: [true, "Average weight is required"],
      min: [0.01, "Average weight must be at least 0.01kg"],
    },
    pricePerKg: {
      type: Number,
      required: [true, "Price per kg is required"],
      min: [0.01, "Price per kg must be at least 0.01"],
    },
    totalIncome: {
      type: Number,
      required: [true, "Total income is required"],
      min: [0, "Total income cannot be negative"],
    },
    harvestType: {
      type: String,
      required: [true, "Harvest type is required"],
      enum: {
        values: ["Live", "Smoked"],
        message: "Harvest type must be either Live or Smoked",
      },
    },
    smokedQuantity: {
      type: Number,
      default: 0,
      min: [0, "Smoked quantity cannot be negative"],
      validate: {
        validator: function (this: IFishHarvest, value: number) {
          // If harvest type is Smoked, smoked quantity is required
          if (this.harvestType === "Smoked") {
            return value > 0;
          }
          return true;
        },
        message: "Smoked quantity is required when harvest type is Smoked",
      },
    },
  },
  {
    timestamps: true,
  },
);

// Index for better query performance
FishHarvestSchema.index({ fishUnitId: 1, harvestDate: -1 });
FishHarvestSchema.index({ harvestDate: -1 });
FishHarvestSchema.index({ harvestType: 1 });

export default mongoose.models.FishHarvest ||
  mongoose.model<IFishHarvest>("FishHarvest", FishHarvestSchema);
