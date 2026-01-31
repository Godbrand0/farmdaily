import mongoose, { Schema, Document } from "mongoose";

export interface IMortalityRecord extends Document {
  livestockType: "Layer" | "Catfish";
  referenceId: mongoose.Types.ObjectId;
  numberDead: number;
  cause: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MortalityRecordSchema: Schema = new Schema(
  {
    livestockType: {
      type: String,
      required: [true, "Livestock type is required"],
      enum: {
        values: ["Layer", "Catfish"],
        message: "Livestock type must be either Layer or Catfish",
      },
    },
    referenceId: {
      type: Schema.Types.ObjectId,
      required: [true, "Reference ID is required"],
      refPath: "livestockType",
    },
    numberDead: {
      type: Number,
      required: [true, "Number dead is required"],
      min: [1, "Number dead must be at least 1"],
    },
    cause: {
      type: String,
      required: [true, "Cause of death is required"],
      trim: true,
      maxlength: [200, "Cause cannot exceed 200 characters"],
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
MortalityRecordSchema.index({ livestockType: 1, referenceId: 1, date: -1 });
MortalityRecordSchema.index({ date: -1 });
MortalityRecordSchema.index({ cause: 1 });

export default mongoose.models.MortalityRecord ||
  mongoose.model<IMortalityRecord>("MortalityRecord", MortalityRecordSchema);
