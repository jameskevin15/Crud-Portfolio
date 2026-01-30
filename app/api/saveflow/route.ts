// app/api/updateflow/route.ts

import { openDb } from "@/mongodb/lib/db";
import { NextResponse } from "next/server";

const DB_NAME = "etracs_mgmt_base_oscp";
const COLLECTION = "wf_design";

export async function POST(request: Request) {
  try {
    const { _id, nodes, edges, nodeStatus, status } = await request.json();

    if (!nodes || !edges || !_id) {
      return NextResponse.json(
        { message: "Invalid flow data or missing ID" },
        { status: 400 }
      );
    }

    const { collection } = await openDb(DB_NAME, COLLECTION);

    const result = await collection.updateOne(
      { _id },
      {
        $set: {
          nodes,
          edges,
          nodeStatus, // Keep the disabled state
          status,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("DB error:", error);

    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}