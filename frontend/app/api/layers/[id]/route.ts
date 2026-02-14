import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import LayerBatch from "@/models/LayerBatch";
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
        { success: false, error: "Invalid layer ID" },
        { status: 400 },
      );
    }

    const body = await request.json();

    const layer = await LayerBatch.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!layer) {
      return NextResponse.json(
        { success: false, error: "Layer not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: layer,
    });
  } catch (error: any) {
    console.error("Error updating layer:", error);

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
      { success: false, error: "Failed to update layer" },
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
        { success: false, error: "Invalid layer ID" },
        { status: 400 },
      );
    }

    const layer = await LayerBatch.findByIdAndDelete(id);

    if (!layer) {
      return NextResponse.json(
        { success: false, error: "Layer not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Layer deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting layer:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete layer" },
      { status: 500 },
    );
  }
}
