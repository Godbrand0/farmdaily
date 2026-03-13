import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function mapMortality(row: any) {
  return {
    _id: row.id,
    livestockType: row.livestock_type,
    referenceId: row.reference_id,
    numberDead: row.number_dead,
    cause: row.cause,
    date: row.date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const livestockType = searchParams.get("livestockType");
  const referenceId = searchParams.get("referenceId");
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("mortality_records")
    .select("*", { count: "exact" })
    .order("date", { ascending: false })
    .range(from, to);

  if (livestockType) {
    query = query.eq("livestock_type", livestockType);
  }
  if (referenceId) {
    query = query.eq("reference_id", referenceId);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching mortality records:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch mortality records" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    data: (data ?? []).map(mapMortality),
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

  const requiredFields = ["livestockType", "referenceId", "numberDead", "cause", "date"];
  for (const field of requiredFields) {
    if (!body[field]) {
      return NextResponse.json(
        { success: false, error: `${field} is required` },
        { status: 400 },
      );
    }
  }

  if (!["Layer", "Catfish"].includes(body.livestockType)) {
    return NextResponse.json(
      { success: false, error: "livestockType must be either Layer or Catfish" },
      { status: 400 },
    );
  }

  // Verify reference exists and check stock
  const table = body.livestockType === "Layer" ? "layer_batches" : "fish_units";
  const stockField = body.livestockType === "Layer" ? "current_birds_alive" : "current_fish_alive";

  const { data: reference, error: refError } = await supabase
    .from(table)
    .select(`id, ${stockField}`)
    .eq("id", body.referenceId)
    .single();

  if (refError || !reference) {
    return NextResponse.json(
      { success: false, error: "Reference not found" },
      { status: 404 },
    );
  }

  const currentStock = reference[stockField];
  const stockLabel =
    body.livestockType === "Layer" ? "current birds alive" : "current fish alive";

  if (body.numberDead > currentStock) {
    return NextResponse.json(
      { success: false, error: `Number dead cannot exceed ${stockLabel}` },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("mortality_records")
    .insert({
      livestock_type: body.livestockType,
      reference_id: body.referenceId,
      number_dead: body.numberDead,
      cause: body.cause,
      date: body.date,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating mortality record:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create mortality record" },
      { status: 500 },
    );
  }

  // Decrement stock on the parent record
  await supabase
    .from(table)
    .update({ [stockField]: currentStock - body.numberDead })
    .eq("id", body.referenceId);

  return NextResponse.json({ success: true, data: mapMortality(data) }, { status: 201 });
}
