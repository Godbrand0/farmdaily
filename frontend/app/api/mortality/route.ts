import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import MortalityRecord from "@/models/MortalityRecord";
import LayerBatch from "@/models/LayerBatch";
import FishUnit from "@/models/FishUnit";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const livestockType = searchParams.get("livestockType");
    const referenceId = searchParams.get("referenceId");
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    if (livestockType) {
      query.livestockType = livestockType;
    }
    if (referenceId) {
      query.referenceId = referenceId;
    }

    const mortalityRecords = await MortalityRecord.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate("referenceId");

    const total = await MortalityRecord.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: mortalityRecords,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching mortality records:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch mortality records" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "livestockType",
      "referenceId",
      "numberDead",
      "cause",
      "date",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 },
        );
      }
    }

    // Validate livestockType
    if (!["Layer", "Catfish"].includes(body.livestockType)) {
      return NextResponse.json(
        {
          success: false,
          error: "livestockType must be either Layer or Catfish",
        },
        { status: 400 },
      );
    }

    // Validate referenceId exists
    let referenceModel: typeof LayerBatch | typeof FishUnit;
    if (body.livestockType === "Layer") {
      referenceModel = LayerBatch;
    } else if (body.livestockType === "Catfish") {
      referenceModel = FishUnit;
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid livestock type" },
        { status: 400 },
      );
    }

    const reference = await referenceModel.findById(body.referenceId);
    if (!reference) {
      return NextResponse.json(
        { success: false, error: "Reference not found" },
        { status: 404 },
      );
    }

    // Validate numberDead doesn't exceed current stock
    if (body.livestockType === "Layer") {
      if (body.numberDead > reference.currentBirdsAlive) {
        return NextResponse.json(
          {
            success: false,
            error: "Number dead cannot exceed current birds alive",
          },
          { status: 400 },
        );
      }
    } else if (body.livestockType === "Catfish") {
      if (body.numberDead > reference.currentFishAlive) {
        return NextResponse.json(
          {
            success: false,
            error: "Number dead cannot exceed current fish alive",
          },
          { status: 400 },
        );
      }
    }

    // Create mortality record
    const mortalityRecord = new MortalityRecord(body);
    await mortalityRecord.save();

    // Update current stock
    if (body.livestockType === "Layer") {
      await LayerBatch.findByIdAndUpdate(body.referenceId, {
        $inc: { currentBirdsAlive: -body.numberDead },
      });
    } else if (body.livestockType === "Catfish") {
      await FishUnit.findByIdAndUpdate(body.referenceId, {
        $inc: { currentFishAlive: -body.numberDead },
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: mortalityRecord,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating mortality record:", error);

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
      { success: false, error: "Failed to create mortality record" },
      { status: 500 },
    );
  }
}
