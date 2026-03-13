import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function mapExpense(row: any) {
  return {
    _id: row.id,
    category: row.category,
    amount: row.amount,
    description: row.description,
    date: row.date,
    relatedUnitId: row.related_unit_id ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const category = searchParams.get("category");
  const relatedUnitId = searchParams.get("relatedUnitId");
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("expenses")
    .select("*", { count: "exact" })
    .order("date", { ascending: false })
    .range(from, to);

  if (category) {
    query = query.eq("category", category);
  }
  if (relatedUnitId) {
    query = query.eq("related_unit_id", relatedUnitId);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch expenses" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    data: (data ?? []).map(mapExpense),
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

  const requiredFields = ["category", "amount", "description", "date"];
  for (const field of requiredFields) {
    if (!body[field]) {
      return NextResponse.json(
        { success: false, error: `${field} is required` },
        { status: 400 },
      );
    }
  }

  if (!["Feed", "Medication", "Maintenance", "Labor"].includes(body.category)) {
    return NextResponse.json(
      {
        success: false,
        error: "category must be either Feed, Medication, Maintenance, or Labor",
      },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("expenses")
    .insert({
      category: body.category,
      amount: body.amount,
      description: body.description,
      date: body.date,
      related_unit_id: body.relatedUnitId ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create expense" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, data: mapExpense(data) }, { status: 201 });
}
