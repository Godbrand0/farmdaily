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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  const updates: Record<string, any> = {};
  if (body.batchName !== undefined) updates.batch_name = body.batchName;
  if (body.cageNumber !== undefined) updates.cage_number = body.cageNumber;
  if (body.numberOfBirds !== undefined) updates.number_of_birds = body.numberOfBirds;
  if (body.currentBirdsAlive !== undefined) updates.current_birds_alive = body.currentBirdsAlive;
  if (body.dateStocked !== undefined) updates.date_stocked = body.dateStocked;

  const { data, error } = await supabase
    .from("layer_batches")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating layer:", error);
    if (error.code === "PGRST116") {
      return NextResponse.json(
        { success: false, error: "Layer not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update layer" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, data: mapLayer(data) });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const { error, count } = await supabase
    .from("layer_batches")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) {
    console.error("Error deleting layer:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete layer" },
      { status: 500 },
    );
  }

  if (count === 0) {
    return NextResponse.json(
      { success: false, error: "Layer not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, message: "Layer deleted successfully" });
}
