import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import LayerBatch from "@/models/LayerBatch";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const layers = await LayerBatch.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await LayerBatch.countDocuments();

    return NextResponse.json({
      success: true,
      data: layers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching layers:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch layers" },
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
      "batchName",
      "numberOfBirds",
      "cageNumber",
      "dateStocked",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 },
        );
      }
    }

    // Set currentBirdsAlive to numberOfBirds if not provided
    if (!body.currentBirdsAlive) {
      body.currentBirdsAlive = body.numberOfBirds;
    }

    const layer = new LayerBatch(body);
    await layer.save();

    return NextResponse.json(
      {
        success: true,
        data: layer,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating layer:", error);

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
      { success: false, error: "Failed to create layer" },
      { status: 500 },
    );
  }
}
