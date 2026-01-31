import mongoose, { Schema, Document } from "mongoose";

export interface IFishUnit extends Document {
  unitType: "Pond" | "Cage";
  unitNumber: string;
  stockedQuantity: number;
  currentFishAlive: number;
  dateStocked: Date;
  feedStageMM: number;
  createdAt: Date;
  updatedAt: Date;
}

const FishUnitSchema: Schema = new Schema(
  {
    unitType: {
      type: String,
      required: [true, "Unit type is required"],
      enum: {
        values: ["Pond", "Cage"],
        message: "Unit type must be either Pond or Cage",
      },
    },
    unitNumber: {
      type: String,
      required: [true, "Unit number is required"],
      trim: true,
      maxlength: [50, "Unit number cannot exceed 50 characters"],
    },
    stockedQuantity: {
      type: Number,
      required: [true, "Stocked quantity is required"],
      min: [1, "Stocked quantity must be at least 1"],
    },
    currentFishAlive: {
      type: Number,
      required: [true, "Current fish alive is required"],
      min: [0, "Current fish alive cannot be negative"],
    },
    dateStocked: {
      type: Date,
      required: [true, "Date stocked is required"],
      validate: {
        validator: function (value: Date) {
          return value <= new Date();
        },
        message: "Date stocked cannot be in the future",
      },
    },
    feedStageMM: {
      type: Number,
      required: [true, "Feed stage is required"],
      min: [0.1, "Feed stage must be at least 0.1mm"],
      max: [20, "Feed stage cannot exceed 20mm"],
    },
  },
  {
    timestamps: true,
  },
);

// Index for better query performance
FishUnitSchema.index({ unitType: 1, unitNumber: 1 });
FishUnitSchema.index({ dateStocked: -1 });
FishUnitSchema.index({ feedStageMM: 1 });

export default mongoose.models.FishUnit ||
  mongoose.model<IFishUnit>("FishUnit", FishUnitSchema);
