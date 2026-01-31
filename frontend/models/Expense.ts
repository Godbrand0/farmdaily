import mongoose, { Schema, Document } from "mongoose";

export interface IExpense extends Document {
  category: "Feed" | "Medication" | "Maintenance" | "Labor";
  amount: number;
  description: string;
  date: Date;
  relatedUnitId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema: Schema = new Schema(
  {
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["Feed", "Medication", "Maintenance", "Labor"],
        message:
          "Category must be either Feed, Medication, Maintenance, or Labor",
      },
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be at least 0.01"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
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
    relatedUnitId: {
      type: Schema.Types.ObjectId,
      ref: "FishUnit",
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

// Index for better query performance
ExpenseSchema.index({ category: 1, date: -1 });
ExpenseSchema.index({ date: -1 });
ExpenseSchema.index({ relatedUnitId: 1 });

export default mongoose.models.Expense ||
  mongoose.model<IExpense>("Expense", ExpenseSchema);
