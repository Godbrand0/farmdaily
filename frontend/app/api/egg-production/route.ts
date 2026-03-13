import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function mapEggProduction(row: any) {
  return {
    _id: row.id,
    layerBatchId: row.layer_batch_id,
    eggsCollected: row.eggs_collected,
    damagedEggs: row.damaged_eggs,
    date: row.date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const layerBatchId = searchParams.get("layerBatchId");
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("egg_production")
    .select("*", { count: "exact" })
    .order("date", { ascending: false })
    .range(from, to);

  if (layerBatchId) {
    query = query.eq("layer_batch_id", layerBatchId);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching egg production:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch egg production" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    data: (data ?? []).map(mapEggProduction),
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

  const requiredFields = ["layerBatchId", "eggsCollected", "damagedEggs", "date"];
  for (const field of requiredFields) {
    if (body[field] === undefined || body[field] === null) {
      return NextResponse.json(
        { success: false, error: `${field} is required` },
        { status: 400 },
      );
    }
  }

  // Verify the layer batch exists
  const { data: batch, error: batchError } = await supabase
    .from("layer_batches")
    .select("id")
    .eq("id", body.layerBatchId)
    .single();

  if (batchError || !batch) {
    return NextResponse.json(
      { success: false, error: "Layer batch not found" },
      { status: 404 },
    );
  }

  const { data, error } = await supabase
    .from("egg_production")
    .insert({
      layer_batch_id: body.layerBatchId,
      eggs_collected: body.eggsCollected,
      damaged_eggs: body.damagedEggs,
      date: body.date,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating egg production record:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create egg production record" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, data: mapEggProduction(data) }, { status: 201 });
}
