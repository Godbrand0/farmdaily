import mongoose, { Schema, Document } from "mongoose";

export interface ILayerBatch extends Document {
  batchName: string;
  numberOfBirds: number;
  cageNumber: string;
  dateStocked: Date;
  currentBirdsAlive: number;
  createdAt: Date;
  updatedAt: Date;
}

const LayerBatchSchema: Schema = new Schema(
  {
    batchName: {
      type: String,
      required: [true, "Batch name is required"],
      trim: true,
      maxlength: [100, "Batch name cannot exceed 100 characters"],
    },
    numberOfBirds: {
      type: Number,
      required: [true, "Number of birds is required"],
      min: [1, "Number of birds must be at least 1"],
    },
    cageNumber: {
      type: String,
      required: [true, "Cage number is required"],
      trim: true,
      maxlength: [50, "Cage number cannot exceed 50 characters"],
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
    currentBirdsAlive: {
      type: Number,
      required: [true, "Current birds alive is required"],
      min: [0, "Current birds alive cannot be negative"],
    },
  },
  {
    timestamps: true,
  },
);

// Index for better query performance
LayerBatchSchema.index({ batchName: 1 });
LayerBatchSchema.index({ cageNumber: 1 });
LayerBatchSchema.index({ dateStocked: -1 });

export default mongoose.models.LayerBatch ||
  mongoose.model<ILayerBatch>("LayerBatch", LayerBatchSchema);
