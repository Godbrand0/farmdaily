import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import FishUnit from "@/models/FishUnit";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const unitType = searchParams.get("unitType");
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    if (unitType) {
      query.unitType = unitType;
    }

    const fishUnits = await FishUnit.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await FishUnit.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: fishUnits,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching fish units:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch fish units" },
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
      "unitType",
      "unitNumber",
      "stockedQuantity",
      "dateStocked",
      "feedStageMM",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 },
        );
      }
    }

    // Validate unitType
    if (!["Pond", "Cage"].includes(body.unitType)) {
      return NextResponse.json(
        { success: false, error: "unitType must be either Pond or Cage" },
        { status: 400 },
      );
    }

    // Set currentFishAlive to stockedQuantity if not provided
    if (!body.currentFishAlive) {
      body.currentFishAlive = body.stockedQuantity;
    }

    const fishUnit = new FishUnit(body);
    await fishUnit.save();

    return NextResponse.json(
      {
        success: true,
        data: fishUnit,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating fish unit:", error);

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
      { success: false, error: "Failed to create fish unit" },
      { status: 500 },
    );
  }
}
