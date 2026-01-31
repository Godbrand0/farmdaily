import mongoose, { Schema, Document } from "mongoose";

export interface IEggProduction extends Document {
  layerBatchId: mongoose.Types.ObjectId;
  eggsCollected: number;
  damagedEggs: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EggProductionSchema: Schema = new Schema(
  {
    layerBatchId: {
      type: Schema.Types.ObjectId,
      ref: "LayerBatch",
      required: [true, "Layer batch ID is required"],
    },
    eggsCollected: {
      type: Number,
      required: [true, "Eggs collected is required"],
      min: [0, "Eggs collected cannot be negative"],
    },
    damagedEggs: {
      type: Number,
      required: [true, "Damaged eggs is required"],
      min: [0, "Damaged eggs cannot be negative"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      validate: {
        validator: function (value: Date) {
          return value <= new Date();
        },
        message: "Date cannot be in the future",
      },
    },
  },
  {
    timestamps: true,
  },
);

// Index for better query performance
EggProductionSchema.index({ layerBatchId: 1, date: -1 });
EggProductionSchema.index({ date: -1 });

export default mongoose.models.EggProduction ||
  mongoose.model<IEggProduction>("EggProduction", EggProductionSchema);
