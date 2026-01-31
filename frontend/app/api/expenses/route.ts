import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Expense from "@/models/Expense";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const relatedUnitId = searchParams.get("relatedUnitId");
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    if (category) {
      query.category = category;
    }
    if (relatedUnitId) {
      query.relatedUnitId = relatedUnitId;
    }

    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate("relatedUnitId");

    const total = await Expense.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: expenses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch expenses" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    const requiredFields = ["category", "amount", "description", "date"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 },
        );
      }
    }

    // Validate category
    if (
      !["Feed", "Medication", "Maintenance", "Labor"].includes(body.category)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "category must be either Feed, Medication, Maintenance, or Labor",
        },
        { status: 400 },
      );
    }

    // Validate relatedUnitId if provided
    if (
      body.relatedUnitId &&
      !mongoose.Types.ObjectId.isValid(body.relatedUnitId)
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid related unit ID" },
        { status: 400 },
      );
    }

    const expense = new Expense(body);
    await expense.save();

    return NextResponse.json(
      {
        success: true,
        data: expense,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating expense:", error);

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message,
      );
      return NextResponse.json(
        { success: false, error: validationErrors.join(", ") },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create expense" },
      { status: 500 },
    );
  }
}
