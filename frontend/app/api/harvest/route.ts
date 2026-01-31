import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import FishHarvest from "@/models/FishHarvest";
import FishUnit from "@/models/FishUnit";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const fishUnitId = searchParams.get("fishUnitId");
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    if (fishUnitId) {
      query.fishUnitId = fishUnitId;
    }

    const harvests = await FishHarvest.find(query)
      .sort({ harvestDate: -1 })
      .skip(skip)
      .limit(limit)
      .populate("fishUnitId");

    const total = await FishHarvest.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: harvests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching harvests:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch harvests" },
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
      "fishUnitId",
      "harvestDate",
      "quantityHarvested",
      "totalWeightKg",
      "pricePerKg",
      "harvestType",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 },
        );
      }
    }

    // Validate harvestType
    if (!["Live", "Smoked"].includes(body.harvestType)) {
      return NextResponse.json(
        { success: false, error: "harvestType must be either Live or Smoked" },
        { status: 400 },
      );
    }

    // Validate fish unit exists
    const fishUnit = await FishUnit.findById(body.fishUnitId);
    if (!fishUnit) {
      return NextResponse.json(
        { success: false, error: "Fish unit not found" },
        { status: 404 },
      );
    }

    // Validate quantityHarvested doesn't exceed current fish alive
    if (body.quantityHarvested > fishUnit.currentFishAlive) {
      return NextResponse.json(
        {
          success: false,
          error: "Quantity harvested cannot exceed current fish alive",
        },
        { status: 400 },
      );
    }

    // Calculate averageWeightKg and totalIncome
    const averageWeightKg = body.totalWeightKg / body.quantityHarvested;
    const totalIncome = body.totalWeightKg * body.pricePerKg;

    // Validate smokedQuantity if harvestType is Smoked
    if (
      body.harvestType === "Smoked" &&
      (!body.smokedQuantity || body.smokedQuantity <= 0)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Smoked quantity is required when harvest type is Smoked",
        },
        { status: 400 },
      );
    }

    const harvestData = {
      ...body,
      averageWeightKg,
      totalIncome,
      smokedQuantity: body.smokedQuantity || 0,
    };

    const harvest = new FishHarvest(harvestData);
    await harvest.save();

    // Update fish unit current stock
    await FishUnit.findByIdAndUpdate(body.fishUnitId, {
      $inc: { currentFishAlive: -body.quantityHarvested },
    });

    return NextResponse.json(
      {
        success: true,
        data: harvest,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating harvest record:", error);

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
      { success: false, error: "Failed to create harvest record" },
      { status: 500 },
    );
  }
}
