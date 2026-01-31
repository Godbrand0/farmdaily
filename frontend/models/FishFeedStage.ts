import mongoose, { Schema, Document } from "mongoose";

export interface IFishFeedStage extends Document {
  fishUnitId: mongoose.Types.ObjectId;
  feedSizeMM: number;
  dateStarted: Date;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const FishFeedStageSchema: Schema = new Schema(
  {
    fishUnitId: {
      type: Schema.Types.ObjectId,
      ref: "FishUnit",
      required: [true, "Fish unit ID is required"],
    },
    feedSizeMM: {
      type: Number,
      required: [true, "Feed size is required"],
      min: [0.1, "Feed size must be at least 0.1mm"],
      max: [20, "Feed size cannot exceed 20mm"],
    },
    dateStarted: {
      type: Date,
      required: [true, "Date started is required"],
      validate: {
        validator: function (value: Date) {
          return value <= new Date();
        },
        message: "Date started cannot be in the future",
      },
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  },
);

// Index for better query performance
FishFeedStageSchema.index({ fishUnitId: 1, dateStarted: -1 });
FishFeedStageSchema.index({ feedSizeMM: 1 });

export default mongoose.models.FishFeedStage ||
  mongoose.model<IFishFeedStage>("FishFeedStage", FishFeedStageSchema);
