import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function mapFishUnit(row: any) {
  return {
    _id: row.id,
    unitType: row.unit_type,
    unitNumber: row.unit_number,
    stockedQuantity: row.stocked_quantity,
    currentFishAlive: row.current_fish_alive,
    dateStocked: row.date_stocked,
    feedStageMM: row.feed_stage_mm,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  const updates: Record<string, any> = {};
  if (body.unitType !== undefined) updates.unit_type = body.unitType;
  if (body.unitNumber !== undefined) updates.unit_number = body.unitNumber;
  if (body.stockedQuantity !== undefined) updates.stocked_quantity = body.stockedQuantity;
  if (body.currentFishAlive !== undefined) updates.current_fish_alive = body.currentFishAlive;
  if (body.dateStocked !== undefined) updates.date_stocked = body.dateStocked;
  if (body.feedStageMM !== undefined) updates.feed_stage_mm = body.feedStageMM;

  const { data, error } = await supabase
    .from("fish_units")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating fish unit:", error);
    if (error.code === "PGRST116") {
      return NextResponse.json(
        { success: false, error: "Fish unit not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update fish unit" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, data: mapFishUnit(data) });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const { error, count } = await supabase
    .from("fish_units")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) {
    console.error("Error deleting fish unit:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete fish unit" },
      { status: 500 },
    );
  }

  if (count === 0) {
    return NextResponse.json(
      { success: false, error: "Fish unit not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, message: "Fish unit deleted successfully" });
}
