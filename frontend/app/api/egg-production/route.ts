import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import EggProduction from "@/models/EggProduction";
import LayerBatch from "@/models/LayerBatch";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const layerBatchId = searchParams.get("layerBatchId");
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    if (layerBatchId) {
      query.layerBatchId = layerBatchId;
    }

    const eggProduction = await EggProduction.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate("layerBatchId");

    const total = await EggProduction.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: eggProduction,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching egg production:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch egg production" },
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
      "layerBatchId",
      "eggsCollected",
      "damagedEggs",
      "date",
    ];
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 },
        );
      }
    }

    // Validate layer batch exists
    const layerBatch = await LayerBatch.findById(body.layerBatchId);
    if (!layerBatch) {
      return NextResponse.json(
        { success: false, error: "Layer batch not found" },
        { status: 404 },
      );
    }

    const eggProduction = new EggProduction(body);
    await eggProduction.save();

    return NextResponse.json(
      {
        success: true,
        data: eggProduction,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating egg production record:", error);

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
      { success: false, error: "Failed to create egg production record" },
      { status: 500 },
    );
  }
}
