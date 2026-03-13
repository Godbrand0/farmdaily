import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function mapLayer(row: any) {
  return {
    _id: row.id,
    batchName: row.batch_name,
    cageNumber: row.cage_number,
    numberOfBirds: row.number_of_birds,
    currentBirdsAlive: row.current_birds_alive,
    dateStocked: row.date_stocked,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("layer_batches")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching layers:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch layers" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    data: (data ?? []).map(mapLayer),
    pagination: {
      page,
      limit,
      total: count ?? 0,
      pages: Math.ceil((count ?? 0) / limit),
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const requiredFields = ["batchName", "numberOfBirds", "cageNumber", "dateStocked"];
  for (const field of requiredFields) {
    if (!body[field]) {
      return NextResponse.json(
        { success: false, error: `${field} is required` },
        { status: 400 },
      );
    }
  }

  const { data, error } = await supabase
    .from("layer_batches")
    .insert({
      batch_name: body.batchName,
      cage_number: body.cageNumber,
      number_of_birds: body.numberOfBirds,
      current_birds_alive: body.currentBirdsAlive ?? body.numberOfBirds,
      date_stocked: body.dateStocked,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating layer:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create layer" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, data: mapLayer(data) }, { status: 201 });
}
