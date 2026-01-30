// app/api/deleteflow/[id]/route.ts

import { openDb } from "@/mongodb/lib/db";
import { NextRequest, NextResponse } from "next/server";

const DB_NAME = "etracs_mgmt_base_oscp";
const COLLECTION = "wf_design";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const db = await openDb(DB_NAME, COLLECTION);

    const result = await db.deleteMany({ _id: id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Workflow not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Workflow deleted successfully" }
    );
  } catch (error) {
    console.error("Error deleting workflow:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}