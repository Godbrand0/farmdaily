import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import FishUnit from "@/models/FishUnit";
import mongoose from "mongoose";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid fish unit ID" },
        { status: 400 },
      );
    }

    const body = await request.json();

    const fishUnit = await FishUnit.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!fishUnit) {
      return NextResponse.json(
        { success: false, error: "Fish unit not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: fishUnit,
    });
  } catch (error: any) {
    console.error("Error updating fish unit:", error);

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
      { success: false, error: "Failed to update fish unit" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid fish unit ID" },
        { status: 400 },
      );
    }

    const fishUnit = await FishUnit.findByIdAndDelete(id);

    if (!fishUnit) {
      return NextResponse.json(
        { success: false, error: "Fish unit not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Fish unit deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting fish unit:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete fish unit" },
      { status: 500 },
    );
  }
}
